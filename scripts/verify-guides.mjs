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
const pbzHub = "/guides/phantom-blade-zero";
const pbzPages = [pbzHub, `${pbzHub}/release-time`, `${pbzHub}/pc-requirements`, `${pbzHub}/difficulty-modes`];
const pbzUpdatedAt = "2026-10-28T07:30:00.000Z";
pages.push(...pbzPages);
const mhoHub = "/guides/monster-hunter-outlanders";
const mhoPages = [mhoHub, `${mhoHub}/release-date`, `${mhoHub}/beginners-guide`, `${mhoHub}/weapons`];
const mhoUpdatedAt = "2026-10-29T10:00:00.000Z";
const fkHub = "/guides/fight-karo";
const fkPages = [fkHub, `${fkHub}/how-to-play`, `${fkHub}/fighters`, `${fkHub}/friend-rooms`];
pages.push(...fkPages);
const steamHub = "/guides/steam-free-games-2026";
const steamUpdatedAt = "2026-10-29T08:00:00.000Z";
const ootLaunchPath = `${hub}/launch-checklist`;
const ootLaunchUpdatedAt = "2026-10-29T09:00:00.000Z";
pages.push(...mhoPages, steamHub, ootLaunchPath);
const wkgHub = "/guides/wikigacha";
const wkgPages = [wkgHub, `${wkgHub}/how-to-play`, `${wkgHub}/rarity`, `${wkgHub}/alternatives`];
const wkgUpdatedAt = "2026-10-31T09:00:00.000Z";
pages.push(...wkgPages);
const npoHub = "/guides/niem-phat-online";
const npoPages = [npoHub, `${npoHub}/getting-started`, `${npoHub}/practices`, `${npoHub}/world`];
const npoUpdatedAt = "2026-11-07T16:10:00.000Z";
pages.push(...npoPages);
const ftHub = "/guides/fortnite-pirate-token";
const ftPages = [ftHub, `${ftHub}/drop-rate`, `${ftHub}/how-to-get`];
const gtaHub = "/guides/gta-6";
const gtaPages = [gtaHub, `${gtaHub}/pre-order`];
const newestUpdatedAt = "2026-11-08T13:00:00.000Z";
const ootDlcPath = `${hub}/master-quest-dlc`;
pages.push(...ftPages, ...gtaPages, ootDlcPath);
const shrekHub = "/guides/shrek-2-remastered";
const shrekPages = [shrekHub, `${shrekHub}/co-op`, `${shrekHub}/cheats`, `${shrekHub}/where-to-buy`];
const shrekUpdatedAt = "2026-11-11T09:00:00.000Z";
pages.push(...shrekPages);
const prHub = "/guides/playrooms";
const prPages = [prHub, `${prHub}/getting-started`, `${prHub}/demo`, `${prHub}/achievements`];
const msHub = "/guides/moon-sweepers";
const msPages = [msHub, `${msHub}/getting-started`, `${msHub}/co-op`];
const ffaHub = "/guides/unstable-smp-ffa";
const ffaPages = [ffaHub, `${ffaHub}/how-to-play`, `${ffaHub}/pvp-tips`];
const bgHub = "/guides/break-glass-if-bored";
const bgPages = [bgHub, `${bgHub}/getting-started`, `${bgHub}/secrets`];
const trendingUpdatedAt = "2026-11-11T10:00:00.000Z";
pages.push(...prPages, ...msPages, ...ffaPages, ...bgPages);
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
  [`${pbzHub}/release-time`, "/images/guides/phantom-blade-zero-release-time.webp"],
  [`${pbzHub}/pc-requirements`, "/images/guides/phantom-blade-zero-pc-requirements.webp"],
  [`${pbzHub}/difficulty-modes`, "/images/guides/phantom-blade-zero-difficulty.webp"],
  [`${mhoHub}/release-date`, "/images/guides/monster-hunter-outlanders-release-date.webp"],
  [`${mhoHub}/beginners-guide`, "/images/guides/monster-hunter-outlanders-beginners-guide.webp"],
  [`${mhoHub}/weapons`, "/images/guides/monster-hunter-outlanders-weapons.webp"],
  [ootLaunchPath, "/images/guides/ocarina-of-time-launch-checklist.webp"],
  [`${wkgHub}/how-to-play`, "/images/guides/wikigacha-how-to-play.webp"],
  [`${wkgHub}/rarity`, "/images/guides/wikigacha-rarity.webp"],
  [`${wkgHub}/alternatives`, "/images/guides/wikigacha-alternatives.webp"],
  [`${npoHub}/getting-started`, "/images/guides/niem-phat-online-getting-started.webp"],
  [`${npoHub}/practices`, "/images/guides/niem-phat-online-practices.webp"],
  [`${npoHub}/world`, "/images/guides/niem-phat-online-world.webp"],
  [`${ftHub}/drop-rate`, "/images/guides/fortnite-pirate-token-drop-rate.webp"],
  [`${ftHub}/how-to-get`, "/images/guides/fortnite-pirate-token-how-to-get.webp"],
  [ootDlcPath, "/images/guides/ocarina-of-time-master-quest-dlc.webp"],
  [`${shrekHub}/co-op`, "/images/guides/shrek-2-remastered-co-op.webp"],
  [`${shrekHub}/cheats`, "/images/guides/shrek-2-remastered-cheats.webp"],
  [`${shrekHub}/where-to-buy`, "/images/guides/shrek-2-remastered-buy.webp"],
  [`${prHub}/getting-started`, "/images/guides/playrooms-difficulty.webp"],
  [`${prHub}/demo`, "/images/guides/playrooms-pool.webp"],
  [`${prHub}/achievements`, "/images/guides/playrooms-yellow-room.webp"],
  [`${msHub}/getting-started`, "/images/guides/moon-sweepers-sweeper.webp"],
  [`${msHub}/co-op`, "/images/guides/moon-sweepers-crew.webp"],
  [`${ffaHub}/how-to-play`, "/images/guides/unstable-smp-ffa-how-to-play.webp"],
  [`${ffaHub}/pvp-tips`, "/images/guides/unstable-smp-ffa-pvp.webp"],
  [`${bgHub}/getting-started`, "/images/guides/break-glass-if-bored-getting-started.webp"],
  [`${bgHub}/secrets`, "/images/guides/break-glass-if-bored-gold.webp"],
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
assert.ok(home.includes('href="/guides"'), "Homepage mosaic links to the guides hub");
assert.ok(home.includes("Game Guides: get good, faster"), "Homepage mosaic shows the guides card");
assert.ok(home.includes("/images/guides/playrooms.webp"), "Guides card features the newest guide cover");
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
    if (path === hub) {
      assert.equal(currentEntries.get(url), newestUpdatedAt, "Ocarina hub reflects the DLC rumor update");
      continue;
    }
    if (path === `${hub}/release-date`) {
      assert.equal(currentEntries.get(url), ootLaunchUpdatedAt, `${path}: Ocarina launch update keeps its own timestamp`);
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
assert.equal(firstHub, prHub, "Guide hubs list leads with the newest published topic");
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

for (const path of pbzPages) {
  const html = await (await get(path)).text();
  assert.ok(!html.includes("/_next/image"), `${path}: cover bypasses the image optimizer`);
  assert.ok(!html.includes("<iframe"), `${path}: no game embed`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `${path}: contents target ${target} exists`);
  assert.equal(currentEntries.get(`${canonicalOrigin}${path}`), pbzUpdatedAt, `${path}: sitemap uses the PlayBloo publication date`);
}
const pbzHubHtml = await (await get(pbzHub)).text();
assert.ok(/datetime="2026-10-29"/i.test(pbzHubHtml), "Phantom Blade Zero release date is separate from guide publication");
assert.ok(pbzHubHtml.includes("Upcoming"), "Phantom Blade Zero is still marked upcoming at the last check");
assert.ok(pbzHubHtml.includes("not a browser game"), "Phantom Blade Zero is not presented as a playable browser game");
const pbzRelease = await (await get(`${pbzHub}/release-time`)).text();
assert.ok(pbzRelease.includes("October 28") && pbzRelease.includes("October 29"), "Release article explains both dates");
assert.ok(pbzRelease.includes("7:00 PM"), "Release article lists the Pacific unlock time");
assert.ok(pbzRelease.includes("No. Neither edition includes early play."), "Release article rules out early access");
const pbzPc = await (await get(`${pbzHub}/pc-requirements`)).text();
assert.ok(pbzPc.includes("300 GB") && pbzPc.includes("145 GB"), "PC article explains the preload space gap");
assert.ok(pbzPc.includes("RTX 3060 Ti"), "PC article carries the official recommended GPU");
assert.ok(pbzPc.includes("PlayBloo has not run the preload"), "PC article does not imply hands-on testing");
const pbzDifficulty = await (await get(`${pbzHub}/difficulty-modes`)).text();
for (const mode of ["Wayfarer", "Gamechanger", "Hellwalker", "Sixty-Six Days"]) assert.ok(pbzDifficulty.includes(mode), `Difficulty article covers ${mode}`);
for (const slug of ["beginner-guide", "boss-guide", "best-weapons"]) assert.equal((await get(`${pbzHub}/${slug}`)).status, 404, `${slug}: no unverified placeholder`);
console.log("PASS Phantom Blade Zero routes, launch facts, covers, anchors and sitemap dates");

for (const path of mhoPages) {
  const html = await (await get(path)).text();
  assert.ok(!html.includes("/_next/image"), `${path}: direct precompressed cover`);
  assert.ok(!html.includes("<iframe"), `${path}: no browser-game embed`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `${path}: contents target ${target} exists`);
  assert.equal(currentEntries.get(`${canonicalOrigin}${path}`), mhoUpdatedAt, `${path}: sitemap uses the PlayBloo publication date`);
  if (path !== mhoHub) assert.ok(latestUpdates.includes(`href="${path}"`), `${path}: appears in Latest Updates`);
}
const mhoHubHtml = await (await get(mhoHub)).text();
assert.ok(mhoHubHtml.includes("Released") && mhoHubHtml.includes("free-to-play"), "Outlanders launch and pricing status are explicit");
assert.ok(mhoHubHtml.includes("not a browser edition"), "Outlanders is not presented as a browser game");
const mhoWeapons = await (await get(`${mhoHub}/weapons`)).text();
for (const weapon of ["Great Sword", "Long Sword", "Dual Blades", "Hammer", "Lance", "Heavy Bowgun", "Bow"]) assert.ok(mhoWeapons.includes(weapon), `Outlanders weapons include ${weapon}`);
assert.ok(mhoWeapons.includes("not a damage ranking"), "Outlanders weapon guide does not invent a tier list");
const mhoBeginners = await (await get(`${mhoHub}/beginners-guide`)).text();
assert.ok(mhoBeginners.includes("two control modes") && mhoBeginners.includes("Up to four players"), "Outlanders beginner guide covers controls and co-op");

const steamHtml = await (await get(steamHub)).text();
assert.equal(currentEntries.get(`${canonicalOrigin}${steamHub}`), steamUpdatedAt, "Steam collection sitemap uses its publication date");
assert.ok(steamHtml.includes("Updated throughout 2026"), "Steam collection has an evergreen update label");
assert.ok(steamHtml.includes("Free to play, free to keep, free weekend or Demo?"), "Steam collection explains free-access types");
for (const game of ["Dr. Mancell and Mr. Flame", "Stolemates", "Goliath Rogue", "Wood Watch", "Counter-Strike 2", "Dota 2"]) assert.ok(steamHtml.includes(game), `Steam collection includes ${game}`);
assert.ok(latestUpdates.includes(`href="${steamHub}"`), "Standalone Steam collection appears in Latest Updates");
const steamSchemas = [...steamHtml.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((match) => JSON.parse(match[1]));
assert.equal(steamSchemas.find((schema) => schema["@type"] === "Article")?.about?.["@type"], "Thing", "Steam collection is not marked as one VideoGame");

const ootLaunch = await (await get(ootLaunchPath)).text();
assert.equal(currentEntries.get(`${canonicalOrigin}${ootLaunchPath}`), ootLaunchUpdatedAt, "Ocarina launch checklist uses its publication date");
assert.equal(currentEntries.get(`${canonicalOrigin}${hub}`), newestUpdatedAt, "Ocarina hub reflects the DLC rumor update");
assert.equal(currentEntries.get(`${canonicalOrigin}${hub}/release-date`), ootLaunchUpdatedAt, "Ocarina release article keeps its launch-update timestamp");
assert.ok(ootLaunch.includes("$69.99") && ootLaunch.includes("1 player"), "Ocarina launch checklist carries current store facts");
assert.ok(ootLaunch.includes("not October 29") && ootLaunch.includes("November 5"), "Ocarina hardware and game dates stay distinct");
assert.ok(ootLaunch.includes("remain unconfirmed"), "Ocarina download size and unlock time are not invented");
const ootDlc = await (await get(ootDlcPath)).text();
assert.equal(currentEntries.get(`${canonicalOrigin}${ootDlcPath}`), newestUpdatedAt, "Ocarina DLC article uses its publication date");
assert.ok(ootDlc.includes("DodongoCavern") && ootDlc.includes("HasMQ"), "Ocarina DLC article carries the datamine specifics");
assert.ok(ootDlc.includes("I don’t think that we would announce anything specific at this time"), "Ocarina DLC article quotes Aonuma’s non-answer");
assert.ok(ootDlc.includes("could be scaffolding for cancelled work"), "Ocarina DLC article keeps the leftover-code caveat");
assert.ok(latestUpdates.includes(`href="${ootLaunchPath}"`), "Ocarina launch checklist appears in Latest Updates");
assert.ok(latestUpdates.includes(`href="${ootDlcPath}"`), "Ocarina DLC article appears in Latest Updates");
const npoFeatures = await (await get(`${hub}/new-features`)).text();
assert.ok(npoFeatures.includes(`href="${ootDlcPath}"`), "New-features article links the DLC rumor for the related-card surface");
for (const cover of ["/images/guides/monster-hunter-outlanders.webp", "/images/guides/steam-free-games-2026.webp"]) {
  const response = await get(cover);
  assert.equal(response.status, 200, `${cover}: hub cover loads`);
  assert.ok(response.headers.get("content-type")?.includes("image/webp"), `${cover}: precompressed WebP`);
}
console.log("PASS Outlanders, Steam collection and Ocarina launch routes, facts, covers and sitemap dates");

for (const path of wkgPages) {
  const html = await (await get(path)).text();
  assert.ok(!html.includes("/_next/image"), `${path}: direct precompressed cover`);
  assert.ok(!html.includes("<iframe"), `${path}: no game embed`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `${path}: contents target ${target} exists`);
  const pageTitle = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
  assert.ok(pageTitle.length <= 60, `${path}: rendered title within 60 chars (${pageTitle.length})`);
  const metaDescription = attr(html, "meta", 'name="description"', "content") ?? "";
  assert.ok(metaDescription.length <= 160, `${path}: meta description within 160 chars (${metaDescription.length})`);
  assert.equal(currentEntries.get(`${canonicalOrigin}${path}`), wkgUpdatedAt, `${path}: sitemap uses the PlayBloo publication date`);
  if (path !== wkgHub) assert.ok(latestUpdates.includes(`href="${path}"`), `${path}: appears in Latest Updates`);
}
const wkgHubHtml = await (await get(wkgHub)).text();
assert.ok(wkgHubHtml.includes('href="https://wikigacha.com/"'), "WikiGacha hub links the official site");
assert.ok(wkgHubHtml.includes("unofficial and not affiliated with Wikipedia"), "WikiGacha unofficial status is explicit");
assert.ok(wkgHubHtml.includes("February 24, 2026"), "WikiGacha release date is separate from guide publication");
assert.ok(wkgHubHtml.includes("Released"), "WikiGacha is marked released");
const wkgHow = await (await get(`${wkgHub}/how-to-play`)).text();
assert.ok(wkgHow.includes("Daily Raid Battle") && wkgHow.includes("Team Battle"), "How-to-play covers battle modes");
assert.ok(wkgHow.includes("Watch one ad"), "How-to-play lists the rewarded-ad mission");
assert.ok(wkgHow.includes("11/10"), "How-to-play reports the observed bonus-pack overflow");
const wkgRarity = await (await get(`${wkgHub}/rarity`)).text();
for (const rank of ["Legend Rare", "Ultra Rare", "Super Special Rare", "Super Rare", "Uncommon", "Common"]) {
  assert.ok(wkgRarity.includes(rank), `Rarity article covers ${rank}`);
}
assert.ok(wkgRarity.includes("15,000") && wkgRarity.includes("WikiRank"), "Rarity article carries stat caps and the quality source");
assert.ok(wkgRarity.includes("No drop rates are published"), "Rarity article does not invent probabilities");
const wkgAlt = await (await get(`${wkgHub}/alternatives`)).text();
assert.ok(wkgAlt.includes("wikitcg.net") && wkgAlt.includes("wikitrivia.tomjwatson.com"), "Alternatives links verified rival sites");
for (const slug of ["best-cards", "drop-rates"]) assert.equal((await get(`${wkgHub}/${slug}`)).status, 404, `${slug}: folded into existing articles, no placeholder route`);
for (const cover of ["/images/guides/wikigacha.webp", "/images/guides/wikigacha-how-to-play.webp", "/images/guides/wikigacha-rarity.webp", "/images/guides/wikigacha-alternatives.webp"]) {
  const response = await get(cover);
  assert.equal(response.status, 200, `${cover}: cover loads`);
  assert.ok(response.headers.get("content-type")?.includes("image/webp"), `${cover}: precompressed WebP`);
}
console.log("PASS WikiGacha routes, Rule Book facts, covers and sitemap dates");

for (const path of npoPages) {
  const html = await (await get(path)).text();
  assert.ok(!html.includes("/_next/image"), `${path}: direct precompressed cover`);
  assert.ok(!html.includes("<iframe"), `${path}: no game embed`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `${path}: contents target ${target} exists`);
  const pageTitle = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
  assert.ok(pageTitle.length <= 60, `${path}: rendered title within 60 chars (${pageTitle.length})`);
  const metaDescription = attr(html, "meta", 'name="description"', "content") ?? "";
  assert.ok(metaDescription.length <= 160, `${path}: meta description within 160 chars (${metaDescription.length})`);
  assert.equal(currentEntries.get(`${canonicalOrigin}${path}`), npoUpdatedAt, `${path}: sitemap uses the PlayBloo publication date`);
  if (path !== npoHub) assert.ok(latestUpdates.includes(`href="${path}"`), `${path}: appears in Latest Updates`);
}
const npoHubHtml = await (await get(npoHub)).text();
assert.ok(npoHubHtml.includes('href="https://www.niemphat.online/"'), "Niệm Phật Online hub links the official site");
assert.ok(npoHubHtml.includes("PlayBloo is not affiliated with Niệm Phật Online"), "Niệm Phật Online non-affiliation is explicit");
assert.ok(npoHubHtml.includes("runs on the official site only"), "The hub says the live service is official-only");
assert.ok(npoHubHtml.includes("November 7, 2026"), "Niệm Phật Online hub states the hands-on check date");
const npoStart = await (await get(`${npoHub}/getting-started`)).text();
assert.ok(npoStart.includes("Máy chủ Gốc") && npoStart.includes("Máy chủ S1"), "Getting-started lists the servers");
assert.ok(npoStart.includes("100 Sen"), "Getting-started reports the welcome gift");
assert.ok(npoStart.includes("60 minutes per day"), "Getting-started carries the under-18 playtime notice");
assert.ok(npoStart.includes("W A S D"), "Getting-started covers desktop controls");
const npoPractices = await (await get(`${npoHub}/practices`)).text();
for (const practice of ["Lạy Phật", "Tràng hạt", "Tụng kinh", "Thiền"]) assert.ok(npoPractices.includes(practice), `Practices article covers ${practice}`);
assert.ok(npoPractices.includes("+5% per extra person"), "Practices article explains the group bowing bonus");
assert.ok(npoPractices.includes("30 rosary chains, 1,080 bows and 180 meditation minutes"), "Practices article carries the leaderboard caps");
assert.ok(npoPractices.includes("cannot be bought with money"), "Practices article keeps the no-paid-merit promise");
const npoWorld = await (await get(`${npoHub}/world`)).text();
assert.ok(npoWorld.includes("chùa duyên") && npoWorld.includes("Hộ chiếu"), "World article covers destiny temples and the passport");
assert.ok(npoWorld.includes("Áo Hoa Sala") && npoWorld.includes("Sư Tử Xanh"), "World article covers the robe reward and pet pity");
assert.ok(npoWorld.includes("ngạ quỷ"), "World article explains the hungry ghost rule");
for (const slug of ["merit", "download"]) assert.equal((await get(`${npoHub}/${slug}`)).status, 404, `${slug}: folded into existing articles, no placeholder route`);
for (const cover of ["/images/guides/niem-phat-online.webp", "/images/guides/niem-phat-online-getting-started.webp", "/images/guides/niem-phat-online-practices.webp", "/images/guides/niem-phat-online-world.webp"]) {
  const response = await get(cover);
  assert.equal(response.status, 200, `${cover}: cover loads`);
  assert.ok(response.headers.get("content-type")?.includes("image/webp"), `${cover}: precompressed WebP`);
}
console.log("PASS Niệm Phật Online routes, hands-on facts, covers and sitemap dates");

for (const path of ftPages) {
  const html = await (await get(path)).text();
  assert.ok(!html.includes("/_next/image"), `${path}: direct precompressed cover`);
  assert.ok(!html.includes("<iframe"), `${path}: no game embed`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `${path}: contents target ${target} exists`);
  const pageTitle = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
  assert.ok(pageTitle.length <= 60, `${path}: rendered title within 60 chars (${pageTitle.length})`);
  const metaDescription = attr(html, "meta", 'name="description"', "content") ?? "";
  assert.ok(metaDescription.length <= 160, `${path}: meta description within 160 chars (${metaDescription.length})`);
  assert.equal(currentEntries.get(`${canonicalOrigin}${path}`), newestUpdatedAt, `${path}: sitemap uses the PlayBloo publication date`);
  if (path !== ftHub) assert.ok(latestUpdates.includes(`href="${path}"`), `${path}: appears in Latest Updates`);
}
const ftHubHtml = await (await get(ftHub)).text();
assert.ok(ftHubHtml.includes("1 in 137,500"), "Pirate Token hub carries the headline odds");
assert.ok(ftHubHtml.includes("Treasure Hours") && ftHubHtml.includes("2–4 PM ET"), "Hub carries the Treasure Hour windows");
assert.ok(ftHubHtml.includes("nothing here is a luck claim"), "Hub does not imply hands-on token luck");
assert.ok(ftHubHtml.includes("December 5"), "Hub marks the season end event");
const ftDrop = await (await get(`${ftHub}/drop-rate`)).text();
assert.ok(ftDrop.includes("1 in 1,562,500") && ftDrop.includes("1 in 68,750"), "Drop-rate article carries base and boosted odds");
assert.ok(ftDrop.includes("137,500 chests on average"), "Drop-rate article does the expected-chests math");
assert.ok(ftDrop.includes("may be higher in the future"), "Drop-rate article keeps Epic’s future-rate caveat");
const ftHow = await (await get(`${ftHub}/how-to-get`)).text();
assert.ok(ftHow.includes("Crossbones Isle") && ftHow.includes("Arlong Park"), "How-to-get covers the island");
assert.ok(ftHow.includes("nowhere else"), "How-to-get warns off token-generator scams");
assert.ok(ftHow.includes(`href="${ftHub}/drop-rate"`), "How-to-get links the odds article");
for (const slug of ["calculator", "power-hour", "shop"]) assert.equal((await get(`${ftHub}/${slug}`)).status, 404, `${slug}: folded into existing articles, no placeholder route`);
for (const cover of ["/images/guides/fortnite-pirate-token.webp", "/images/guides/fortnite-pirate-token-drop-rate.webp", "/images/guides/fortnite-pirate-token-how-to-get.webp"]) {
  const response = await get(cover);
  assert.equal(response.status, 200, `${cover}: cover loads`);
  assert.ok(response.headers.get("content-type")?.includes("image/webp"), `${cover}: precompressed WebP`);
}
console.log("PASS Fortnite Pirate Token routes, published odds, covers and sitemap dates");

for (const path of gtaPages) {
  const html = await (await get(path)).text();
  assert.ok(!html.includes("/_next/image"), `${path}: direct precompressed cover`);
  assert.ok(!html.includes("<iframe"), `${path}: no game embed`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `${path}: contents target ${target} exists`);
  const pageTitle = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
  assert.ok(pageTitle.length <= 60, `${path}: rendered title within 60 chars (${pageTitle.length})`);
  const metaDescription = attr(html, "meta", 'name="description"', "content") ?? "";
  assert.ok(metaDescription.length <= 160, `${path}: meta description within 160 chars (${metaDescription.length})`);
  assert.equal(currentEntries.get(`${canonicalOrigin}${path}`), newestUpdatedAt, `${path}: sitemap uses the PlayBloo publication date`);
}
const gtaHubHtml = await (await get(gtaHub)).text();
assert.ok(/datetime="2026-11-19"/i.test(gtaHubHtml), "GTA 6 release date is separate from guide publication");
assert.ok(gtaHubHtml.includes("Upcoming"), "GTA 6 is still marked upcoming at the last check");
assert.ok(gtaHubHtml.includes("code-in-box") || gtaHubHtml.includes("code in a box"), "GTA 6 hub carries the physical-edition caveat");
assert.ok(gtaHubHtml.includes("not a browser game"), "GTA 6 is not presented as a playable browser game");
const gtaPreorder = await (await get(`${gtaHub}/pre-order`)).text();
assert.ok(gtaPreorder.includes("$79.99") && gtaPreorder.includes("$99.99"), "Pre-order guide carries both reported US prices");
assert.ok(gtaPreorder.includes("Vintage Vice City Pack") && gtaPreorder.includes("November 20"), "Pre-order bonus and its deadline are explicit");
assert.ok(gtaPreorder.includes("'55 Vapid Stanier"), "Pre-order guide itemizes the bonus contents");
assert.ok(gtaPreorder.includes("Preload begins November 10") || gtaPreorder.includes("November 10, 2026"), "Preload window is stated");
assert.ok(gtaPreorder.includes("a disc will not be included"), "Pre-order guide repeats the no-disc warning");
assert.ok(gtaPreorder.includes("PlayBloo does not sell"), "Pre-order guide disclaims selling");
const gtaArticleCover = await get("/images/guides/gta-6-pre-order-guide.webp");
assert.equal(gtaArticleCover.status, 200, "GTA pre-order article cover loads");
assert.ok(gtaArticleCover.headers.get("content-type")?.includes("image/webp"), "GTA pre-order article cover is WebP");
for (const slug of ["release-date", "editions", "collector"]) assert.equal((await get(`${gtaHub}/${slug}`)).status, 404, `${slug}: single-intent topic, no placeholder route`);
assert.ok(latestUpdates.includes(`href="${gtaHub}/pre-order"`), "GTA pre-order article appears in Latest Updates");
console.log("PASS GTA 6 pre-order routes, store facts, covers and sitemap dates");

for (const path of shrekPages) {
  const html = await (await get(path)).text();
  assert.ok(!html.includes("/_next/image"), `${path}: direct precompressed cover`);
  assert.ok(!html.includes("<iframe"), `${path}: no game embed`);
  const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `${path}: contents target ${target} exists`);
  const pageTitle = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
  assert.ok(pageTitle.length <= 60, `${path}: rendered title within 60 chars (${pageTitle.length})`);
  const metaDescription = attr(html, "meta", 'name="description"', "content") ?? "";
  assert.ok(metaDescription.length <= 160, `${path}: meta description within 160 chars (${metaDescription.length})`);
  assert.equal(currentEntries.get(`${canonicalOrigin}${path}`), shrekUpdatedAt, `${path}: sitemap uses the PlayBloo publication date`);
  if (path !== shrekHub) assert.ok(latestUpdates.includes(`href="${path}"`), `${path}: appears in Latest Updates`);
}
const shrekHubHtml = await (await get(shrekHub)).text();
assert.ok(/datetime="2026-11-10"/i.test(shrekHubHtml), "Shrek 2 Remastered release date is separate from guide publication");
assert.ok(shrekHubHtml.includes("Released"), "Shrek 2 Remastered is marked released");
assert.ok(shrekHubHtml.includes("not a browser game"), "Shrek 2 Remastered is not presented as a playable browser game");
assert.ok(shrekHubHtml.includes("has not played"), "Shrek hub discloses no hands-on testing");
const shrekCoop = await (await get(`${shrekHub}/co-op`)).text();
assert.ok(shrekCoop.includes("Couch Co-Op") && shrekCoop.includes("Mixed"), "Co-op article covers couch, online and mixed modes");
assert.ok(shrekCoop.includes("Epic Online Services") && shrekCoop.includes("linking to a Steam account"), "Co-op article explains the EOS account step");
assert.ok(shrekCoop.includes("Remote Play Together") && shrekCoop.includes("Family Sharing"), "Co-op article carries the Steam feature flags");
assert.ok(shrekCoop.includes("a first for this game"), "Co-op article attributes online play to the remaster only");
const shrekCheats = await (await get(`${shrekHub}/cheats`)).text();
assert.ok(shrekCheats.includes("Cheat Mode") && shrekCheats.includes("unlock cheats"), "Cheats article carries the official Cheat Mode wording");
assert.ok(shrekCheats.includes("not documented") || shrekCheats.includes("not published"), "Cheats article admits the cheat list is undocumented");
assert.ok(shrekCheats.includes("Scrap Book"), "Cheats article keeps the 2004 Scrap Book context");
assert.ok(shrekCheats.includes("45 achievements"), "Cheats article reports the verified achievement count");
const shrekBuy = await (await get(`${shrekHub}/where-to-buy`)).text();
assert.ok(shrekBuy.includes("$29.99") && shrekBuy.includes("$26.99"), "Buyer's guide carries both price points");
assert.ok(shrekBuy.includes("November 17"), "Buyer's guide states the Steam discount end date");
assert.ok(shrekBuy.includes("Windows 11 (64-bit)") && shrekBuy.includes("15 GB"), "Buyer's guide carries the PC spec quirks");
assert.ok(shrekBuy.includes("Mixed"), "Buyer's guide reports the early Steam review status");
assert.ok(shrekBuy.includes("PlayBloo does not sell"), "Buyer's guide disclaims selling");
for (const cover of ["/images/guides/shrek-2-remastered.webp", "/images/guides/shrek-2-remastered-co-op.webp", "/images/guides/shrek-2-remastered-cheats.webp", "/images/guides/shrek-2-remastered-buy.webp"]) {
  const response = await get(cover);
  assert.equal(response.status, 200, `${cover}: cover loads`);
  assert.ok(response.headers.get("content-type")?.includes("image/webp"), `${cover}: precompressed WebP`);
}
for (const slug of ["walkthrough", "cheat-codes", "release-date"]) assert.equal((await get(`${shrekHub}/${slug}`)).status, 404, `${slug}: no invented walkthrough, cheat list or duplicate release route`);
console.log("PASS Shrek 2 Remastered routes, co-op and cheat facts, buyer pricing, covers and sitemap dates");

const trendingGroups = [
  {
    hub: prHub,
    pages: prPages,
    hubChecks: [
      [/datetime="2026-11-04"/i, "Playrooms release date is separate from guide publication"],
      [/Overwhelmingly Positive/, "Playrooms hub carries the verified review verdict"],
      [/\$6\.99/, "Playrooms hub states the US price"],
      [/not a browser game/, "Playrooms is not presented as a playable browser game"],
    ],
    articleChecks: [
      [`${prHub}/getting-started`, [/Crazy/, /Normal/, /Hardcore/], "Getting-started names the three difficulty modes"],
      [`${prHub}/demo`, [/Download Demo/, /\$6\.99/], "Demo article explains the free trial and the full-game price"],
      [`${prHub}/achievements`, [/30 achievements/, /First sparrow/], "Achievements article carries the count and highlighted names"],
    ],
    covers: ["/images/guides/playrooms.webp", "/images/guides/playrooms-difficulty.webp", "/images/guides/playrooms-pool.webp", "/images/guides/playrooms-yellow-room.webp"],
    missing: ["walkthrough", "codes", "tier-list"],
  },
  {
    hub: msHub,
    pages: msPages,
    hubChecks: [
      [/datetime="2026-10-23"/i, "Moon Sweepers release date is separate from guide publication"],
      [/€8\.99/, "Moon Sweepers hub states the store price"],
      [/16 players/, "Moon Sweepers hub covers the 16-player co-op ceiling"],
      [/not a browser game/, "Moon Sweepers is not presented as a playable browser game"],
    ],
    articleChecks: [
      [`${msHub}/getting-started`, [/depot/, /carrying capacity/], "Getting-started explains the delivery loop and upgrade priorities"],
      [`${msHub}/co-op`, [/Online Co-op/, /up to 16 players/], "Co-op article covers lobby size and the online-only flag"],
    ],
    covers: ["/images/guides/moon-sweepers.webp", "/images/guides/moon-sweepers-sweeper.webp", "/images/guides/moon-sweepers-crew.webp"],
    missing: ["tier-list", "map", "secrets"],
  },
  {
    hub: ffaHub,
    pages: ffaPages,
    hubChecks: [
      [/datetime="2026-10-21"/i, "Unstable SMP FFA creation date is separate from guide publication"],
      [/Insomnia Studios/, "Unstable SMP FFA hub names the developer group"],
      [/7\.4 million/, "Unstable SMP FFA hub carries the verified visit count"],
      [/not affiliated with Roblox/, "Unstable SMP FFA hub disclaims affiliation"],
    ],
    articleChecks: [
      [`${ffaHub}/how-to-play`, [/76870565041704/, /Insomnia Studios/], "How-to-play points at the official experience and developer"],
      [`${ffaHub}/pvp-tips`, [/Practice Dummy/, /Terms of Use/], "PvP tips steer beginners away from scripts"],
    ],
    covers: ["/images/guides/unstable-smp-ffa.webp", "/images/guides/unstable-smp-ffa-how-to-play.webp", "/images/guides/unstable-smp-ffa-pvp.webp"],
    missing: ["scripts", "codes", "server-ip"],
  },
  {
    hub: bgHub,
    pages: bgPages,
    hubChecks: [
      [/datetime="2026-10-23"/i, "Break Glass If Bored creation date is separate from guide publication"],
      [/Nebula/, "Break Glass If Bored hub names the developer"],
      [/976,000 visits/, "Break Glass If Bored hub carries the verified visit count"],
      [/not a browser game/, "Break Glass If Bored is not presented as a playable browser game"],
    ],
    articleChecks: [
      [`${bgHub}/getting-started`, [/139016063432102/, /pistol/, /sledgehammer/], "Getting-started links the official page and the community buy order"],
      [`${bgHub}/secrets`, [/26 secrets/, /Force Push/], "Secrets article attributes the community count and the Premium perk"],
    ],
    covers: ["/images/guides/break-glass-if-bored.webp", "/images/guides/break-glass-if-bored-getting-started.webp", "/images/guides/break-glass-if-bored-gold.webp"],
    missing: ["badges-list", "wing-map", "codes"],
  },
];
for (const group of trendingGroups) {
  for (const path of group.pages) {
    const html = await (await get(path)).text();
    assert.ok(!html.includes("/_next/image"), `${path}: direct precompressed cover`);
    assert.ok(!html.includes("<iframe"), `${path}: no game embed`);
    const ids = [...html.matchAll(/<section[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${path}: unique section IDs`);
    for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(target), `${path}: contents target ${target} exists`);
    const pageTitle = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "";
    assert.ok(pageTitle.length <= 60, `${path}: rendered title within 60 chars (${pageTitle.length})`);
    const metaDescription = attr(html, "meta", 'name="description"', "content") ?? "";
    assert.ok(metaDescription.length <= 160, `${path}: meta description within 160 chars (${metaDescription.length})`);
    assert.equal(currentEntries.get(`${canonicalOrigin}${path}`), trendingUpdatedAt, `${path}: sitemap uses the PlayBloo publication date`);
    if (path !== group.hub) assert.ok(latestUpdates.includes(`href="${path}"`), `${path}: appears in Latest Updates`);
  }
  const hubHtml = await (await get(group.hub)).text();
  for (const [pattern, message] of group.hubChecks) assert.ok(pattern.test(hubHtml), `${group.hub}: ${message}`);
  for (const [path, patterns, message] of group.articleChecks) {
    const html = await (await get(path)).text();
    for (const pattern of patterns) assert.ok(pattern.test(html), `${path}: ${message}`);
  }
  for (const cover of group.covers) {
    const response = await get(cover);
    assert.equal(response.status, 200, `${cover}: cover loads`);
    assert.ok(response.headers.get("content-type")?.includes("image/webp"), `${cover}: precompressed WebP`);
  }
  for (const slug of group.missing) assert.equal((await get(`${group.hub}/${slug}`)).status, 404, `${group.hub}/${slug}: no invented or unmaintainable route`);
}
console.log("PASS Playrooms, Moon Sweepers, Unstable SMP FFA and Break Glass If Bored routes, facts, covers, 404 boundaries and sitemap dates");
