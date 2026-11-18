// Delete incremental-cache entries of old build IDs from the R2 bucket.
//
// Every deploy uploads the whole cache under a new build ID namespace
// (`incremental-cache/<buildId>/<hash>.{cache,fetch}`), and the runtime only
// reads the deployed build ID. Nothing ever deletes the old namespaces, so
// each deploy leaves a full cache worth (~450 MB) of dead objects behind.
// This script purges stale `incremental-cache/` prefixes, keeping the build ID
// of the local `.open-next/cache` output plus the most recently written old
// namespace (rollback safety: rolling back to the previous deployment must
// find its cache warm, not trigger a full cold render; adjust with
// CLEANUP_KEEP_OLD_BUILDS). It runs as part of
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

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CF_ACCOUNT_ID || "9727dd6591b71bd19b539eb94ee91e78";
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
  // `s3-no-check-bucket`: the R2 token is scoped to Object Read & Write, and
  // rclone's bucket probe (CreateBucket idempotency check) is denied with 403
  // for write operations — the bucket always exists here.
  const run = (command, target, flags = {}) =>
    new Promise((resolve, reject) => {
      const proc = rclone(command, target, { ...flags, "s3-no-check-bucket": true, env });
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

    // Keep the most recently written old namespace(s) so a rollback to the
    // previous deployment finds its cache warm. Rollback was the recovery path
    // for the 2026-11-18 cold-render 1102 incident; deleting everything but
    // the current build would turn any post-deploy rollback itself into a
    // full cold render. A namespace keeps receiving writes as long as some
    // deployed version reads it (runtime ISR revalidation), so its newest
    // object mtime identifies exactly the namespace a rollback would warm up.
    const KEEP_OLD_BUILDS = Number(process.env.CLEANUP_KEEP_OLD_BUILDS || 1);
    const newestMtime = new Map(
      await Promise.all(
        stale.map(async (id) => {
          // `lsf --format t` prints "mtime;key" per line. Scanning one
          // namespace is a few seconds (S3 lists 1000 keys per request).
          const out = await run("lsf", `${remote}/${PREFIX}/${id}/`, {
            "files-only": true,
            format: "t",
          });
          let max = 0;
          for (const line of out.split("\n")) {
            if (!line) continue;
            // "2026-01-02 15:04:05.000000000;key" → epoch ms, truncated to
            // milliseconds. rclone prints local time; all namespaces are
            // compared on the same machine and are hours-to-days apart, so
            // the shared timezone offset cancels out in the ordering.
            const t = Date.parse(line.split(";")[0].replace(" ", "T").slice(0, 23));
            if (Number.isFinite(t) && t > max) max = t;
          }
          return [id, max];
        })
      )
    );
    const keepOld = [...stale]
      .sort((a, b) => (newestMtime.get(b) ?? 0) - (newestMtime.get(a) ?? 0))
      .slice(0, KEEP_OLD_BUILDS);
    const toDelete = stale.filter((id) => !keepOld.includes(id));
    if (toDelete.length === 0) {
      console.log(
        `Keeping current build ${buildId} + ${stale.length} recent old build(s) (${stale.join(", ")}); nothing to clean up`
      );
      return;
    }
    if (keepOld.length > 0) {
      console.log(
        `Keeping current build ${buildId} + most recent old build ${keepOld.join(", ")} (rollback safety); purging the rest`
      );
    }

    // Prefixes are purged in parallel: on high-latency networks the sequential
    // loop needs the better part of an hour for ~90k objects, while R2
    // comfortably accepts a few hundred concurrent S3 requests.
    const PURGE_CONCURRENCY = 4;
    let next = 0;
    await Promise.all(
      Array.from({ length: Math.min(PURGE_CONCURRENCY, toDelete.length) }, async () => {
        while (next < toDelete.length) {
          const id = toDelete[next++];
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
        ? `Dry run: ${toDelete.length} stale build(s) would be purged (kept old: ${keepOld.join(", ") || "none"})`
        : `Done: purged ${toDelete.length} stale build(s), kept ${buildId} + old ${keepOld.join(", ") || "none"}`
    );
  } finally {
    await rm(configDir, { recursive: true, force: true });
  }
}

await main();
