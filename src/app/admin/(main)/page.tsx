import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type RecentGame = { id: string; title: string; slug: string; created_at: string };
type TopGame = { id: string; title: string; slug: string; view_count: number; play_count: number };

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

    return {
      totalGames: gamesCount.count || 0,
      totalCategories: catsCount.count || 0,
      totalTags: tagsCount.count || 0,
      totalSeries: seriesCount.count || 0,
      recentGames: recentGames.data || [],
      topGames: topGames.data || [],
    };
  } catch {
    return {
      totalGames: 0, totalCategories: 0, totalTags: 0, totalSeries: 0,
      recentGames: [], topGames: [],
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
              {(stats.recentGames as RecentGame[]).map((g) => (
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
              {(stats.topGames as TopGame[]).map((g, i) => (
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
    </div>
  );
}
