import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/games/GameCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import type { Game } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getSeries(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("series").select("*").eq("slug", slug).single();
  return data;
}

async function getGames(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data: seriesData } = await supabase
    .from("series").select("id").eq("slug", slug).single();
  if (!seriesData) return [];

  const { data } = await supabase
    .from("games")
    .select(`*, categories:game_categories(category_id, categories:categories(*)), series:game_series!inner(series_id, sort_order, series:series(*))`)
    .eq("is_published", true)
    .eq("game_series.series_id", seriesData.id)
    .order("game_series.sort_order", { ascending: true });

  return (data || []).map((g: any) => ({
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
