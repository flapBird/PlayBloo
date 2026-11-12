import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CoverFallback } from "@/components/games/CoverFallback";
import { HOME_PICKS } from "@/lib/priority-pages";
import { shouldBypassImageOptimization } from "@/lib/game-utils";
import type { HomePickGame } from "@/lib/home-feeds";

/**
 * "Featured this week" at the bottom of the homepage: twelve curated priority
 * games as compact cover-and-copy cards — visual enough to read as an
 * editorial strip, distinct from the big discovery grids above. Curated
 * blurbs come from priority-pages; titles and covers from the catalogue.
 */
export function HomePicks({ games }: { games: HomePickGame[] }) {
  const bySlug = new Map(games.map((game) => [game.slug, game]));
  const picks = HOME_PICKS.flatMap((pick) => {
    const game = bySlug.get(pick.slug);
    return game ? [{ ...game, blurb: pick.blurb }] : [];
  });
  if (!picks.length) return null;

  return (
    <section aria-labelledby="home-picks-heading" className="mt-12 border-t pt-8">
      <div>
        <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />Editorial picks</p>
        <h2 id="home-picks-heading" className="mt-1 text-2xl font-black tracking-tight">Featured this week</h2>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {picks.map((pick) => (
          <li key={pick.slug} className="min-w-0">
            <Link href={`/game/${pick.slug}`} prefetch={false} aria-label={`View ${pick.title}`}
              className="group flex items-center gap-3 rounded-xl border bg-card p-2.5 transition-[border-color] duration-150 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
              <span className="relative block h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-muted" aria-hidden="true">
                {pick.thumbnail_url ? (
                  <Image
                    src={pick.thumbnail_url}
                    alt=""
                    fill
                    loading="lazy"
                    unoptimized={shouldBypassImageOptimization(pick.thumbnail_url)}
                    className="object-cover transition-transform duration-200 group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
                    sizes="(max-width: 640px) 80px, (max-width: 1024px) 80px, 80px"
                  />
                ) : (
                  <CoverFallback title={pick.title} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold transition-colors group-hover:text-primary">{pick.title}</span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">{pick.blurb}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
