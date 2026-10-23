// Give every object in the public `game-media` bucket a long-lived
// `cache-control` so browsers and the Supabase CDN stop revalidating every
// cover on every page view.
//
// Why this exists
// ---------------
// 1185 of the 1489 objects were stored with `cacheControl: "no-cache"`. That
// header is served verbatim (`cache-control: no-cache`), so the Supabase CDN
// has to revalidate with the Storage origin on every single request, and the
// browser has to revalidate too. The site shows 15-24 covers per page and the
// site answers roughly 27,000 page views a month, so those objects alone
// generated hundreds of thousands of Storage requests — the main driver of
// the Free plan's 1 GB "Log Ingestion" quota, and of the egress that comes
// with it.
//
// What this script does NOT do
// ----------------------------
// It never re-encodes anything. Every object is downloaded and re-uploaded
// byte for byte, so PNGs stay PNGs, animated GIFs keep every frame, and no
// image is recompressed. Only the stored cache-control value changes.
//
// Usage
// -----
//   node scripts/fix-storage-cache-control.mjs            # fix everything
//   node scripts/fix-storage-cache-control.mjs --dry-run  # only report
//   node scripts/fix-storage-cache-control.mjs --limit 20 # small batch
//
// The script is idempotent: objects that already carry the wanted cache
// control are skipped, so re-running it is cheap and safe.

import { readFileSync } from "node:fs";
import crypto from "node:crypto";

const BUCKET = "game-media";

// Seven days. Long enough that the CDN serves the object straight from its
// edge and the browser stops asking at all, short enough that a cover that
// is replaced at the same path still reaches visitors within a week.
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const WANTED_CACHE_CONTROL = `max-age=${MAX_AGE_SECONDS}`;

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const limitIndex = args.indexOf("--limit");
const LIMIT = limitIndex >= 0 ? Number(args[limitIndex + 1]) : Infinity;
const CONCURRENCY = 6;

const env = {};
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  if (line.includes("=")) {
    const i = line.indexOf("=");
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
}

const BASE = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!BASE || !KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing from .env.local");
  process.exit(1);
}

const auth = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function rest(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error(`${options.method || "GET"} ${path} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res;
}

/** List every object in the bucket, descending into the batch folders. */
async function listObjects(prefix = "", depth = 0, out = []) {
  const res = await rest(`/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ prefix, limit: 1000 }),
  });
  const entries = await res.json();
  if (!Array.isArray(entries)) return out;
  for (const entry of entries) {
    if (entry.id) {
      out.push({
        path: `${prefix}${entry.name}`,
        size: entry.metadata?.size || 0,
        mime: entry.metadata?.mimetype || "application/octet-stream",
        cacheControl: entry.metadata?.cacheControl || null,
      });
    } else if (depth < 3) {
      await listObjects(`${prefix}${entry.name}/`, depth + 1, out);
    }
  }
  return out;
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/** Download the stored bytes through the authenticated API. */
async function downloadBytes(objectPath) {
  const res = await rest(`/storage/v1/object/${BUCKET}/${objectPath}`, { headers: auth });
  return Buffer.from(await res.arrayBuffer());
}

