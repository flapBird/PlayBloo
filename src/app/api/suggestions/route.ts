import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeSearchQuery } from "@/lib/search-query";

export const dynamic = "force-dynamic";

type SuggestionGame = { id: string; title: string; slug: string; thumbnail_url: string | null };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = normalizeSearchQuery(searchParams.get("q") || "");

  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  // Title/slug only, narrow payload: this endpoint feeds the header typeahead
  // on every keystroke, so it must stay cheap and CDN-cacheable.
  const supabase = createAdminClient();
  const titleMatches = await supabase
    .from("games")
    .select("id, title, slug, thumbnail_url")
    .eq("is_published", true)
    .or(`title.ilike.%${q}%,slug.ilike.%${q}%`)
    .order("play_count", { ascending: false })
    .limit(6);

  const suggestions = new Map<string, SuggestionGame>(
    ((titleMatches.data || []) as SuggestionGame[]).map((game) => [game.id, game])
  );

  // Aliases (migration 00011) carry the visitor vocabulary that never appears
  // in a title — Chinese community names like 异宠包裹 → MY SWEET PETS. The
  // table is tiny and the query only runs when titles came up short on
  // matches, so the extra round trip stays rare. Degrades silently when the
  // migration has not been applied yet (404 on the relation).
  if (suggestions.size < 6) {
    const aliasMatches = await supabase
      .from("game_aliases")
      .select("game_id, games!inner(id, title, slug, thumbnail_url)")
      .ilike("alias", `%${q}%`)
      .limit(20);
    for (const row of (aliasMatches.data || []) as Array<{ games: SuggestionGame | SuggestionGame[] | null }>) {
      const games = Array.isArray(row.games) ? row.games : row.games ? [row.games] : [];
      for (const game of games) {
        if (!suggestions.has(game.id)) suggestions.set(game.id, game);
        if (suggestions.size >= 6) break;
      }
      if (suggestions.size >= 6) break;
    }
  }

  return NextResponse.json(
    { suggestions: [...suggestions.values()].slice(0, 6) },
    { headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" } },
  );
}
