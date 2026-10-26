import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { queryTimeout } from "@/lib/query-timeout";
import { HOME_GAME_CARD_FIELDS, normalizePublicGameCards } from "@/lib/discovery-data";
import { PAGE_SIZE } from "@/lib/constants";
import type { Category } from "@/lib/types";

export const getCategory = cache((slug: string) => unstable_cache(async (): Promise<Category | null> => {
  const { data, error } = await createAdminClient()
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .abortSignal(AbortSignal.timeout(queryTimeout(8000)))
    .maybeSingle();

  // Only a successful read with no row is a 404. Network/database failures
  // must reject inside the cache so they cannot persist as missing categories.
  if (error) throw new Error(`Could not load category: ${error.message}`);
  return data;
}, ["category-by-slug-v3", slug], { revalidate: 3600, tags: [`category:${slug}`] })());

export const getCategoryGames = cache((categoryId: string, slug: string, page: number) => unstable_cache(async () => {
  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await createAdminClient()
    .from("games")
    // Filter in Postgres rather than downloading a capped list of membership
    // IDs and sending it back in a potentially oversized `in` query string.
    .select(`${HOME_GAME_CARD_FIELDS}, category_filter:game_categories!inner(category_id)`, { count: "exact" })
    .eq("is_published", true)
    .eq("category_filter.category_id", categoryId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .range(from, from + PAGE_SIZE - 1)
    .abortSignal(AbortSignal.timeout(queryTimeout(8000)));

  if (error) throw new Error(`Could not load category games: ${error.message}`);
  return { games: normalizePublicGameCards(data), total: count || 0 };
}, ["category-games-v4", categoryId, slug, String(page)], {
  revalidate: 3600, tags: [`category:${slug}`],
})());
