import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { GameCard } from "@/components/games/GameCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { GameJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Play, Eye, Calendar } from "lucide-react";
import { GameIframe } from "@/components/games/GameIframe";
import type { Game } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getGame(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("games")
    .select("*, categories:game_categories(category_id, categories:categories(*)), tags:game_tags(tag_id, tags:tags(*)), series:game_series(series_id, series:series(*))")
    .eq("slug", slug)
    .single();
  return data;
}

async function getRelatedGames(gameId: string, categoryIds: string[]) {
  if (!categoryIds.length) return [];
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("games")
    .select(`*, categories:game_categories!inner(category_id, categories:categories(*))`)
    .eq("is_published", true)
    .in("categories.category_id", categoryIds)
    .neq("id", gameId)
    .limit(6);
  return (data || []).map((g: any) => ({
    ...g,
    categories: g.categories?.filter((gc: any) => gc.categories).map((gc: any) => gc.categories) || [],
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return { title: "Game Not Found" };

  return {
    title: `${game.title} - Play Free Online Game`,
    description: game.description?.slice(0, 160) || `Play ${game.title} online for free on ${SITE_NAME}.`,
    openGraph: {
      title: `${game.title} - Free Online Game`,
      description: game.description?.slice(0, 160) || undefined,
      ...(game.thumbnail_url ? { images: [{ url: game.thumbnail_url }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.title} - Free Online Game`,
      description: game.description?.slice(0, 160) || undefined,
      ...(game.thumbnail_url ? { images: [game.thumbnail_url] } : {}),
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) notFound();

  const categories = game.categories?.filter((gc: any) => gc.categories).map((gc: any) => gc.categories) || [];
  const tags = game.tags?.filter((gt: any) => gt.tags).map((gt: any) => gt.tags) || [];
  const seriesList = game.series?.filter((gs: any) => gs.series).map((gs: any) => gs.series) || [];

  const relatedGames = await getRelatedGames(
    game.id,
    categories.map((c: any) => c.id)
  );

  // Increment view count
  try {
    const supabase = createAdminClient();
    await supabase
      .from("games")
      .update({ view_count: game.view_count + 1 })
      .eq("id", game.id);
  } catch {}

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: game.title, url: `${SITE_URL}/game/${game.slug}` },
        ]}
      />
      <GameJsonLd
        name={game.title}
        description={game.description || ""}
        url={`${SITE_URL}/game/${game.slug}`}
        image={game.thumbnail_url}
      />

      {/* Game Header */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Game Info */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{game.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {game.view_count.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <Play className="h-4 w-4" /> {game.play_count.toLocaleString()} plays
            </span>
            {game.release_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {game.release_date}
              </span>
            )}
            
          </div>

          {(categories.length > 0 || tags.length > 0 || seriesList.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat: any) => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  <Badge variant="secondary">{cat.name}</Badge>
                </Link>
              ))}
              {seriesList.map((s: any) => (
                <Link key={s.id} href={`/series/${s.slug}`}>
                  <Badge variant="secondary">{s.name}</Badge>
                </Link>
              ))}
              {tags.map((tag: any) => (
                <Link key={tag.id} href={`/tag/${tag.slug}`}>
                  <Badge variant="outline" className="text-xs">{tag.name}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

      {/* Game Iframe */}
      <GameIframe src={game.iframe_url} title={game.title} gameId={game.id} thumbnailUrl={game.thumbnail_url} externalUrl={game.external_url} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {game.description && (
            <section>
              <h2 className="text-xl font-bold mb-3">About {game.title}</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.description}
              </div>
            </section>
          )}

          {game.how_to_play && (
            <section>
              <h2 className="text-xl font-bold mb-3">How to Play</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.how_to_play}
              </div>
            </section>
          )}

          {game.controls && (
            <section>
              <h2 className="text-xl font-bold mb-3">Controls</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.controls}
              </div>
            </section>
          )}

          {game.tips && (
            <section>
              <h2 className="text-xl font-bold mb-3">Tips & Tricks</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.tips}
              </div>
            </section>
          )}

          {game.features && (
            <section>
              <h2 className="text-xl font-bold mb-3">Features</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.features}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {seriesList.length > 0 && (
            <section className="rounded-xl border p-4">
              <h3 className="font-semibold mb-3">Series</h3>
              <div className="flex flex-wrap gap-2">
                {seriesList.map((s: any) => (
                  <Link key={s.id} href={`/series/${s.slug}`}>
                    <Badge variant="secondary">{s.name}</Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {categories.length > 0 && (
            <section className="rounded-xl border p-4">
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat: any) => (
                  <Link key={cat.id} href={`/category/${cat.slug}`}>
                    <Badge variant="secondary">{cat.name}</Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {tags.length > 0 && (
            <section className="rounded-xl border p-4">
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag: any) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`}>
                    <Badge variant="outline" className="text-xs">{tag.name}</Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      </div>
      {relatedGames.length > 0 && (
        <section>
          <Separator className="mb-8" />
          <h2 className="text-2xl font-bold mb-6">Related Games</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {relatedGames.map((game: Game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
