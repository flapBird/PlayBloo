import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { queryTimeout } from "@/lib/query-timeout";
import {
  getRecommendationPool,
  getRelatedGames,
  getNeighbors,
  getVisibleSeries,
  type RecommendationCandidate,
} from "@/lib/related-games";
import { recordMetric, startTimer } from "@/lib/metrics";
import { RelatedGameItem } from "@/components/games/RelatedGameItem";
import { Badge } from "@/components/ui/badge";
import { GameJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Play, Eye, Calendar, Grid3X3, ArrowRight, ExternalLink, ShieldAlert, ShieldCheck, Zap } from "lucide-react";
import { GameIframe } from "@/components/games/GameIframe";
import type { Category, Game, GameUpdate, Series, Tag } from "@/lib/types";
import { LevelSearch } from "@/components/levels/LevelSearch";
import { FavoriteButton } from "@/components/games/FavoriteButton";
import { getExternalGameUrl, getGamePlayMode, getGameSources } from "@/lib/game-utils";
import { GameInfo } from "@/components/games/GameInfo";
import { GameUpdates } from "@/components/games/GameUpdates";
import { GameNeighbors } from "@/components/games/GameNeighbors";
import { GameViewTracker } from "@/components/analytics/GameViewTracker";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

// Prerender every published game at build time. A visitor hitting a page that
// was never rendered pays the full server render (several Supabase round
// trips) synchronously — after each deploy that used to be the first visitor
// of every game outside the top-24. Capped so a huge catalogue cannot blow up
// build times; the tail renders on demand through ISR.
//
// Order by publish date, not popularity. The engagement counters start at zero
// and only a few dozen games in the whole catalogue have ever been played, so
// sorting by hot_score/play_count degenerated into "the oldest 500" and left
// every recently published game on the cold on-demand path. That is the worst
// possible split: a new URL gets one crawl attempt, and a cold render of a
// fresh game page took tens of seconds, so the crawler abandoned it and the
// URL stayed "discovered, never crawled" in Search Console. Prerendering the
// newest games puts them in the cache before the crawler arrives. The cap
// still bounds build time; once it is reached the oldest games drop off
// first, and those are the ones already indexed.
export async function generateStaticParams() {
  const { data } = await createAdminClient()
    .from("games")
    .select("slug")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(1500);
  return (data || []).map((game) => ({ slug: game.slug }));
}

function getMetaDescription(description: string | null, title: string) {
  const fallback = `Discover ${title} on ${SITE_NAME}, including verified game details and where to play.`;
  const normalized = description?.replace(/\s+/g, " ").trim() || fallback;
  if (normalized.length <= 160) return normalized;

  const shortened = normalized.slice(0, 156).replace(/\s+\S*$/, "");
  return `${shortened}…`;
}

const getGame = cache(async (slug: string) => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("games")
    .select("*, categories:game_categories(category_id, categories:categories(*)), tags:game_tags(tag_id, tags:tags(*)), series:game_series(series_id, series:series(*))")
    .eq("is_published", true)
    .eq("slug", slug)
    .abortSignal(AbortSignal.timeout(queryTimeout(4000)))
    .maybeSingle();
  // A database failure must not overwrite a valid cached page with a 404.
  if (error) throw new Error(`Could not load game: ${error.message}`);
  return data as unknown as RawGameRelations | null;
});

type CategorySummary = Pick<Category, "id" | "name" | "slug">;
type TagSummary = Pick<Tag, "id" | "name" | "slug">;
type SeriesSummary = Pick<Series, "id" | "name" | "slug">;
type RawGameRelations = Omit<Game, "categories" | "tags" | "series"> & {
  categories?: Array<{ category_id: string; categories: CategorySummary | null }>;
  tags?: Array<{ tag_id: string; tags: TagSummary | null }>;
  series?: Array<{ series_id: string; series: SeriesSummary | null }>;
};

async function gameHasLevels(gameId: string) {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("game_levels")
    .select("id", { count: "exact", head: true })
    .eq("game_id", gameId)
    .eq("is_published", true)
    .abortSignal(AbortSignal.timeout(queryTimeout(2000)));
  return (count || 0) > 0;
}

