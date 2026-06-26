import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("games")
    .select("title, slug")
    .eq("is_published", true)
    .or(`title.ilike.%${q}%,slug.ilike.%${q}%`)
    .limit(8);

  return NextResponse.json({ suggestions: data || [] });
}
