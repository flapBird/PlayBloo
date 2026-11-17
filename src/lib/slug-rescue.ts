import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { queryTimeout } from "@/lib/query-timeout";

/**
 * Rescue for /game/<slug> requests that miss because the URL was pasted from
 * somewhere hostile to exact slugs. The not-found log (admin Searches page)
 * keeps filling with the same patterns:
 *   - trailing CJK punctuation from AI-chat/translated-page copies
 *     ("my-sweet-pets-demo%E3%80%82" → "my-sweet-pets-demo。")
 *   - AI citation markers ("my-sweet-pets-demo**[citation:1")
 *   - typographic dashes that break slug equality (drag‑race‑simulator with
 *     U+2011 non-breaking hyphens → drag-race-simulator)
 *   - guessed slugs ("my-sweet-pets" → my-sweet-pets-demo, "footbillion-quiz"
 *     → footbillion)
 *   - the title pasted verbatim, in Chinese ("我的甜蜜宠物")
 *
 * The resolver normalizes the paste and tries, in order: exact slug, alias
 * table (migration 00011), unambiguous slug prefix, head-slug after dropping
 * the last token. Every lookup is bounded by queryTimeout like the game page
 * itself, and every miss returns null so the caller keeps its 404 + demand
 * signal path. Resolved hits redirect and are therefore no longer logged as
 * game_404 — they are demand that got served, not demand to catalogue.
 */

const CITATION_RE = /\[citation[^\]]*(\]|$)/gi;
// ASCII punctuation plus the full-width set seen in pasted titles. ASCII `-`
// is the slug separator and survives; unicode dashes fold into it first.
const NOISE_RE = /[.,;:!?@#$%^&*_+=~`'"“”‘’。，、；：？！～·…—―「」『』【】（）《》〈〉(){}[\]<>|\\/]/g;
const DASH_RE = /[\u2010-\u2015\u2043\u2212]/g;

export function cleanPastedSlug(raw: string): string {
  let value = raw;
  try {
    value = decodeURIComponent(value);
  } catch {
    // Malformed escapes: continue with the raw segment.
  }
  return value
    .normalize("NFKC")
    .replace(DASH_RE, "-")
    .replace(CITATION_RE, " ")
    .replace(NOISE_RE, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function resolvePastedGameSlug(raw: string): Promise<string | null> {
  const cleaned = cleanPastedSlug(raw);
  if (cleaned.length < 3) return null;

  const supabase = createAdminClient();
  // The rescue only runs on a cold not-found render, but that render still
  // shares the game page's abort budget; 1500ms measured as too tight for a
  // remote Supabase round trip (queries silently aborted at ~1.5s and every
  // paste was reported unresolvable), so all reads get the same 4000ms the
  // page itself allows. The four lookups fire in parallel and are resolved by
  // priority afterwards: exact > alias > prefix > head-token.
  const timeout = (runtimeMs: number) => AbortSignal.timeout(queryTimeout(runtimeMs));
  const gameBy = (column: "slug", value: string) =>
    supabase.from("games").select("slug").eq("is_published", true).eq(column, value).abortSignal(timeout(4000)).maybeSingle();
  const publishedSlugs = () =>
    supabase.from("games").select("slug").eq("is_published", true).abortSignal(timeout(4000));

  const exactPromise = gameBy("slug", cleaned);
  // Alias table (00011). Spaces and hyphens are interchangeable here: the
  // alias "footbillion quiz" matches the pasted "footbillion-quiz". Missing
  // table (migration not applied yet) surfaces as { data: null }, not a throw.
  const aliasRowsPromise = supabase
    .from("game_aliases")
    .select("alias, games!inner(slug)")
    .eq("games.is_published", true)
    .abortSignal(timeout(4000));
  // Unambiguous slug prefix — "my-sweet-pets" → my-sweet-pets-demo. Guessed
  // suffix — "footbillion-quiz" → footbillion via the head token.
  const prefixPromise =
    cleaned.length >= 4
      ? publishedSlugs().like("slug", `${cleaned}%`).limit(2)
      : Promise.resolve({ data: [] as unknown[] });
  const head = cleaned.slice(0, cleaned.lastIndexOf("-"));
  const headPromise = head.length >= 4 ? gameBy("slug", head) : Promise.resolve({ data: null });

  const [exact, aliasRows, prefixRows, headMatch] = await Promise.all([
    exactPromise,
    aliasRowsPromise,
    prefixPromise,
    headPromise,
  ]);

  if (exact.data?.slug) return exact.data.slug as string;

  const aliasCandidates = new Set<string>();
  for (const row of (aliasRows.data || []) as Array<{ alias: string; games: { slug: string } | { slug: string }[] | null }>) {
    const games = Array.isArray(row.games) ? row.games : row.games ? [row.games] : [];
    const aliasSlugForm = row.alias.trim().toLowerCase().replace(/\s+/g, "-");
    // Compact form drops separators entirely: "mysweetpets" and
    // "footbillionquiz" arrive with no spaces or hyphens at all.
    const aliasCompact = aliasSlugForm.replace(/-/g, "");
    const cleanedCompact = cleaned.replace(/-/g, "");
    const hits =
      aliasSlugForm === cleaned ||
      (aliasSlugForm.length >= 3 && cleaned.includes(aliasSlugForm)) ||
      (cleaned.length >= 3 && aliasSlugForm.includes(cleaned)) ||
      (aliasCompact.length >= 3 && aliasCompact === cleanedCompact);
    if (hits) for (const game of games) aliasCandidates.add(game.slug);
  }
  if (aliasCandidates.size === 1) return [...aliasCandidates][0];

  const prefixSlugs = ((prefixRows.data || []) as Array<{ slug: string }>).map((row) => row.slug);
  if (prefixSlugs.length === 1) return prefixSlugs[0];

  if (headMatch.data?.slug) return headMatch.data.slug as string;

  return null;
}
