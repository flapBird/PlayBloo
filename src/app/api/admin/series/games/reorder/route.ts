import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// POST /api/admin/series/games/reorder
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { series_id, orders } = body;
  if (!series_id || !orders?.length) {
    return NextResponse.json({ error: "Missing series_id or orders" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Update each game's sort_order in parallel
  await Promise.all(
    orders.map((o: { game_id: string; sort_order: number }) =>
      supabase
        .from("game_series")
        .update({ sort_order: o.sort_order })
        .eq("series_id", series_id)
        .eq("game_id", o.game_id)
    )
  );

  return NextResponse.json({ success: true });
}
