import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const supabase = createAdminClient();

    const [gamesCount, catsCount, tagsCount, seriesCount, recentGames, topGames] = await Promise.all([
      supabase.from("games").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("tags").select("*", { count: "exact", head: true }),
      supabase.from("series").select("*", { count: "exact", head: true }),
      supabase.from("games").select("id, title, slug, created_at").eq("is_published", true).order("created_at", { ascending: false }).limit(5),
      supabase.from("games").select("id, title, slug, view_count, play_count").eq("is_published", true).order("view_count", { ascending: false }).limit(5),
    ]);

    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const { data: statsData } = await supabase
      .from("game_stats_daily")
      .select("date, view_count, play_count")
      .gte("date", sevenDaysAgo)
      .order("date", { ascending: false });

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

    return {
      totalGames: gamesCount.count || 0,
      totalCategories: catsCount.count || 0,
      totalTags: tagsCount.count || 0,
      totalSeries: seriesCount.count || 0,
      recentGames: recentGames.data || [],
      topGames: topGames.data || [],
      recentStats,
    };
  } catch {
    return {
      totalGames: 0, totalCategories: 0, totalTags: 0, totalSeries: 0,
      recentGames: [], topGames: [], recentStats: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your game platform</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Games</p>
          <p className="text-3xl font-bold mt-1">{stats.totalGames}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Categories</p>
          <p className="text-3xl font-bold mt-1">{stats.totalCategories}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Tags</p>
          <p className="text-3xl font-bold mt-1">{stats.totalTags}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Series</p>
          <p className="text-3xl font-bold mt-1">{stats.totalSeries}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">Recent Games</h2>
          {stats.recentGames.length > 0 ? (
            <ul className="space-y-2">
              {stats.recentGames.map((g: any) => (
                <li key={g.id} className="text-sm flex justify-between">
                  <span>{g.title}</span>
                  <span className="text-muted-foreground">{new Date(g.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No games yet.</p>
          )}
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">Most Viewed Games</h2>
          {stats.topGames.length > 0 ? (
            <ul className="space-y-2">
              {stats.topGames.map((g: any, i: number) => (
                <li key={g.id} className="text-sm flex justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-muted flex items-center justify-center text-xs font-medium">{i + 1}</span>
                    {g.title}
                  </span>
                  <span className="text-muted-foreground">{g.view_count.toLocaleString()} views</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="font-semibold mb-4">Recent 7 Days Stats</h2>
        {stats.recentStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b"><th className="text-left py-2 font-medium">Date</th><th className="text-right py-2 font-medium">Views</th><th className="text-right py-2 font-medium">Plays</th></tr>
              </thead>
              <tbody>
                {stats.recentStats.map((s) => (
                  <tr key={s.date} className="border-b last:border-0">
                    <td className="py-2">{s.date}</td>
                    <td className="text-right py-2">{s.view_total}</td>
                    <td className="text-right py-2">{s.play_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No stats yet.</p>
        )}
      </div>
    </div>
  );
}
