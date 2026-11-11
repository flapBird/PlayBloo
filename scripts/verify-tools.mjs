import assert from "node:assert/strict";

// Smoke test for the /tools section, in the spirit of verify-guides.mjs:
//   node scripts/verify-tools.mjs [base-url]
// Asserts the SEO contract (rendered title/description lengths, canonical,
// one H1, JSON-LD), that the tools pages stay out of the curated sitemap,
// the trailing-slash redirect, and that made-up tool slugs stay 404.

const base = process.argv[2] || "http://localhost:3000";
const hubPath = "/tools";
const path = "/tools/fortnite-chest-counter";
const canonicalOrigin = "https://playbloo.net";
const canonicalUrl = `${canonicalOrigin}${path}`;

const get = (target, options) => fetch(new URL(target, base), { signal: AbortSignal.timeout(30000), ...options });
const attr = (html, tag, match, name) => {
  const element = [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))].map(([value]) => value).find((value) => value.includes(match));
  return element?.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
};

const response = await get(path);
assert.equal(response.status, 200, `${path}: HTTP status`);
const html = await response.text();

const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
assert.equal(title, "Fortnite Chest Counter — Free Online Tracker | PlayBloo", `${path}: title`);
assert.ok(title.length <= 60, `${path}: rendered title within 60 chars (got ${title.length})`);

const description = attr(html, "meta", 'name="description"', "content");
assert.ok(description, `${path}: meta description present`);
assert.ok(description.length <= 160, `${path}: meta description within 160 chars (got ${description.length})`);

assert.equal(attr(html, "link", 'rel="canonical"', "href"), canonicalUrl, `${path}: canonical`);
assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one H1`);
assert.ok(attr(html, "meta", 'property="og:image"', "content")?.startsWith(canonicalOrigin), `${path}: absolute OG image`);
const robots = attr(html, "meta", 'name="robots"', "content");
assert.ok(!robots?.includes("noindex"), `${path}: indexable`);

const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
assert.ok(schemas.some((schema) => schema["@type"] === "BreadcrumbList"), `${path}: BreadcrumbList schema`);
const webApp = schemas.find((schema) => schema["@type"] === "WebApplication");
assert.ok(webApp?.name && webApp?.url === canonicalUrl && webApp?.offers, `${path}: WebApplication schema`);
assert.ok(html.includes('href="/guides/fortnite-pirate-token"'), `${path}: links to the Pirate Token guide`);
assert.ok(html.includes("Chance ladder"), `${path}: renders the chance ladder`);
assert.ok(html.includes("Next Treasure Hour"), `${path}: renders the Treasure Hour countdown module`);
assert.ok(html.includes("pace line appears once you have counted"), `${path}: explains the pace projection before data exists`);

const sitemapResponse = await get("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
// The 2026-11-12 sitemap curation (see src/app/sitemap.ts) stopped listing
// the tools pages: the sitemap only carries Search Console-indexed URLs,
// category pages, the homepage, high-traffic games and guides. The pages
// stay live and crawlable via internal links, so assert absence here.
assert.ok(!sitemap.includes(`<loc>${canonicalUrl}</loc>`), "Tool page is intentionally absent from the curated sitemap");

const redirect = await get(`${path}/`, { redirect: "manual" });
assert.ok([307, 308].includes(redirect.status), "Trailing-slash URL redirects");
assert.equal(new URL(redirect.headers.get("location"), base).pathname, path);

assert.equal((await get("/tools/not-a-real-tool")).status, 404, "Made-up tool slug stays 404");

console.log(`PASS ${path} (title ${title.length} chars, description ${description.length} chars)`);

// Tools hub: card index that deep links into each tool.
const hubResponse = await get(hubPath);
assert.equal(hubResponse.status, 200, `${hubPath}: HTTP status`);
const hubHtml = await hubResponse.text();
const hubTitle = hubHtml.match(/<title>(.*?)<\/title>/s)?.[1];
assert.equal(hubTitle, "Free Gaming Tools: Trackers and Counters | PlayBloo", `${hubPath}: title`);
assert.ok(hubTitle.length <= 60, `${hubPath}: rendered title within 60 chars (got ${hubTitle.length})`);
const hubDescription = attr(hubHtml, "meta", 'name="description"', "content");
assert.ok(hubDescription && hubDescription.length <= 160, `${hubPath}: meta description within 160 chars (got ${hubDescription?.length})`);
assert.equal(attr(hubHtml, "link", 'rel="canonical"', "href"), `${canonicalOrigin}${hubPath}`, `${hubPath}: canonical`);
assert.equal((hubHtml.match(/<h1\b/g) || []).length, 1, `${hubPath}: one H1`);
assert.ok(hubHtml.includes('href="/tools/fortnite-chest-counter"'), `${hubPath}: card links to the chest counter`);
assert.ok(hubHtml.includes("Auto-save") && hubHtml.includes("Live odds"), `${hubPath}: card lists its features`);
assert.ok([...hubHtml.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].some((match) => JSON.parse(match[1])["@type"] === "BreadcrumbList"), `${hubPath}: BreadcrumbList schema`);

assert.ok(!sitemap.includes(`<loc>${canonicalOrigin}${hubPath}</loc>`), "Tools hub is intentionally absent from the curated sitemap");

const hubRedirect = await get(`${hubPath}/`, { redirect: "manual" });
assert.ok([307, 308].includes(hubRedirect.status), "Tools hub trailing-slash URL redirects");
assert.equal(new URL(hubRedirect.headers.get("location"), base).pathname, hubPath);
console.log(`PASS ${hubPath} (title ${hubTitle.length} chars, description ${hubDescription.length} chars)`);
