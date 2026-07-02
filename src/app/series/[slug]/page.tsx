import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { GameCard } from "@/components/games/GameCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import type { Game } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getSeries(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("series").select("*").eq("slug", slug).single();
  return data;
}

async function getGames(slug: string) {
  const supabase = createAdminClient();
  const { data: seriesData } = await supabase
    .from("series").select("id").eq("slug", slug).single();
  if (!seriesData) return [];

  const { data: seriesGames } = await supabase
    .from("game_series")
    .select("game_id, sort_order")
    .eq("series_id", seriesData.id)
    .order("sort_order", { ascending: true });

  const gameIds = (seriesGames || []).map(gs => gs.game_id);
  const sortMap = new Map((seriesGames || []).map(gs => [gs.game_id, gs.sort_order]));

  if (gameIds.length === 0) return [];

  const { data } = await supabase
    .from("games")
    .select(`id, title, slug, thumbnail_url, view_count, play_count, categories:game_categories(category_id, categories:categories(*)), series:game_series(series_id, sort_order, series:series(*))`)
    .eq("is_published", true)
    .in("id", gameIds);

  return (data || []).sort((a: any, b: any) => (sortMap.get(a.id) || 0) - (sortMap.get(b.id) || 0)).map((g: any) => ({
    ...g,
    categories: g.categories?.filter((gc: any) => gc.categories).map((gc: any) => gc.categories) || [],
    series: g.series?.filter((gs: any) => gs.series).map((gs: any) => gs.series) || [],
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) return { title: "Series Not Found" };

  const title = series.meta_title || `${series.name} Game Series - Play All Games in Order`;
  const description = series.meta_description || series.description || `Play the complete ${series.name} game series.`;

  return { title, description };
}

export const revalidate = 120;

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) notFound();

  const games = await getGames(slug);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Series", url: `${SITE_URL}/series` },
          { name: series.name, url: `${SITE_URL}/series/${series.slug}` },
        ]}
      />

      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold">{series.name} Game Series</h1>
        {series.description && (
          <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {series.description}
          </div>
        )}
        {series.meta_description && (
          <p className="text-muted-foreground">{series.meta_description}</p>
        )}
        {games.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {games.length} game{games.length > 1 ? "s" : ""} in this series
          </p>
        )}
      </div>

      {games.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Games in this series</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3 md:gap-4">
            {games.map((game: Game, index: number) => (
              <div key={game.id} className="relative">
                <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow">
                  {index + 1}
                </div>
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>
      )}

      {games.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No games in this series yet.
        </div>
      )}
    </div>
  );
}