async function getUpdates(gameId: string): Promise<GameUpdate[]> {
  const { data } = await createAdminClient().from("game_updates").select("*").eq("game_id", gameId).lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(20).abortSignal(AbortSignal.timeout(queryTimeout(2000)));
  return (data || []) as GameUpdate[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gameRow = await getGame(slug);
  if (!gameRow) return { title: "Game Not Found" };
  const game = gameRow as unknown as Game;
  const description = game.meta_description?.trim() ||
    getMetaDescription(game.content_verified ? game.description : null, game.title);
  const playMode = getGamePlayMode(game);
  const title = game.meta_title?.trim() ||
    (playMode === "embedded" ? `${game.title} - Play Here` : `${game.title} - Game Details`);

  return {
    title,
    description,
     alternates: {
       canonical: `/game/${slug}`,
     },
    openGraph: {
      title,
      description,
      ...(game.thumbnail_url ? { images: [{ url: game.thumbnail_url }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(game.thumbnail_url ? { images: [game.thumbnail_url] } : {}),
    },
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;
  // The page body only runs when the R2 cache did not answer, so this is the
  // server-side render a crawler would otherwise have waited for.
  const elapsed = startTimer();
  const gameRow = await getGame(slug);

  if (!gameRow) notFound();
  const game = gameRow as unknown as Game;

  const categories = gameRow.categories?.map((membership) => membership.categories).filter((category): category is CategorySummary => Boolean(category)) || [];
  const tags = gameRow.tags?.map((membership) => membership.tags).filter((tag): tag is TagSummary => Boolean(tag)) || [];
  const rawSeriesList = gameRow.series?.map((membership) => membership.series).filter((series): series is SeriesSummary => Boolean(series)) || [];

  const [recommendationPool, updates, hasLevels] = await Promise.all([
    getRecommendationPool().catch((error: unknown) => {
      console.error("Recommendation data unavailable:", error instanceof Error ? error.message : "Unknown error");
      return [] as RecommendationCandidate[];
    }),
    getUpdates(game.id),
    gameHasLevels(game.id),
  ]);
  recordMetric("game_render_ms", elapsed(), slug);
  const neighbors = getNeighbors(game, recommendationPool);
  const seriesList = getVisibleSeries(rawSeriesList, recommendationPool);
  const relatedGames = getRelatedGames(game, categories.map((category) => category.id), tags.map((tag) => tag.id), seriesList.map((series) => series.id), recommendationPool);
  const playMode = getGamePlayMode(game);
  const externalGameUrl = getExternalGameUrl(game);
  const sources = getGameSources(game);
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <GameViewTracker gameId={game.id} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: game.title, url: `${SITE_URL}/game/${game.slug}` },
        ]}
      />
      <GameJsonLd
        name={game.title}
        description={game.content_verified ? game.description || "" : getMetaDescription(null, game.title)}
        url={`${SITE_URL}/game/${game.slug}`}
        image={game.thumbnail_url}
      />

      {/* Game Header */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Game Info */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{game.title}</h1>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <FavoriteButton gameId={game.id} gameTitle={game.title} />
            </div>
          </div>

          {/* Game launch */}
          <GameIframe src={game.iframe_url} title={game.title} gameId={game.id} slug={game.slug} thumbnailUrl={game.thumbnail_url} externalUrl={externalGameUrl} />
          <div className="flex flex-wrap items-center gap-3">
              {hasLevels && (
              <>
                <div className="w-full sm:w-64">
                  <LevelSearch gameId={game.id} gameSlug={game.slug} />
                </div>
                <Link
                  href={`/game/${game.slug}/level`}
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border bg-card text-foreground hover:bg-muted transition-all active:scale-95"
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                  Walkthroughs
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </>
              )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {/* Zero counters read as "nobody plays this" — surface them only once there is something to show. */}
            {game.view_count > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" /> {game.view_count.toLocaleString()} views
              </span>
            )}
            {game.play_count > 0 && (
              <span className="flex items-center gap-1">
                <Play className="h-4 w-4" /> {game.play_count.toLocaleString()} plays
              </span>
            )}
            {game.release_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Released {new Date(game.release_date).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            )}
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${playMode === "embedded" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : playMode === "external" ? "bg-slate-500/15 text-slate-600 dark:text-slate-300" : "bg-amber-500/15 text-amber-700 dark:text-amber-300"}`}>
              {playMode === "embedded" ? <><Zap className="h-3.5 w-3.5 fill-current" /> Play Here</> : playMode === "external" ? <><ExternalLink className="h-3.5 w-3.5" /> External Game</> : "Details Only"}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-bold ${game.content_verified ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}>
              {game.content_verified ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
              {game.content_verified ? "Source checked" : "Verification pending"}
            </span>
          </div>

          {(categories.length > 0 || tags.length > 0 || seriesList.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  <Badge variant="secondary">{cat.name}</Badge>
                </Link>
              ))}
              {seriesList.map((s) => (
                <Link key={s.id} href={`/series/${s.slug}`}>
                  <Badge variant="secondary">{s.name}</Badge>
                </Link>
              ))}
              {tags.map((tag) => (
                <Link key={tag.id} href={`/tag/${tag.slug}`}>
                  <Badge variant="outline" className="text-xs">{tag.name}</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Editorial voice: the one block that is ours, not the source page's. */}
          {game.editorial_take?.trim() && (
            <section className="rounded-xl border border-primary/25 bg-primary/5 p-4">
              <h2 className="text-xl font-bold mb-3">Why we&apos;re featuring {game.title}</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.editorial_take}
              </div>
            </section>
          )}

          {game.content_verified && game.description && (
            <section>
              <h2 className="text-xl font-bold mb-3">About {game.title}</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.description}
              </div>
            </section>
          )}

          {game.content_verified && game.how_to_play && (
            <section>
              <h2 className="text-xl font-bold mb-3">How to Play</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.how_to_play}
              </div>
            </section>
          )}

          {game.content_verified && game.controls && (
            <section>
              <h2 className="text-xl font-bold mb-3">Controls</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.controls}
              </div>
            </section>
          )}

          {game.content_verified && game.tips && (
            <section>
              <h2 className="text-xl font-bold mb-3">Tips & Tricks</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.tips}
              </div>
            </section>
          )}

          {game.content_verified && game.features && (
            <section>
              <h2 className="text-xl font-bold mb-3">Features</h2>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.features}
              </div>
            </section>
          )}
          {!game.content_verified && (
            <section className="rounded-xl border border-dashed bg-muted/35 p-4">
              <h2 className="flex items-center gap-2 text-sm font-bold"><ShieldAlert className="h-4 w-4 text-amber-700 dark:text-amber-300" />Editorial verification in progress</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">Detailed gameplay claims are hidden until they have been checked against an official or trusted source. Play availability and catalogue metadata remain visible.</p>
            </section>
          )}
          <GameUpdates updates={updates} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <GameInfo game={game} playMode={playMode} />
          <section className="rounded-xl border p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> Sources &amp; credits</h3>
              {game.developer && <p className="mb-3 text-sm text-muted-foreground">Developer: <span className="font-semibold text-foreground">{game.developer}</span></p>}
              {sources.length > 0 && (
                <ul className="space-y-2 text-sm">
                  {sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">{source.type}<ExternalLink className="h-3 w-3" /></a>
                      {source.verifiedAt && <span className="ml-2 text-xs text-muted-foreground">checked {new Date(source.verifiedAt).toLocaleDateString("en")}</span>}
                    </li>
                  ))}
                </ul>
              )}
              {!game.developer && sources.length === 0 && <p className="text-sm leading-6 text-muted-foreground">No verified source or developer link has been published yet.</p>}
          </section>
          {(neighbors.previous || neighbors.next) && <GameNeighbors previous={neighbors.previous} next={neighbors.next} />}
        </aside>
      </div>

      </div>
      {relatedGames.length > 0 && (
        <section className="border-t pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Continue discovering</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">More like {game.title}</h2>
            </div>
            <Link href="/search" className="text-sm font-bold text-muted-foreground hover:text-primary">Browse all games <span aria-hidden="true">→</span></Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {relatedGames.map((relatedGame) => (
              <RelatedGameItem key={relatedGame.id} game={relatedGame} reason={relatedGame.recommendationReason} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
