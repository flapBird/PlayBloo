import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PAGE_SIZE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category");
  const limit = Math.min(parseInt(searchParams.get("limit") || String(PAGE_SIZE)), 100);

  const supabase = await createServerSupabaseClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("games")
    .select("*, categories:game_categories(category_id, categories:categories(*))", { count: "exact" })
    .eq("is_published", true);

  if (category) {
    query = query.eq("game_categories.category_id", category);
  }

  switch (sort) {
    case "trending": query = query.order("hot_score", { ascending: false }); break;
    case "popular": query = query.order("view_count", { ascending: false }); break;
    case "newest": default: query = query.order("created_at", { ascending: false }); break;
  }

  const { data, count } = await query.range(from, to);

  const games = (data || []).map((g: any) => ({
    ...g,
    categories: g.categories?.filter((gc: any) => gc.categories).map((gc: any) => gc.categories) || [],
  }));

  return NextResponse.json({
    data: games,
    total: count || 0,
    page,
    page_size: limit,
    total_pages: Math.ceil((count || 0) / limit),
  });
}
