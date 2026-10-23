import "server-only";

import { unstable_cache } from "next/cache";
import { getCachedCatalog, type CatalogCategory } from "@/lib/catalog";
import type { GameCardGame } from "@/components/games/GameCard";
import { getGamePlayMode } from "@/lib/game-utils";
import { MIN_INDEXABLE_SERIES_GAMES } from "@/lib/constants";

/**
 * Shared related-game selection.
 *
 * The game detail page, the level pages and any future listing that wants
 * cross-game links all rank candidates from the same source: one cached copy
 * of the published catalogue with the taxonomy memberships attached. Nothing
 * here issues its own Supabase query at request time.
 */

export interface RecommendationCandidate extends GameCardGame {
  iframe_url: string | null;
  external_url: string | null;
  original_game_url: string | null;
  categoryIds: string[];
  tagIds: string[];
  seriesIds: string[];
  hot_score?: number;
  is_trending?: boolean;
}

type RawRecommendationCandidate = Omit<RecommendationCandidate, "categories" | "categoryIds" | "tagIds" | "seriesIds" | "original_game_url">;

export const getRecommendationPool = unstable_cache(async (): Promise<RecommendationCandidate[]> => {
  // The pool covers the whole published catalogue, not a top-N slice. It used
  // to be limited to 500 rows ordered by hot_score, and because every
  // published game has hot_score = 0 the slice fell on the oldest games: the
  // ~550 newest games were never candidates, so their pages rendered without
  // related games and without previous/next links.
  //
  // The catalogue comes through the shared cached entry, so the expensive
  // whole-catalogue read runs once per TTL for the sitemap and this pool
  // together; what this layer adds is the per-game taxonomy lookup tables and
  // the card-shaped candidates.
  const catalog = await getCachedCatalog();

  const categoryById = new Map(catalog.categories.map((category) => [category.id, category]));
  const categoryIdsByGame = new Map<string, string[]>();
  for (const membership of catalog.categoryMembership) {
    for (const gameId of membership.gameIds) {
      const list = categoryIdsByGame.get(gameId) || [];
      list.push(membership.id);
      categoryIdsByGame.set(gameId, list);
    }
  }
  const tagIdsByGame = new Map<string, string[]>();
  for (const membership of catalog.tagMembership) {
    for (const gameId of membership.gameIds) {
      const list = tagIdsByGame.get(gameId) || [];
      list.push(membership.id);
      tagIdsByGame.set(gameId, list);
    }
  }
  const seriesIdsByGame = new Map<string, string[]>();
  for (const membership of catalog.seriesMembership) {
    for (const gameId of membership.gameIds) {
      const list = seriesIdsByGame.get(gameId) || [];
      list.push(membership.id);
      seriesIdsByGame.set(gameId, list);
    }
  }

  return catalog.games.map((game) => {
    const candidate = game as unknown as RawRecommendationCandidate;
    const categoryIds = categoryIdsByGame.get(game.id) || [];
    return {
      ...candidate,
      original_game_url: null,
      categories: categoryIds
        .map((id) => categoryById.get(id))
        .filter((category): category is CatalogCategory => Boolean(category))
        .map((category) => ({ id: category.id, name: category.name, slug: category.slug })),
      categoryIds,
      tagIds: tagIdsByGame.get(game.id) || [],
      seriesIds: seriesIdsByGame.get(game.id) || [],
    };
  });
}, ["public-recommendation-pool-v4"], { revalidate: 3600, tags: ["public-recommendations"] });

/** Only the fields the ranking actually reads, so pages can pass a Game or a pool candidate. */
export interface RelatedSource {
  id: string;
  iframe_url?: string | null;
  external_url?: string | null;
  original_game_url?: string | null;
  official_website_url?: string | null;
}

export function getRelatedGames(
  source: RelatedSource,
  categoryIds: string[],
  tagIds: string[],
  seriesIds: string[],
  candidates: RecommendationCandidate[],
  limit = 6,
) {
  const categorySet = new Set(categoryIds);
  const tagSet = new Set(tagIds);
  const seriesSet = new Set(seriesIds);
  const currentMode = getGamePlayMode({
    iframe_url: source.iframe_url ?? null,
    external_url: source.external_url ?? null,
    original_game_url: source.original_game_url ?? null,
    official_website_url: source.official_website_url ?? null,
  });
  const best: Array<{ candidate: RecommendationCandidate; reason: string; score: number }> = [];
  for (const candidate of candidates) {
    if (candidate.id === source.id) continue;
    const sameSeries = candidate.seriesIds.some((id) => seriesSet.has(id));
    const sameCategory = candidate.categoryIds.some((id) => categorySet.has(id));
    const sameTag = candidate.tagIds.some((id) => tagSet.has(id));
    const sameMode = getGamePlayMode(candidate) === currentMode;
    const entry = {
      candidate,
      reason: sameSeries ? "Same game series" : sameCategory ? "Similar genre" :
        sameTag ? "Shared gameplay tags" : sameMode && currentMode === "embedded" ? "Also playable here" :
        candidate.is_trending ? "Trending with players" : "Popular discovery",
      score: (sameSeries ? 10000 : 0) + (sameCategory ? 1000 : 0) + (sameTag ? 100 : 0) +
        (sameMode ? 10 : 0) + (candidate.is_trending ? 5 : 0) + Math.min(Number(candidate.hot_score) || 0, 4),
    };
    // Keep only the winners, preserving input order for exact ties. Avoid
    // allocating and sorting a second 500-game array on every regeneration.
    const index = best.findIndex((item) => entry.score > item.score ||
      (entry.score === item.score && (candidate.play_count || 0) > (item.candidate.play_count || 0)));
    if (index >= 0) best.splice(index, 0, entry);
    else if (best.length < limit) best.push(entry);
    if (best.length > limit) best.pop();
  }
  return best.map(({ candidate, reason }) => ({ ...candidate, recommendationReason: reason }));
}

export function getNeighbors(game: { id: string }, candidates: RecommendationCandidate[]) {
  const ordered = [...candidates].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  const index = ordered.findIndex((candidate) => candidate.id === game.id);
  if (index < 0) return { previous: null, next: null };
  const previous = ordered[index - 1];
  const next = ordered[index + 1];
  return {
    previous: previous ? { title: previous.title, slug: previous.slug } : null,
    next: next ? { title: next.title, slug: next.slug } : null,
  };
}

export function getVisibleSeries<T extends { id: string }>(series: T[], candidates: RecommendationCandidate[]): T[] {
  if (!series.length) return [];
  const counts = new Map(series.map((item) => [item.id, 0]));
  for (const candidate of candidates) {
    for (const seriesId of candidate.seriesIds) {
      if (counts.has(seriesId)) counts.set(seriesId, (counts.get(seriesId) || 0) + 1);
    }
  }
  return series.filter((item) => (counts.get(item.id) || 0) >= MIN_INDEXABLE_SERIES_GAMES);
}

/**
 * Related games for a page that only knows the current game's slug — the
 * level pages. Issues no Supabase query of its own: the pool already carries
 * every game's memberships, so the current game is found by slug and ranked
 * from its taxonomy ids. Returns an empty list when the pool is unavailable
 * or the game is missing from it.
 */
export async function getRelatedGamesBySlug(slug: string, limit = 6) {
  const pool = await getRecommendationPool().catch(() => [] as RecommendationCandidate[]);
  const self = pool.find((candidate) => candidate.slug === slug);
  if (!self) return [];
  return getRelatedGames(self, self.categoryIds, self.tagIds, self.seriesIds, pool, limit);
}
