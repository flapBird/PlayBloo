import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Flame,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { GameListItem } from "@/components/games/GameListItem";
import type { GameCardGame } from "@/components/games/GameCard";
import { HomeLibraryPanel } from "@/components/home/HomeLibraryPanel";
import { HomeGuideFeature } from "@/components/guides/HomeGuideFeature";
import { normalizePublicGameCards, LEGACY_GAME_CARD_FIELDS, PUBLIC_GAME_DISCOVERY_FIELDS, rankHiddenGems } from "@/lib/discovery-data";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

interface HomeContent {
  feed: HomeGame[];
  trending: HomeGame[];
  playable: HomeGame[];
  released: HomeGame[];
  updated: HomeGame[];
  hiddenGems: HomeGame[];
}

type HomeGame = GameCardGame;

async function getHomeContent(): Promise<HomeContent> {
  try {
    const supabase = createAdminClient();
    const advancedResult = await supabase
      .from("games")
      .select(PUBLIC_GAME_DISCOVERY_FIELDS)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(60);

    // The public site stays usable before the optional P1 migration is run.
    // Legacy timestamps are never presented as real update dates.
    let gameRows: unknown = advancedResult.data;
    let queryError = advancedResult.error;
    if (advancedResult.error) {
      const fallbackResult = await supabase
        .from("games")
        .select(LEGACY_GAME_CARD_FIELDS)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(60);
      gameRows = fallbackResult.data;
      queryError = fallbackResult.error;
    }

    if (queryError) throw queryError;

    const games = normalizePublicGameCards(gameRows);
    const now = Date.now();
    const pastTimestamp = (value: string | null | undefined) => {
      if (!value) return 0;
      const timestamp = new Date(value).getTime();
      return Number.isFinite(timestamp) && timestamp <= now ? timestamp : 0;
    };
    const feed = [...games]
      .sort((a, b) => pastTimestamp(b.added_at || b.created_at) - pastTimestamp(a.added_at || a.created_at))
      .slice(0, 14);
    const trending = [...games]
      .sort(
        (a, b) =>
          Number(Boolean(b.is_trending)) - Number(Boolean(a.is_trending)) ||
          (b.hot_score || 0) - (a.hot_score || 0) ||
          (b.play_count || 0) - (a.play_count || 0),
      )
      .slice(0, 6);
    const playable = games
      .filter((game) => Boolean(game.iframe_url?.trim()))
      .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
      .slice(0, 6);
    const released = games
      .filter((game) => pastTimestamp(game.release_date) > 0)
      .sort((a, b) => pastTimestamp(b.release_date) - pastTimestamp(a.release_date))
      .slice(0, 3);
    const updated = games
      .filter((game) => pastTimestamp(game.last_updated_at) > 0)
      .sort((a, b) => pastTimestamp(b.last_updated_at) - pastTimestamp(a.last_updated_at))
      .slice(0, 3);
    const hiddenGems = rankHiddenGems(games).slice(0, 3);

    return { feed, trending, playable, released, updated, hiddenGems };
  } catch (error) {
    console.error("Could not load home content:", error);
    return { feed: [], trending: [], playable: [], released: [], updated: [], hiddenGems: [] };
  }
}

