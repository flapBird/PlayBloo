import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// GET /api/admin/series/games?series_id=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const seriesId = searchParams.get("series_id");
  if (!seriesId) return NextResponse.json({ error: "Missing series_id" }, { status: 400 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("game_series")
    .select("game_id, sort_order, games:games!inner(id, title, slug, thumbnail_url)")
    .eq("series_id", seriesId)
    .order("sort_order", { ascending: true });

  const games = (data || []).map((r: any) => r.games).filter(Boolean);
  return NextResponse.json({ data: games });
}

// POST /api/admin/series/games
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { series_id, game_id } = body;
  if (!series_id || !game_id) {
    return NextResponse.json({ error: "Missing series_id or game_id" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Get current max sort_order
  const { data: existing } = await supabase
    .from("game_series")
    .select("sort_order")
    .eq("series_id", series_id)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1;

  const { error } = await supabase.from("game_series").insert([{
    series_id,
    game_id,
    sort_order: nextOrder,
  }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true }, { status: 201 });
}

// DELETE /api/admin/series/games
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { series_id, game_id } = body;
  if (!series_id || !game_id) {
    return NextResponse.json({ error: "Missing series_id or game_id" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("game_series")
    .delete()
    .eq("series_id", series_id)
    .eq("game_id", game_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
