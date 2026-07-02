import { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  const [games, categories, tags, series, levels] = await Promise.all([
    supabase.from("games").select("slug, updated_at").eq("is_published", true),
    supabase.from("categories").select("slug, updated_at"),
    supabase.from("tags").select("slug, updated_at"),
    supabase.from("series").select("slug, updated_at"),
    supabase
      .from("game_levels")
      .select("slug, updated_at, games:games!inner(slug)")
      .eq("is_published", true),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
  ];

  const gamePages: MetadataRoute.Sitemap = (games.data || []).map((g) => ({
    url: `${SITE_URL}/game/${g.slug}`,
    lastModified: new Date(g.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = (categories.data || []).map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: new Date(c.updated_at),
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
