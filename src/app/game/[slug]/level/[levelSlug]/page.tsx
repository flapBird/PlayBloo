import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ArrowLeft, ArrowRight, Gamepad2, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ slug: string; levelSlug: string }>;
}

export async function generateStaticParams() {
  const { data } = await createAdminClient()
    .from("game_levels")
    .select("slug, games!inner(slug, is_published)")
    .eq("is_published", true)
    .eq("games.is_published", true)
    .limit(100);
  return ((data || []) as Array<{ slug: string; games: { slug: string } | Array<{ slug: string }> }>).flatMap((level) => {
    const game = Array.isArray(level.games) ? level.games[0] : level.games;
    return game?.slug ? [{ slug: game.slug, levelSlug: level.slug }] : [];
  });
}

const getGame = cache(async (slug: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("games")
    .select("id, title, slug, thumbnail_url, iframe_url, content_verified, description, how_to_play, controls, tips, features")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
});

const getLevel = cache(async (gameId: string, levelSlug: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("game_levels")
    .select("*")
    .eq("game_id", gameId)
    .eq("slug", levelSlug)
    .eq("is_published", true)
    .single();
  return data;
});

async function getAdjacentLevels(gameId: string, currentNumber: number) {
  const supabase = createAdminClient();
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("game_levels")
      .select("title, slug, level_number")
      .eq("game_id", gameId)
      .eq("is_published", true)
      .lt("level_number", currentNumber)
      .order("level_number", { ascending: false })
      .limit(1),
    supabase
      .from("game_levels")
      .select("title, slug, level_number")
      .eq("game_id", gameId)
      .eq("is_published", true)
      .gt("level_number", currentNumber)
      .order("level_number", { ascending: true })
      .limit(1),
  ]);

  return {
    prev: prevRes.data?.[0] || null,
    next: nextRes.data?.[0] || null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
   const { slug, levelSlug } = await params;
  const game = await getGame(slug);
  if (!game) return { title: "Game Not Found" };
  const level = await getLevel(game.id, levelSlug);
  if (!level) return { title: "Level Not Found" };

  return {
    title: level.meta_title || `${level.title} — ${SITE_NAME}`,
    description: level.meta_description || `Walkthrough and tips for ${level.title}.`,
     alternates: {
       canonical: `/game/${slug}/level/${levelSlug}`,
     },
  };
}

export const revalidate = 1800;

export default async function LevelPage({ params }: Props) {
  const { slug, levelSlug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

  const level = await getLevel(game.id, levelSlug);
  if (!level) notFound();

  const adjacent = await getAdjacentLevels(game.id, level.level_number);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: game.title, url: `${SITE_URL}/game/${game.slug}` },
          { name: level.title, url: `${SITE_URL}/game/${game.slug}/level/${level.slug}` },
        ]}
      />
      {/* Breadcrumb + Level Index */}
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href={`/game/${game.slug}`} className="hover:text-foreground">{game.title}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Level {level.level_number}</span>
        </div>
        <Link
          href={`/game/${game.slug}/level`}
          className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Grid3X3 className="h-4 w-4" />
          Walkthroughs
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Level {level.level_number}</Badge>
          <Badge variant="outline">Walkthrough</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          {level.content || level.tips ? level.title : `${game.title} — Level ${level.level_number}${level.video_url ? " Video Walkthrough" : ""}`}
        </h1>
      </div>

      {/* Tips — above video */}
      {level.tips && (
        <div className="text-amber-100/80 leading-relaxed whitespace-pre-wrap text-center bg-amber-500/10 border border-amber-400/25 rounded-xl p-4 mb-6">
          {level.tips}
        </div>
      )}

      {/* Video */}
      {level.video_url && (
        <section className="mb-8">
          <div className="rounded-xl overflow-hidden border bg-black">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={level.video_url}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${level.title} video walkthrough`}
              />
            </div>
          </div>
          <a href={level.video_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-primary underline underline-offset-4">Open video in a new tab</a>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Thumbnail — only if no video */}
          {!level.video_url && level.thumbnail_url && (
            <div className="rounded-xl overflow-hidden border">
              <Image
                src={level.thumbnail_url}
                alt={level.title}
                width={1200}
                height={675}
                unoptimized
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Walkthrough content */}
          {level.content && (
            <section>
              <h2 className="text-xl font-bold mb-4">Walkthrough</h2>
              <div className="prose prose-neutral max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: level.content || "" }} />
            </section>
          )}

          {!level.content && !level.tips && <section className="rounded-xl border p-4"><h2 className="font-bold">About this walkthrough</h2><p className="mt-2 text-sm text-muted-foreground">Written steps for Level {level.level_number} are not available yet.{level.video_url ? " Use the video above, or open it in a new tab if the player does not load." : " Browse other levels or return to the game page."}</p></section>}
          {game.content_verified && game.how_to_play && <section><h2 className="mb-3 text-xl font-bold">General game instructions</h2><p className="mb-3 text-sm text-muted-foreground">These instructions apply to the game overall, rather than this specific level.</p><div className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{game.how_to_play}</div></section>}
          {/* Play the game */}
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              Play {game.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Return to the game page to start playing.
            </p>
            <Button asChild><Link href={`/game/${game.slug}`}>View game</Link></Button>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Game info */}
          <div className="rounded-xl border p-4 space-y-3">
            <h3 className="font-semibold text-sm">About {game.title}</h3>
            {game.thumbnail_url && (
              <Image src={game.thumbnail_url} alt={game.title} width={640} height={360} unoptimized className="w-full rounded-lg" />
            )}
            {game.content_verified && game.description && (
              <p className="text-xs text-muted-foreground line-clamp-3">{game.description}</p>
            )}
            <Link href={`/game/${game.slug}`} className="text-sm text-primary hover:underline block">
              View full game page →
            </Link>
          </div>

          {/* Prev / Next navigation */}
          <div className="rounded-xl border p-4 space-y-3">
            <h3 className="font-semibold text-sm">Navigation</h3>
            <div className="space-y-2">
              {adjacent.prev && (
                <Link
                  href={`/game/${game.slug}/level/${adjacent.prev.slug}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4 shrink-0" />
                  <span className="truncate">Level {adjacent.prev.level_number}: {adjacent.prev.title}</span>
                </Link>
              )}
              {adjacent.next && (
                <Link
                  href={`/game/${game.slug}/level/${adjacent.next.slug}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
                >
                  <ArrowRight className="h-4 w-4 shrink-0" />
                  <span className="truncate">Level {adjacent.next.level_number}: {adjacent.next.title}</span>
                </Link>
              )}
              {!adjacent.prev && !adjacent.next && (
                <p className="text-xs text-muted-foreground">No adjacent levels</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
