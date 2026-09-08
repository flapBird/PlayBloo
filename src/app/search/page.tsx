import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCachedCategoryCatalog, normalizePublicGameCards, PUBLIC_GAME_CARD_FIELDS, rankHiddenGems } from "@/lib/discovery-data";
import { GameCard, type GameCardGame } from "@/components/games/GameCard";
import { GameListItem } from "@/components/games/GameListItem";
import { ActiveFilterChips, SearchFilterPanel, type FilterOptions, type PublicSearchFilters } from "@/components/search/SearchFilterPanel";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { MIN_INDEXABLE_CATEGORY_GAMES, PAGE_SIZE, SITE_URL } from "@/lib/constants";

interface Props { searchParams: Promise<{ q?: string; sort?: string; page?: string; category?: string; playMode?: string; platform?: string; price?: string; status?: string; view?: string }> }
interface SearchOptionGame { platforms: string[] | null; monetization: string | null; development_status: string | null; release_date: string | null; last_updated_at: string | null }
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const hasParameters = Object.keys(params).length > 0;
  return {
    title: "Search and Discover Browser Games",
    description: "Search PlayBloo games by title, developer, genre, tag and play mode.",
    robots: { index: false, follow: true },
    ...(!hasParameters ? { alternates: { canonical: "/search" } } : {}),
  };
}
function clean(value = "", max = 80) { return value.trim().replace(/[%_(),]/g, " ").replace(/\s+/g, " ").slice(0, max); }

async function findMatches(q: string) {
  const term = clean(q); if (!term) return null;
  const supabase = createAdminClient();
  const { data: rpcMatches, error: rpcError } = await supabase.rpc("search_public_game_ids", { search_term: term });
  if (!rpcError) return new Set<string>((rpcMatches || []).map((match: { game_id: string }) => match.game_id));

  // Compatibility fallback until migration 00005 is applied.
  const pattern = `%${term}%`;
  const [games, categories, tags] = await Promise.all([
    supabase.from("games").select("id").eq("is_published", true).ilike("title", pattern).limit(500),
    supabase.from("categories").select("id").ilike("name", pattern).limit(100), supabase.from("tags").select("id").ilike("name", pattern).limit(100),
  ]);
  const ids = new Set<string>((games.data || []).map((v) => v.id));
  const [categoryGames, tagGames] = await Promise.all([
    categories.data?.length ? supabase.from("game_categories").select("game_id").in("category_id", categories.data.map((v) => v.id)).limit(500) : Promise.resolve({ data: [] as { game_id: string }[] }),
    tags.data?.length ? supabase.from("game_tags").select("game_id").in("tag_id", tags.data.map((v) => v.id)).limit(500) : Promise.resolve({ data: [] as { game_id: string }[] }),
  ]);
  for (const item of [...(categoryGames.data || []), ...(tagGames.data || [])]) ids.add(item.game_id); return ids;
}

async function searchGames(filters: PublicSearchFilters): Promise<{ games: GameCardGame[]; total: number }> {
  const supabase = createAdminClient(); let ids = await findMatches(filters.q);
  if (filters.category) { const { data } = await supabase.from("game_categories").select("game_id").eq("category_id", filters.category).limit(1000); const categoryIds = new Set((data || []).map((v) => v.game_id)); ids = ids === null ? categoryIds : new Set([...ids].filter((id) => categoryIds.has(id))); }
  if (ids && !ids.size) return { games: [], total: 0 };
  // Dynamic search results only need list/card fields. Selecting the full game
  // row also transferred long editorial copy, screenshots and source JSON.
  let query = supabase.from("games").select(PUBLIC_GAME_CARD_FIELDS, { count: "exact" }).eq("is_published", true);
  if (ids) query = query.in("id", [...ids]);
  if (filters.playMode === "embedded") query = query.not("iframe_url", "is", null).neq("iframe_url", "");
  if (filters.platform) query = query.contains("platforms", [filters.platform]);
  if (filters.price === "free") query = query.in("monetization", ["free", "free-with-ads", "freemium"]);
  if (filters.price === "paid") query = query.eq("monetization", "paid");
  if (filters.status) query = query.eq("development_status", filters.status);
  if (filters.sort === "hidden-gems") {
    const { data, error } = await query.order("view_count", { ascending: true }).limit(500);
    if (error) {
      console.error("Hidden gems query failed:", error.message);
      return { games: [], total: 0 };
    }
    const ranked = rankHiddenGems(normalizePublicGameCards(data));
    const from = (filters.page - 1) * PAGE_SIZE;
    return { games: ranked.slice(from, from + PAGE_SIZE), total: ranked.length };
  }
  if (filters.sort === "released") query = query.not("release_date", "is", null).order("release_date", { ascending: false });
  else if (filters.sort === "recently-updated") query = query.not("last_updated_at", "is", null).order("last_updated_at", { ascending: false });
  else if (filters.sort === "trending") query = query.order("hot_score", { ascending: false }).order("play_count", { ascending: false });
  else if (filters.sort === "popular") query = query.order("play_count", { ascending: false }).order("view_count", { ascending: false });
  // created_at remains the compatibility-safe "added" timestamp until the
  // optional editorial-date migration has been applied in every environment.
  else query = query.order("created_at", { ascending: false });
  const from = (filters.page - 1) * PAGE_SIZE; const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) {
    // The public site remains usable before the optional discovery migrations
    // are applied. These two rankings depend on new columns, so temporarily
    // fall back to newest rather than returning a misleading empty result.
    console.error("Search query failed:", error.message);
    return { games: [], total: 0 };
  }
  return { games: normalizePublicGameCards(data), total: count || 0 };
}

