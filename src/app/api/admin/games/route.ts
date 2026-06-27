import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = createAdminClient();

  // Single game lookup by id
  const id = searchParams.get("id");
  if (id) {
    const { data } = await supabase.from("games").select("*").eq("id", id).single();
    return NextResponse.json({ data: data || null });
  }

  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const search = searchParams.get("q") || "";
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("games").select("*", { count: "exact" });
  if (search) query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`);
  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, count } = await query;

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    page,
    page_size: limit,
    total_pages: Math.ceil((count || 0) / limit),
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("games").insert([body]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, category_ids, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("games").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (category_ids) {
    await supabase.from("game_categories").delete().eq("game_id", id);
    if (category_ids.length > 0) {
      await supabase.from("game_categories").insert(
        category_ids.map((catId: string) => ({ game_id: id, category_id: catId }))
      );
    }
  }

  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
