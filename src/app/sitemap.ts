import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getGuidesSitemap } from "@/lib/guides";
import { loadCatalog, type Membership } from "@/lib/catalog";
import { MIN_INDEXABLE_CATEGORY_GAMES, MIN_INDEXABLE_SERIES_GAMES, MIN_INDEXABLE_TAG_GAMES, SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  // The catalogue is read through the shared helper. It used to be one wide
  // `games` query with three nested joins, paged 500 rows at a time, which
  // made every sitemap regeneration take seconds and sometimes time out
  // entirely. Reading the taxonomy from its own side keeps the same counts
  // and timestamps while cutting the read to a fraction of the cost.
  const [catalog, levels] = await Promise.all([
    loadCatalog(),
    supabase
      .from("game_levels")
      .select("slug, updated_at, games:games!inner(slug)")
      .eq("is_published", true),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${SITE_URL}/category`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${SITE_URL}/series`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${SITE_URL}/submit-game`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const gamePages: MetadataRoute.Sitemap = catalog.games.map((game) => ({
    url: `${SITE_URL}/game/${game.slug}`,
    lastModified: new Date(game.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Each category inherits the most recent change among the games it holds,
  // so a category page is re-crawled when one of its games is touched.
  const gameUpdatedAt = new Map(catalog.games.map((game) => [game.id, new Date(game.updated_at)]));
  const categoryLastModified = new Map<string, Date>();
  for (const membership of catalog.categoryMembership) {
    let latest: Date | undefined;
    for (const gameId of membership.gameIds) {
      const updatedAt = gameUpdatedAt.get(gameId);
      if (!updatedAt) continue;
      if (!latest || updatedAt > latest) latest = updatedAt;
    }
    if (latest) categoryLastModified.set(membership.id, latest);
  }

  const countById = (memberships: Membership[]) =>
    new Map(memberships.map((membership) => [membership.id, membership.gameIds.length]));

  const categoryCounts = countById(catalog.categoryMembership);
  const tagCounts = countById(catalog.tagMembership);
  const seriesCounts = countById(catalog.seriesMembership);

  const categoryPages: MetadataRoute.Sitemap = catalog.categories
    .filter((category) => (categoryCounts.get(category.id) || 0) >= MIN_INDEXABLE_CATEGORY_GAMES)
    .map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      lastModified: new Date(
        Math.max(
          new Date(category.updated_at).getTime(),
          categoryLastModified.get(category.id)?.getTime() || 0,
        ),
      ),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const tagPages: MetadataRoute.Sitemap = catalog.tags
    .filter((tag) => (tagCounts.get(tag.id) || 0) >= MIN_INDEXABLE_TAG_GAMES)
    .map((tag) => ({ url: `${SITE_URL}/tag/${tag.slug}`, lastModified: new Date(tag.updated_at), changeFrequency: "weekly" as const, priority: 0.4 }));

  const seriesPages: MetadataRoute.Sitemap = catalog.series
    .filter((item) => (seriesCounts.get(item.id) || 0) >= MIN_INDEXABLE_SERIES_GAMES)
    .map((item) => ({ url: `${SITE_URL}/series/${item.slug}`, lastModified: new Date(item.updated_at), changeFrequency: "weekly" as const, priority: 0.6 }));

  // Level index pages for games that have levels
  const getLevelGameSlug = (game: { slug: string } | { slug: string }[] | null): string | null => {
    if (Array.isArray(game)) return game[0]?.slug || null;
    return game?.slug || null;
  };
  const gameIdsWithLevels = new Set(
    (levels.data || []).map((level) => getLevelGameSlug(level.games)).filter((slug): slug is string => Boolean(slug)),
  );
  const levelIndexPages: MetadataRoute.Sitemap = [...gameIdsWithLevels].map((slug) => ({
    url: `${SITE_URL}/game/${slug}/level`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const levelPages: MetadataRoute.Sitemap = (levels.data || []).flatMap((level) => {
    const gameSlug = getLevelGameSlug(level.games);
    if (!gameSlug) return [];
    return [{
    url: `${SITE_URL}/game/${gameSlug}/level/${level.slug}`,
    lastModified: new Date(level.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.5,
    }];
  });

  return [...staticPages, ...gamePages, ...categoryPages, ...tagPages, ...seriesPages, ...levelIndexPages, ...levelPages, ...getGuidesSitemap()];
}
