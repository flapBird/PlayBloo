import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/games/GameCard";
import { SITE_NAME, GAME_CATEGORIES } from "@/lib/constants";
import { ArrowRight, TrendingUp, Sparkles, Flame } from "lucide-react";
import type { Game } from "@/lib/types";

async function getGamesSection(): Promise<{
  trending: Game[];
  popular: Game[];
  newest: Game[];
}> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return { trending: [], popular: [], newest: [] };
    }

    const [trendingRes, popularRes, newestRes] = await Promise.all([
      supabase
        .from("games")
        .select("*, categories:game_categories(category_id, categories:categories(*))")
        .eq("is_published", true)
        .order("hot_score", { ascending: false })
        .limit(12),
      supabase
        .from("games")
        .select("*, categories:game_categories(category_id, categories:categories(*))")
        .eq("is_published", true)
        .order("view_count", { ascending: false })
        .limit(12),
      supabase
        .from("games")
        .select("*, categories:game_categories(category_id, categories:categories(*))")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(12),
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
    const supabase = await createServerSupabaseClient();
    if (!supabase) return [];
    const { data } = await supabase
      .from("series")
      .select("*")
      .order("sort_order", { ascending: true })
      .limit(8);
    return data || [];
  } catch {
    return [];
  }
}

function SectionHeader({ title, icon: Icon, href }: { title: string; icon: any; href: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-black text-foreground">{title}</h2>
      </div>
      <Link
        href={href}
        className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        View All <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const games = await getGamesSection();
  const series = await getSeries();

  const sections: {
    id: string;
    title: string;
    icon: any;
    href: string;
    games: Game[];
  }[] = [
    {
      id: "new",
      title: "New Games",
      icon: Sparkles,
      href: "/search?sort=newest",
      games: games.newest,
    },
    {
      id: "trending",
      title: "Trending",
      icon: TrendingUp,
      href: "/search?sort=trending",
      games: games.trending,
    },
    {
      id: "popular",
      title: "Most Popular",
      icon: Flame,
      href: "/search?sort=popular",
      games: games.popular,
    },
  ];

  return (
    <div className="pb-12">
      {/* Page title */}
      <div className="container mx-auto px-4 pt-8 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-foreground">
          Free Online Games at {SITE_NAME}
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Play the latest and best free online games. No downloads, no intrusive ads — just fun.
        </p>
      </div>

      <div className="container mx-auto px-4 space-y-10">
        {/* Game sections — show all even if empty for layout consistency */}
        {sections.map((section) => (
          <section key={section.id}>
            <SectionHeader
              title={section.title}
              icon={section.icon}
              href={section.href}
            />
            {section.games.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {section.games.map((game) => (
                  <GameCard key={game.id} game={game} showCategory={false} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
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

        {/* Empty state when no data at all */}
        {sections.every((s) => s.games.length === 0) && (
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
          <SectionHeader
            title="Categories"
            icon={() => (
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
            href="/search"
          />
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

        {/* Series */}
        {series.length > 0 && (
          <section>
            <SectionHeader
              title="Game Series"
              icon={() => (
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )}
              href="/series"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {series.map((s: any) => (
                <Link
                  key={s.id}
                  href={`/series/${s.slug}`}
                  className="flex items-center justify-center h-16 rounded-xl bg-card border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-bold text-muted-foreground hover:text-primary"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
