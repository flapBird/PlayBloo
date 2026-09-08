import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { MIN_INDEXABLE_CATEGORY_GAMES, MIN_INDEXABLE_SERIES_GAMES, MIN_INDEXABLE_TAG_GAMES, SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  const [games, categories, tags, series, levels] = await Promise.all([
    supabase
      .from("games")
      .select("slug, updated_at, categories:game_categories(category_id), tags:game_tags(tag_id), series:game_series(series_id)")
      .eq("is_published", true),
    supabase.from("categories").select("id, slug, updated_at"),
    supabase.from("tags").select("id, slug, updated_at"),
    supabase.from("series").select("id, slug, updated_at"),
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

  const gamePages: MetadataRoute.Sitemap = (games.data || []).map((g) => ({
    url: `${SITE_URL}/game/${g.slug}`,
    lastModified: new Date(g.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryCounts = new Map<string, number>();
  const categoryLastModified = new Map<string, Date>();
  for (const game of games.data || []) {
    for (const membership of game.categories || []) {
      categoryCounts.set(
        membership.category_id,
        (categoryCounts.get(membership.category_id) || 0) + 1,
      );

      const gameUpdatedAt = new Date(game.updated_at);
      const previousUpdatedAt = categoryLastModified.get(membership.category_id);
      if (!previousUpdatedAt || gameUpdatedAt > previousUpdatedAt) {
        categoryLastModified.set(membership.category_id, gameUpdatedAt);
      }
    }
  }

  const categoryPages: MetadataRoute.Sitemap = (categories.data || [])
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

  const tagCounts = new Map<string, number>();
  const seriesCounts = new Map<string, number>();
  for (const game of games.data || []) {
    for (const membership of game.tags || []) tagCounts.set(membership.tag_id, (tagCounts.get(membership.tag_id) || 0) + 1);
    for (const membership of game.series || []) seriesCounts.set(membership.series_id, (seriesCounts.get(membership.series_id) || 0) + 1);
  }

  const tagPages: MetadataRoute.Sitemap = (tags.data || [])
    .filter((tag) => (tagCounts.get(tag.id) || 0) >= MIN_INDEXABLE_TAG_GAMES)
    .map((tag) => ({ url: `${SITE_URL}/tag/${tag.slug}`, lastModified: new Date(tag.updated_at), changeFrequency: "weekly" as const, priority: 0.4 }));

  const seriesPages: MetadataRoute.Sitemap = (series.data || [])
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

  return [...staticPages, ...gamePages, ...categoryPages, ...tagPages, ...seriesPages, ...levelIndexPages, ...levelPages];
}
