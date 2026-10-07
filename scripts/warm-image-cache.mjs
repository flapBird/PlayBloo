#!/usr/bin/env node
/**
 * Warms the Vercel image optimizer cache (/_next/image) for every published
 * game cover after a deployment. Deployments start with a cold image cache, so
 * the first visitors pay an origin fetch + transform per image variant — over
 * a lossy route (e.g. China → Vercel) many of those requests time out and
 * images render as broken placeholders. Running this script right after a
 * deploy turns every image into an edge cache HIT.
 *
 * Usage:
 *   node scripts/warm-image-cache.mjs
 *
 * Env (read from .env.local when not exported):
 *   NEXT_PUBLIC_SUPABASE_URL — project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service key (server-side only!)
 */
import { readFileSync } from "node:fs";

const WIDTHS = [96, 240, 480];
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const ATTEMPTS = 3;

function loadEnv() {
  try {
    for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim().replace(/^"|"$/g, "");
    }
  } catch {}
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (env or .env.local)");
    process.exit(1);
  }
  return { url: url.replace(/\/$/, ""), key };
}

async function fetchWithRetry(url, attempts = ATTEMPTS) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
      return response.status;
    } catch (error) {
      if (attempt === attempts) return `ERR ${String(error.cause?.code || error.message).slice(0, 40)}`;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

const { url: base, key } = loadEnv();

const gamesResponse = await fetch(`${base}/rest/v1/games?select=thumbnail_url&is_published=eq.true`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
const games = await gamesResponse.json();
const sources = [...new Set(games.map((game) => game.thumbnail_url).filter(Boolean))];
if (!sources.length) {
  console.log("No game thumbnails found; nothing to warm.");
  process.exit(0);
}

const jobs = sources.flatMap((source) => WIDTHS.map((w) => ({ source, w })));
console.log(`Warming ${sources.length} images × ${WIDTHS.length} widths = ${jobs.length} requests…`);

const results = new Map();
const queue = [...jobs];
async function worker() {
  while (queue.length) {
    const { source, w } = queue.shift();
    const encoded = encodeURIComponent(source);
    const status = await fetchWithRetry(`https://playbloo.net/_next/image?url=${encoded}&w=${w}&q=75`);
    results.set(status, (results.get(status) || 0) + 1);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));

const report = Object.fromEntries([...results.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
console.log("Done:", JSON.stringify(report));
const ok = (results.get(200) || 0) + (results.get(304) || 0);
if (ok < jobs.length) {
  console.error("Some requests did not succeed — re-run the script or check the failing statuses above.");
  process.exit(1);
}
