import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = process.argv[2] || "http://localhost:3000";
const hub = "/guides/ocarina-of-time-remake";
const pages = ["/guides/sploob", "/guides/sploob/how-to-play", "/guides/shape-walkthrough", "/guides/shape-walkthrough/controls-and-camera", "/guides", hub, ...["release-date", "new-features", "remake-vs-original", "gameplay"].map((slug) => `${hub}/${slug}`), "/guides/world-of-warcraft-forever", "/guides/world-of-warcraft-forever/beta", "/guides/marvels-wolverine", "/guides/marvels-wolverine/settings-and-accessibility", "/guides/hellraiser-revival", "/guides/hellraiser-revival/getting-started"];
const preview = `${hub}/walkthrough`;
const mw4Hub = "/guides/modern-warfare-4";
const dmzPages = [`${mw4Hub}/dmz`, `${mw4Hub}/dmz-fob`];
const dmzUpdatedAt = "2026-10-21T04:48:19.000Z";
const mw4Pages = [mw4Hub, `${mw4Hub}/release-date`, `${mw4Hub}/campaign-early-access`, ...dmzPages];
pages.push(...mw4Pages);
const castlevaniaHub = "/guides/castlevania-belmonts-curse";
const enshroudedHub = "/guides/enshrouded";
const starterPath = `${enshroudedHub}/early-game-build`;
const starterUpdatedAt = "2026-10-21T04:54:14.000Z";
pages.push(starterPath);
const newGuidePages = [castlevaniaHub, `${castlevaniaHub}/getting-started`, `${castlevaniaHub}/launch-fixes`, enshroudedHub, `${enshroudedHub}/beginners-guide`, `${enshroudedHub}/skill-tree`];
pages.push(...newGuidePages);
const canonicalOrigin = "https://playbloo.net";
const demoTopics = [
  { slug: "remember", officialUrl: "https://xlaucifer.itch.io/remember" },
  { slug: "next-station-the-moon", officialUrl: "https://comfortkuma.itch.io/next-station-the-moon" },
  { slug: "bite-your-tongue", officialUrl: "https://try-froggery.itch.io/bite-your-tongue" },
];
pages.push(...demoTopics.map(({ slug }) => `/guides/${slug}`));
const get = (path, options) => fetch(new URL(path, base), { signal: AbortSignal.timeout(30000), ...options });
const attr = (html, tag, match, name) => {
  const element = [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))].map(([value]) => value).find((value) => value.includes(match));
  return element?.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
};
const titles = new Set();
const descriptions = new Set();
const internalLinks = new Set();
const articleCovers = new Map([
  [starterPath, "/images/guides/enshrouded-early-game-build.webp"],
  [`${mw4Hub}/dmz`, "/images/guides/modern-warfare-4-dmz.webp"],
  [`${mw4Hub}/dmz-fob`, "/images/guides/modern-warfare-4-fob.webp"],
  [`${castlevaniaHub}/getting-started`, "/images/guides/castlevania-belmonts-curse-getting-started.webp"],
  [`${castlevaniaHub}/launch-fixes`, "/images/guides/castlevania-belmonts-curse-launch-fixes.webp"],
  [`${enshroudedHub}/beginners-guide`, "/images/guides/enshrouded-beginners-guide.webp"],
  [`${enshroudedHub}/skill-tree`, "/images/guides/enshrouded-skill-tree.webp"],
  [`${mw4Hub}/release-date`, "/images/guides/modern-warfare-4-release-date.webp"],
  [`${mw4Hub}/campaign-early-access`, "/images/guides/modern-warfare-4-campaign-early-access.webp"],
]);
const checkedCoverCards = new Map([...articleCovers.keys()].map((path) => [path, new Set()]));

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
  const cover = articleCovers.get(path);
  if (cover) {
    const expectedImage = `${canonicalOrigin}${cover}`;
    assert.equal(attr(html, "meta", 'property="og:image"', "content"), expectedImage, `${path}: article-specific OG image`);
    assert.equal(attr(html, "meta", 'name="twitter:image"', "content"), expectedImage, `${path}: article-specific Twitter image`);
    assert.equal(schemas.find((schema) => schema["@type"] === "Article")?.image, expectedImage, `${path}: article-specific schema image`);
    const articleCover = html.match(/<figure\b[^>]*articleCover[^>]*>([\s\S]*?)<\/figure>/)?.[1];
    assert.equal(attr(articleCover ?? "", "img", "src=", "src"), cover, `${path}: article header uses its own cover`);
    const response = await get(cover);
    assert.equal(response.status, 200, `${cover}: image loads`);
    assert.ok(response.headers.get("content-type")?.includes("image/webp"), `${cover}: precompressed WebP`);
  }
  for (const [, href, card] of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    if (!articleCovers.has(href) || !card.includes("<img")) continue;
    assert.equal(attr(card, "img", "src=", "src"), articleCovers.get(href), `${path}: ${href} card uses its own cover`);
    const surface = path === "/guides" ? "listing" : path === href.slice(0, href.lastIndexOf("/")) ? "hub" : "related";
    checkedCoverCards.get(href).add(surface);
  }
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
for (const [path, surfaces] of checkedCoverCards) assert.deepEqual([...surfaces].sort(), ["hub", "listing", "related"], `${path}: cover checked in listing, hub and related cards`);
console.log("PASS article covers across headers, cards, share metadata and structured data");

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
assert.ok(home.includes(`href="${castlevaniaHub}"`), "Homepage feature links to the newest guide");
assert.ok(!(home.match(/<nav aria-label="Game feed"[\s\S]*?<\/nav>/)?.[0] || "").includes("playMode=embedded"), "Redundant feed tab removed");
console.log("PASS unknown routes, canonical redirect, sitemap, internal links and homepage navigation");

