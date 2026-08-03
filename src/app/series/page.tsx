import Link from "next/link";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SITE_NAME } from "@/lib/constants";
import { ArrowRight, Layers } from "lucide-react";

type SeriesCard = {
  id: string;
  name: string;
  slug: string;
  thumbnail_url: string | null;
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

export default async function SeriesListPage() {
  const supabase = await createServerSupabaseClient();
  const [seriesRes, seriesGamesRes] = await Promise.all([
    supabase
      .from("series")
      .select("id, name, slug, thumbnail_url, sort_order")
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

  const series = ((seriesRes.data || []) as Omit<SeriesCard, "game_count">[]).map((item) => ({
    ...item,
    game_count: gameCounts.get(item.id) || 0,
  }));
  const gridClass = series.length <= 2
    ? "max-w-2xl grid-cols-2"
    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

  return (
    <div className="container mx-auto space-y-8 px-4 py-10 md:py-14">
      <div className="max-w-2xl">
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Complete collections</p>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">Game Series</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">Find every game in a collection and play the series in order.</p>
      </div>

      {series.length > 0 ? (
        <div className={`grid gap-4 md:gap-5 ${gridClass}`}>
          {series.map((item, index) => (
            <Link
              key={item.id}
              href={`/series/${item.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/70 bg-indigo-950 shadow-lg shadow-indigo-950/10 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-indigo-950/20">
                {item.thumbnail_url ? (
                  <Image
                    src={item.thumbnail_url}
                    alt={`${item.name} game series`}
                    fill
                    preload={series.length <= 2 || index === 0}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-violet-500 via-indigo-700 to-slate-950">
                    <Layers className="h-12 w-12 text-white/65" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-black/5" />
                <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                  {item.game_count} game{item.game_count === 1 ? "" : "s"}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <h2 className="text-lg font-black leading-tight text-white md:text-xl">{item.name}</h2>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white/70 transition-colors group-hover:text-white">
                    View series <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
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
