import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// GET /api/levels?game_id=xxx&q=xxx&page=1&limit=20
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get("game_id");
  const gameIds = searchParams.getAll("game_id"); // support multiple
  const q = searchParams.get("q") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("game_levels")
    .select("id, game_id, level_number, title, slug, thumbnail_url, tips, meta_description, video_url, view_count, created_at, games!inner(slug)", { count: "exact" })
    .eq("is_published", true)
    .order("level_number", { ascending: true });

  // Use multiple game_ids if provided, otherwise single
  const allIds = gameIds.length > 0 ? gameIds : (gameId ? [gameId] : []);
  if (allIds.length > 0) {
    query = query.in("game_id", allIds);
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,meta_description.ilike.%${q}%`);
  }

  const { data, count } = await query.range(from, to);

  // Flatten games slug into level result
  const flattened = (data || []).map((l: any) => {
    const { games, ...rest } = l;
    return {
      ...rest,
      game_slug: games?.slug || "",
    };
  });

  return NextResponse.json({
    data: flattened,
    total: count || 0,
    page,
    page_size: limit,
    total_pages: Math.ceil((count || 0) / limit),
  });
}
