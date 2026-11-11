import Link from "next/link";
import { Sparkles } from "lucide-react";
import { HOME_PICKS } from "@/lib/priority-pages";

/**
 * "Featured this week" text-link block at the bottom of the homepage. This is
 * the homepage's editorial layer: twelve priority pages, one curated blurb
 * each, rendered as real crawler-visible anchors (the mosaic cards above
 * carry the same games' images, but their anchor text is the image alt).
 */
export function HomePicks() {
  return (
    <section aria-labelledby="home-picks-heading" className="mt-12 border-t pt-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />Editorial picks</p>
          <h2 id="home-picks-heading" className="mt-1 text-2xl font-black tracking-tight">Featured this week</h2>
        </div>
        <p className="hidden max-w-xs text-right text-xs leading-5 text-muted-foreground sm:block">
          Twelve games worth your next click, hand-picked from the catalogue and refreshed as new arrivals prove themselves.
        </p>
      </div>
      <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {HOME_PICKS.map((pick) => (
          <li key={pick.href} className="min-w-0">
            <Link href={pick.href} prefetch={false} className="group inline-flex min-w-0 flex-col">
              <span className="truncate text-sm font-bold group-hover:text-primary">{pick.label}</span>
              <span className="truncate text-xs text-muted-foreground">{pick.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
