// Full-site internal link audit for playbloo.net.
//
// Crawls production starting from /sitemap.xml + known static hubs, follows
// every internal <a href>, and reports:
//   - 4xx/5xx internal targets (with the pages that link to them)
//   - internal links that redirect (redirect chains burn crawl budget too)
//   - sitemap entries that are not 200
//   - 200 pages that exist but are absent from the sitemap (informational)
//
// Usage: node scripts/check-links.mjs [--base https://playbloo.net] [--out reports/link-check]
// Gentle by design: unique URLs fetched once, concurrency 3, 15s timeout.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const BASE = (argOf("--base", "https://playbloo.net")).replace(/\/+$/, "");
const OUT_DIR = argOf("--out", "reports/link-check");
// --guides-only: crawl the guide section + static hubs instead of every game
// page; still verifies every extracted link target (including /game/*).
const GUIDES_ONLY = args.includes("--guides-only");
const CONCURRENCY = 3;
const TIMEOUT_MS = 15000;

const host = new URL(BASE).host;
const SELF_HOSTS = new Set([host, `www.${host.replace(/^www\./, "")}`]);

// Seed pages that may not appear in the sitemap (noindex/utility pages still
// link out, so they must be crawled for their hrefs).
const SEED_PATHS = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/search",
  "/favorites",
  "/recently-played",
  "/gacha",
  "/tools",
  "/tools/fortnite-chest-counter",
  "/submit-game",
  "/category",
  "/series",
  "/guides",
];

const ALLOWED_QUERY_KEYS = new Set(["page", "sort", "query", "q", "tag", "category"]);

const normalizeHref = (raw, baseHtmlPath) => {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^(mailto:|tel:|javascript:|data:|#)/i.test(trimmed)) return null;
  let url;
  try {
    url = new URL(trimmed, BASE + (baseHtmlPath || "/"));
  } catch {
    return null;
  }
  if (!SELF_HOSTS.has(url.host)) return null;
  let path = url.pathname.replace(/\/{2,}/g, "/");
  if (path.length > 1) path = path.replace(/\/+$/, "") || "/";
  // Drop tracking/utm noise; keep meaningful params (pagination, search).
  const keep = [...url.searchParams.entries()].filter(([k]) => ALLOWED_QUERY_KEYS.has(k));
  const query = new URLSearchParams(keep).toString();
  const full = path + (query ? `?${query}` : "");
  return full + (url.hash || "");
};

const fetchWithTimeout = async (url, redirects = 0, wantBody = false) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "manual",
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36" },
    });
    if ([301, 302, 303, 307, 308].includes(res.status) && res.headers.get("location")) {
      // Drain the redirect response body so the socket is released.
      await res.arrayBuffer().catch(() => {});
      if (redirects >= 5) return { status: res.status, location: res.headers.get("location"), chain: [url] };
      const next = new URL(res.headers.get("location"), url).toString();
      const inner = await fetchWithTimeout(next, redirects + 1, wantBody);
      return { ...inner, chain: [url, ...(inner.chain || [])] };
    }
    const body = wantBody && res.status === 200 ? await res.text().catch(() => "") : null;
    if (!body) await res.arrayBuffer().catch(() => {});
    return { status: res.status, location: res.headers.get("location"), chain: [url], body };
  } catch (err) {
    return { status: 0, error: err.message, chain: [url] };
  } finally {
    clearTimeout(timer);
  }
};

const results = new Map(); // fullUrl -> { status, error?, chain, html? }
const links = []; // { from, to, text }
const queue = [];
const queued = new Set();

const enqueue = (fullUrl, depth = 0) => {
  const pathOnly = fullUrl.split("#")[0];
  if (!queued.has(pathOnly) && depth < 6) {
    queued.add(pathOnly);
    queue.push({ url: pathOnly, depth });
  }
};

const isCrawlableHtml = (url) => {
  if (url.startsWith("/api/")) return false;
  return true;
};

