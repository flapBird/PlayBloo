import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "")
    .trim()
    .replace(/[%_(),]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 80);

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const { data } = await createAdminClient()
    .from("games")
    .select("title, slug")
    .eq("is_published", true)
    .or(`title.ilike.%${q}%,slug.ilike.%${q}%`)
    .limit(8);

  return NextResponse.json(
    { suggestions: data || [] },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" } },
  );
}