const shapeResponse = await get("/guides/shape-walkthrough");
const shape = await shapeResponse.text();
assert.ok(shape.includes("Before you start: this is the web Demo"), "SHAPE identifies the covered version");
assert.ok(shape.includes("not a solvable puzzle in the web Demo"), "SHAPE explains the full-game water tank boundary");
const sectionIds = [...shape.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(sectionIds).size, sectionIds.length, "SHAPE section IDs are unique");
for (const [, target] of shape.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(shape.includes(`id="${target}"`), `SHAPE anchor ${target} exists`);
}
const puzzles = [...shape.matchAll(/<details\b([^>]*)>[\s\S]*?<summary>Reveal the full solution \(spoilers\)<\/summary>/g)];
assert.equal(puzzles.length, 8, "SHAPE includes all eight Demo puzzle solutions");
assert.equal([...shape.matchAll(/<figure\b/g)].length, puzzles.length, "Each SHAPE puzzle includes a location image");
for (const [, attrs] of puzzles) assert.ok(!/\bopen\b/.test(attrs), "SHAPE solutions start collapsed");
console.log("PASS SHAPE version boundary, puzzle disclosures and contents anchors");

for (const path of ["/guides/sploob", "/guides/sploob/how-to-play"]) {
  const html = await (await get(path)).text();
  assert.ok(html.includes('href="https://mors-games.itch.io/sploob"'), `${path}: official game entry`);
  assert.ok(!html.includes("<iframe"), `${path}: no unapproved game embed`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(html.includes(`id="${target}"`), `${path}: anchor ${target} exists`);
  }
}
for (const path of ["/images/guides/sploob.webp", "/images/guides/sploob-score.webp"]) {
  const response = await get(path);
  assert.equal(response.status, 200, `${path}: screenshot loads`);
  assert.ok(response.headers.get("content-type")?.includes("image/webp"), `${path}: image format`);
}
console.log("PASS SPLOOB official entry, screenshots and contents anchors");

for (const path of ["/guides/hellraiser-revival", "/guides/hellraiser-revival/getting-started"]) {
  const html = await (await get(path)).text();
  assert.ok(html.includes('href="https://store.steampowered.com/app/1551980/Clive_Barkers_Hellraiser_Revival/"'), `${path}: official Steam entry`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(html.includes(`id="${target}"`), `${path}: anchor ${target} exists`);
  }
}
assert.ok((await (await get("/guides/hellraiser-revival")).text()).includes("<iframe") === false, "Hellraiser hub trailer starts without an unapproved embed");
for (const path of ["/images/guides/hellraiser-revival.webp", "/images/guides/hellraiser-revival-pinhead.webp", "/images/guides/hellraiser-revival-combat.webp"]) {
  const response = await get(path);
  assert.equal(response.status, 200, `${path}: screenshot loads`);
  assert.ok(response.headers.get("content-type")?.includes("image/webp"), `${path}: image format`);
}
console.log("PASS Hellraiser Revival official entry, screenshots and contents anchors");