function formatSignalDate(value: string | null | undefined): string {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

function DiscoverySignal({
  title,
  detail,
  games,
  href,
  dateField,
  emptyText,
}: {
  title: string;
  detail: string;
  games: HomeGame[];
  href: string;
  dateField?: "release_date" | "last_updated_at";
  emptyText: string;
}) {
  if (!games.length) return null;
  return (
    <section className="min-w-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">{detail}</p>
        </div>
        <Link href={href} aria-label={`View all ${title}`} className="shrink-0 text-muted-foreground hover:text-primary">
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {games.length ? (
        <ol className="mt-3 space-y-2.5">
          {games.map((game, index) => (
            <li key={game.id} className="flex min-w-0 items-center gap-2.5">
              <span className="w-4 shrink-0 text-[10px] font-black text-muted-foreground/60">0{index + 1}</span>
              <Link href={`/game/${game.slug}`} prefetch={false} className="min-w-0 flex-1 truncate text-xs font-bold hover:text-primary">{game.title}</Link>
              {dateField ? (
                <time dateTime={game[dateField] || undefined} className="hidden shrink-0 text-[10px] text-muted-foreground sm:block">
                  {formatSignalDate(game[dateField])}
                </time>
              ) : (
                <span className="shrink-0 text-[10px] text-muted-foreground">{game.play_count || 0} plays</span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">{emptyText}</p>
      )}
    </section>
  );
}

function CompactRanking({
  title,
  eyebrow,
  games,
  href,
}: {
  title: string;
  eyebrow: string;
  games: HomeGame[];
  href: string;
}) {
  if (!games.length) return null;

  return (
    <section className="discovery-side-panel">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <h2 className="text-base font-extrabold tracking-tight">{title}</h2>
        <Link href={href} className="text-xs font-bold text-muted-foreground hover:text-primary">View all</Link>
      </div>
      <ol className="mt-3 divide-y divide-border/70">
        {games.map((game, index) => (
          <li key={game.id}>
            <Link href={`/game/${game.slug}`} prefetch={false} className="group flex items-center gap-3 py-3">
              <span className="w-5 shrink-0 text-center text-xs font-black text-muted-foreground/70">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold transition-colors group-hover:text-primary">{game.title}</span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  {game.categories?.[0]?.name || "Browser game"} · {(game.play_count || 0).toLocaleString()} plays
                </span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default async function HomePage() {
  const { feed, trending, playable, released, updated, hiddenGems } = await getHomeContent();

  return (
    <div className="pb-16">
      <div className="container mx-auto px-4 pt-5 md:pt-7">
        <section className="home-intro flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Curated browser game discovery</p>
            <h1 className="text-2xl font-black leading-tight tracking-[-0.035em] sm:text-3xl">
              Discover what&apos;s new. <span className="text-primary">Play instantly.</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Find a browser game and start playing. No download required.
            </p>
          </div>
          <Link href="/search" className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border bg-card px-4 py-2.5 text-sm font-bold transition-colors hover:border-primary/50 hover:text-primary md:self-auto">
            <Search className="h-4 w-4" /> Find a game
          </Link>
        </section>


        <nav aria-label="Game feed" className="discovery-toolbar mt-7">
          <div className="discovery-tabs">
            <Link href="/" className="is-active" aria-current="page">New</Link>
            <Link href="/search?sort=trending"><Flame className="h-3.5 w-3.5" />Trending</Link>
            <Link href="/search?sort=released"><CalendarDays className="h-3.5 w-3.5" />Released</Link>
            {updated.length > 0 && <Link href="/search?sort=recently-updated"><Clock3 className="h-3.5 w-3.5" />Updated</Link>}
            <Link href="/search?sort=popular">Popular</Link>
            <Link href="/search?sort=hidden-gems">Hidden Gems</Link>
          </div>
          <div className="discovery-tools flex shrink-0 items-center gap-2">
            <Link href="/search" className="discovery-tool-button"><SlidersHorizontal className="h-4 w-4" />Filters</Link>
            <span className="discovery-tool-button view-switch is-selected hidden sm:inline-flex"><List className="h-4 w-4" />List</span>
            <Link href="/search?view=grid" aria-label="Grid view" className="discovery-tool-button view-switch hidden sm:inline-flex"><LayoutGrid className="h-4 w-4" /></Link>
          </div>
        </nav>

        <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_290px] xl:gap-12">
          <section className="min-w-0" aria-label="Newest games">
            {feed.length ? (
              <div className="discovery-list">
                {feed.map((game, index) => (
                  <GameListItem
                    key={game.id}
                    game={game}
                    eagerImage={index === 0}
                    featured={index === 0}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
                <Flame className="mx-auto mb-3 h-8 w-8 text-primary/30" />
                New games will appear here soon.
              </div>
            )}

            {feed.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Link href="/search" className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-bold hover:border-primary/50 hover:text-primary">
                  Browse all games <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <HomeGuideFeature />
            <div className="grid gap-5 rounded-xl border bg-card/40 p-4">
              <DiscoverySignal
                title="Recently released"
                detail="Ordered by the game’s real release date"
                games={released}
                href="/search?sort=released"
                dateField="release_date"
                emptyText="Release dates will appear after they are sourced."
              />
              <DiscoverySignal
                title="Recently updated"
                detail="Only verified game update dates"
                games={updated}
                href="/search?sort=recently-updated"
                dateField="last_updated_at"
                emptyText="No verified game updates have been recorded yet."
              />
              <DiscoverySignal
                title="Hidden gems"
                detail="Lower visibility with a stronger play rate"
                games={hiddenGems}
                href="/search?sort=hidden-gems"
                emptyText="More play activity is needed to surface hidden gems."
              />
            </div>

            <CompactRanking title="Trending now" eyebrow="Popular this moment" games={trending} href="/search?sort=trending" />
            <CompactRanking title="Play instantly" eyebrow="No download required" games={playable} href="/search?playMode=embedded" />
            <Link href="/category" className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
              Browse all genres <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
        <HomeLibraryPanel />
      </div>
    </div>
  );
}