/** Re-upload the very same bytes with a long-lived cache control. */
async function uploadBytes(objectPath, bytes, mime) {
  const res = await fetch(`${BASE}/storage/v1/object/${BUCKET}/${objectPath}`, {
    method: "POST",
    headers: {
      ...auth,
      "Content-Type": mime,
      "x-upsert": "true",
      "cache-control": WANTED_CACHE_CONTROL,
    },
    body: bytes,
  });
  if (!res.ok) throw new Error(`upload ${objectPath} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/**
 * Read the object back from the Storage API and confirm the bytes.
 *
 * This is the hard check: the stored bytes must be exactly what we uploaded,
 * so no image is ever re-encoded, resized or flattened. The response header
 * is deliberately not asserted here — the CDN keeps its own copy of an object
 * and only picks up a new `cache-control` when it revalidates, which can lag
 * by a minute or two. The header is checked in the sweep at the end.
 */
async function verifyStoredBytes(objectPath, expectedHash, mime) {
  const res = await rest(`/storage/v1/object/${BUCKET}/${objectPath}`, { headers: auth });
  const contentType = res.headers.get("content-type") || "";
  const bytes = Buffer.from(await res.arrayBuffer());
  const hash = sha256(bytes);
  if (hash !== expectedHash) {
    throw new Error(`stored bytes differ: expected ${expectedHash.slice(0, 12)}, got ${hash.slice(0, 12)}`);
  }
  if (contentType.split(";")[0] !== mime) {
    throw new Error(`content type changed: expected ${mime}, got ${contentType}`);
  }
}

/**
 * Final sweep: read every object through the public URL and report how many
 * still hand out a short-lived cache control.
 */
async function sweepHeaders(objects) {
  let cached = 0;
  const stale = [];
  const queue = [...objects];
  async function worker() {
    while (queue.length) {
      const object = queue.shift();
      try {
        const res = await rest(`/storage/v1/object/public/${BUCKET}/${object.path}?cb=${Date.now()}-${Math.random()}`, {
          headers: { "cache-control": "no-cache" },
        });
        await res.arrayBuffer();
        const cacheControl = res.headers.get("cache-control") || "";
        const match = /max-age=(\d+)/.exec(cacheControl);
        if (match && Number(match[1]) >= MAX_AGE_SECONDS) {
          cached += 1;
        } else {
          stale.push(`${object.path} (${cacheControl})`);
        }
      } catch (error) {
        stale.push(`${object.path} (${error.message})`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  return { cached, stale };
}

/** The already-cached batch covers carry `max-age=31536000`; leave them alone. */
function isLongLived(cacheControl) {
  const match = /max-age=(\d+)/.exec(cacheControl || "");
  return Boolean(match) && Number(match[1]) >= MAX_AGE_SECONDS;
}

const objects = await listObjects();
const stale = objects.filter((object) => !isLongLived(object.cacheControl));
const targets = stale.slice(0, LIMIT);

console.log(`bucket ${BUCKET}: ${objects.length} objects, ${stale.length} without "${WANTED_CACHE_CONTROL}"`);
if (!stale.length) {
  console.log("nothing to do");
  process.exit(0);
}
if (DRY_RUN) {
  for (const object of targets.slice(0, 20)) {
    console.log(`  would fix ${object.path} (${object.size}B, current "${object.cacheControl}")`);
  }
  console.log(`dry run: ${targets.length} object(s) would be re-uploaded`);
  process.exit(0);
}

let done = 0;
let failed = 0;
const failures = [];
const started = Date.now();

async function worker() {
  while (targets.length) {
    const object = targets.shift();
    try {
      const before = await downloadBytes(object.path);
      const hash = sha256(before);
      await uploadBytes(object.path, before, object.mime);
      await verifyStoredBytes(object.path, hash, object.mime);
      done += 1;
      if (done % 100 === 0) {
        const rate = Math.round(done / ((Date.now() - started) / 1000));
        console.log(`${done}/${stale.length} fixed (${rate}/s, ${failed} failed)`);
      }
    } catch (error) {
      failed += 1;
      failures.push(`${object.path}: ${error.message}`);
      console.error(`FAIL ${object.path}: ${error.message}`);
      if (failed > 20) {
        console.error("too many failures, stopping");
        process.exit(1);
      }
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

console.log(`\ndone: ${done} fixed, ${failed} failed`);
for (const failure of failures.slice(0, 20)) console.log("FAIL", failure);

// The CDN keeps its own copy of every object and only adopts the new
// cache-control when it revalidates against the origin, so the public header
// can lag the upload by a minute or two. Sweep once at the end and report
// what is still short-lived.
console.log("\nsweeping public headers...");
if (args.includes("--skip-sweep")) {
  console.log("skipped (--skip-sweep)");
} else {
  const sweep = await sweepHeaders(objects);
  console.log(`public headers: ${sweep.cached}/${objects.length} long-lived, ${sweep.stale.length} still short-lived`);
  for (const entry of sweep.stale.slice(0, 20)) console.log("  stale", entry);
}
if (failed) process.exit(1);