const listing = await (await get("/guides")).text();
const latestUpdates = listing.split('id="latest-guides"')[1]?.split("</section>")[0] ?? "";
const sitemapEntries = (xml) => new Map([...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => [entry.match(/<loc>([^<]+)<\/loc>/)?.[1], entry.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]]));
const currentEntries = sitemapEntries(sitemap);
for (const path of newGuidePages) {
  const html = await (await get(path)).text();
  assert.ok(!html.includes("/_next/image"), `${path}: direct image URLs`);
  assert.ok(!html.includes("<iframe"), `${path}: no game embed`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `${path}: anchor ${target} exists`);
  assert.equal(currentEntries.get(`${canonicalOrigin}${path}`), path === enshroudedHub ? starterUpdatedAt : "2026-10-18T10:00:00.000Z", `${path}: sitemap reflects only substantive updates`);
  if (![castlevaniaHub, enshroudedHub].includes(path)) assert.ok(latestUpdates.includes(`href="${path}"`), `${path}: appears in Latest Updates`);
}
for (const slug of ["castlevania-belmonts-curse", "enshrouded"]) {
  const cover = await get(`/images/guides/${slug}.webp`);
  assert.equal(cover.status, 200, `${slug}: official cover loads`);
  assert.ok(cover.headers.get("content-type")?.includes("image/webp"), `${slug}: WebP cover`);
  const html = await (await get(`/guides/${slug}`)).text();
  assert.ok(/datetime="2026-10-15"/i.test(html), `${slug}: game release date is separate from guide publication`);
  assert.ok(html.includes("Released"), `${slug}: released status`);
}
for (const path of [`${castlevaniaHub}/walkthrough`, `${castlevaniaHub}/map`, `${castlevaniaHub}/true-ending`, `${enshroudedHub}/best-builds`, `${enshroudedHub}/resource-locations`]) {
  assert.equal((await get(path)).status, 404, `${path}: no unverified placeholder`);
}
if (process.argv[3]) {
  const previousEntries = sitemapEntries(await readFile(process.argv[3], "utf8"));
  let unchanged = 0;
  for (const [url, lastmod] of previousEntries) {
    const path = new URL(url).pathname;
    if (!/^\/(game\/[^/]+(?:\/level\/[^/]+)?|guides\/.+)$/.test(path)) continue;
    if (path === enshroudedHub) {
      assert.equal(currentEntries.get(url), starterUpdatedAt, "Enshrouded hub reflects the starter-build addition");
      continue;
    }
    if (path === mw4Hub) {
      assert.equal(currentEntries.get(url), dmzUpdatedAt, "MW4 hub reflects the substantive DMZ update");
      continue;
    }
    assert.equal(currentEntries.get(url), lastmod, `${path}: existing content keeps its sitemap timestamp`);
    unchanged++;
  }
  assert.ok(unchanged > 0, "Baseline includes existing content");
  console.log(`PASS ${unchanged} existing game and guide sitemap timestamps unchanged`);
}
console.log("PASS Castlevania and Enshrouded routes, publication dates, covers and article links");
for (const path of mw4Pages) {
  const html = await (await get(path)).text();
  assert.ok(!html.includes("/_next/image"), `${path}: cover bypasses the image optimizer`);
  assert.ok(!html.includes("<iframe"), `${path}: no game embed`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(html.includes(`id="${target}"`), `${path}: contents target ${target} exists`);
  }
  const entry = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].find((match) => match[1].includes(`<loc>${canonicalOrigin}${path}</loc>`))?.[1];
  assert.equal(entry?.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1], path === mw4Hub || dmzPages.includes(path) ? dmzUpdatedAt : "2026-10-18T09:53:50.000Z", `${path}: sitemap reflects only substantive updates`);
}
const mw4 = await (await get(mw4Hub)).text();
assert.ok(mw4.includes('dateTime="2026-10-23"') || mw4.includes('datetime="2026-10-23"'), "MW4 full release date is separate from publication date");
assert.ok(mw4.includes("Upcoming") && mw4.includes("campaign is available early"), "MW4 early campaign access does not mark the full game released");
for (const path of dmzPages) {
  const html = await (await get(path)).text();
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
  const article = schemas.find((schema) => schema["@type"] === "Article");
  assert.equal(new Date(article.datePublished).toISOString(), dmzUpdatedAt, `${path}: new article publication date`);
  assert.ok(html.includes("PlayBloo has not played MW4 DMZ"), `${path}: no implied hands-on testing`);
  assert.ok(html.includes(`href="${dmzPages.find((other) => other !== path)}"`), `${path}: sibling guide linked`);
}
const mw4HubSchema = [...mw4.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1])).find((schema) => schema["@type"] === "Article");
assert.equal(new Date(mw4HubSchema.datePublished).toISOString(), "2026-10-18T09:53:50.000Z", "MW4 hub original publication is preserved");
const fob = await (await get(`${mw4Hub}/dmz-fob`)).text();
assert.ok(fob.includes("Complete your second DMZ Order"), "Boss Board uses an Order milestone, not a player-level gate");
for (const slug of ["dmz-map", "dmz-bosses", "dmz/fob"]) assert.equal((await get(`${mw4Hub}/${slug}`)).status, 404, `${slug}: no duplicate or placeholder route`);
const mw4Campaign = await (await get(`${mw4Hub}/campaign-early-access`)).text();
assert.ok(mw4Campaign.includes("16 campaign missions"), "MW4 campaign answers the mission count");
assert.ok(mw4Campaign.includes("Standard Digital Edition") && mw4Campaign.includes("do not need the Vault Edition"), "MW4 standard digital eligibility is explicit");
assert.ok(mw4Campaign.includes("October 16") && mw4Campaign.includes("October 20"), "MW4 campaign and DMZ access dates remain distinct");
const mw4Release = await (await get(`${mw4Hub}/release-date`)).text();
assert.ok(mw4Release.includes("Holiday 2027"), "MW4 uses the latest Game Pass announcement");
for (const path of mw4Pages.slice(1)) assert.ok(latestUpdates.includes(`href="${path}"`), `${path}: article appears in Latest Updates`);
const mw4Cover = await get("/images/guides/modern-warfare-4.webp");
assert.equal(mw4Cover.status, 200, "MW4 official cover loads");
assert.ok(mw4Cover.headers.get("content-type")?.includes("image/webp"), "MW4 cover format");
assert.equal((await get(`${mw4Hub}/missions`)).status, 404, "MW4 has no placeholder mission-list route");
console.log("PASS MW4 dates, campaign eligibility, mission count, cover, anchors and sitemap publication dates");
for (const { slug, officialUrl } of demoTopics) {
  const path = `/guides/${slug}`;
  const html = await (await get(path)).text();
  assert.ok(html.includes(`href="${officialUrl}"`), `${path}: official Demo entry`);
  assert.ok(html.includes("Demo release date") && html.includes("Full game in development"), `${path}: Demo availability is separate from full release`);
  assert.ok(!html.includes("<iframe"), `${path}: no game embed`);
  assert.ok(!html.includes('href="#guide-library"'), `${path}: no empty article-library link`);
  assert.ok(latestUpdates.includes(`href="${path}"`), `${path}: standalone introduction appears in Latest Updates`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(html.includes(`id="${target}"`), `${path}: contents target ${target} exists`);
  }
  const cover = await get(`/images/guides/${slug}.webp`);
  assert.equal(cover.status, 200, `${path}: official cover loads`);
  assert.ok(cover.headers.get("content-type")?.includes("image/webp"), `${path}: cover format`);
}
console.log("PASS visual novel Demo status, official entries, covers and Latest Updates");