const getOptions = unstable_cache(async (): Promise<FilterOptions> => {
  const supabase = createAdminClient();
  const [categories, advancedResult] = await Promise.all([
    getCachedCategoryCatalog(),
    supabase
      .from("games")
      .select("platforms, monetization, development_status, release_date, last_updated_at")
      .eq("is_published", true)
      .limit(500),
  ]);

  let rows = (advancedResult.data || []) as SearchOptionGame[];
  if (advancedResult.error) {
    // Compatibility before migration 00004: release_date already exists, while
    // the richer filter columns may not.
    const fallback = await supabase
      .from("games")
      .select("release_date")
      .eq("is_published", true)
      .limit(500);
    rows = (fallback.data || []).map((game) => ({
      platforms: null,
      monetization: null,
      development_status: null,
      release_date: game.release_date,
      last_updated_at: null,
    }));
  }

  const preferred = ["Web", "Windows", "Android", "iOS"];
  return {
    categories: categories.filter((item) => item.game_count >= MIN_INDEXABLE_CATEGORY_GAMES),
    platforms: preferred.filter((platform) => rows.some((game) => game.platforms?.includes(platform))),
    prices: ["free", "paid"].filter((price) => rows.some((game) => price === "free" ? ["free", "free-with-ads", "freemium"].includes(game.monetization || "") : game.monetization === "paid")),
    statuses: ["demo", "released", "upcoming"].filter((status) => rows.some((game) => game.development_status === status)),
    hasReleaseDates: rows.some((game) => Boolean(game.release_date)),
    hasUpdates: rows.some((game) => Boolean(game.last_updated_at)),
  };
}, ["public-search-filter-options-v2"], { revalidate: 1800 });

function href(filters: PublicSearchFilters, page: number, view = filters.view) {
  const p = new URLSearchParams();
  for (const [key, value] of Object.entries({
    q: filters.q,
    sort: filters.sort === "newest" ? "" : filters.sort,
    category: filters.category,
    playMode: filters.playMode === "all" ? "" : filters.playMode,
    platform: filters.platform,
    price: filters.price,
    status: filters.status,
    view: view === "list" ? "" : view,
    page: page > 1 ? String(page) : "",
  })) {
    if (value) p.set(key, value);
  }
  return `/search${p.size ? `?${p}` : ""}`;
}

export default async function SearchPage({ searchParams }: Props) {
  const p = await searchParams;
  const sorts = ["newest", "released", "recently-updated", "trending", "popular", "hidden-gems"];
  const requestedFilters: PublicSearchFilters = {
    q: clean(p.q),
    sort: sorts.includes(p.sort || "") ? p.sort! : "newest",
    page: Math.max(1, Number(p.page) || 1),
    category: clean(p.category, 80) || undefined,
    playMode: p.playMode === "embedded" ? "embedded" : "all",
    platform: clean(p.platform, 30) || undefined,
    price: ["free", "paid"].includes(p.price || "") ? p.price : undefined,
    status: ["demo", "released", "upcoming"].includes(p.status || "") ? p.status : undefined,
    view: p.view === "grid" ? "grid" : "list",
  };
  const options = await getOptions();
  const filters: PublicSearchFilters = {
    ...requestedFilters,
    platform: options.platforms.includes(requestedFilters.platform || "") ? requestedFilters.platform : undefined,
    price: options.prices.includes(requestedFilters.price || "") ? requestedFilters.price : undefined,
    status: options.statuses.includes(requestedFilters.status || "") ? requestedFilters.status : undefined,
  };
  const { games, total } = filters.sort === "recently-updated" && !options.hasUpdates
    ? { games: [], total: 0 }
    : await searchGames(filters);
  const pages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container mx-auto space-y-6 px-4 py-6 md:py-8">
      <BreadcrumbJsonLd items={[{ name: "Home", url: SITE_URL }, { name: "Search", url: `${SITE_URL}/search` }]} />
      <div>
        <p className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"><SlidersHorizontal className="h-3.5 w-3.5" />Game discovery</p>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{filters.q ? `Results for “${filters.q}”` : "Find your next game"}</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <SearchFilterPanel filters={filters} options={options} />
        <main className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div>
              <p className="text-sm text-muted-foreground"><strong className="text-foreground">{total}</strong> games found</p>
              <ActiveFilterChips filters={filters} />
            </div>
            <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
              <Link href={href(filters, 1, "list")} aria-label="List view" className={`grid h-8 w-8 place-items-center rounded-md ${filters.view === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}><List className="h-4 w-4" /></Link>
              <Link href={href(filters, 1, "grid")} aria-label="Grid view" className={`grid h-8 w-8 place-items-center rounded-md ${filters.view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}><LayoutGrid className="h-4 w-4" /></Link>
            </div>
          </div>
          {games.length ? (
            <>
              {filters.view === "grid" ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {games.map((game) => <GameCard key={game.id} game={game} />)}
                </div>
              ) : (
                <div className="discovery-list">
                  {games.map((game, index) => <GameListItem key={game.id} game={game} eagerImage={index === 0} />)}
                </div>
              )}
              {pages > 1 && (
                <nav className="flex justify-center gap-2 pt-3">
                  {filters.page > 1 && <Link href={href(filters, filters.page - 1)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Previous</Link>}
                  <span className="px-3 py-2 text-sm text-muted-foreground">Page {filters.page} of {pages}</span>
                  {filters.page < pages && <Link href={href(filters, filters.page + 1)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Next</Link>}
                </nav>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
              {filters.sort === "recently-updated" ? "No verified game updates have been recorded yet." : "No games match these filters."}{" "}
              <Link href="/search" className="font-bold text-primary">Clear all</Link>.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
