import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Shared catalogue reads for pages that need the whole published catalogue.
 *
 * The game recommendation pool and the sitemap both used to load the
 * catalogue through one wide `games` query with three nested joins
 * (categories, tags, series). That single row set is expensive to build on
 * every cache miss, and the pool kept racing its own 3s abort window
 * because the JSON payload for a thousand games is large.
 *
 * Reading the taxonomy from its own side is much cheaper: `categories`,
 * `tags` and `series` are small tables (24 / 7 / 2 rows) and each one
 * already has an index on the join column, so asking each table for the
 * games that reference it returns a handful of narrow rows instead of a
 * thousand wide ones. The game list itself is fetched with only the columns
 * the caller needs.
 */

// PostgREST caps every response at 1000 rows, so the catalogue has to be
// read in pages.
const PAGE_SIZE = 1000;

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  updated_at: string;
}

export interface CatalogTag {
  id: string;
  slug: string;
  updated_at: string;
}

export interface CatalogSeries {
  id: string;
  slug: string;
  updated_at: string;
}

/** A published game, with the taxonomy memberships nested on the row. */
export interface CatalogGame {
  id: string;
  slug: string;
  updated_at: string;
  game_categories?: { category_id: string }[] | null;
  game_tags?: { tag_id: string }[] | null;
  game_series?: { series_id: string }[] | null;
}

export interface Membership {
  /** The taxonomy id (category, tag or series). */
  id: string;
  /** The published games that belong to it. */
  gameIds: string[];
}

export interface Catalog {
  games: CatalogGame[];
  categories: CatalogCategory[];
  tags: CatalogTag[];
  series: CatalogSeries[];
  categoryMembership: Membership[];
  tagMembership: Membership[];
  seriesMembership: Membership[];
}

type AdminClient = ReturnType<typeof createAdminClient>;

/**
 * Read every published game in 1000-row pages using the caller's columns.
 *
 * PostgREST caps a response at 1000 rows, so the catalogue has to be paged.
 * The first page is read with `count: "exact"`, which reports the total row
 * count without an extra round trip, and every remaining page is then
 * requested in parallel. Reading them one after another would make the read
 * cost grow with the number of pages instead of staying flat.
 */
export async function fetchPublishedGames<T extends CatalogGame>(
  supabase: AdminClient,
  columns: string,
  order: { column: string; ascending: boolean } = { column: "id", ascending: true },
): Promise<T[]> {
  const readPage = async (offset: number, withCount = false) => {
    const { data, error, count } = await supabase
      .from("games")
      .select(columns, withCount ? { count: "exact" } : undefined)
      .eq("is_published", true)
      .order(order.column, { ascending: order.ascending })
      .range(offset, offset + PAGE_SIZE - 1);
    if (error) throw new Error(`Could not load catalogue games: ${error.message}`);
    return { rows: (data || []) as unknown as T[], count: count ?? null };
  };

  const first = await readPage(0, true);
  const total = first.count;
  if (total === null || total <= PAGE_SIZE) return first.rows;

  const pageCount = Math.ceil(total / PAGE_SIZE);
  const offsets = [];
  for (let page = 1; page < pageCount; page++) offsets.push(page * PAGE_SIZE);
  const remaining = await Promise.all(offsets.map((offset) => readPage(offset)));
  return [first.rows, ...remaining.map((page) => page.rows)].flat();
}

/**
 * The taxonomy memberships, read from the game side.
 *
 * Reading them from the taxonomy side costs one row per membership, and each
 * of those rows carried a 36-character game UUID plus a nested copy of the
 * same UUID — about 230 KB for a catalogue with 2,230 memberships. Nesting the
 * membership on the game row instead keeps the UUIDs out of the payload and
 * turns seven queries into four.
 */
const MEMBERSHIP_COLUMNS = "game_categories(category_id), game_tags(tag_id), game_series(series_id)";

type MembershipRelationKey = "game_categories" | "game_tags" | "game_series";
type MembershipIdKey = "category_id" | "tag_id" | "series_id";

/**
 * Group the memberships by taxonomy id.
 *
 * The games are already filtered to the published ones, so every membership
 * that comes back belongs to a published game.
 */
function groupMembership(
  games: CatalogGame[],
  relationKey: MembershipRelationKey,
  idKey: MembershipIdKey,
): Membership[] {
  const grouped = new Map<string, string[]>();
  for (const game of games) {
    const relations = (game[relationKey] || []) as Array<Record<string, string> | null>;
    for (const relation of relations) {
      const taxonomyId = relation?.[idKey];
      if (!taxonomyId) continue;
      const list = grouped.get(taxonomyId) || [];
      list.push(game.id);
      grouped.set(taxonomyId, list);
    }
  }
  return [...grouped.entries()].map(([id, gameIds]) => ({ id, gameIds }));
}

/**
 * Load the published catalogue: the game list plus the category, tag and
 * series membership rows.
 *
 * All reads run in parallel and each one is individually small, so the
 * whole catalogue costs a fraction of the previous wide join.
 */
export async function loadCatalog(options: {
  gameColumns?: string;
  order?: { column: string; ascending: boolean };
} = {}): Promise<Catalog> {
  const supabase = createAdminClient();
  const gameColumns = options.gameColumns || "id, slug, updated_at";
  const order = options.order || { column: "id", ascending: true };

  const [games, categories, tags, series] = await Promise.all([
    fetchPublishedGames<CatalogGame>(supabase, `${gameColumns}, ${MEMBERSHIP_COLUMNS}`, order),
    supabase.from("categories").select("id, name, slug, updated_at"),
    supabase.from("tags").select("id, slug, updated_at"),
    supabase.from("series").select("id, slug, updated_at"),
  ]);

  return {
    games,
    categories: (categories.data || []) as CatalogCategory[],
    tags: (tags.data || []) as CatalogTag[],
    series: (series.data || []) as CatalogSeries[],
    categoryMembership: groupMembership(games, "game_categories", "category_id"),
    tagMembership: groupMembership(games, "game_tags", "tag_id"),
    seriesMembership: groupMembership(games, "game_series", "series_id"),
  };
}
