import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { GameCard } from "@/components/games/GameCard";
import { SITE_NAME, GAME_CATEGORIES } from "@/lib/constants";
import { ArrowRight, TrendingUp, Sparkles, Flame, Layers } from "lucide-react";
import type { Game } from "@/lib/types";

async function getGamesSection(): Promise<{
  trending: Game[];
  popular: Game[];
  newest: Game[];
}> {
  try {
    const supabase = createAdminClient();
    if (!supabase) {
      return { trending: [], popular: [], newest: [] };
    }

    const [trendingRes, popularRes, newestRes] = await Promise.all([
      supabase
        .from("games")
        .select("id, title, slug, thumbnail_url, view_count, play_count, created_at, is_trending, hot_score, categories:game_categories(category_id, categories:categories(*))")
        .eq("is_published", true)
        .order("hot_score", { ascending: false })
        .limit(10),
      supabase
        .from("games")
        .select("id, title, slug, thumbnail_url, view_count, play_count, created_at, is_trending, hot_score, categories:game_categories(category_id, categories:categories(*))")
        .eq("is_published", true)
        .order("view_count", { ascending: false })
        .limit(10),
      supabase
        .from("games")
        .select("id, title, slug, thumbnail_url, view_count, play_count, created_at, is_trending, hot_score, categories:game_categories(category_id, categories:categories(*))")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const mapGames = (games: any[]) =>
      (games || []).map((g: any) => ({
        ...g,
        categories: (g.categories || [])
          .filter((gc: any) => gc.categories)
          .map((gc: any) => gc.categories),
      }));

    return {
      trending: mapGames(trendingRes.data || []),
      popular: mapGames(popularRes.data || []),
      newest: mapGames(newestRes.data || []),
    };
  } catch (e) {
    console.error("Error fetching games:", e);
    return { trending: [], popular: [], newest: [] };
  }
}

async function getSeries() {
  try {
    const supabase = createAdminClient();
    if (!supabase) return [];

    const { data } = await supabase
      .from("series")
      .select("*, game_series(count)")
      .order("sort_order", { ascending: true })
      .limit(8);

    return (data || []).map((s: any) => ({
      ...s,
      game_count: s.game_series?.[0]?.count ?? 0,
    }));
  } catch {
    return [];
  }
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
      <Link
        href={href}
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        View All
      </Link>
    </div>
  );
}

export const revalidate = 60;

export default async function HomePage() {
  const games = await getGamesSection();
  const series = await getSeries();

  const sections: {
    id: string;
    title: string;
    href: string;
    games: Game[];
  }[] = [
    {
      id: "new",
      title: "New Games",
      href: "/search?sort=newest",
      games: games.newest,
    },
    {
      id: "trending",
      title: "Trending",
      href: "/search?sort=trending",
      games: games.trending,
    },
    {
      id: "popular",
      title: "Most Popular",
      href: "/search?sort=popular",
      games: games.popular,
    },
  ];

  const hasAnyGames = sections.some((s) => s.games.length > 0);

  return (
    <div className="pb-12">
      <div className="container mx-auto px-4 pt-6 space-y-12">

        {/* Game sections */}
        {sections.map((section) => (
          <section key={section.id}>
            <SectionHeader title={section.title} href={section.href} />
            {section.games.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3 md:gap-4">
                {section.games.map((game) => (
                  <GameCard key={game.id} game={game} showCategory={false} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3 md:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-card border border-border/40 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-muted rounded w-3/4" />
                      <div className="h-2.5 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* Empty state */}
        {!hasAnyGames && (
          <div className="text-center py-12 space-y-3 rounded-2xl bg-card/40 border border-border/30">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
              <Sparkles className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              No games yet. New games will appear here once added.
            </p>
          </div>
        )}

        {/* Categories */}
        <section>
          <SectionHeader title="Categories" href="/search" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {GAME_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center justify-center h-14 rounded-xl bg-card border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-semibold text-muted-foreground hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Game Series */}
        {series.length > 0 && (
          <section>
            <SectionHeader title="Game Series" href="/series" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {series.map((s: any) => (
                <Link
                  key={s.id}
                  href={`/series/${s.slug}`}
                  className="group rounded-xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="aspect-[3/4] bg-muted/30 overflow-hidden">
                    {s.thumbnail_url ? (
                      <img
                        src={s.thumbnail_url}
                        alt={s.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 group-hover:from-indigo-100 group-hover:to-violet-100 transition-colors">
                        <Layers className="h-8 w-8 text-indigo-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.game_count > 0 ? `${s.game_count} game${s.game_count !== 1 ? "s" : ""}` : "No games yet"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
