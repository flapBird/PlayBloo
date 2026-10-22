// Populate the R2 incremental cache without the OpenNext helper worker.
//
// `npm run deploy` populates the remote R2 cache by starting a temporary
// `open-next-cache-populate` Worker and uploading the build output through
// it. That helper lives on *.workers.dev, which is unreachable from networks
// where workers.dev is blocked, and the population then fails the whole
// deploy. This script uploads the same entries through the Cloudflare REST
// API, which is reachable.
//
// Usage: node scripts/populate-r2-cache.mjs [--concurrency N]

import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { homedir } from "node:os";

const ACCOUNT_ID = process.env.CF_ACCOUNT_ID || "9727dd6591b71bd19b539eb94ee91e78";
const BUCKET = process.env.R2_BUCKET_NAME || "playbloo-next-cache";
const CACHE_DIR = process.env.OPEN_NEXT_CACHE_DIR || ".open-next/cache";
const PREFIX = "incremental-cache";
const API = "https://api.cloudflare.com/client/v4";

const concurrencyArg = process.argv.indexOf("--concurrency");
const CONCURRENCY = concurrencyArg > -1 ? Number(process.argv[concurrencyArg + 1]) : 8;

// The REST API starts returning 429 above roughly this request rate, so the
// whole run is paced below it. Uploads are idempotent, so the script can be
// stopped and restarted freely.
const MIN_REQUEST_INTERVAL_MS = 260;

// How many times a single write may be throttled before it is reported as
// failed. The account-level quota window can last a long while, so this is
// generous enough to ride out a window rather than dropping the entry.
const MAX_THROTTLED_RETRIES = 40;

async function readOAuthToken() {
  const config = await readFile(join(homedir(), ".wrangler/config/default.toml"), "utf8");
  const match = config.match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!match) throw new Error("No oauth_token found in ~/.wrangler/config/default.toml");
  return match[1];
}

/** Mirrors computeCacheKey() from the OpenNext adapter. */
function computeCacheKey(key, { prefix, buildId, cacheType }) {
  const hash = createHash("sha256").update(key).digest("hex");
  return `${prefix}/${buildId}/${hash}.${cacheType}`.replace(/\/+/g, "/");
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(full)));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

async function buildAssets() {
  const all = await listFiles(CACHE_DIR);
  const assets = [];
  for (const fullPath of all) {
    const relativePath = relative(CACHE_DIR, fullPath).split(sep).join("/");
    if (relativePath.startsWith("__fetch")) {
      const [__fetch, buildId, ...keyParts] = relativePath.split("/");
      if (__fetch !== "__fetch" || buildId === undefined || keyParts.length === 0) {
        throw new Error(`Invalid cache asset path: ${relativePath}`);
      }
      assets.push({ fullPath, key: `/${keyParts.join("/")}`, buildId, isFetch: true });
    } else {
      const [buildId, ...keyParts] = relativePath.split("/");
      assets.push({ fullPath, key: `/${keyParts.join("/")}`, buildId, isFetch: false });
    }
  }
  return assets;
}

async function main() {
  const token = await readOAuthToken();
  const assets = await buildAssets();
  console.log(`Uploading ${assets.length} cache entries to ${BUCKET} (concurrency ${CONCURRENCY})`);

  let uploaded = 0;
  let processed = 0;
  let failed = 0;
  const failures = [];
  const queue = assets.slice();

  // Progress is checkpointed so an interrupted run can resume without
  // re-uploading the entries that already landed.
  const checkpointPath = process.env.R2_POPULATE_CHECKPOINT || ".open-next/r2-populate-checkpoint.txt";
  let done = new Set();
  try {
    done = new Set((await readFile(checkpointPath, "utf8")).split("\n").filter(Boolean));
  } catch {
    // No checkpoint yet — this is a fresh run.
  }
  if (done.size) console.log(`Resuming: ${done.size} entries already uploaded`);

  // The REST API allows a limited number of object writes per second. A
  // shared gate keeps the whole run under that ceiling no matter how many
  // workers are pulling from the queue.
  let nextSlot = Date.now();
  // When the API throttles, every worker has to wait — a per-worker backoff
  // would keep hammering the same limit and slow the run down further.
  let cooldownUntil = 0;

  async function writeCheckpoint() {
    await writeFile(checkpointPath, [...done].join("\n"), "utf8");
  }

  async function rateLimit() {
    const now = Date.now();
    const wait = Math.max(0, nextSlot - now, cooldownUntil - now);
    nextSlot = Math.max(now, nextSlot) + MIN_REQUEST_INTERVAL_MS;
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  }

  async function worker() {
    while (queue.length) {
      const asset = queue.pop();
      const cacheKey = computeCacheKey(asset.key, {
        prefix: PREFIX,
        buildId: asset.buildId,
        cacheType: asset.isFetch ? "fetch" : "cache",
      });
      if (done.has(cacheKey)) continue;

      const body = await readFile(asset.fullPath);
      const url = `${API}/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}/objects/${encodeURIComponent(cacheKey)}`;
      let ok = false;

      // A quota window can throttle writes for many minutes at a time, so the
      // 429 budget is separate from the error budget: throttled writes wait
      // out the window, while real errors are retried a few times and then
      // reported as failed.
      let throttled = 0;
      let errors = 0;
      while (!ok) {
        await rateLimit();
        try {
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/octet-stream",
            },
            body,
          });
          if (response.ok) {
            ok = true;
            uploaded++;
            processed++;
            done.add(cacheKey);
          } else if (response.status === 429) {
            // The REST API rate limits object writes. Honour the retry-after
            // hint and pause every worker, otherwise the whole run stalls on
            // 429s and each worker keeps hitting the same ceiling.
            const retryAfter = Number(response.headers.get("retry-after")) || 30;
            cooldownUntil = Date.now() + retryAfter * 1000;
            nextSlot = Math.max(nextSlot, cooldownUntil);
            throttled++;
            if (throttled > MAX_THROTTLED_RETRIES) {
              failed++;
              failures.push(`${cacheKey}: throttled ${throttled} times`);
              break;
            }
          } else {
            const text = await response.text();
            errors++;
            if (errors >= 5) {
              failed++;
              failures.push(`${cacheKey}: HTTP ${response.status}: ${text.slice(0, 200)}`);
              break;
            }
            await new Promise((resolve) => setTimeout(resolve, 1000 * errors));
          }
        } catch (error) {
          errors++;
          if (errors >= 5) {
            failed++;
            failures.push(`${cacheKey}: ${error instanceof Error ? error.message : String(error)}`);
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 1000 * errors));
        }
      }
      if (processed > 0 && processed % 250 === 0) {
        console.log(`  ${uploaded}/${assets.length} (${processed} attempted)`);
        await writeCheckpoint();
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  await writeCheckpoint();
  console.log(`Done: ${uploaded} uploaded, ${failed} failed`);
  if (failures.length) {
    console.log("First failures:");
    for (const failure of failures.slice(0, 10)) console.log(`  ${failure}`);
    process.exitCode = 1;
  }
}

await main();
