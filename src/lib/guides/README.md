# Guides content

Guides are independent of Supabase `games`, `game_levels`, play counters and iframes.
The first release uses typed local content, rendered as static HTML. Edits require a
new deployment; there is no admin editor for Guides yet.

## Add a game topic

1. Add a `GuideTopic` content file alongside `ocarina-of-time-remake.ts`.
2. Register it in the `topics` array in `index.ts`.
3. Give it a unique, stable lowercase kebab-case slug and add its own platform,
   release information, cover, official trailer and sources. Platforms describe
   hardware/OS; Steam and other stores belong in source links.
4. Add articles with slugs unique within that topic. Section IDs must be unique
   within each article, and `sourceIds` must resolve to the topic's source list.
5. Set related article slugs and verify that they resolve to published articles.

Give each new article a subject-specific `cover` using inspected official artwork
or screenshots, with its own alt text, source URL, credit and intrinsic dimensions.
Use distinct images for sibling articles and the topic hub. Article covers are
shared by the article header, every article card, Open Graph/Twitter and Article
JSON-LD. Existing articles without a `cover` fall back to the topic cover.
`fit` and `position` control cropping consistently across article surfaces.

The templates generate `/guides`, `/guides/[slug]` and
`/guides/[slug]/[articleSlug]`. Existing site conventions normalize trailing slashes
to the non-trailing-slash canonical. Unknown topics/articles return 404.

## Publishing states

- Topic `draft`: no public hub, articles, listing or sitemap entry.
- Article `draft`: no public route or listing.
- Article `preview`: accessible URL, `noindex, follow`, excluded from the article
  list, related links and sitemap. The current walkthrough is deliberately a
  preview, with a clearly labeled coverage-status link on the hub.
- Article `published`: accessible and indexable, included in navigation and sitemap.

Do not publish empty dungeon pages to reserve search positions. Keep plans in
drafts until they answer a real question. Old N64/3DS routes must not be presented
as verified Switch 2 instructions. Change the walkthrough to `published` only
after replacing the preparation text with substantive, verified content.

## Updating facts

Maintain shared release date/platform facts on the topic. Use `releaseFacts: true`
for sections that display them. Keep `publishedAt` stable. Change `updatedAt` only
when content meaningfully changes; `verifiedAt` records source checking separately.
When a topic-level fact changes, update dates on affected articles as well.
Review `releaseStatus` at launch; it is displayed as status at the last check.

Metadata and JSON-LD use the same data as the visible page. Sitemap excludes drafts
and previews and uses actual modification dates. Guides use Article schema with
a VideoGame subject, without the existing game module's free-price Offer.

## Artwork and editorial sources

The Ocarina cover in `public/images/guides/ocarina-of-time-remake.webp` is Nintendo
promotional artwork linked from the official US product page. Its source asset is:

https://assets.nintendo.com/image/upload/c_limit,w_1600/q_auto/f_webp/Marketing2/3OKTBMay01784158342jwugZ3wp08zzZXCWrPOIiyNS7pQz0fYoQD300Z0LrEbNS/intro/intro-keyart-large-up

Artwork attribution and source URLs are retained in the content data. Text is original editorial
coverage; GameWith and other competitors informed navigation planning only.
The trailer loads YouTube's privacy-enhanced embed after the user clicks play.

## SPLOOB (October 2, 2026)

`sploob` covers the HTML5 game released by Mors and Catonator on September 28,
2026. The hub and `how-to-play` article link to the official itch.io game;
no playable iframe or Supabase game entry is added. Row-clearing advice is based
on the official objective, not a hands-on high-score test. Exact key bindings,
controller behavior and phone touch support remain untested. Do not present
the developer screenshots as original PlayBloo captures.

The cover and in-body screenshot were inspected before conversion to WebP.
Their original asset URLs are retained in `sploob.ts`. The cover uses `contain`
to keep the beaker and score display visible in compact cards.

## Standalone introductions

Standalone topics without published articles appear directly in Latest Updates.
Their cards link to the topic; topics with articles keep showing article updates.

## October 2 visual novel Demos

Remember is Laucifer's creepypasta visual novel, not another same-name game.
Its official Demo covers the prologue, Chapter 1 and half of Chapter 2. The
September 27 date is the itch.io Demo publication date, not a full-game launch.

