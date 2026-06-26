import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const limit = Math.min(parseInt(searchParams.get("limit") || "24"), 100);

  const supabase = await createServerSupabaseClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("games")
    .select("*", { count: "exact" })
    .eq("is_published", true);

  if (q) {
    query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
  }

  switch (sort) {
    case "trending": query = query.order("hot_score", { ascending: false }); break;
    case "popular": query = query.order("view_count", { ascending: false }); break;
    case "newest": default: query = query.order("created_at", { ascending: false }); break;
  }

  const { data, count } = await query.range(from, to);

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    page,
    page_size: limit,
    total_pages: Math.ceil((count || 0) / limit),
  });
}
