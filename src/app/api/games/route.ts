import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { PAGE_SIZE } from "@/lib/constants";
import { normalizePublicGameCards, PUBLIC_GAME_CARD_FIELDS } from "@/lib/discovery-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category");
  const playMode = searchParams.get("playMode");
  const ids = (searchParams.get("ids") || "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => /^[0-9a-f-]{36}$/i.test(id))
    .slice(0, 30);
  const limit = Math.min(parseInt(searchParams.get("limit") || String(PAGE_SIZE)), 100);

  const supabase = createAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("games")
    .select(PUBLIC_GAME_CARD_FIELDS, { count: "exact" })
    .eq("is_published", true);

  if (ids.length) query = query.in("id", ids);

  if (playMode === "embedded") {
    query = query.not("iframe_url", "is", null).neq("iframe_url", "");
  }

  if (category) {
    query = query.eq("game_categories.category_id", category);
  }

  switch (sort) {
    case "trending": query = query.order("view_count", { ascending: false }); break;
    case "popular": query = query.order("view_count", { ascending: false }); break;
    case "newest": default: query = query.order("created_at", { ascending: false }); break;
  }

  const { data, count, error } = await query.range(from, to);
  if (error) return NextResponse.json({ error: "Could not load games" }, { status: 500 });

  const games = normalizePublicGameCards(data);

  if (ids.length) {
    const order = new Map(ids.map((id, index) => [id, index]));
    games.sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
  }

  return NextResponse.json(
    {
      data: games,
      total: count || 0,
      page,
      page_size: limit,
      total_pages: Math.ceil((count || 0) / limit),
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800" } },
  );
}