Next Station: The Moon's September 30 release is a Demo. January 2027 is the
studio's announced full-release target; no exact day is established.
Bite Your Tongue's October 1 release is also a Demo. Its 13 endings and expanded
word count are full-game plans, not current Demo content.

All three pages retain official product/source artwork URLs in their topic data.
Remember uses a still from the developer's animated cover; the other two use
official static covers. No embedded game, hands-on walkthrough or unverified
mobile input promise is added. `releaseKind: "demo"` labels the visible facts
as Demo dates and keeps the full game's development status explicit.

## Hellraiser: Revival (October 11, 2026)

`hellraiser-revival` covers Saber Interactive's single-player first-person action
horror survival game, launched October 8, 2026 on Steam (Windows), PlayStation 5,
Xbox Series X|S and Nintendo Switch 2. It was not added to the Supabase games
module; there is no playable iframe, review score claim or hands-on session.
PlayBloo has not played the game.

Verified facts come from the official game site and its store links (Steam app
1551980, PlayStation concept 10012313, Xbox 9nswrgzbq2mc), the Steam appdetails
API for date/price/specs ($39.99, 80 GB, Windows-only), the official Demo page
(app 5184670, September 17, 2026) and the Deluxe Content DLC page (app 4664770,
$14.99, item list quoted from the store). The Switch 2 release rests on two
official sources: Nintendo of America's launch trailer upload and
Nintendo Everything's same-day coverage; the eShop listing was not checked
directly.

The launch trailer embed (`JCeq-T1Q4FM`) is Nintendo of America's official
upload, verified via oEmbed; it is labeled as such in the sources. If a
Saber-channel trailer URL is confirmed later, swapping the ID is enough.

Gameplay advice (suffering economy, armor targeting, healing loop, stealth
caveat, Chatterer avoidance, late-game crashes) is summarized and quoted from
GamingTrend's October 8, 2026 PC review (85/100) and attributed to it in-text.
It is one reviewer's experience, not a PlayBloo test; difficulty options and
exact control bindings remain unverified and are not described.

The cover and two in-body images are official Steam store screenshots,
inspected before conversion to WebP; their original asset URLs are retained in
`hellraiser-revival.ts`. The combat screenshot shows gore; it is official
marketing material for an adults-rated horror game and illustrates the armor
advice directly.

## Checks

Run `npm run lint` and `npm run build`. Against a local running server, run
`node scripts/verify-guides.mjs http://localhost:3000` to check route boundaries,
metadata, sitemap, internal links and navigation. Also inspect a hub and article
at desktop/mobile widths and test the trailer control.

## Modern Warfare 4 (October 18, 2026)

`modern-warfare-4` consolidates the MW4 / COD MW4 game-name variants. The
`release-date` article serves the release-date and “when does MW4 come out”
queries; `campaign-early-access` answers eligibility and the 16-mission count.
The hub summarizes announced gameplay. Do not create separate pages for each
spelling of the same release-date intent, or a placeholder full mission list.
“Call of Duty” is too broad to establish MW4 intent; “IGN” is a publisher-navigation
query rather than a PlayBloo guide topic. The supplied rising queries are an
editorial lead, without verified country, period, volume or traffic estimates.

Sources were checked October 18. The full release remains upcoming on October 23,
while campaign early access is live from October 16. Both Standard Digital and
Vault preorders qualify; DMZ has a separate October 20 opening. The October 15
standalone-release announcement supersedes assumptions about Game Pass: separate
purchase at launch, subscription inclusion announced for Holiday 2027. PC midnight
local-time wording is scoped to the PC announcement, not a verified universal
store-by-store unlock table. Exact campaign unlock hours and a full ordered mission
list are not established here. PlayBloo has not played MW4.

The official reveal cover was inspected before resizing to 1600 × 901 WebP;
`cover.sourceUrl` retains the original asset. `contain` preserves the logo across
card crops. No trailer, browser-game entry or Supabase mutation is added. All three
published URLs use this guide's actual publication date in sitemap, independently
of the October 23 game release date. Existing game timestamps stay unchanged.

## Castlevania: Belmont's Curse and Enshrouded (October 18, 2026)

