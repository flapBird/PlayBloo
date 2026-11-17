/**
 * Shared normalization for every place a visitor-typed term meets the
 * catalogue: the /search page URL parser, /api/search, /api/suggestions and
 * the demand-signal logger (lib/search-logs.ts).
 *
 * 2026-11-18: extended beyond the original `[%_(),]` strip. The zero-result
 * log filled up with paste artifacts from translated pages and AI chat
 * answers — full-width quotes/periods around game names (“My Sweet Pets”。),
 * [citation:N] markers — none of which can appear in a real title, tag or
 * alias. Dropping them before matching is always safe.
 *
 * Apostrophes are folded (curly ’ → ASCII ') rather than stripped: titles
 * carry them mid-word ("Tower of the Dragon's Girth") and a stripped query
 * would no longer match its own title. Curly double quotes, CJK brackets and
 * full-width sentence punctuation wrap or follow whole names, so those are
 * dropped.
 *
 * Deliberately NOT touched: ASCII hyphens. Slugs, titles and tags carry
 * hyphens ("Split-Second Racers", "co-op"), so folding `-` to a space here
 * would break more queries than the pasted-URL cases it would rescue; those
 * are handled by the /game/[slug] fallback (lib/slug-rescue.ts) instead.
 */
const STRIPPED_RE =
  /[%_()[\]{}<>*#"`=+“”。、；：？！～·…—―「」『』【】（）《》〈〉]/g;
const CURLY_APOSTROPHE_RE = /[’‘]/g;

export function normalizeSearchQuery(value = "", max = 80): string {
  return value
    .trim()
    .replace(CURLY_APOSTROPHE_RE, "'")
    .replace(STRIPPED_RE, " ")
    .replace(/\s+/g, " ")
    .slice(0, max)
    .trim();
}
