import { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { getGuidesSitemap } from "@/lib/guides";
import { getCachedCatalog, type Membership } from "@/lib/catalog";
import { createAdminClient } from "@/lib/supabase/admin";
import { queryTimeout } from "@/lib/query-timeout";
import { recordMetric, startTimer } from "@/lib/metrics";
import { MIN_INDEXABLE_CATEGORY_GAMES, MIN_INDEXABLE_SERIES_GAMES, MIN_INDEXABLE_TAG_GAMES, SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

type SitemapLevel = { slug: string; updated_at: string; games: { slug: string } | { slug: string }[] | null };

// game_levels hits the same 1000-row PostgREST cap as every other response, so
// a bare select silently truncates and every level past the first thousand
// drops out of the sitemap. Page through it the way the catalogue does: one
// counted first page, then the rest in parallel, ordered by id so pages line
// up across requests.
const LEVEL_PAGE_SIZE = 1000;

const getCachedSitemapLevels = unstable_cache(async (): Promise<SitemapLevel[]> => {
  const supabase = createAdminClient();
  const readPage = async (offset: number, withCount = false) => {
    const { data, error, count } = await supabase
      .from("game_levels")
      .select("slug, updated_at, games:games!inner(slug)", withCount ? { count: "exact" } : undefined)
      .eq("is_published", true)
      .order("id")
      .range(offset, offset + LEVEL_PAGE_SIZE - 1)
      .abortSignal(AbortSignal.timeout(queryTimeout(5000)));
    if (error) throw new Error(`Could not load sitemap levels: ${error.message}`);
    return { rows: (data || []) as unknown as SitemapLevel[], count: count ?? null };
  };

  const first = await readPage(0, true);
  const total = first.count;
  if (total === null || total <= LEVEL_PAGE_SIZE) return first.rows;
  const pageCount = Math.ceil(total / LEVEL_PAGE_SIZE);
  const offsets: number[] = [];
  for (let page = 1; page < pageCount; page++) offsets.push(page * LEVEL_PAGE_SIZE);
  const remaining = await Promise.all(offsets.map((offset) => readPage(offset)));
  return [first.rows, ...remaining.map((page) => page.rows)].flat();
}, ["public-sitemap-levels-v1"], { revalidate: 3600, tags: ["sitemap-levels"] });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const elapsed = startTimer();

  // Both reads sit behind shared cache entries (the catalogue via
  // getCachedCatalog, the levels just below), so a regeneration after the
  // hourly TTL — the thing a crawler is most likely to catch — replays cached
  // data instead of re-reading every game, membership and level from Supabase.
  const [catalog, levels] = await Promise.all([getCachedCatalog(), getCachedSitemapLevels()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    // /gacha launched 2026-10-31; its lastmod keeps the launch date, matching
    // the convention that new pages carry their real PlayBloo launch date.
    { url: `${SITE_URL}/gacha`, lastModified: new Date("2026-10-31T09:00:00.000Z"), changeFrequency: "daily" as const, priority: 0.6 },
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
    levels.map((level) => getLevelGameSlug(level.games)).filter((slug): slug is string => Boolean(slug)),
  );
  const levelIndexPages: MetadataRoute.Sitemap = [...gameIdsWithLevels].map((slug) => ({
    url: `${SITE_URL}/game/${slug}/level`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const levelPages: MetadataRoute.Sitemap = levels.flatMap((level) => {
    const gameSlug = getLevelGameSlug(level.games);
    if (!gameSlug) return [];
    return [{
    url: `${SITE_URL}/game/${gameSlug}/level/${level.slug}`,
    lastModified: new Date(level.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.5,
    }];
  });

  const entries = [...staticPages, ...gamePages, ...categoryPages, ...tagPages, ...seriesPages, ...levelIndexPages, ...levelPages, ...getGuidesSitemap()];
  recordMetric("sitemap_generate_ms", elapsed());
  recordMetric("sitemap_urls", entries.length);
  return entries;
}
