import "server-only";

import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { HOME_GAME_CARD_FIELDS, LEGACY_GAME_CARD_FIELDS, normalizePublicGameCards } from "@/lib/discovery-data";
import { LANDING_PAGE_SIZE } from "@/lib/constants";
import type { GameCardGame } from "@/components/games/GameCard";

/**
 * Server data for the three indexable discovery landing pages (/new-games,
 * /popular, /trending). Each page owns one ranking so the trio never renders
 * the same ordered list — that would hand Google three duplicates to choose
 * between.
 *
 * Trending ranks by `hot_score`, the catalogue's recency-decayed blend of
 * views and plays. A literal "last 7 days' rise" would need per-day history,
 * and game_stats_daily is not populated, so hot_score is the strongest
 * trend signal the catalogue actually has.
 *
 * Like the home feeds, sort columns stay out of the select list: ORDER BY
 * does not need them, and cards never render the counters.
 */
export type LandingSort = "new" | "popular" | "trending";

function buildQuery(sort: LandingSort, fields: string, count: boolean) {
  const request = createAdminClient()
    .from("games")
    .select(fields, count ? { count: "exact" } : undefined)
    .eq("is_published", true);
  if (sort === "popular") {
    return request.order("play_count", { ascending: false }).order("view_count", { ascending: false });
  }
  if (sort === "trending") {
    return request.order("hot_score", { ascending: false }).order("play_count", { ascending: false });
  }
  return request.order("created_at", { ascending: false });
}

export interface LandingFeed {
  games: GameCardGame[];
  total: number;
  failed: boolean;
}

export const getCachedLandingPage = (sort: LandingSort, page: number) =>
  unstable_cache(async (): Promise<LandingFeed> => {
    const from = (page - 1) * LANDING_PAGE_SIZE;
    try {
      let result = await buildQuery(sort, HOME_GAME_CARD_FIELDS, true).range(from, from + LANDING_PAGE_SIZE - 1);
      // Preserve support for catalogs without the optional discovery migration.
      if (result.error) {
        result = await buildQuery(sort, LEGACY_GAME_CARD_FIELDS, true).range(from, from + LANDING_PAGE_SIZE - 1);
      }
      if (result.error) throw result.error;
      return { games: normalizePublicGameCards(result.data), total: result.count || 0, failed: false };
    } catch (error) {
      console.error(`Could not load ${sort} landing page ${page}:`, error);
      return { games: [], total: 0, failed: true };
    }
  }, ["landing-page-v2", sort, String(page)], { revalidate: 900, tags: ["public-recommendations"] })();

/**
 * Games added to the catalogue within the last 7 days, plus how long ago the
 * newest one joined, for the intro copy. A factory like getCachedLandingPage:
 * the wrapped read must execute per request cycle, never at module import
 * time (import-time execution would run inside build/HMR worker contexts
 * that have no request environment). The age is computed here rather than in
 * the page so `Date.now()` stays out of render.
 */
export const getCachedRecentAdditions = () =>
  unstable_cache(async (): Promise<{ weekCount: number; latestTitle: string | null; latestAgeDays: number | null }> => {
    try {
      const supabase = createAdminClient();
      const since = new Date(Date.now() - 7 * 86_400_000).toISOString();
      const [{ count }, latest] = await Promise.all([
        supabase.from("games").select("id", { count: "exact", head: true }).eq("is_published", true).gte("created_at", since),
        supabase.from("games").select("title, created_at").eq("is_published", true).order("created_at", { ascending: false }).order("id", { ascending: true }).limit(1),
      ]);
      const latestAddedAt = latest.data?.[0]?.created_at;
      return {
        weekCount: count || 0,
        latestTitle: latest.data?.[0]?.title ?? null,
        latestAgeDays: latestAddedAt
          ? Math.max(0, Math.floor((Date.now() - new Date(latestAddedAt).getTime()) / 86_400_000))
          : null,
      };
    } catch (error) {
      console.error("Could not load recent additions:", error);
      return { weekCount: 0, latestTitle: null, latestAgeDays: null };
    }
  }, ["landing-recent-additions-v2"], { revalidate: 900, tags: ["public-recommendations"] })();
