import "server-only";

import { getCachedCatalog } from "@/lib/catalog";
import { MIN_INDEXABLE_CATEGORY_GAMES } from "@/lib/constants";

/**
 * Sitewide category navigation data (sidebar, mobile menu, footer links).
 *
 * Ordering approximates traffic: the total play count of a category's
 * published games, with the game count as tiebreaker. Everything is derived
 * from the shared catalogue cache, so this costs no extra database reads and
 * a new category row shows up here automatically once it holds enough games
 * to be indexable.
 */

export interface CategoryNavItem {
  name: string;
  slug: string;
  gameCount: number;
}

export async function getCategoryNav(): Promise<CategoryNavItem[]> {
  const catalog = await getCachedCatalog();

  const counts = new Map<string, number>();
  for (const membership of catalog.categoryMembership) {
    counts.set(membership.id, membership.gameIds.length);
  }

  const plays = new Map<string, number>();
  for (const game of catalog.games) {
    for (const relation of game.game_categories || []) {
      plays.set(relation.category_id, (plays.get(relation.category_id) || 0) + (game.play_count || 0));
    }
  }

  return catalog.categories
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
}
