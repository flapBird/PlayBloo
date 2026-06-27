import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const game_id = searchParams.get("game_id");
  if (!game_id) {
    return NextResponse.json({ data: [] });
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("game_categories")
    .select("category_id, categories!inner(id, name)")
    .eq("game_id", game_id);

  return NextResponse.json({ data: data || [] });
}
