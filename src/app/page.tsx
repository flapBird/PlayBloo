import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { GameCardGame } from "@/components/games/GameCard";
import { HomeDiscovery } from "@/components/home/HomeDiscovery";
import { HomeLibraryPanel } from "@/components/home/HomeLibraryPanel";
import { HomeGuideFeature } from "@/components/guides/HomeGuideFeature";
import { getHomeContent } from "@/lib/home-feeds";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

type HomeGame = GameCardGame;

function CompactRanking({
  title,
  eyebrow,
  games,
  href,
}: {
  title: string;
  eyebrow: string;
  games: HomeGame[];
  href: string;
}) {
  if (!games.length) return null;

  return (
    <section className="discovery-side-panel">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <h2 className="text-base font-extrabold tracking-tight">{title}</h2>
        <Link href={href} prefetch={false} className="text-xs font-bold text-muted-foreground hover:text-primary">View all</Link>
      </div>
      <ol className="mt-3 divide-y divide-border/70">
        {games.map((game, index) => (
          <li key={game.id}>
            <Link href={`/game/${game.slug}`} prefetch={false} className="group flex items-center gap-3 py-3">
              <span className="w-5 shrink-0 text-center text-xs font-black text-muted-foreground/70">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold transition-colors group-hover:text-primary">{game.title}</span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                  {game.categories?.[0]?.name || "Browser game"} · {(game.play_count || 0).toLocaleString()} plays
                </span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default async function HomePage() {
  const { feeds, playable } = await getHomeContent();

  return (
    <div className="home-page pb-8">
      <div className="container mx-auto px-4 pt-5 md:pt-7">
        <section className="home-intro">
          <div className="max-w-2xl">
            <h1 className="home-title">
              Discover your next game.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              New browser games, ready to play. No download required.
            </p>
          </div>
        </section>


        <HomeDiscovery
          feeds={feeds}
          sidebar={
            <aside key="home-sidebar" className="home-sidebar space-y-5 lg:sticky lg:top-24">
              <HomeGuideFeature />
              <CompactRanking title="Play instantly" eyebrow="No download required" games={playable.slice(0, 4)} href="/search?playMode=embedded" />
              <Link href="/category" className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary">
                Browse all genres <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          }
        />
        <HomeLibraryPanel />
      </div>
    </div>
  );
}
