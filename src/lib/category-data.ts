import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { queryTimeout } from "@/lib/query-timeout";
import { HOME_GAME_CARD_FIELDS, normalizePublicGameCards } from "@/lib/discovery-data";
import { PRIORITY_GAME_SLUGS } from "@/lib/priority-pages";
import { PAGE_SIZE } from "@/lib/constants";
import type { Category } from "@/lib/types";
import type { GameCardGame } from "@/components/games/GameCard";

export const getCategory = cache((slug: string) => unstable_cache(async (): Promise<Category | null> => {
  const { data, error } = await createAdminClient()
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .abortSignal(AbortSignal.timeout(queryTimeout(8000)))
    .maybeSingle();

  // Only a successful read with no row is a 404. Network/database failures
  // must reject inside the cache so they cannot persist as missing categories.
  if (error) throw new Error(`Could not load category: ${error.message}`);
  return data;
}, ["category-by-slug-v3", slug], { revalidate: 3600, tags: [`category:${slug}`] })());

/** The category's priority games, whatever their age, in priority rank order. */
function loadPriorityHits(categoryId: string, slug: string): Promise<GameCardGame[]> {
  return unstable_cache(async () => {
    const { data, error } = await createAdminClient()
      .from("games")
      .select(`${HOME_GAME_CARD_FIELDS}, category_filter:game_categories!inner(category_id)`)
      .eq("is_published", true)
      .eq("category_filter.category_id", categoryId)
      .in("slug", PRIORITY_GAME_SLUGS)
      .abortSignal(AbortSignal.timeout(queryTimeout(8000)));
    if (error) throw new Error(`Could not load category priority games: ${error.message}`);
    const hits = normalizePublicGameCards(data);
    // Priority rank order, so page 1 leads with the pages we are pushing.
    return hits.sort(
      (a, b) => PRIORITY_GAME_SLUGS.indexOf(a.slug) - PRIORITY_GAME_SLUGS.indexOf(b.slug),
    );
  }, ["category-priority-hits-v1", categoryId], { revalidate: 3600, tags: [`category:${slug}`] })();
}

/**
 * One page of a category's games. Page 1 additionally leads with the
 * category's priority games (the Search Console-indexed set), pulled forward
 * regardless of their age. Every page reads from the list with those slugs
 * excluded, so a game promoted onto page 1 never repeats deeper in the
 * pagination, and `total` comes from an unfiltered count so the pagination
 * math (and the too-far-page 404) keeps working on later pages.
 */
export const getCategoryGames = cache((categoryId: string, slug: string, page: number) => unstable_cache(async () => {
  const hits = await loadPriorityHits(categoryId, slug);
  const hitSlugs = new Set(hits.map((game) => game.slug));

  const buildRequest = (withCount: boolean, excludeHits: boolean) => {
    let request = createAdminClient()
      .from("games")
      // Filter in Postgres rather than downloading a capped list of membership
      // IDs and sending it back in a potentially oversized `in` query string.
      .select(`${HOME_GAME_CARD_FIELDS}, category_filter:game_categories!inner(category_id)`, withCount ? { count: "exact" } : undefined)
      .eq("is_published", true)
      .eq("category_filter.category_id", categoryId);
    if (excludeHits && hitSlugs.size) {
      request = request.not("slug", "in", `(${[...hitSlugs].map((s) => `"${s}"`).join(",")})`);
    }
    return request
      .order("created_at", { ascending: false })
      .order("id", { ascending: true });
  };

  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await buildRequest(true, true)
    .range(from, from + PAGE_SIZE - 1)
    .abortSignal(AbortSignal.timeout(queryTimeout(8000)));
  if (error) throw new Error(`Could not load category games: ${error.message}`);

  let total = count || 0;
  if (hitSlugs.size) {
    const { count: unfiltered } = await buildRequest(true, false)
      .range(0, 0)
      .abortSignal(AbortSignal.timeout(queryTimeout(8000)));
    if (unfiltered) total = unfiltered;
  }

  const games = normalizePublicGameCards(data);
  return { games: page === 1 ? [...hits, ...games] : games, total };
}, ["category-games-v5", categoryId, slug, String(page)], {
  revalidate: 3600, tags: [`category:${slug}`],
})());