const extractLinks = (html, fromPath) => {
  const out = [];
  const re = /<a\b[^>]*href\s*=\s*("([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[2] ?? m[3] ?? "";
    const text = (m[4] || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 80);
    const normalized = normalizeHref(raw, fromPath);
    if (normalized) out.push({ from: fromPath, to: normalized, text });
  }
  return out;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log(`Fetching sitemap from ${BASE}/sitemap.xml ...`);
const sitemapRes = await fetchWithTimeout(`${BASE}/sitemap.xml`);
let sitemapUrls = [];
if (sitemapRes.status === 200) {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  sitemapUrls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  console.log(`Sitemap lists ${sitemapUrls.length} URLs`);
} else {
  console.log(`WARNING: sitemap fetch returned ${sitemapRes.status}`);
  sitemapRes.status && results.set("/sitemap.xml", sitemapRes);
}

for (const loc of sitemapUrls) {
  try {
    const u = new URL(loc);
    if (!SELF_HOSTS.has(u.host)) continue;
    const path = u.pathname + (u.search || "");
    if (GUIDES_ONLY && !path.startsWith("/guides")) continue;
    enqueue(path);
  } catch {}
}
for (const p of SEED_PATHS) enqueue(p);

console.log(`Crawling ${queue.length} seed pages (following internal links)...`);

let processed = 0;
const crawlQueue = [...queue];
const crawledPaths = new Set();

const crawl = async (workerId) => {
  while (crawlQueue.length) {
    const item = crawlQueue.shift();
    if (!item) break;
    const pathOnly = item.url;
    if (crawledPaths.has(pathOnly)) continue;
    crawledPaths.add(pathOnly);
    if (!isCrawlableHtml(pathOnly)) continue;
    if (results.has(pathOnly)) continue;

    const res = await fetchWithTimeout(BASE + pathOnly, 0, true);
    results.set(pathOnly, res);
    processed++;
    if (processed % 25 === 0) console.log(`  ... ${processed} pages fetched`);

    if (res.status === 200 && res.body) {
      for (const link of extractLinks(res.body, pathOnly)) {
        links.push(link);
        const targetPath = link.to.split("#")[0];
        if (isCrawlableHtml(targetPath) && !results.has(targetPath) && !crawledPaths.has(targetPath)) {
          if (!queued.has(targetPath)) {
            queued.add(targetPath);
            crawlQueue.push({ url: targetPath });
          }
        }
      }
    }
    await sleep(120);
  }
};

await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => crawl(i)));
console.log(`Crawled ${crawledPaths.size} unique pages, recorded ${links.length} links`);

// Verify every link target (including ones we never crawled, e.g. /api/*).
const targets = [...new Set(links.map((l) => l.to.split("#")[0]))];
const verifyQueue = targets.filter((t) => !results.has(t));
console.log(`Verifying ${verifyQueue.length} additional link targets not crawled...`);
const verify = async () => {
  while (verifyQueue.length) {
    const t = verifyQueue.shift();
    if (t === undefined || results.has(t)) continue;
    const res = await fetchWithTimeout(BASE + t);
    results.set(t, res);
    await sleep(100);
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, () => verify()));

// ---- Report ----
const referrers = new Map(); // target -> [{from, text}]
for (const l of links) {
  const t = l.to.split("#")[0];
  if (!referrers.has(t)) referrers.set(t, []);
  referrers.get(t).push({ from: l.from, text: l.text });
}

const broken = [];
const redirects = [];
const okNotInSitemap = [];
const sitemapSet = new Set(sitemapUrls.map((u) => u.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/"));

for (const [target, res] of results) {
  const status = res.status;
  if (status >= 400 || status === 0) {
    broken.push({ target, status, error: res.error || null, referrers: referrers.get(target) || [] });
  } else if (status >= 300 && status < 400) {
    redirects.push({ target, status, chain: res.chain, referrers: referrers.get(target) || [] });
  }
}

for (const [target, res] of results) {
  if (res.status === 200 && !sitemapSet.has(target) && !target.startsWith("/api/")) {
    okNotInSitemap.push(target);
  }
}

// Sitemap URLs that are broken (worst kind: we told Google about them).
const sitemapBroken = [];
for (const loc of sitemapUrls) {
  const path = loc.replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/";
  const res = results.get(path);
  if (res && (res.status >= 400 || res.status === 0)) sitemapBroken.push({ url: loc, status: res.status });
}

const sortReferrers = (r) => r.sort((a, b) => a.from.localeCompare(b.from));

const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  summary: {
    pagesCrawled: crawledPaths.size,
    linksChecked: links.length,
    uniqueTargets: targets.length,
    brokenTargets: broken.length,
    redirectTargets: redirects.length,
    sitemapUrls: sitemapUrls.length,
    sitemapBroken: sitemapBroken.length,
    okNotInSitemap: okNotInSitemap.length,
  },
  broken: broken.map((b) => ({ ...b, referrers: sortReferrers(b.referrers) })).sort((a, b) => b.referrers.length - a.referrers.length),
  redirects: redirects.map((r) => ({ ...r, referrers: sortReferrers(r.referrers) })).sort((a, b) => b.referrers.length - a.referrers.length),
  sitemapBroken,
  okNotInSitemap: okNotInSitemap.sort(),
};

console.log("\n=== SUMMARY ===");
console.log(JSON.stringify(report.summary, null, 2));
if (broken.length) {
  console.log("\n=== BROKEN LINKS ===");
  for (const b of report.broken.slice(0, 60)) {
    console.log(`[${b.status}] ${b.target}  (${b.referrers.length} referrer(s))`);
    for (const r of b.referrers.slice(0, 5)) console.log(`    <- ${r.from}  "${r.text}"`);
  }
}
if (redirects.length) {
  console.log("\n=== REDIRECTING INTERNAL LINKS ===");
  for (const r of report.redirects.slice(0, 40)) {
    console.log(`[${r.status}] ${r.target} -> ${r.chain?.[r.chain.length - 1]}`);
  }
}
if (sitemapBroken.length) {
  console.log("\n=== SITEMAP URLS THAT ARE BROKEN ===");
  for (const s of sitemapBroken) console.log(`[${s.status}] ${s.url}`);
}

mkdirSync(OUT_DIR, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const outPath = resolve(OUT_DIR, `link-audit-${stamp}.json`);
writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(`\nFull report written to ${outPath}`);
