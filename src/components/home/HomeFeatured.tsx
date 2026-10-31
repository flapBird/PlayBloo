import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Play } from "lucide-react";
import { getDiscoveryStatusBadge, getGamePlayMode, shouldBypassImageOptimization } from "@/lib/game-utils";
import { CoverFallback } from "@/components/games/CoverFallback";
import type { GameCardGame } from "@/components/games/GameCard";

/**
 * The homepage's one big visual anchor: a large spotlight plus two stacked
 * runner-ups, sitting between the hero headline and the discovery feed.
 * Sourced from the trending feed — the games users are actually playing.
 */
export function HomeFeatured({ games }: { games: GameCardGame[] }) {
  if (!games.length) return null;
  const [lead, ...rest] = games;
  const runners = rest.slice(0, 2);

  const leadMode = getGamePlayMode({
    iframe_url: lead.iframe_url || null,
    external_url: lead.external_url || null,
    original_game_url: lead.original_game_url || null,
    official_website_url: lead.official_website_url || null,
  });
  const leadCategory = lead.categories?.[0]?.name;

  return (
    <section aria-label="Featured games" className="mb-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
      <Link
        href={`/game/${lead.slug}`}
        prefetch={false}
        aria-label={`View ${lead.title}`}
        className="group relative flex h-60 overflow-hidden rounded-2xl border bg-card transition-[border-color,box-shadow] duration-150 hover:border-primary/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:h-[300px] motion-reduce:transition-none"
      >
        <span className="absolute inset-0" aria-hidden="true">
          {lead.thumbnail_url ? (
            <Image
              src={lead.thumbnail_url}
              alt=""
              fill
              preload
              unoptimized={shouldBypassImageOptimization(lead.thumbnail_url)}
              className="object-cover object-[right_32%]"
              sizes="(max-width: 1023px) 100vw, 1140px"
            />
          ) : (
            <CoverFallback title={lead.title} />
          )}
        </span>
        {/* Text zone keeps the page background so white/dark text stays readable over any art. */}
        <span
          className="absolute inset-0"
          aria-hidden="true"
          style={{ background: "linear-gradient(90deg, var(--background) 22%, color-mix(in srgb, var(--background) 45%, transparent) 46%, transparent 68%)" }}
        />
        <span className="relative z-10 flex flex-col justify-end gap-2.5 p-5 md:gap-3 md:p-7">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary">
            Trending now
          </span>
          <span className="max-w-md text-xl font-black leading-tight tracking-tight md:text-2xl">{lead.title}</span>
          <span className="flex flex-wrap items-center gap-2">
            {leadCategory && <span className="rounded-full border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">{leadCategory}</span>}
            {leadMode === "embedded" && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
                <Play className="h-3 w-3 fill-current" aria-hidden="true" /> Play here
              </span>
            )}
            {leadMode === "external" && (
              <span className="inline-flex items-center gap-1 rounded-full border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground">
                <ExternalLink className="h-3 w-3" aria-hidden="true" /> External
              </span>
            )}
          </span>
          <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-extrabold text-white transition-colors group-hover:bg-primary/90">
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            Play now
          </span>
        </span>
      </Link>

      {runners.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {runners.map((game) => {
            const badge = getDiscoveryStatusBadge(game);
            return (
              <Link
                key={game.id}
                href={`/game/${game.slug}`}
                prefetch={false}
                aria-label={`View ${game.title}`}
                className="group flex items-center gap-3.5 rounded-2xl border bg-card p-3.5 transition-[border-color] duration-150 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
              >
                <span className="relative h-[94px] w-[118px] shrink-0 overflow-hidden rounded-xl border bg-muted" aria-hidden="true">
                  {game.thumbnail_url ? (
                    <Image
                      src={game.thumbnail_url}
                      alt=""
                      fill
                      loading="lazy"
                      unoptimized={shouldBypassImageOptimization(game.thumbnail_url)}
                      className="object-cover"
                      sizes="118px"
                    />
                  ) : (
                    <CoverFallback title={game.title} />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5">
                    {badge && (
                      <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.06em] text-primary">
                        {badge === "TRENDING" ? "Trending" : badge.charAt(0) + badge.slice(1).toLowerCase()}
                      </span>
                    )}
                    <span className="truncate text-xs text-muted-foreground">{game.categories?.[0]?.name || "Browser game"}</span>
                  </span>
                  <span className="mt-1 block truncate text-[15px] font-bold">{game.title}</span>
                  <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    Play
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
