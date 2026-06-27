import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { game_id, type } = body;

  if (!game_id || !type) {
    return NextResponse.json({ error: "Missing game_id or type" }, { status: 400 });
  }

  if (!["view", "play"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const field = type === "view" ? "view_count" : "play_count";

    const { data: game } = await supabase
      .from("games")
      .select(field)
      .eq("id", game_id)
      .single();

    if (game) {
      await supabase
        .from("games")
        .update({ [field]: (game as any)[field] + 1 })
        .eq("id", game_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to record stat" }, { status: 500 });
  }
}
