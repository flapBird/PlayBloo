import { MetadataRoute } from "next";
import { unstable_cache } from "next/cache";
import { getGuidesSitemap } from "@/lib/guides";
import { getCachedCatalog, type Membership } from "@/lib/catalog";
import { createAdminClient } from "@/lib/supabase/admin";
import { queryTimeout } from "@/lib/query-timeout";
import { recordMetric, startTimer } from "@/lib/metrics";
import { MIN_INDEXABLE_CATEGORY_GAMES, MIN_INDEXABLE_SERIES_GAMES, SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

type SitemapGame = { slug: string; updated_at: string };

// Sitemap curation (2026-11-12). The generated sitemap used to list every
// published page — 1,368 URLs, 1,255 of them game pages — while crawl stats
// showed most earning nothing: 856 of the 1,255 game pages have zero views
// and another ~350 sit in single digits, so crawl budget went to pages
// nobody (or Google) cared about. The sitemap now lists a curated set while
// the pages themselves and their internal links stay live as before:
//   1. the 34 URLs Search Console reports as indexed (see GSC_INDEXED_...),
//   2. every indexable category page (page-1 canonicals, as before),
//   3. the homepage plus games with real traffic (view_count >= 3),
//   4. every guides hub and article (all editorially curated).
// /new-games, /popular and /trending join here once those pages exist.
// /gacha, /tools/*, /submit-game, tag pages and level pages are no longer
// listed even though the pages remain live and crawlable via internal links.

// The 17 game URLs from the Search Console indexed list. view_count only
// ever increases, so these all clear FEATURED_MIN_VIEWS today — the explicit
// list keeps them in the sitemap even if a data fix resets the counters.
const GSC_INDEXED_GAME_SLUGS = [
  "eggy-car",
  "last-flag-standing",
  "wave-rider",
  "odio-el-chocolate",
  "drift-rush",
  "wheeljumper",
  "escape-road-halloween",
  "juniper-jam-metagame",
  "escape-road-city-2",
  "escape-road-3",
  "color-block-jam",
  "undead-corridor",
  "dearest-darling-dragon",
  "death-spiral",
  "escape-road-city",
  "goodbye-doggy",
  "escape-road-2",
];

const FEATURED_MIN_VIEWS = 3;

// games hits the same 1000-row PostgREST cap as every other response, so page
// through it the way the catalogue does: one counted first page, then the
// rest in parallel, ordered deterministically so pages line up across
// requests.
const PAGE_SIZE = 1000;

const getCachedFeaturedGames = unstable_cache(async (): Promise<SitemapGame[]> => {
  const supabase = createAdminClient();
  const readPage = async (offset: number, withCount = false) => {
    const { data, error, count } = await supabase
      .from("games")
      .select("slug, updated_at", withCount ? { count: "exact" } : undefined)
      .eq("is_published", true)
      .or(
        `view_count.gte.${FEATURED_MIN_VIEWS},slug.in.(${GSC_INDEXED_GAME_SLUGS.map((slug) => `"${slug}"`).join(",")})`,
      )
      .order("view_count", { ascending: false })
      .order("id", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1)
      .abortSignal(AbortSignal.timeout(queryTimeout(5000)));
    if (error) throw new Error(`Could not load featured sitemap games: ${error.message}`);
    return { rows: (data || []) as unknown as SitemapGame[], count: count ?? null };
  };

  const first = await readPage(0, true);
  const total = first.count;
  if (total === null || total <= PAGE_SIZE) return first.rows;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const offsets: number[] = [];
  for (let page = 1; page < pageCount; page++) offsets.push(page * PAGE_SIZE);
  const remaining = await Promise.all(offsets.map((offset) => readPage(offset)));
  return [first.rows, ...remaining.map((page) => page.rows)].flat();
}, ["public-sitemap-featured-games-v1"], { revalidate: 3600, tags: ["sitemap-featured-games"] });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const elapsed = startTimer();

  // Both reads sit behind shared cache entries (the catalogue via
  // getCachedCatalog, the featured games just below), so a regeneration after
  // the hourly TTL — the thing a crawler is most likely to catch — replays
  // cached data instead of re-reading every game and membership from
  // Supabase.
  const [catalog, featuredGames] = await Promise.all([getCachedCatalog(), getCachedFeaturedGames()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${SITE_URL}/category`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${SITE_URL}/series`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    // Newly sitemapped with the 2026-11-12 curation (Search Console reports
    // all four indexed). lastmod anchors to the last commit that touched each
    // page in git history, not to the build.
    { url: `${SITE_URL}/about`, lastModified: new Date("2026-07-24T00:00:00.000Z"), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date("2026-09-13T00:00:00.000Z"), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date("2026-09-08T00:00:00.000Z"), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${SITE_URL}/terms`, lastModified: new Date("2026-07-24T00:00:00.000Z"), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const gamePages: MetadataRoute.Sitemap = featuredGames.map((game) => ({
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

  const seriesPages: MetadataRoute.Sitemap = catalog.series
    .filter((item) => (seriesCounts.get(item.id) || 0) >= MIN_INDEXABLE_SERIES_GAMES)
    .map((item) => ({ url: `${SITE_URL}/series/${item.slug}`, lastModified: new Date(item.updated_at), changeFrequency: "weekly" as const, priority: 0.6 }));

  const entries = [...staticPages, ...gamePages, ...categoryPages, ...seriesPages, ...getGuidesSitemap()];
  recordMetric("sitemap_generate_ms", elapsed());
  recordMetric("sitemap_urls", entries.length);
  return entries;
}
