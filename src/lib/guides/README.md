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

## Checks

Run `npm run lint` and `npm run build`. Against a local running server, run
`node scripts/verify-guides.mjs http://localhost:3000` to check route boundaries,
metadata, sitemap, internal links and navigation. Also inspect a hub and article
at desktop/mobile widths and test the trailer control.

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
