import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type SlotInput = { position?: unknown; game_id?: unknown };

function parseSlots(body: Record<string, unknown>): { slots: { position: number; game_id: string }[]; error: string | null } {
  const raw = body.slots;
  if (!Array.isArray(raw)) return { slots: [], error: "slots must be an array" };
  const seenPositions = new Set<number>();
  const seenGames = new Set<string>();
  const slots: { position: number; game_id: string }[] = [];
  for (const entry of raw as SlotInput[]) {
    const position = Number(entry?.position);
    const game_id = typeof entry?.game_id === "string" ? entry.game_id.trim() : "";
    if (!Number.isInteger(position) || position < 1 || position > 5) {
      return { slots: [], error: "position must be an integer between 1 and 5" };
    }
    if (seenPositions.has(position)) return { slots: [], error: `duplicate position ${position}` };
    if (!game_id) return { slots: [], error: `position ${position} is missing game_id` };
    if (seenGames.has(game_id)) return { slots: [], error: "the same game cannot occupy two positions" };
    seenPositions.add(position);
    seenGames.add(game_id);
    slots.push({ position, game_id });
  }
  return { slots, error: null };
}

// GET /api/admin/home-featured — current curated slots with game summaries.
export async function GET() {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("home_featured_slots")
    .select("position, game:games(id, title, slug, thumbnail_url, is_published)")
    .order("position", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const slots = (data || []).map((row: { position: number; game: unknown }) => ({
    position: row.position,
    game: Array.isArray(row.game) ? row.game[0] ?? null : row.game ?? null,
  }));
  return NextResponse.json({ slots });
}

// PUT /api/admin/home-featured — replace the whole curated set (unset
// positions fall back to the trending feed on the homepage).
export async function PUT(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const { slots, error } = parseSlots(body as Record<string, unknown>);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const supabase = createAdminClient();
  if (slots.length) {
    const ids = [...new Set(slots.map((slot) => slot.game_id))];
    const { data: games, error: gamesError } = await supabase.from("games").select("id").in("id", ids);
    if (gamesError) return NextResponse.json({ error: gamesError.message }, { status: 500 });
    const known = new Set((games || []).map((game) => game.id));
    const missing = ids.filter((id) => !known.has(id));
    if (missing.length) return NextResponse.json({ error: `Unknown game id: ${missing.join(", ")}` }, { status: 400 });
  }

  // The table is at most five rows, so a full replace keeps positions
  // authoritative without upsert bookkeeping (same pattern as relation tables).
  const { error: deleteError } = await supabase.from("home_featured_slots").delete().neq("position", 0);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
  if (slots.length) {
    const { error: insertError } = await supabase.from("home_featured_slots").insert(slots);
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  }
  revalidatePath("/");
  return NextResponse.json({ slots });
}
