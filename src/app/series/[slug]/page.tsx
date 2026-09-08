import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { GameListItem } from "@/components/games/GameListItem";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { MIN_INDEXABLE_SERIES_GAMES, SITE_URL } from "@/lib/constants";
import { normalizePublicGameCards, PUBLIC_GAME_CARD_FIELDS } from "@/lib/discovery-data";

interface Props {
  params: Promise<{ slug: string }>;
}

const getSeries = cache(async (slug: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase.from("series").select("*").eq("slug", slug).single();
  return data;
});

const getGames = cache(async (slug: string) => {
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
    .select(PUBLIC_GAME_CARD_FIELDS)
    .eq("is_published", true)
    .in("id", gameIds);

  return normalizePublicGameCards(data)
    .sort((a, b) => (sortMap.get(a.id) || 0) - (sortMap.get(b.id) || 0));
});

export async function generateStaticParams() {
  const { data } = await createAdminClient().from("series").select("slug").order("sort_order").limit(100);
  return (data || []).map((series) => ({ slug: series.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) return { title: "Series Not Found" };
  const games = await getGames(slug);
  const isContentVerified = series.content_verified === true;

  const title = isContentVerified && series.meta_title
    ? series.meta_title
    : `${series.name} Games in Order`;
  const gameLabel = games.length === 1 ? "game" : "games";
  const description = isContentVerified && (series.meta_description || series.description)
    ? series.meta_description || series.description
    : `Browse ${games.length} ${gameLabel} in the ${series.name} series in order.`;

   return {
     title,
     description,
     alternates: {
       canonical: `/series/${slug}`,
     },
     ...(games.length < MIN_INDEXABLE_SERIES_GAMES
       ? { robots: { index: false, follow: true } }
       : {}),
   };
}

export const revalidate = 1800;

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const series = await getSeries(slug);
  if (!series) notFound();

  const games = await getGames(slug);
  const isContentVerified = series.content_verified === true;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Series", url: `${SITE_URL}/series` },
          { name: series.name, url: `${SITE_URL}/series/${series.slug}` },
        ]}
      />

      <div className="max-w-3xl border-b pb-6">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Play in series order</p>
        <h1 className="text-3xl font-black tracking-tight">{series.name} Game Series</h1>
        {isContentVerified && series.description && (
          <div className="mt-3 whitespace-pre-wrap leading-7 text-muted-foreground">
            {series.description}
          </div>
        )}
        {isContentVerified && series.meta_description && series.meta_description !== series.description && (
          <p className="mt-3 text-muted-foreground">{series.meta_description}</p>
        )}
        {isContentVerified && series.source_url && (
          <a
            href={series.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Editorial source
          </a>
        )}
        {games.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            {games.length} game{games.length > 1 ? "s" : ""} in this series
          </p>
        )}
      </div>

      {games.length > 0 && (
        <div className="mx-auto max-w-5xl">
          {games.map((game, index) => (
            <GameListItem key={game.id} game={game} position={index + 1} eagerImage={index === 0} />
          ))}
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
