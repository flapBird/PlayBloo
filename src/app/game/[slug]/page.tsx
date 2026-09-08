import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import type { GameCardGame } from "@/components/games/GameCard";
import { RelatedGameItem } from "@/components/games/RelatedGameItem";
import { Badge } from "@/components/ui/badge";
import { GameJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { MIN_INDEXABLE_SERIES_GAMES, SITE_NAME, SITE_URL } from "@/lib/constants";
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

export const revalidate = 300;

export async function generateStaticParams() {
  const { data } = await createAdminClient()
    .from("games")
    .select("slug")
    .eq("is_published", true)
    .order("hot_score", { ascending: false })
    .order("play_count", { ascending: false })
    .limit(24);
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
  const { data } = await supabase
    .from("games")
    .select("*, categories:game_categories(category_id, categories:categories(*)), tags:game_tags(tag_id, tags:tags(*)), series:game_series(series_id, series:series(*))")
    .eq("is_published", true)
    .eq("slug", slug)
    .single();
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

interface RecommendationCandidate extends GameCardGame {
  iframe_url: string | null;
  external_url: string | null;
  original_game_url: string | null;
  categoryIds: string[];
  tagIds: string[];
  seriesIds: string[];
  hot_score?: number;
  is_trending?: boolean;
}

type RawRecommendationCandidate = Omit<RecommendationCandidate, "categories" | "categoryIds" | "tagIds" | "seriesIds" | "original_game_url"> & {
  categories?: Array<{ category_id: string; categories: CategorySummary | null }>;
  tags?: Array<{ tag_id: string }>;
  series?: Array<{ series_id: string }>;
};

const getRecommendationPool = unstable_cache(async (): Promise<RecommendationCandidate[]> => {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("games")
    .select("id, title, slug, thumbnail_url, iframe_url, external_url, view_count, play_count, created_at, updated_at, release_date, is_trending, hot_score, categories:game_categories(category_id, categories:categories(id, name, slug)), tags:game_tags(tag_id), series:game_series(series_id)")
    .eq("is_published", true)
    .order("hot_score", { ascending: false })
    .limit(500);

  if (error) {
    console.error("Could not load recommendation pool:", error.message);
    return [];
  }

  return ((data || []) as unknown as RawRecommendationCandidate[]).map((candidate) => ({
      ...candidate,
      original_game_url: null,
      categories: candidate.categories?.map((membership) => membership.categories).filter((category): category is CategorySummary => Boolean(category)) || [],
      categoryIds: candidate.categories?.map((membership) => membership.category_id) || [],
      tagIds: candidate.tags?.map((membership) => membership.tag_id) || [],
      seriesIds: candidate.series?.map((membership) => membership.series_id) || [],
    }));
}, ["public-recommendation-pool-v2"], { revalidate: 1800 });

function getRelatedGames(game: Game, categoryIds: string[], tagIds: string[], seriesIds: string[], candidates: RecommendationCandidate[]) {
  const categorySet = new Set(categoryIds);
  const tagSet = new Set(tagIds);
  const seriesSet = new Set(seriesIds);
  const currentMode = getGamePlayMode(game);
  return candidates
    .filter((candidate) => candidate.id !== game.id)
    .map((candidate) => ({
      candidate,
      reason:
        candidate.seriesIds.some((id) => seriesSet.has(id)) ? "Same game series" :
        candidate.categoryIds.some((id) => categorySet.has(id)) ? "Similar genre" :
        candidate.tagIds.some((id) => tagSet.has(id)) ? "Shared gameplay tags" :
        getGamePlayMode(candidate) === currentMode && currentMode === "embedded" ? "Also playable here" :
        candidate.is_trending ? "Trending with players" : "Popular discovery",
      score:
        (candidate.seriesIds.some((id) => seriesSet.has(id)) ? 10000 : 0) +
        (candidate.categoryIds.some((id) => categorySet.has(id)) ? 1000 : 0) +
        (candidate.tagIds.some((id) => tagSet.has(id)) ? 100 : 0) +
        (getGamePlayMode(candidate) === currentMode ? 10 : 0) +
        (candidate.is_trending ? 5 : 0) +
        Math.min(Number(candidate.hot_score) || 0, 4),
    }))
    .sort((a, b) => b.score - a.score || (b.candidate.play_count || 0) - (a.candidate.play_count || 0))
    .slice(0, 6)
    .map(({ candidate, reason }) => ({ ...candidate, recommendationReason: reason }));
}

async function gameHasLevels(gameId: string) {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("game_levels")
    .select("id", { count: "exact", head: true })
    .eq("game_id", gameId)
    .eq("is_published", true);
  return (count || 0) > 0;
}

async function getUpdates(gameId: string): Promise<GameUpdate[]> {
  const { data } = await createAdminClient().from("game_updates").select("*").eq("game_id", gameId).lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(20);
  return (data || []) as GameUpdate[];
}

function getNeighbors(game: Game, candidates: RecommendationCandidate[]) {
  const ordered = [...candidates].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  const index = ordered.findIndex((candidate) => candidate.id === game.id);
  if (index < 0) return { previous: null, next: null };
  const previous = ordered[index - 1];
  const next = ordered[index + 1];
  return {
    previous: previous ? { title: previous.title, slug: previous.slug } : null,
    next: next ? { title: next.title, slug: next.slug } : null,
  };
}

function getVisibleSeries<T extends { id: string }>(series: T[], candidates: RecommendationCandidate[]): T[] {
  if (!series.length) return [];
  const counts = new Map(series.map((item) => [item.id, 0]));
  for (const candidate of candidates) {
    for (const seriesId of candidate.seriesIds) {
      if (counts.has(seriesId)) counts.set(seriesId, (counts.get(seriesId) || 0) + 1);
    }
  }
  return series.filter((item) => (counts.get(item.id) || 0) >= MIN_INDEXABLE_SERIES_GAMES);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const gameRow = await getGame(slug);
  if (!gameRow) return { title: "Game Not Found" };
  const game = gameRow as unknown as Game;
  const description = getMetaDescription(game.content_verified ? game.description : null, game.title);
  const playMode = getGamePlayMode(game);
  const title = playMode === "embedded" ? `${game.title} - Play Here` : `${game.title} - Game Details`;

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
  const gameRow = await getGame(slug);

  if (!gameRow) notFound();
  const game = gameRow as unknown as Game;

  const categories = gameRow.categories?.map((membership) => membership.categories).filter((category): category is CategorySummary => Boolean(category)) || [];
  const tags = gameRow.tags?.map((membership) => membership.tags).filter((tag): tag is TagSummary => Boolean(tag)) || [];
  const rawSeriesList = gameRow.series?.map((membership) => membership.series).filter((series): series is SeriesSummary => Boolean(series)) || [];

  const [recommendationPool, updates, hasLevels] = await Promise.all([
    getRecommendationPool(),
    getUpdates(game.id),
    gameHasLevels(game.id),
  ]);
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
              {hasLevels && (
              <>
                <div className="w-64">
                  <LevelSearch gameId={game.id} gameSlug={game.slug} />
                </div>
                <Link
                  href={`/game/${game.slug}/level`}
                  className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all active:scale-95"
                >
                  <Grid3X3 className="h-3.5 w-3.5" />
                  Walkthroughs
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" /> {game.view_count.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <Play className="h-4 w-4" /> {game.play_count.toLocaleString()} plays
            </span>
            {game.release_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {new Date(game.release_date).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            )}
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${playMode === "embedded" ? "bg-emerald-500/15 text-emerald-300" : playMode === "external" ? "bg-slate-500/15 text-slate-300" : "bg-amber-500/15 text-amber-300"}`}>
              {playMode === "embedded" ? <><Zap className="h-3.5 w-3.5 fill-current" /> Play Here</> : playMode === "external" ? <><ExternalLink className="h-3.5 w-3.5" /> External Game</> : "Details Only"}
            </span>
            <span className={`inline-flex items-center gap-1 text-xs font-bold ${game.content_verified ? "text-emerald-300" : "text-muted-foreground"}`}>
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

      {/* Game Iframe */}
      <GameIframe src={game.iframe_url} title={game.title} gameId={game.id} slug={game.slug} thumbnailUrl={game.thumbnail_url} externalUrl={externalGameUrl} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
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
              <h2 className="flex items-center gap-2 text-sm font-bold"><ShieldAlert className="h-4 w-4 text-amber-300" />Editorial verification in progress</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">Detailed gameplay claims are hidden until they have been checked against an official or trusted source. Play availability and catalogue metadata remain visible.</p>
            </section>
          )}
          <GameUpdates updates={updates} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <GameInfo game={game} playMode={playMode} />
          <section className="rounded-xl border p-4">
              <h3 className="mb-3 flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Sources &amp; credits</h3>
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
        </aside>
      </div>

      </div>
      {relatedGames.length > 0 && (
        <section className="border-t pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Continue discovering</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">Why these games are related</h2>
            </div>
            <Link href="/search" className="text-sm font-bold text-muted-foreground hover:text-primary">Browse all games <span aria-hidden="true">→</span></Link>
          </div>
          <div className="mt-4 grid gap-x-7 md:grid-cols-2">
            {relatedGames.map((relatedGame) => (
              <RelatedGameItem key={relatedGame.id} game={relatedGame} reason={relatedGame.recommendationReason} />
            ))}
          </div>
        </section>
      )}
      <div className="max-w-5xl mx-auto"><GameNeighbors previous={neighbors.previous} next={neighbors.next} /></div>
    </div>
  );
}
