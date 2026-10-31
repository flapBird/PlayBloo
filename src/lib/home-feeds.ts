import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { HOME_GAME_CARD_FIELDS, LEGACY_GAME_CARD_FIELDS, normalizePublicGameCards } from "@/lib/discovery-data";
import type { GameCardGame } from "@/components/games/GameCard";

export type HomeFeedSort = "newest" | "trending" | "released" | "popular";
export interface HomeFeed { games: GameCardGame[]; failed: boolean }
export type HomeFeeds = Record<HomeFeedSort, HomeFeed>;

async function getFeed(sort: HomeFeedSort | "playable"): Promise<HomeFeed> {
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
      } else if (sort === "popular" || sort === "playable") {
        if (sort === "playable") request = request.not("iframe_url", "is", null).neq("iframe_url", "");
        request = request.order("play_count", { ascending: false }).order("view_count", { ascending: false });
      } else {
        request = request.order("created_at", { ascending: false });
      }

      // 30 keeps the XL 5-column grid at six full rows — a non-multiple would
      // orphan cards on the last row.
      return request.order("id", { ascending: true }).limit(sort === "playable" ? 6 : 30);
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

export async function getHomeContent() {
  const [newest, trending, released, popular, playable] = await Promise.all([
    getFeed("newest"), getFeed("trending"), getFeed("released"), getFeed("popular"), getFeed("playable"),
  ]);
  return { feeds: { newest, trending, released, popular } satisfies HomeFeeds, playable: playable.games };
}
