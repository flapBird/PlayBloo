import Link from "next/link";
import Image from "next/image";
import { createAdminClient } from "@/lib/supabase/admin";
import { GameCard } from "@/components/games/GameCard";
import { ContinuePlaying } from "@/components/home/ContinuePlaying";
import { GAME_CATEGORIES, SITE_URL } from "@/lib/constants";
import { ArrowRight, Flame, Gamepad2, Layers, Play, Sparkles } from "lucide-react";
import type { Game, Series } from "@/lib/types";

export const revalidate = 60;

type HomeGame = Pick<Game, "id" | "title" | "slug" | "thumbnail_url" | "view_count" | "play_count" | "created_at" | "is_featured">;
type HomeSeries = Pick<Series, "id" | "name" | "slug" | "sort_order"> & {
  thumbnail_url: string | null;
  game_count: number;
};

async function getHomeContent(): Promise<{ featured: HomeGame[]; popular: HomeGame[]; newest: HomeGame[]; series: HomeSeries[] }> {
  try {
    const supabase = createAdminClient();
    if (!supabase) return { featured: [], popular: [], newest: [], series: [] };

    const fields = "id, title, slug, thumbnail_url, view_count, play_count, created_at, is_featured";
    const [featuredRes, popularRes, newestRes, seriesRes, seriesGamesRes] = await Promise.all([
      supabase.from("games").select(fields).eq("is_published", true).eq("is_featured", true).order("created_at", { ascending: false }).limit(5),
      supabase.from("games").select(fields).eq("is_published", true).order("play_count", { ascending: false }).limit(18),
      supabase.from("games").select(fields).eq("is_published", true).order("created_at", { ascending: false }).limit(18),
      supabase.from("series").select("id, name, slug, thumbnail_url, sort_order").order("sort_order", { ascending: true }).limit(8),
      supabase.from("game_series").select("series_id, games!inner(id)").eq("games.is_published", true),
    ]);

    const mapGames = (games: unknown): HomeGame[] => (games || []) as HomeGame[];
    const popular = mapGames(popularRes.data);
    const seriesCounts = new Map<string, number>();
    for (const membership of (seriesGamesRes.data || []) as { series_id: string }[]) {
      seriesCounts.set(membership.series_id, (seriesCounts.get(membership.series_id) || 0) + 1);
    }
    const series = ((seriesRes.data || []) as Omit<HomeSeries, "game_count">[])
      .map((item) => ({ ...item, game_count: seriesCounts.get(item.id) || 0 }))
      .filter((item) => item.game_count >= 2)
      .slice(0, 3);

    return {
      featured: mapGames(featuredRes.data).length ? mapGames(featuredRes.data) : popular.slice(0, 5),
      popular,
      newest: mapGames(newestRes.data),
      series,
    };
  } catch (error) {
    console.error("Could not load home content:", error);
    return { featured: [], popular: [], newest: [], series: [] };
  }
}

