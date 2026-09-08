import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { data } = await createAdminClient()
    .from("series")
    .select("id, name, slug, sort_order")
    .order("sort_order", { ascending: true });
  return NextResponse.json(
    { data: data || [] },
    { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" } },
  );
}
