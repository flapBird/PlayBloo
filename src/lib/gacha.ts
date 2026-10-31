import "server-only";

import { getCachedCatalog, type CatalogGame } from "@/lib/catalog";
import { GACHA_RARITIES, GACHA_RARITY_ORDER, type GachaData, type GachaPoolGame, type GachaRarity, type GachaTheme } from "@/lib/gacha-shared";

/**
 * Game Gacha data layer.
 *
 * The card pool is derived from the shared cached catalogue: every published
 * game becomes a card whose rarity reflects how often it is played across
 * PlayBloo (a play-count percentile), so rarity follows real interest instead
 * of a hand-picked list. Drawing itself happens in the browser; the server
 * only ships the pool, today's theme and the published odds.
 */

/** Catalogue share covered by each rarity band, top of the ranking first. */
const RARITY_BANDS: Array<{ rarity: GachaRarity; share: number }> = [
  { rarity: "legendary", share: 0.03 },
  { rarity: "epic", share: 0.12 },
  { rarity: "rare", share: 0.25 },
  { rarity: "common", share: 1 },
];

const THEME_MIN_GAMES = 15;

/**
 * Assign rarities by play-count rank: the top 3% of the catalogue are
 * Legendary, the next 12% Epic, the next 25% Rare and the rest Common.
 * `id` breaks ties in the sort so the split is stable across renders.
 */
function assignRarities(games: Array<{ id: string; playCount: number }>): Map<string, GachaRarity> {
  const ranked = [...games].sort((a, b) => b.playCount - a.playCount || a.id.localeCompare(b.id));
  const total = ranked.length;
  const assignment = new Map<string, GachaRarity>();
  let index = 0;
  for (const band of RARITY_BANDS) {
    const bandEnd = Math.ceil(total * band.share);
    while (index < bandEnd && index < total) {
      assignment.set(ranked[index].id, band.rarity);
      index += 1;
    }
  }
  return assignment;
}

/** The day's featured category, rotating through the eligible ones in order. */
function pickTheme(eligible: GachaTheme[]): GachaTheme | null {
  if (!eligible.length) return null;
  const days = Math.floor(Date.now() / 86_400_000);
  return eligible[days % eligible.length];
}

export async function getGachaData(): Promise<GachaData> {
  const catalog = await getCachedCatalog();

  const categoryNameById = new Map(catalog.categories.map((category) => [category.id, { slug: category.slug, name: category.name }]));
  const primaryCategoryByGame = new Map<string, { slug: string; name: string }>();
  const categoryGameCounts = new Map<string, number>();
  for (const membership of catalog.categoryMembership) {
    categoryGameCounts.set(membership.id, membership.gameIds.length);
    for (const gameId of membership.gameIds) {
      if (!primaryCategoryByGame.has(gameId)) {
        const category = categoryNameById.get(membership.id);
        if (category) primaryCategoryByGame.set(gameId, category);
      }
    }
  }

  // The shared cached catalogue carries `title` and `thumbnail_url` in its
  // game columns, but CatalogGame only declares the fields every consumer
  // needs — widen to the card fields the gacha pool renders.
  const games = catalog.games as unknown as Array<CatalogGame & { title: string; thumbnail_url: string | null }>;

  const rarityByGame = assignRarities(games.map((game) => ({ id: game.id, playCount: game.play_count || 0 })));

  const pool: GachaPoolGame[] = games.map((game) => {
    const category = primaryCategoryByGame.get(game.id) || null;
    return {
      id: game.id,
      slug: game.slug,
      title: game.title,
      thumbnailUrl: game.thumbnail_url || null,
      categorySlug: category?.slug || null,
      categoryName: category?.name || null,
      rarity: rarityByGame.get(game.id) || "common",
    };
  });

  const counts = { legendary: 0, epic: 0, rare: 0, common: 0 } as Record<GachaRarity, number>;
  for (const card of pool) counts[card.rarity] += 1;

  const eligibleThemes = catalog.categories
    .filter((category) => (categoryGameCounts.get(category.id) || 0) >= THEME_MIN_GAMES)
    .map((category) => ({ slug: category.slug, name: category.name }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return { pool, theme: pickTheme(eligibleThemes), totalGames: pool.length, counts };
}

// Re-exported for server components that render the gacha page.
export { GACHA_RARITIES, GACHA_RARITY_ORDER };
export type { GachaData, GachaPoolGame, GachaRarity, GachaTheme };
