import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { LevelEpisodes } from "@/components/levels/LevelEpisodes";
import { getRelatedGamesBySlug } from "@/lib/related-games";
import { RelatedGameItem } from "@/components/games/RelatedGameItem";

interface Props {
  params: Promise<{ slug: string }>;
}

const getGame = cache(async (slug: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("games")
    .select("id, title, slug, thumbnail_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
});

export async function generateStaticParams() {
  const { data } = await createAdminClient()
    .from("games")
    .select("slug, game_levels!inner(id)")
    .eq("is_published", true)
    .eq("game_levels.is_published", true)
    .limit(50);
  return (data || []).map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return { title: "Not Found" };
  return {
    title: `${game.title} Walkthroughs — Level Guides & Tips | ${SITE_NAME}`,
    description: `Stuck on ${game.title}? Browse our collection of level walkthroughs with video guides, tips, and step-by-step strategies.`,
     alternates: {
       canonical: `/game/${slug}/level`,
     },
  };
}

export const revalidate = 1800;

export default async function LevelIndexPage({ params }: Props) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();
  const relatedGames = await getRelatedGamesBySlug(slug);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: game.title, url: `${SITE_URL}/game/${game.slug}` },
          { name: "Walkthroughs", url: `${SITE_URL}/game/${game.slug}/level` },
        ]}
      />

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href={`/game/${game.slug}`} className="hover:text-foreground">{game.title}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Walkthroughs</span>
      </div>

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          {game.title} Walkthroughs
        </h1>
        <p className="text-muted-foreground">
          Choose a level to see its available videos and written tips.
        </p>
      </div>

      <LevelEpisodes gameSlug={game.slug} />

      {/* Cross-game links: the level index is a dead end for catalogue browsing otherwise. */}
      {relatedGames.length > 0 && (
        <section className="mt-10 border-t pt-8">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">More games to play</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Keep exploring on {SITE_NAME}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {relatedGames.map((relatedGame) => (
              <RelatedGameItem key={relatedGame.id} game={relatedGame} reason={relatedGame.recommendationReason} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