Both games' publishers confirm October 15 full releases. The six published URLs
use October 18 as the PlayBloo publication date; it is independent of each game's
release date. The supplied trend screenshots are research leads, without verified
search volume or a traffic forecast. Routes retain the nested topic/article form.

`castlevania-belmonts-curse` includes `getting-started` and `launch-fixes`.
The first-boss and Arcana material draws on Konami, PlayStation's firsthand
preview, the developer interview and a limited part of KeenGamer's launch route.
The preview's version is identified; this is not a PlayBloo playthrough. The
troubleshooting page follows Konami's October 14 known-issues notice. Complete
walkthrough, map and true-ending pages are not published without further checks.

`enshrouded` includes `beginners-guide` and `skill-tree`, based on the launch FAQ,
1.0 changelog, combat announcement and support documentation. Early Access tips
are used for basic systems with their scope recorded; current changes take
precedence. Do not publish old node allocations, best-build rankings or precise
resource coordinates as 1.0-tested data. Individual skill resets were introduced
in Pact of the Flame; the current game displays the cost to confirm.

Covers are an official Castlevania promotional still from PlayStation Blog and
Enshrouded's official 1.0 press-kit key art. Both originals were visually inspected
and compressed to 1600 × 900 WebP; `cover.sourceUrl` preserves their source URLs.
No playable catalog entry or Supabase mutation is involved. The existing sitemap
generator picks up all six URLs; existing topic and game timestamps are retained.
Pass a pre-change XML snapshot as the optional third argument to
`verify-guides.mjs` to check timestamp preservation as well as the route checks.

## September 15 topics

World of Warcraft Forever and Marvel’s Wolverine use official promotional artwork
from their publisher product pages. Source records remain in the content data for
editorial maintenance; the public pages omit source links and image credit overlays.
Trailers are optional; do not add an embed without a verified official video.
The Forever beta article distinguishes launch subscription access from beta pack
eligibility. Wolverine coverage does not assert unverified file sizes, frame-rate
targets, completion times or trophy requirements. Keep these in the hub until
substantive, verified standalone coverage is ready.

Official cover assets:

- Forever: https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/blt766f7698aedb7b7f/6a9bc5882437ed5612d4878f/Open_Graph_-_Camelot.jpg
- Wolverine: https://gmedia.playstation.com/is/image/SIEPDC/marvels-wolverine-hero-desktop-01-en-30sep25?wid=1600&fmt=jpg

## SHAPE web Demo (September 23, 2026)

`shape-walkthrough` covers the browser Demo only. Do not apply its route to the
complete SHAPE game included with TRACE Definitive Edition. September 13 is the
web Demo publication date, not TRACE Definitive Edition's release date.
Colorbomb's official reply confirms the underwater red-block puzzle is full-game
content and cannot be solved in the Demo. Platform promises for the complete game
must be checked separately from browser support.

Official Demo cover asset (reviewed before use):
https://img.itch.zone/aW1nLzI5OTUyMzQ5LnBuZw==/original/w1b49k.png

Puzzle sections support a location image, a visible gentle hint, and native
`details` disclosures for the stronger hint and full solution. Keep solution
screenshots out of the visible location image. Preserve native keyboard access.

Hands-on notes (September 20; resumed September 22): web v17 starts in the metal
room numbered 12. Shopping-list words OXIDE / BOXES / XENON / EPOXY / XYLOL map
O and X positions directly onto the five-by-five wall panel. Other letters remain
blank. Solving it releases the blue key from the slot beneath the panel.
Inventory items follow the pointer after selection; move the pointer out of the
drawer and let it close before clicking the target. Browser screenshots should
use distinct filenames and be saved only after the relevant scene has settled.

The September 23 puzzle-order check used the full browser-Demo playthrough from
EscapeGamesWalkthrough, linked by EscapeGames24:
https://www.youtube.com/watch?v=FC-H18PKE2w
The eight location images are compressed frames from that playthrough, not captures
from the separate Steam game. Keep this provenance with the content if replacing
images. The own browser session verified the shopping-list answer; later steps were
checked against video frames and EscapeGames24 player notes. The four-pad color
interaction is deliberately described by its observable behavior rather than a
fixed color code, since the footage does not establish a single stable sequence.
