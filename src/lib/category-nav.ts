import "server-only";

import { unstable_cache } from "next/cache";
import { fetchPublishedGames } from "@/lib/catalog";
import { createAdminClient } from "@/lib/supabase/admin";
import { queryTimeout } from "@/lib/query-timeout";
import { MIN_INDEXABLE_CATEGORY_GAMES } from "@/lib/constants";

/**
 * Sitewide category navigation data (sidebar and mobile menu).
 *
 * Ordering approximates traffic: the total play count of a category's
 * published games, with the game count as tiebreaker. A separate, narrow cache
 * keeps the root layout independent of the much larger recommendation/sitemap
 * catalogue. New categories appear once they have enough published games.
 */

export interface CategoryNavItem {
  name: string;
  slug: string;
  gameCount: number;
}

type NavigationGame = {
  id: string;
  play_count: number | null;
  game_categories: { category_id: string }[] | null;
};

const getCachedCategoryNav = unstable_cache(async (): Promise<CategoryNavItem[]> => {
  const supabase = createAdminClient();
  const [categoryResult, games] = await Promise.all([
    supabase.from("categories").select("id, name, slug")
      .abortSignal(AbortSignal.timeout(queryTimeout(5000))),
    fetchPublishedGames<NavigationGame>(supabase, "id, play_count, game_categories(category_id)"),
  ]);
  if (categoryResult.error) {
    throw new Error(`Could not load navigation categories: ${categoryResult.error.message}`);
  }

  const counts = new Map<string, number>();
  const plays = new Map<string, number>();
  for (const game of games) {
    for (const relation of game.game_categories || []) {
      counts.set(relation.category_id, (counts.get(relation.category_id) || 0) + 1);
      plays.set(relation.category_id, (plays.get(relation.category_id) || 0) + (game.play_count || 0));
    }
  }

  return (categoryResult.data || [])
    .map((category) => ({
      name: category.name,
      slug: category.slug,
      gameCount: counts.get(category.id) || 0,
      playCount: plays.get(category.id) || 0,
    }))
    .filter((category) => category.gameCount >= MIN_INDEXABLE_CATEGORY_GAMES)
    .sort(
      (a, b) =>
        b.playCount - a.playCount ||
        b.gameCount - a.gameCount ||
        a.name.localeCompare(b.name),
    )
    .map(({ name, slug, gameCount }) => ({ name, slug, gameCount }));
}, ["public-category-navigation-v1"], {
  revalidate: 3600,
  tags: ["public-category-catalog", "public-recommendations"],
});

export async function getCategoryNav(): Promise<CategoryNavItem[]> {
  try {
    return await getCachedCategoryNav();
  } catch (error) {
    // Keep the fallback outside the data cache: a cold-cache outage must not
    // store an empty navigation for an hour, nor take down the root layout.
    // The permanent Browse Categories links remain available in the UI.
    console.warn("[category-nav] Navigation temporarily unavailable", error);
    return [];
  }
}
