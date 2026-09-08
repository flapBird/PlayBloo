import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type SearchCategoryMembership = {
  categories: { id: string; name: string; slug: string } | { id: string; name: string; slug: string }[] | null;
};

type SearchGameRow = {
  categories: SearchCategoryMembership[] | null;
  [key: string]: unknown;
};

function normalize(value: string): string {
  return value.trim().replace(/[%_(),]/g, " ").replace(/\s+/g, " ").slice(0, 80);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = normalize(searchParams.get("q") || "");
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category");
  const playMode = searchParams.get("playMode") || "all";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "24") || 24), 100);
  const supabase = createAdminClient();
  let requiredIds: Set<string> | null = null;

  if (q) {
    const { data: rpcMatches, error: rpcError } = await supabase.rpc("search_public_game_ids", { search_term: q });
    if (!rpcError) {
      requiredIds = new Set((rpcMatches || []).map((match: { game_id: string }) => match.game_id));
    } else {
      const pattern = `%${q}%`;
      const [games, categories, tags] = await Promise.all([
        supabase.from("games").select("id").eq("is_published", true).ilike("title", pattern).limit(500),
        supabase.from("categories").select("id").ilike("name", pattern).limit(100),
        supabase.from("tags").select("id").ilike("name", pattern).limit(100),
      ]);
      requiredIds = new Set((games.data || []).map((item) => item.id));
      const [categoryGames, tagGames] = await Promise.all([
        categories.data?.length ? supabase.from("game_categories").select("game_id").in("category_id", categories.data.map((item) => item.id)).limit(500) : Promise.resolve({ data: [] as { game_id: string }[] }),
        tags.data?.length ? supabase.from("game_tags").select("game_id").in("tag_id", tags.data.map((item) => item.id)).limit(500) : Promise.resolve({ data: [] as { game_id: string }[] }),
      ]);
      for (const match of [...(categoryGames.data || []), ...(tagGames.data || [])]) requiredIds.add(match.game_id);
    }
  }

  if (category) {
    const { data } = await supabase.from("game_categories").select("game_id").eq("category_id", category).limit(1000);
    const categoryIds = new Set((data || []).map((item) => item.game_id));
    requiredIds = requiredIds === null ? categoryIds : new Set([...requiredIds].filter((id) => categoryIds.has(id)));
  }

  if (requiredIds?.size === 0) return NextResponse.json({ data: [], total: 0, page, page_size: limit, total_pages: 0 });

  let query = supabase
    .from("games")
    .select("id, title, slug, thumbnail_url, iframe_url, external_url, view_count, play_count, created_at, updated_at, is_trending, categories:game_categories(category_id, categories:categories(id, name, slug))", { count: "exact" })
    .eq("is_published", true);
  if (requiredIds) query = query.in("id", [...requiredIds]);
  if (playMode === "embedded") query = query.not("iframe_url", "is", null).neq("iframe_url", "");

  if (sort === "trending") query = query.order("hot_score", { ascending: false }).order("play_count", { ascending: false });
  else if (sort === "popular") query = query.order("play_count", { ascending: false }).order("view_count", { ascending: false });
  else if (sort === "updated") query = query.order("updated_at", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const from = (page - 1) * limit;
  const { data, count } = await query.range(from, from + limit - 1);
  const games = ((data || []) as SearchGameRow[]).map((game) => ({
    ...game,
    categories: game.categories
      ?.flatMap((membership) => Array.isArray(membership.categories) ? membership.categories : membership.categories ? [membership.categories] : []) || [],
  }));
  return NextResponse.json({ data: games, total: count || 0, page, page_size: limit, total_pages: Math.ceil((count || 0) / limit) });
}
