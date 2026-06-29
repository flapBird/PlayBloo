import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ArrowLeft, ArrowRight, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  params: Promise<{ slug: string; levelSlug: string }>;
}

async function getGame(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("games")
    .select("id, title, slug, thumbnail_url, iframe_url, description")
    .eq("slug", slug)
    .single();
  return data;
}

async function getLevel(levelSlug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("game_levels")
    .select("*")
    .eq("slug", levelSlug)
    .eq("is_published", true)
    .single();
  return data;
}

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
  const { levelSlug } = await params;
  const level = await getLevel(levelSlug);
  if (!level) return { title: "Level Not Found" };

  return {
    title: level.meta_title || `${level.title} — ${SITE_NAME}`,
    description: level.meta_description || `Walkthrough and tips for ${level.title}.`,
  };
}

export const dynamic = "force-dynamic";

export default async function LevelPage({ params }: Props) {
  const { slug, levelSlug } = await params;
  const game = await getGame(slug);
  if (!game) notFound();

  const level = await getLevel(levelSlug);
  if (!level) notFound();

  const adjacent = await getAdjacentLevels(game.id, level.level_number);

  // Increment view count
  try {
    const supabase = createAdminClient();
    await supabase
      .from("game_levels")
      .update({ view_count: level.view_count + 1 })
      .eq("id", level.id);
  } catch {}

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: game.title, url: `${SITE_URL}/game/${game.slug}` },
          { name: level.title, url: `${SITE_URL}/game/${game.slug}/level/${level.slug}` },
        ]}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href={`/game/${game.slug}`} className="hover:text-foreground">{game.title}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Level {level.level_number}</span>
      </div>

      {/* Header */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Level {level.level_number}</Badge>
          <Badge variant="outline">Walkthrough</Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          {level.title}
        </h1>
        <p className="text-muted-foreground">
          Stuck on Level {level.level_number} of {game.title}? Read our step-by-step walkthrough to beat this level.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Thumbnail */}
          {level.thumbnail_url && (
            <div className="rounded-xl overflow-hidden border">
              <img
                src={level.thumbnail_url}
                alt={level.title}
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

          {/* Tips */}
          {level.tips && (
            <section>
              <h2 className="text-xl font-bold mb-3">Tips & Tricks</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap bg-amber-50 border border-amber-200 rounded-xl p-4" dangerouslySetInnerHTML={{ __html: level.tips }} />
            </section>
          )}

          {/* Play the game */}
          <section className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              Play {game.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Read the walkthrough and ready to play? Jump into the game now.
            </p>
            <Link href={`/game/${game.slug}`}>
              <Button>
                Play {game.title}
              </Button>
            </Link>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Game info */}
          <div className="rounded-xl border p-4 space-y-3">
            <h3 className="font-semibold text-sm">About {game.title}</h3>
            {game.thumbnail_url && (
              <img src={game.thumbnail_url} alt={game.title} className="w-full rounded-lg" />
            )}
            {game.description && (
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
