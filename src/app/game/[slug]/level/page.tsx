import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { LevelEpisodes } from "@/components/levels/LevelEpisodes";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getGame(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("games")
    .select("id, title, slug, thumbnail_url")
    .eq("slug", slug)
    .single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) return { title: "Not Found" };
  return {
    title: `${game.title} Walkthroughs — Level Guides & Tips | ${SITE_NAME}`,
    description: `Stuck on ${game.title}? Browse our collection of level walkthroughs with video guides, tips, and step-by-step strategies.`,
  };
}

export const revalidate = 120;

export default async function LevelIndexPage({ params }: Props) {
  const { slug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

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
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
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
          Step-by-step guides for the trickiest levels. Videos, tips, and strategies to help you beat every challenge.
        </p>
      </div>

      <LevelEpisodes gameSlug={game.slug} />
    </div>
  );
}
