import "server-only";

import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { GameCardGame } from "@/components/games/GameCard";
import type { Category } from "@/lib/types";

export const PUBLIC_GAME_CARD_FIELDS = "id, title, slug, thumbnail_url, iframe_url, external_url, original_game_url, official_website_url, content_verified, short_description, description, added_at, last_updated_at, view_count, play_count, created_at, updated_at, release_date, is_trending, hot_score, categories:game_categories(category_id, categories:categories(id, name, slug))";
export const LEGACY_GAME_CARD_FIELDS = "id, title, slug, thumbnail_url, iframe_url, external_url, view_count, play_count, created_at, updated_at, release_date, is_trending, hot_score, categories:game_categories(category_id, categories:categories(id, name, slug))";
export const PUBLIC_GAME_DISCOVERY_FIELDS = PUBLIC_GAME_CARD_FIELDS;

type CategorySummary = Pick<Category, "id" | "name" | "slug">;
type RawPublicGameCard = Omit<GameCardGame, "categories"> & {
  categories?: Array<{ categories: CategorySummary | CategorySummary[] | null }>;
};

export function normalizePublicGameCards(value: unknown): GameCardGame[] {
  const games = (Array.isArray(value) ? value : []) as unknown as RawPublicGameCard[];
  return games.map((game) => ({
    ...game,
    categories: game.categories
      ?.flatMap((membership) => Array.isArray(membership.categories) ? membership.categories : [membership.categories])
      .filter((category): category is CategorySummary => Boolean(category)) || [],
  }));
}

/**
 * A deterministic discovery score based only on observed catalogue activity.
 * Games must sit in the lower 60% by views and have at least three real plays;
 * within that pool, a stronger play-to-view ratio ranks first.
 */
export function rankHiddenGems(games: GameCardGame[]): GameCardGame[] {
  const rankedByViews = [...games]
    .filter((game) => (game.view_count || 0) > 0)
    .sort((a, b) => (a.view_count || 0) - (b.view_count || 0));
  const lowViewCutoff = rankedByViews[Math.floor(rankedByViews.length * 0.6)]?.view_count || 0;

  return games
    .filter((game) => (game.play_count || 0) >= 3 && (game.view_count || 0) > 0 && (game.view_count || 0) <= lowViewCutoff)
    .sort((a, b) => {
      const aRate = (a.play_count || 0) / Math.max(a.view_count || 0, 1);
      const bRate = (b.play_count || 0) / Math.max(b.view_count || 0, 1);
      return bRate - aRate || (b.play_count || 0) - (a.play_count || 0);
    });
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  game_count: number;
}

/**
 * Category counts are shared by the header, homepage, search filters and API.
 * Keeping the aggregation behind one cache avoids repeating a 5,000-row join
 * on every navigation or dynamic search request.
 */
export const getCachedCategoryCatalog = unstable_cache(
  async (): Promise<PublicCategory[]> => {
    const supabase = createAdminClient();
    const [{ data: categories, error: categoriesError }, countsResult] = await Promise.all([
      supabase.from("categories").select("id, name, slug, sort_order").order("sort_order", { ascending: true }),
      supabase.rpc("public_category_counts"),
    ]);

    if (categoriesError) throw categoriesError;

    let countRows = (countsResult.data || []) as Array<{ category_id: string; game_count: number | string }>;

    // Compatibility fallback until migration 00005 has been applied.
    if (countsResult.error) {
      const { data: memberships, error } = await supabase
        .from("game_categories")
        .select("category_id, games!inner(id)")
        .eq("games.is_published", true)
        .limit(5000);
      if (error) throw error;

      const counts = new Map<string, number>();
      for (const membership of memberships || []) {
        counts.set(membership.category_id, (counts.get(membership.category_id) || 0) + 1);
      }
      countRows = [...counts].map(([category_id, game_count]) => ({ category_id, game_count }));
    }

    const counts = new Map(countRows.map((row) => [row.category_id, Number(row.game_count) || 0]));
    return (categories || []).map((category) => ({
      ...category,
      game_count: counts.get(category.id) || 0,
    }));
  },
  ["public-category-catalog-v1"],
  { revalidate: 1800 },
);

export async function getNavigationCategories(limit = 8): Promise<PublicCategory[]> {
  const categories = await getCachedCategoryCatalog();
  return categories
    .filter((category) => category.game_count > 0)
    .slice(0, limit);
}
