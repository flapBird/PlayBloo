import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// Level rows feed the sitemap through a cached read; a publish, edit or
// delete must drop that entry or the URL set goes stale for up to an hour.
function invalidateSitemapLevels() {
  revalidateTag("sitemap-levels", { expire: 0 });
  revalidatePath("/sitemap.xml");
}

// GET /api/admin/levels?game_id=xxx
export async function GET(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get("game_id");
  if (!gameId) return NextResponse.json({ error: "Missing game_id" }, { status: 400 });

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("game_levels")
    .select("*")
    .eq("game_id", gameId)
    .order("level_number", { ascending: true });

  return NextResponse.json({ data: data || [] });
}

// POST /api/admin/levels
export async function POST(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const supabase = createAdminClient();
  const { error } = await supabase.from("game_levels").insert([body]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  invalidateSitemapLevels();
  return NextResponse.json({ success: true }, { status: 201 });
}

// PUT /api/admin/levels
export async function PUT(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("game_levels").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  invalidateSitemapLevels();
  return NextResponse.json({ success: true });
}

// DELETE /api/admin/levels?id=xxx
export async function DELETE(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("game_levels").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  invalidateSitemapLevels();
  return NextResponse.json({ success: true });
}
