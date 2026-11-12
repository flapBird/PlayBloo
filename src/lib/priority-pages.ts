import "server-only";

/**
 * The priority pages for this round of internal linking (2026-11-12).
 *
 * Search Console knows every URL below — the game slugs are the indexed set —
 * so links to them pass signals through the only pages on the site that still
 * carry weight (the 34 indexed URLs, most of all the homepage). Anchors mix
 * the plain game title with light long-tail variants ("play X online")
 * instead of repeating one identical phrase sitewide.
 *
 * These lists are curated, not derived: they are the pages we are actively
 * pushing this round, in the order we are pushing them.
 */

/** Indexed game pages ordered by Search Console impressions. */
export const PRIORITY_GAME_SLUGS = [
  "last-flag-standing",
  "escape-road-3",
  "odio-el-chocolate",
  "eggy-car",
  "wave-rider",
  "color-block-jam",
  "drift-rush",
  "escape-road-city-2",
  "undead-corridor",
  "wheeljumper",
  "escape-road-halloween",
  "goodbye-doggy",
  "dearest-darling-dragon",
  "death-spiral",
  "juniper-jam-metagame",
  "escape-road-city",
  "escape-road-2",
];

/** Anchor-text pool for the rotating game links on guide pages. */
export interface PriorityLink {
  href: string;
  label: string;
}

export const GAME_LINK_POOL: PriorityLink[] = [
  { href: "/game/eggy-car", label: "Play Eggy Car online" },
  { href: "/game/last-flag-standing", label: "Last Flag Standing" },
  { href: "/game/escape-road-3", label: "Escape Road 3" },
  { href: "/game/wave-rider", label: "Wave Rider" },
  { href: "/game/color-block-jam", label: "Color Block Jam" },
  { href: "/game/odio-el-chocolate", label: "Odio el Chocolate" },
  { href: "/game/drift-rush", label: "Drift Rush" },
  { href: "/game/escape-road-city-2", label: "Escape Road City 2" },
  { href: "/game/undead-corridor", label: "Undead Corridor" },
  { href: "/game/goodbye-doggy", label: "Goodbye Doggy" },
  { href: "/game/dearest-darling-dragon", label: "Dearest Darling Dragon" },
  { href: "/game/escape-road-halloween", label: "Escape Road Halloween" },
];

/** Deterministic hash so each guide page gets a stable, different trio. */
function hashSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * 2-3 game links for a guide page, rotated by the guide's slug so the 76
 * guide pages spread their links across the pool instead of repeating one
 * identical sitewide footer.
 */
export function pickGameLinksForGuide(pageSlug: string, count = 3): PriorityLink[] {
  const start = hashSlug(pageSlug) % GAME_LINK_POOL.length;
  const picks: PriorityLink[] = [];
  for (let i = 0; i < Math.min(count, GAME_LINK_POOL.length); i++) {
    picks.push(GAME_LINK_POOL[(start + i) % GAME_LINK_POOL.length]);
  }
  return picks;
}

/**
 * The homepage "Featured this week" block: 12 priority games, each with a
 * one-line original blurb. Titles and covers come from the catalogue at
 * render time (see getCachedHomePickGames); the blurb is the editorial part.
 * Deliberately at most two entries per franchise so the block reads curated
 * rather than keyword-stuffed.
 */
export interface HomePick {
  slug: string;
  blurb: string;
}

export const HOME_PICKS: HomePick[] = [
  { slug: "last-flag-standing", blurb: "Capture-the-flag brawls vs bots and friends." },
  { slug: "escape-road-3", blurb: "The third Escape Road chase — play it right here." },
  { slug: "eggy-car", blurb: "Drive carefully: the egg is very fragile." },
  { slug: "wave-rider", blurb: "Timing-based riding, increasingly mean surf." },
  { slug: "odio-el-chocolate", blurb: "A bite-sized Spanish indie, runs in-browser." },
  { slug: "color-block-jam", blurb: "Sort-and-slide puzzles with a full walkthrough." },
  { slug: "drift-rush", blurb: "Score-chain drifting against the clock." },
  { slug: "escape-road-city-2", blurb: "Tighter streets, louder sirens." },
  { slug: "undead-corridor", blurb: "Horde survival down one long hallway." },
  { slug: "wheeljumper", blurb: "Precision wheel-flipping platforming." },
  { slug: "goodbye-doggy", blurb: "A short, kind game about saying goodbye." },
  { slug: "dearest-darling-dragon", blurb: "Raise the world's most dangerous sweetheart." },
];

/**
 * Game-page → guide links for the games that earn Search Console exposure.
 * None of the current guides literally cover these games (they are
 * audience-adjacent reads — web-game walkthroughs, free-game roundups and
 * PvP tips), so the block on the game page says "From the PlayBloo guides"
 * and picks the closest read for that game's audience.
 */
export const GAME_GUIDE_LINKS: Record<string, PriorityLink[]> = {
  "last-flag-standing": [
    { href: "/guides/unstable-smp-ffa/pvp-tips", label: "Unstable SMP FFA: PvP tips" },
    { href: "/guides/steam-free-games-2026", label: "Free Steam games this week" },
  ],
  "escape-road-3": [
    { href: "/guides/fortnite-pirate-token/how-to-get", label: "Fortnite Pirate Tokens: how to get them" },
    { href: "/guides/steam-free-games-2026", label: "Free Steam games this week" },
  ],
  "odio-el-chocolate": [
    { href: "/guides/playrooms/getting-started", label: "Playrooms: getting started" },
    { href: "/guides/moon-sweepers/co-op", label: "Moon Sweepers co-op guide" },
  ],
  "wave-rider": [
    { href: "/guides/break-glass-if-bored/secrets", label: "Break Glass If Bored: secrets" },
    { href: "/guides/sploob", label: "SPLOOB: the squishy physics puzzle" },
  ],
  "eggy-car": [
    { href: "/guides/shape-walkthrough", label: "SHAPE web demo walkthrough" },
    { href: "/guides/steam-free-games-2026", label: "Free Steam games this week" },
  ],
  "color-block-jam": [
    { href: "/guides/shape-walkthrough", label: "SHAPE puzzle walkthrough" },
    { href: "/guides/sploob", label: "SPLOOB: how the row rule works" },
  ],
};
