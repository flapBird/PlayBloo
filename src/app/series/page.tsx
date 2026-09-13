import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_NAME } from "@/lib/constants";
import { ArrowRight, Layers } from "lucide-react";

type SeriesCard = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  game_count: number;
};

export const metadata = {
  title: "Game Series",
  description: `Browse all game series on ${SITE_NAME}. Play complete game collections.`,
   alternates: {
     canonical: "/series",
   },
};

export const revalidate = 1800;

export default async function SeriesListPage() {
  const supabase = createAdminClient();
  const [seriesRes, seriesGamesRes] = await Promise.all([
    supabase
      .from("series")
      .select("id, name, slug, sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("game_series")
      .select("series_id, games!inner(id)")
      .eq("games.is_published", true),
  ]);

  const gameCounts = new Map<string, number>();
  for (const membership of (seriesGamesRes.data || []) as { series_id: string }[]) {
    gameCounts.set(membership.series_id, (gameCounts.get(membership.series_id) || 0) + 1);
  }

  const series = ((seriesRes.data || []) as Omit<SeriesCard, "game_count">[])
    .map((item) => ({ ...item, game_count: gameCounts.get(item.id) || 0 }))
    .filter((item) => item.game_count > 0);
  return (
    <div className="container mx-auto space-y-8 px-4 py-8 md:py-10">
      <div className="max-w-2xl border-b pb-6">
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Complete collections</p>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">Game Series</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">Explore originals, sequels and spin-offs in each collection.</p>
      </div>

      {series.length > 0 ? (
        <div className="grid max-w-5xl gap-3 md:grid-cols-2">
          {series.map((item) => (
            <Link
              key={item.id}
              href={`/series/${item.slug}`}
              className="group flex min-h-24 items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-primary/45"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary"><Layers className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg font-black transition-colors group-hover:text-primary">{item.name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{item.game_count} game{item.game_count === 1 ? "" : "s"} in this collection</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card/70 p-12 text-center text-muted-foreground">
          Game series will appear here soon.
        </div>
      )}
    </div>
  );
}
