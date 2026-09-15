import assert from "node:assert/strict";

const base = process.argv[2] || "http://localhost:3000";
const hub = "/guides/ocarina-of-time-remake";
const pages = ["/guides", hub, ...["release-date", "new-features", "remake-vs-original", "gameplay"].map((slug) => `${hub}/${slug}`), "/guides/world-of-warcraft-forever", "/guides/world-of-warcraft-forever/beta", "/guides/marvels-wolverine", "/guides/marvels-wolverine/settings-and-accessibility"];
const preview = `${hub}/walkthrough`;
const canonicalOrigin = "https://playbloo.net";
const get = (path, options) => fetch(new URL(path, base), { signal: AbortSignal.timeout(30000), ...options });
const attr = (html, tag, match, name) => {
  const element = [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))].map(([value]) => value).find((value) => value.includes(match));
  return element?.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
};
const titles = new Set();
const descriptions = new Set();
const internalLinks = new Set();

for (const path of [...pages, preview]) {
  const response = await get(path);
  assert.equal(response.status, 200, `${path}: HTTP status`);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title?.includes("PlayBloo"), `${path}: title`);
  assert.ok(!titles.has(title), `${path}: unique title`);
  titles.add(title);
  const description = attr(html, "meta", 'name="description"', "content");
  assert.ok(description && !descriptions.has(description), `${path}: unique description`);
  descriptions.add(description);
  assert.equal(attr(html, "link", 'rel="canonical"', "href"), `${canonicalOrigin}${path}`, `${path}: canonical`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one H1`);
  assert.ok(attr(html, "meta", 'property="og:image"', "content")?.startsWith(canonicalOrigin), `${path}: absolute OG image`);
  const robots = attr(html, "meta", 'name="robots"', "content");
  assert.equal(robots?.includes("noindex"), path === preview, `${path}: correct index state`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
  assert.ok(schemas.some((schema) => schema["@type"] === "BreadcrumbList"), `${path}: breadcrumbs`);
  if (path !== "/guides") {
    const article = schemas.find((schema) => schema["@type"] === "Article");
    assert.ok(article?.dateModified && article?.author, `${path}: article dates and author`);
    assert.equal(article?.mainEntityOfPage?.["@id"], `${canonicalOrigin}${path}`);
    assert.ok(!JSON.stringify(schemas).includes('"offers"'), `${path}: no inherited free offer`);
  }
  for (const [, href] of html.matchAll(/href="(\/guides[^"?#]*)"/g)) internalLinks.add(href);
  console.log(`PASS ${path}`);
}
assert.deepEqual([...internalLinks].sort(), [...pages, preview].sort(), "All guide links resolve to public content");

for (const path of ["/guides/not-a-real-topic", `${hub}/not-a-real-article`, "/guides/not-a-real-topic/release-date"]) {
  assert.equal((await get(path)).status, 404, `${path}: no empty indexable pages`);
}
const redirect = await get(`${hub}/`, { redirect: "manual" });
assert.ok([307, 308].includes(redirect.status), "Trailing-slash URL redirects");
assert.equal(new URL(redirect.headers.get("location"), base).pathname, hub);

const sitemapResponse = await get("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
const guideLocations = [...sitemap.matchAll(/<loc>(https:\/\/playbloo\.net\/guides[^<]*)<\/loc>/g)].map((match) => match[1]);
assert.deepEqual(guideLocations.sort(), pages.map((path) => `${canonicalOrigin}${path}`).sort(), "Sitemap contains all published guides, excludes preview");

const homeResponse = await get("/");
assert.equal(homeResponse.status, 200);
const home = await homeResponse.text();
const header = home.match(/<header\b[\s\S]*?<\/header>/)?.[0] || "";
assert.ok(header.includes('href="/guides"'), "Primary navigation links to Guides");
assert.ok(!header.includes("playMode=embedded"), "Redundant Playable navigation removed");
assert.ok(home.includes('href="/guides/world-of-warcraft-forever"'), "Homepage links to featured hub");
assert.ok(!(home.match(/<nav aria-label="Game feed"[\s\S]*?<\/nav>/)?.[0] || "").includes("playMode=embedded"), "Redundant feed tab removed");
console.log("PASS unknown routes, canonical redirect, sitemap, internal links and homepage navigation");
