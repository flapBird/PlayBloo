import { revalidatePath, revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

type Relation = { slug: string } | { slug: string }[] | null;
export interface GameCacheSnapshot {
  slug: string;
  is_published: boolean;
  categories?: { categories: Relation }[] | null;
  tags?: { tags: Relation }[] | null;
  series?: { series: Relation }[] | null;
}

export async function getGameCacheSnapshot(id: string): Promise<GameCacheSnapshot | null> {
  const { data, error } = await createAdminClient().from("games")
    .select("slug, is_published, categories:game_categories(categories(slug)), tags:game_tags(tags(slug)), series:game_series(series(slug))")
    .eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not read game cache dependencies: ${error.message}`);
  return data;
}

function slugs(relations: Relation[]): string[] {
  return relations.flatMap((relation) => Array.isArray(relation) ? relation : relation ? [relation] : [])
    .map((relation) => relation.slug);
}

function membershipKey(game: GameCacheSnapshot | null): string {
  if (!game?.is_published) return "";
  return JSON.stringify([
    game.slug,
    slugs((game.categories || []).map((row) => row.categories)).sort(),
    slugs((game.tags || []).map((row) => row.tags)).sort(),
    slugs((game.series || []).map((row) => row.series)).sort(),
  ]);
}

/** Invalidate both sides of relation/slug changes, including dependent walkthroughs. */
export function revalidateGameChange(before: GameCacheSnapshot | null, after: GameCacheSnapshot | null) {
  const paths = new Set(["/", "/search", "/category", "/series", "/sitemap.xml"]);
  const dataTags = new Set<string>();
  const games = [before, after].filter((game): game is GameCacheSnapshot => Boolean(game));
  for (const slug of new Set(games.map((game) => game.slug))) revalidatePath(`/game/${slug}`, "layout");
  for (const game of games) {
    for (const slug of slugs((game.categories || []).map((row) => row.categories))) {
      paths.add(`/category/${slug}`);
      dataTags.add(`category:${slug}`);
    }
    for (const slug of slugs((game.tags || []).map((row) => row.tags))) {
      paths.add(`/tag/${slug}`);
      dataTags.add(`tag:${slug}`);
    }
    for (const slug of slugs((game.series || []).map((row) => row.series))) paths.add(`/series/${slug}`);
  }
  // Shared navigation and recommendation data need refreshing for catalog changes,
  // but a description-only edit must not invalidate every public page.
  if (membershipKey(before) !== membershipKey(after)) {
    dataTags.add("public-category-catalog");
    dataTags.add("public-recommendations");
    dataTags.add("public-search-options");
  }
  for (const tag of dataTags) revalidateTag(tag, { expire: 0 });
  for (const path of paths) revalidatePath(path);
}
