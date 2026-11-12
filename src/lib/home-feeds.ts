import "server-only";

import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { queryTimeout } from "@/lib/query-timeout";
import { HOME_GAME_CARD_FIELDS, LEGACY_GAME_CARD_FIELDS, normalizePublicGameCards } from "@/lib/discovery-data";
import { HOME_PICKS } from "@/lib/priority-pages";
import type { GameCardGame } from "@/components/games/GameCard";

export type HomeFeedSort = "newest" | "trending" | "released" | "popular" | "instant";
export interface HomeFeed { games: GameCardGame[]; failed: boolean }
export type HomeFeeds = Record<HomeFeedSort, HomeFeed>;

export interface HomeFeaturedContent {
  /** Five cards for the featured mosaic: curated slots first, trending filling the rest. */
  games: GameCardGame[];
  /** True when position 1 (the big lead tile) holds a hand-curated game. */
  leadIsCurated: boolean;
}

async function getFeed(sort: HomeFeedSort): Promise<HomeFeed> {
  try {
    const supabase = createAdminClient();
    const query = (fields: string) => {
      let request = supabase.from("games").select(fields).eq("is_published", true);

      // Rank the entire published catalog, using the same order as Search.
      if (sort === "released") {
        request = request.not("release_date", "is", null)
          .lte("release_date", new Date().toISOString().slice(0, 10))
          .order("release_date", { ascending: false });
      } else if (sort === "trending") {
        request = request.order("hot_score", { ascending: false }).order("play_count", { ascending: false });
      } else if (sort === "popular" || sort === "instant") {
        // "instant" is Popular restricted to games playable right on PlayBloo.
        if (sort === "instant") request = request.not("iframe_url", "is", null).neq("iframe_url", "");
        request = request.order("play_count", { ascending: false }).order("view_count", { ascending: false });
      } else {
        request = request.order("created_at", { ascending: false });
      }

      // 30 keeps the XL 5-column grid at six full rows — a non-multiple would
      // orphan cards on the last row.
      return request.order("id", { ascending: true }).limit(30);
    };

    let result = await query(HOME_GAME_CARD_FIELDS);
    // Preserve support for catalogs without the optional discovery migration.
    if (result.error) result = await query(LEGACY_GAME_CARD_FIELDS);
    if (result.error) throw result.error;
    return { games: normalizePublicGameCards(result.data), failed: false };
  } catch (error) {
    console.error(`Could not load ${sort} home feed:`, error);
    return { games: [], failed: true };
  }
}

/**
 * The featured mosaic honours hand-picked positions from /admin/featured:
 * each curated row occupies its literal slot (1 = big lead tile, 2-5 =
 * runner-up covers) and every unset slot falls back to the trending feed so
 * the mosaic never shrinks. Any error (missing migration, bad row) keeps the
 * homepage on the pure trending ranking.
 */
async function getFeaturedGames(trending: GameCardGame[]): Promise<HomeFeaturedContent> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("home_featured_slots")
      .select(`position, games(${HOME_GAME_CARD_FIELDS})`)
      .eq("games.is_published", true)
      .order("position", { ascending: true });
    if (error) throw error;

    const slots: (GameCardGame | null)[] = new Array(5).fill(null);
    for (const row of data || []) {
      const position = Number(row?.position);
      const game = Array.isArray(row?.games) ? row.games[0] : row?.games;
      if (!Number.isInteger(position) || position < 1 || position > 5 || !game) continue;
      slots[position - 1] = normalizePublicGameCards([game])[0];
    }
    const used = new Set(slots.filter((game): game is GameCardGame => Boolean(game)).map((game) => game.id));
    const fallbackQueue = trending.filter((game) => !used.has(game.id));
    for (let i = 0; i < slots.length; i++) {
      if (!slots[i]) slots[i] = fallbackQueue.shift() ?? null;
    }
    const games = slots.filter((game): game is GameCardGame => Boolean(game));
    return { games, leadIsCurated: Boolean(slots[0]) };
  } catch (error) {
    console.error("Could not load curated home featured slots:", error);
    return { games: trending, leadIsCurated: false };
  }
}

export async function getHomeContent() {
  const [newest, trending, released, popular, instant] = await Promise.all([
    getFeed("newest"), getFeed("trending"), getFeed("released"), getFeed("popular"), getFeed("instant"),
  ]);
  const featured = await getFeaturedGames(trending.games);
  return { feeds: { newest, trending, released, popular, instant } satisfies HomeFeeds, featured };
}

/** One row per "Featured this week" pick: just enough to render its mini card. */
export interface HomePickGame {
  slug: string;
  title: string;
  thumbnail_url: string | null;
}

/**
 * Catalogue rows for the homepage's editorial picks. The curated order and
 * blurbs live in priority-pages; this only supplies live titles and covers
 * so the block can render thumbnails. Returns a plain array — unstable_cache
 * JSON-serializes its return value, which would strip a Map to {}.
 */
export const getCachedHomePickGames = () =>
  unstable_cache(async (): Promise<HomePickGame[]> => {
    try {
      const { data, error } = await createAdminClient()
        .from("games")
        .select("slug, title, thumbnail_url")
        .eq("is_published", true)
        .in("slug", HOME_PICKS.map((pick) => pick.slug))
        .abortSignal(AbortSignal.timeout(queryTimeout(5000)));
      if (error) throw error;
      return (data || []) as HomePickGame[];
    } catch (error) {
      console.error("Could not load home pick games:", error);
      return [];
    }
  }, ["home-pick-games-v1"], { revalidate: 3600, tags: ["public-recommendations"] })();
