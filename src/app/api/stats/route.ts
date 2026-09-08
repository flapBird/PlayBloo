import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const { game_id, type } = body;

  if (!game_id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(game_id) || !type) {
    return NextResponse.json({ error: "Missing game_id or type" }, { status: 400 });
  }

  if (!["view", "play", "external_click"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const field = type === "view" ? "view_count" : type === "play" ? "play_count" : "external_click_count";

    // Migration 00005 turns each stat event into a single atomic UPDATE. This
    // avoids the previous read-then-write race and halves database round trips.
    const { error: rpcError } = await supabase.rpc("increment_game_stat", {
      p_game_id: game_id,
      p_stat: type,
    });

    if (!rpcError) return NextResponse.json({ success: true });

    // Compatibility fallback until the migration has been applied.
    const { data: game } = await supabase
      .from("games")
      .select(field)
      .eq("id", game_id)
      .single();

    if (game) {
      const currentValue = game[field as keyof typeof game];
      await supabase
        .from("games")
        .update({ [field]: (typeof currentValue === "number" ? currentValue : 0) + 1 })
        .eq("id", game_id);
    }

    return NextResponse.json({ success: true, mode: "compatibility" });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to record stat" }, { status: 500 });
  }
}
