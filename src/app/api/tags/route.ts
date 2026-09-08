import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { data } = await createAdminClient()
    .from("tags")
    .select("id, name, slug")
    .order("name", { ascending: true });
  return NextResponse.json(
    { data: data || [] },
    { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" } },
  );
}