const hubSection = listing.split('aria-label="Game guide hubs"')[1]?.split("</section>")[0] ?? "";
const firstHub = hubSection.match(/href="(\/guides\/[^"?#]+)"/)?.[1];
assert.equal(firstHub, castlevaniaHub, "Guide hubs list leads with the newest published topic");
console.log("PASS guide hubs list is newest-first");

const starter = await (await get(starterPath)).text();
assert.equal(currentEntries.get(`${canonicalOrigin}${starterPath}`), starterUpdatedAt, "Starter guide uses its own publication date");
assert.ok(latestUpdates.includes(`href="${starterPath}"`), "Starter build appears in Latest Updates");
assert.ok(starter.includes("Full 35-point allocation, including connecting nodes"), "Allocation renders in server HTML");
assert.ok(starter.includes("not a damage ranking or an in-game-tested build"), "Starter build does not claim hands-on testing");
assert.ok(!starter.includes("/_next/image"), "Starter cover uses its compressed original");
for (const [, target] of starter.matchAll(/href="#([^"]+)"/g)) assert.ok(starter.includes(`id="${target}"`), `Starter contents target ${target} exists`);
for (const sibling of ["beginners-guide", "skill-tree"]) {
  assert.ok((await (await get(`${enshroudedHub}/${sibling}`)).text()).includes(`href="${starterPath}"`), "Existing guides link to the starter build");
}
console.log("PASS Enshrouded starter route, server-rendered plan, related links and sitemap date");
