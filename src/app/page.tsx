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

  return (
    <div className="pb-12">


      <div className="container mx-auto px-4 pt-6 space-y-10">
        {/* Game sections — show all even if empty for layout consistency */}
        {sections.map((section) => (
          <section key={section.id}>
            <SectionHeader
              title={section.title}
              href={section.href}
            />
            {section.games.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                {section.games.map((game) => (
                  <GameCard key={game.id} game={game} showCategory={false} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
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
