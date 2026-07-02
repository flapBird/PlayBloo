import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// GET /api/levels/summary?game_slug=color-block-jam
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameSlug = searchParams.get("game_slug");
  if (!gameSlug) return NextResponse.json({ error: "Missing game_slug" }, { status: 400 });

  const supabase = createAdminClient();

  const { data: game } = await supabase
    .from("games")
    .select("id, title, slug")
    .eq("slug", gameSlug)
    .single();

  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });

  const { data: levels } = await supabase
    .from("game_levels")
    .select("id, level_number, title, slug")
    .eq("game_id", game.id)
    .eq("is_published", true)
    .order("level_number", { ascending: true });

  if (!levels?.length) {
    return NextResponse.json({ game, groups: [], levels: [] });
  }

  const PAGE_SIZE = 50;
  const maxLevel = levels[levels.length - 1].level_number;

  const groups: { label: string; start: number; end: number }[] = [];
  for (let start = 1; start <= maxLevel; start += PAGE_SIZE) {
    const end = Math.min(start + PAGE_SIZE - 1, maxLevel);
    const hasLevels = levels.some(l => l.level_number >= start && l.level_number <= end);
    if (hasLevels) {
      groups.push({ label: `${start}-${end}`, start, end });
    }
  }

  return NextResponse.json({
    game: { id: game.id, title: game.title, slug: game.slug },
    groups,
    levels: levels.map(l => ({
      id: l.id,
      level_number: l.level_number,
      title: l.title,
      slug: l.slug,
    })),
  });
}
