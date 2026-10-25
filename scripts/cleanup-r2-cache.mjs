// Delete incremental-cache entries of old build IDs from the R2 bucket.
//
// Every deploy uploads the whole cache under a new build ID namespace
// (`incremental-cache/<buildId>/<hash>.{cache,fetch}`), and the runtime only
// reads the deployed build ID. Nothing ever deletes the old namespaces, so
// each deploy leaves a full cache worth (~340 MB) of dead objects behind.
// This script purges every `incremental-cache/` prefix except the build ID
// of the local `.open-next/cache` output. It runs as part of
// `npm run deploy:rclone`, after the new build has been populated and
// deployed, so the local build ID always matches the live deployment.
//
// Uses the same S3 credentials as the `--rclone` deploy path. Running it
// standalone is safe only when `.open-next` matches the deployed build; the
// script refuses to delete anything if the local build ID is missing from
// the bucket.
//
// Usage: node scripts/cleanup-r2-cache.mjs [--dry-run]

import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import rclone from "rclone.js";

// Standalone runs don't go through the OpenNext CLI, which is what loads
// .env* files for `deploy:rclone`; load the same files here. Real
// environment variables keep precedence (process.loadEnvFile never
// overwrites values that are already set).
for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(file);
  } catch (error) {
    if (error.code !== "ENOENT") console.warn(`Ignoring ${file}: ${error.message}`);
  }
}

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID || "9727dd6591b71bd19b539eb94ee91e78";
const BUCKET = process.env.R2_BUCKET_NAME || "playbloo-next-cache";
const CACHE_DIR = process.env.OPEN_NEXT_CACHE_DIR || ".open-next/cache";
const PREFIX = "incremental-cache";
const DRY_RUN = process.argv.includes("--dry-run");

async function currentBuildId() {
  let entries;
  try {
    entries = await readdir(CACHE_DIR, { withFileTypes: true });
  } catch {
    throw new Error(`No OpenNext build found at ${CACHE_DIR}; run npm run build:cloudflare first`);
  }
  const ids = entries.filter((e) => e.isDirectory() && e.name !== "__fetch").map((e) => e.name);
  if (ids.length !== 1) {
    throw new Error(
      `Expected exactly one build ID directory in ${CACHE_DIR}, found: ${ids.join(", ") || "none"}`
    );
  }
  return ids[0];
}

async function main() {
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKey || !secretKey) {
    throw new Error(
      "R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY must be provided (same credentials as the --rclone deploy path)"
    );
  }

  const buildId = await currentBuildId();

  // Mirror of the rclone config the OpenNext adapter writes for --rclone.
  const configDir = await mkdtemp(join(tmpdir(), "rclone-config-"));
  const configPath = join(configDir, "rclone.conf");
  await writeFile(
    configPath,
    `[r2]\ntype = s3\nprovider = Cloudflare\naccess_key_id = ${accessKey}\nsecret_access_key = ${secretKey}\nendpoint = https://${ACCOUNT_ID}.r2.cloudflarestorage.com\nacl = private\n`,
    { mode: 0o600 }
  );
  const env = { ...process.env, RCLONE_CONFIG: configPath };
  const remote = `r2:${BUCKET}`;

  // rclone.js's promise API rejects on any stderr output, even harmless
  // notices on successful runs, so resolve on exit code instead.
  const run = (command, target, flags = {}) =>
    new Promise((resolve, reject) => {
      const proc = rclone(command, target, { ...flags, env });
      let stdout = "";
      let stderr = "";
      proc.stdout.on("data", (chunk) => (stdout += chunk));
      proc.stderr.on("data", (chunk) => (stderr += chunk));
      proc.on("error", reject);
      proc.on("close", (code) => {
        if (code === 0) resolve(stdout);
        else
          reject(
            new Error(`rclone ${command} ${target} exited with code ${code}:\n${stderr.trim().slice(0, 500)}`)
          );
      });
    });

  try {
    const listing = (await run("lsf", `${remote}/${PREFIX}`, { "dirs-only": true }))
      .split("\n")
      .map((line) => line.replace(/\/$/, ""))
      .filter(Boolean);
    if (listing.length === 0) {
      console.log(`No ${PREFIX}/ entries in ${BUCKET}; nothing to clean up`);
      return;
    }
    if (!listing.includes(buildId)) {
      throw new Error(
        `Current build ${buildId} is not present in ${BUCKET} under ${PREFIX}/ — refusing to delete ` +
          `anything (check R2_BUCKET_NAME, and whether cache population ran)`
      );
    }
    const stale = listing.filter((id) => id !== buildId);
    if (stale.length === 0) {
      console.log(`Only the current build ${buildId} is cached in ${BUCKET}; nothing to clean up`);
      return;
    }

    // Prefixes are purged in parallel: on high-latency networks the sequential
    // loop needs the better part of an hour for ~90k objects, while R2
    // comfortably accepts a few hundred concurrent S3 requests.
    const PURGE_CONCURRENCY = 4;
    let next = 0;
    await Promise.all(
      Array.from({ length: Math.min(PURGE_CONCURRENCY, stale.length) }, async () => {
        while (next < stale.length) {
          const id = stale[next++];
          const size = (await run("size", `${remote}/${PREFIX}/${id}`)).trim();
          const objects = /Total objects:\s*(\d+)/.exec(size)?.[1] ?? "?";
          const bytes = /Total size:\s*(.+)/.exec(size)?.[1] ?? "?";
          if (DRY_RUN) {
            console.log(`[dry-run] would purge ${PREFIX}/${id} (${objects} objects, ${bytes})`);
            continue;
          }
          await run("purge", `${remote}/${PREFIX}/${id}`, { transfers: 64 });
          console.log(`Purged ${PREFIX}/${id} (${objects} objects, ${bytes})`);
        }
      })
    );
    console.log(
      DRY_RUN
        ? `Dry run: ${stale.length} stale build(s) would be purged`
        : `Done: purged ${stale.length} stale build(s), kept ${buildId}`
    );
  } finally {
    await rm(configDir, { recursive: true, force: true });
  }
}

await main();
