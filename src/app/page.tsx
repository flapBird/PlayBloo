import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { GameCard } from "@/components/games/GameCard";
import { ContinuePlaying } from "@/components/home/ContinuePlaying";
import { GAME_CATEGORIES } from "@/lib/constants";
import { ArrowRight, Flame, Gamepad2, Play, Sparkles } from "lucide-react";
import type { Category, Game } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "https://playbloo.net/" },
};

async function getHomeContent(): Promise<{ featured: Game[]; popular: Game[]; newest: Game[] }> {
  try {
    const supabase = createAdminClient();
    if (!supabase) return { featured: [], popular: [], newest: [] };

    const fields = "id, title, slug, thumbnail_url, view_count, play_count, created_at, is_featured, categories:game_categories(category_id, categories:categories(*))";
    const [featuredRes, popularRes, newestRes] = await Promise.all([
      supabase.from("games").select(fields).eq("is_published", true).eq("is_featured", true).order("created_at", { ascending: false }).limit(5),
      supabase.from("games").select(fields).eq("is_published", true).order("play_count", { ascending: false }).limit(18),
      supabase.from("games").select(fields).eq("is_published", true).order("created_at", { ascending: false }).limit(18),
    ]);

    type RawGame = Game & { categories?: { categories?: Category | null }[] };
    const mapGames = (games: RawGame[]) => (games || []).map((game) => ({
      ...game,
      categories: (game.categories || []).flatMap((entry) => entry.categories ? [entry.categories] : []),
    })) as Game[];
    const popular = mapGames((popularRes.data || []) as RawGame[]);
    return {
      featured: mapGames((featuredRes.data || []) as RawGame[]).length ? mapGames((featuredRes.data || []) as RawGame[]) : popular.slice(0, 5),
      popular,
      newest: mapGames((newestRes.data || []) as RawGame[]),
    };
  } catch (error) {
    console.error("Could not load home content:", error);
    return { featured: [], popular: [], newest: [] };
  }
}

function SectionTitle({ eyebrow, title, href }: { eyebrow: string; title: string; href: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
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
  const { featured, popular, newest } = await getHomeContent();
  const leadGame = featured[0];
  const sideGames = featured.slice(1, 5);

  return (
    <div className="pb-16">
      <div className="container mx-auto px-4 pt-5 md:pt-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#151426] px-6 py-8 text-white shadow-2xl shadow-indigo-950/20 md:px-10 md:py-10">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/85 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-violet-300" /> Fresh games. Zero downloads.
              </div>
              <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl md:text-6xl">
                Your next game<br /><span className="text-violet-300">starts here.</span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-indigo-100/75">Pick up a quick play, find a new obsession, or jump back into a favorite — all in your browser.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/search?sort=trending" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[#17152b] transition-transform hover:-translate-y-0.5">
                  <Flame className="h-4 w-4 text-orange-500" /> See what&apos;s hot
                </Link>
                <Link href="/category" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
                  Browse categories <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {leadGame ? (
              <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                <Link href={`/game/${leadGame.slug}`} className="group relative row-span-2 min-h-64 overflow-hidden rounded-2xl bg-indigo-900">
                  {leadGame.thumbnail_url && <Image src={leadGame.thumbnail_url} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover transition duration-700 group-hover:scale-110" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="mb-2 inline-block rounded-md bg-violet-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider">Editor&apos;s pick</span>
                    <p className="line-clamp-2 text-lg font-black leading-tight">{leadGame.title}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-white/80">Play now <Play className="h-3 w-3 fill-current" /></span>
                  </div>
                </Link>
                {sideGames.map((game) => (
                  <Link key={game.id} href={`/game/${game.slug}`} className="group relative min-h-30 overflow-hidden rounded-2xl bg-indigo-900">
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

        <div className="mt-12 space-y-14">
          <ContinuePlaying />

          <section>
            <SectionTitle eyebrow="Most played" title="Trending right now" href="/search?sort=popular" />
            <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9">
              {popular.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-border/70 bg-card/75 p-5 shadow-sm md:p-7">
            <SectionTitle eyebrow="Find your mood" title="Explore by genre" href="/category" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {GAME_CATEGORIES.slice(0, 12).map((category, index) => (
                <Link key={category.slug} href={`/category/${category.slug}`} className={`category-tile category-tile-${index % 6}`}>
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

          {!popular.length && !newest.length && <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">New games will appear here soon.</div>}
        </div>
      </div>
    </div>
  );
}
