#!/usr/bin/env node
/**
 * Warm the incremental cache by requesting high-value pages once.
 *
 * Run right after a rollout (`wrangler versions deploy`): the first request to
 * each ISR page triggers a server render that is stored in R2 under the new
 * build ID, so real visitors hit warm cache. Pages without traffic are left
 * to on-demand generation — warming them would only burn time on pages nobody
 * reads.
 *
 * The game list comes from Supabase (every published game with at least one
 * view or play), plus a fixed list of hub pages. Needs SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY from .env.local / the environment.
 *
 * Usage:
 *   node scripts/warm-cache.mjs [--base https://playbloo.net] [--limit N] [--min-views 1]
 */

import { readFileSync } from "node:fs";

for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(file);
  } catch (error) {
    if (error.code !== "ENOENT") console.warn(`Ignoring ${file}: ${error.message}`);
  }
}

const args = process.argv.slice(2);
const getArg = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};

const BASE = (getArg("--base") || "https://playbloo.net").replace(/\/+$/, "");
const LIMIT = Number(getArg("--limit")) || 0; // 0 = no cap
const MIN_VIEWS = Number(getArg("--min-views")) || 1;
const CONCURRENCY = 16;
const TIMEOUT_MS = 20_000;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// Hub pages that real visitors and crawlers land on after every rollout.
const FIXED_PATHS = ["/", "/new-games", "/popular", "/trending", "/category", "/series", "/guides", "/search"];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (check .env.local)");
  process.exit(1);
}

async function gamesToWarm() {
  // view_count / play_count are cumulative, so this also catches games whose
  // traffic predates the counter columns — exactly the pages worth warming.
  const query =
    `${SUPABASE_URL}/rest/v1/games?is_published=eq.true` +
    `&or=(view_count.gte.${MIN_VIEWS},play_count.gte.${MIN_VIEWS})` +
    `&select=slug,view_count,play_count&order=play_count.desc.nullslast,view_count.desc.nullslast` +
    (LIMIT ? `&limit=${LIMIT}` : "&limit=1000");
  const res = await fetch(query, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Supabase query failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function fetchPage(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(BASE + path, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
      signal: controller.signal,
    });
    return { path, status: res.status };
  } catch (error) {
    return { path, status: `ERR: ${error.cause?.code || error.message}`.slice(0, 80) };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const games = await gamesToWarm();
  const gamePaths = games.map((game) => `/game/${game.slug}`);
  const paths = [...FIXED_PATHS, ...gamePaths];
  const t0 = Date.now();
  console.log(`Warming ${paths.length} pages on ${BASE} (concurrency ${CONCURRENCY})`);

  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < paths.length) {
        const path = paths[next++];
        results.push(await fetchPage(path));
      }
    })
  );

  const ok = results.filter((r) => r.status === 200);
  const bad = results.filter((r) => r.status !== 200);
  console.log(`Done in ${((Date.now() - t0) / 1000).toFixed(1)}s — ${ok.length} OK, ${bad.length} failed`);
  if (bad.length) {
    console.log("Failures:");
    for (const { path, status } of bad.slice(0, 30)) console.log(`  ${status}  ${path}`);
    process.exitCode = 1;
  }
}

await main();
