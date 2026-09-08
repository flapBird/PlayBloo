import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const result = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
  return result || null;
}

function httpUrl(value: unknown): string | null {
  const result = text(value, 2048);
  if (!result) return null;
  try {
    const url = new URL(result);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function publishedTimestamp(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime()) || date.getTime() > Date.now() + 5 * 60 * 1000) return null;
  return date.toISOString();
}

async function syncGameLastUpdated(gameId: string) {
  const supabase = createAdminClient();
  const { data: latest } = await supabase.from("game_updates").select("published_at").eq("game_id", gameId).lte("published_at", new Date().toISOString()).order("published_at", { ascending: false }).limit(1).maybeSingle();
  const { data: game } = await supabase.from("games").update({ last_updated_at: latest?.published_at || null }).eq("id", gameId).select("slug").single();
  revalidatePath("/"); revalidatePath("/search");
  if (game?.slug) revalidatePath(`/game/${game.slug}`);
}

export async function GET(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const gameId = request.nextUrl.searchParams.get("game_id");
  if (!gameId) return NextResponse.json({ error: "Missing game_id" }, { status: 400 });
  const { data, error } = await createAdminClient().from("game_updates").select("*").eq("game_id", gameId).order("published_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data: data || [] });
}

export async function POST(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const title = text(body.title, 180);
  const publishedAt = publishedTimestamp(body.published_at);
  if (!body.game_id || !title || !publishedAt) return NextResponse.json({ error: "Game, title and a valid past publish date are required." }, { status: 400 });
  const sourceUrl = httpUrl(body.source_url);
  if (text(body.source_url, 2048) && !sourceUrl) return NextResponse.json({ error: "Update source must be a valid HTTP or HTTPS URL." }, { status: 400 });
  const payload = { game_id: body.game_id, version: text(body.version, 80), title, summary: text(body.summary, 5000), published_at: publishedAt, source_url: sourceUrl };
  const { data, error } = await createAdminClient().from("game_updates").insert([payload]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await syncGameLastUpdated(body.game_id);
  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!body.id || !body.game_id) return NextResponse.json({ error: "Missing update id or game id." }, { status: 400 });
  const title = text(body.title, 180);
  const publishedAt = publishedTimestamp(body.published_at);
  if (!title || !publishedAt) return NextResponse.json({ error: "Title and a valid past publish date are required." }, { status: 400 });
  const sourceUrl = httpUrl(body.source_url);
  if (text(body.source_url, 2048) && !sourceUrl) return NextResponse.json({ error: "Update source must be a valid HTTP or HTTPS URL." }, { status: 400 });
  const payload = { version: text(body.version, 80), title, summary: text(body.summary, 5000), published_at: publishedAt, source_url: sourceUrl, updated_at: new Date().toISOString() };
  const { error } = await createAdminClient().from("game_updates").update(payload).eq("id", body.id).eq("game_id", body.game_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await syncGameLastUpdated(body.game_id);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = request.nextUrl.searchParams.get("id");
  const gameId = request.nextUrl.searchParams.get("game_id");
  if (!id || !gameId) return NextResponse.json({ error: "Missing update id or game id." }, { status: 400 });
  const { error } = await createAdminClient().from("game_updates").delete().eq("id", id).eq("game_id", gameId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await syncGameLastUpdated(gameId);
  return NextResponse.json({ success: true });
}