function SectionTitle({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <div className="section-heading mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 className="text-2xl font-black tracking-tight text-foreground md:text-3xl">{title}</h2>
      </div>
      <Link href={href} className="group hidden items-center gap-1 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
        Explore all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const { featured, popular, newest, series } = await getHomeContent();
  const leadGame = featured[0];
  const sideGames = featured.slice(1, 5);
  const seriesGridClass = series.length === 1 ? "grid-cols-1" : series.length === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="pb-16">
      {/* Next metadata serializes root canonical URLs as the bare origin. */}
      <link rel="canonical" href={`${SITE_URL}/`} />
      <div className="container mx-auto px-4 pt-5 md:pt-8">
        <section className="home-hero relative overflow-hidden rounded-[2rem] px-6 py-8 text-white md:px-10 md:py-10">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-violet-300" /> Fresh games. Zero downloads.
              </div>
              <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] text-white sm:text-5xl md:text-6xl">
                Your next game<br /><span className="hero-gradient-text">starts here.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-indigo-100/75">Pick up a quick play, find a new obsession, or jump back into a favorite — all in your browser.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/search?sort=trending" className="hero-primary-action inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#17152b] transition-transform hover:-translate-y-0.5">
                  <Flame className="h-4 w-4 text-orange-500" /> See what&apos;s hot
                </Link>
                <Link href="/category" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/10">
                  Browse categories <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {leadGame ? (
              <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                <Link href={`/game/${leadGame.slug}`} className="featured-game group relative row-span-2 min-h-64 overflow-hidden rounded-2xl bg-indigo-900">
                  {leadGame.thumbnail_url && <Image src={leadGame.thumbnail_url} alt="" fill preload sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover transition duration-700 group-hover:scale-110" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="mb-2 inline-block rounded-md bg-violet-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider">Editor&apos;s pick</span>
                    <p className="line-clamp-2 text-lg font-black leading-tight">{leadGame.title}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white/80">Play now <Play className="h-3 w-3 fill-current" /></span>
                  </div>
                </Link>
                {sideGames.map((game, index) => (
                  <Link key={game.id} href={`/game/${game.slug}`} className={`featured-game group relative min-h-30 overflow-hidden rounded-2xl bg-indigo-900 ${index > 1 ? "hidden sm:block" : ""}`}>
                    {game.thumbnail_url && <Image src={game.thumbnail_url} alt="" fill sizes="(max-width: 1024px) 50vw, 20vw" className="object-cover transition duration-500 group-hover:scale-110" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                    <p className="absolute inset-x-0 bottom-0 p-3 text-xs font-extrabold leading-tight line-clamp-2">{game.title}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5"><Gamepad2 className="h-12 w-12 text-violet-300" /></div>
            )}
          </div>
        </section>

        <div className="home-content-stack mt-12 space-y-14">
          <ContinuePlaying />

          <section>
            <SectionTitle eyebrow="Most played" title="Trending right now" href="/search?sort=popular" />
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9">
              {popular.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>

          <section className="genre-panel rounded-[1.75rem] p-5 md:p-7">
            <SectionTitle eyebrow="Find your mood" title="Explore by genre" href="/category" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {GAME_CATEGORIES.slice(0, 12).map((category, index) => (
                <Link key={category.slug} href={`/category/${category.slug}`} className={`group category-tile category-tile-${index % 6}`}>
                  <span>{category.name}</span><ArrowRight className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle eyebrow="Just added" title="New games to try" href="/search?sort=newest" />
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9">
              {newest.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>

          {series.length > 0 && (
            <section className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#171529] p-5 text-white shadow-2xl shadow-indigo-950/15 md:p-7">
              <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

              <div className="relative mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-violet-300">Keep the run going</p>
                  <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">Play the whole series</h2>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-indigo-100/65">Found a favorite? Keep playing through every game in the collection.</p>
                </div>
                <Link href="/series" className="group inline-flex w-fit items-center gap-1.5 text-sm font-bold text-white/70 transition-colors hover:text-white">
                  Browse all series <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className={`relative grid gap-3 ${seriesGridClass}`}>
                {series.map((item) => (
                  <Link key={item.id} href={`/series/${item.slug}`} className="group relative min-h-48 overflow-hidden rounded-2xl border border-white/10 bg-indigo-950/70 shadow-xl shadow-black/10">
                    {item.thumbnail_url ? (
                      <Image src={item.thumbnail_url} alt="" fill sizes={series.length === 1 ? "(max-width: 1280px) 100vw, 1200px" : "(max-width: 640px) 100vw, 50vw"} className="object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-violet-600/30 via-indigo-900 to-slate-950">
                        <Layers className="h-12 w-12 text-violet-200/70" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
                    <div className="absolute inset-0 flex flex-col items-start justify-end p-5">
                      <span className="mb-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white/80 backdrop-blur-sm">
                        {item.game_count} games
                      </span>
                      <h3 className="text-xl font-black text-white md:text-2xl">{item.name}</h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white/70 transition-colors group-hover:text-white">
                        Start the series <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {!popular.length && !newest.length && <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">New games will appear here soon.</div>}
        </div>
      </div>
    </div>
  );
}
