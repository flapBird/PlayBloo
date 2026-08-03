import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { MIN_INDEXABLE_CATEGORY_GAMES, SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  const [games, categories, tags, series, levels] = await Promise.all([
    supabase
      .from("games")
      .select("slug, updated_at, categories:game_categories(category_id)")
      .eq("is_published", true),
    supabase.from("categories").select("id, slug, updated_at"),
    supabase.from("tags").select("slug, updated_at"),
    supabase.from("series").select("slug, updated_at"),
    supabase
      .from("game_levels")
      .select("slug, updated_at, games:games!inner(slug)")
      .eq("is_published", true),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
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

  const tagPages: MetadataRoute.Sitemap = (tags.data || []).map((t) => ({
    url: `${SITE_URL}/tag/${t.slug}`,
    lastModified: new Date(t.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  const seriesPages: MetadataRoute.Sitemap = (series.data || []).map((s) => ({
    url: `${SITE_URL}/series/${s.slug}`,
    lastModified: new Date(s.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Level index pages for games that have levels
  const gameIdsWithLevels = new Set((levels.data || []).map((l: any) => l.games.slug));
  const levelIndexPages: MetadataRoute.Sitemap = [...gameIdsWithLevels].map((slug) => ({
    url: `${SITE_URL}/game/${slug}/level`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const levelPages: MetadataRoute.Sitemap = (levels.data || []).map((l: any) => ({
    url: `${SITE_URL}/game/${l.games.slug}/level/${l.slug}`,
    lastModified: new Date(l.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...gamePages, ...categoryPages, ...tagPages, ...seriesPages, ...levelIndexPages, ...levelPages];
}
