import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();

  const [gamesCount, catsCount, tagsCount, seriesCount] = await Promise.all([
    supabase.from("games").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("tags").select("*", { count: "exact", head: true }),
    supabase.from("series").select("*", { count: "exact", head: true }),
  ]);

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

  const { data: statsData } = await supabase
    .from("game_stats_daily")
    .select("date, view_count, play_count")
    .gte("date", sevenDaysAgo)
    .order("date", { ascending: false });

  // Aggregate by date
  const dateMap = new Map<string, { date: string; view_total: number; play_total: number }>();
  for (const row of statsData || []) {
    const existing = dateMap.get(row.date);
    if (existing) {
      existing.view_total += row.view_count;
      existing.play_total += row.play_count;
    } else {
      dateMap.set(row.date, { date: row.date, view_total: row.view_count, play_total: row.play_count });
    }
  }
  const recentStats = Array.from(dateMap.values()).sort((a, b) => b.date.localeCompare(a.date));

  return NextResponse.json({
    total_games: gamesCount.count || 0,
    total_categories: catsCount.count || 0,
    total_tags: tagsCount.count || 0,
    total_series: seriesCount.count || 0,
    recent_stats: recentStats,
  });
}
