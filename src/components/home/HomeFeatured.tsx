import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Play } from "lucide-react";
import { getGamePlayMode, shouldBypassImageOptimization } from "@/lib/game-utils";
import { getLatestGuideTopic } from "@/lib/guides";
import { CoverFallback } from "@/components/games/CoverFallback";
import type { GameCardGame } from "@/components/games/GameCard";

/**
 * The homepage's one big visual anchor: the #1 trending game on a double tile,
 * two runner-up covers, and a Game Guides promo riding in the same mosaic so
 * the guides hub gets first-screen visibility. Sourced from the trending feed.
 */
export function HomeFeatured({ games }: { games: GameCardGame[] }) {
  if (!games.length) return null;
  const [lead, ...rest] = games;
  const runners = rest.slice(0, 2);
  const guideTopic = getLatestGuideTopic();

  const leadMode = getGamePlayMode({
    iframe_url: lead.iframe_url || null,
    external_url: lead.external_url || null,
    original_game_url: lead.original_game_url || null,
    official_website_url: lead.official_website_url || null,
  });
  const leadCategory = lead.categories?.[0]?.name;

  return (
    <section aria-label="Trending games and guides" className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Link
        href={`/game/${lead.slug}`}
        prefetch={false}
        aria-label={`View ${lead.title}`}
        className="group relative col-span-2 flex aspect-[16/10] overflow-hidden rounded-2xl border bg-card transition-[border-color,box-shadow] duration-150 hover:border-primary/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:row-span-2 lg:aspect-auto motion-reduce:transition-none"
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
              sizes="(max-width: 1023px) 100vw, 620px"
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
        <span className="relative z-10 flex flex-col justify-end gap-2 p-4 md:gap-2.5 md:p-6">
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
          <span className="mt-1 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-extrabold text-white transition-colors group-hover:bg-primary/90 md:px-5 md:py-2.5">
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            Play now
          </span>
        </span>
      </Link>

      {runners.map((game) => (
        <Link
          key={game.id}
          href={`/game/${game.slug}`}
          prefetch={false}
          aria-label={`View ${game.title}`}
          className="group relative flex aspect-[16/9] overflow-hidden rounded-xl border bg-card transition-[border-color] duration-150 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
        >
          {game.thumbnail_url ? (
            <Image
              src={game.thumbnail_url}
              alt=""
              fill
              loading="lazy"
              unoptimized={shouldBypassImageOptimization(game.thumbnail_url)}
              className="object-cover transition-transform duration-200 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
              sizes="(max-width: 640px) 50vw, 300px"
            />
          ) : (
            <CoverFallback title={game.title} />
          )}
          <span className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/80 via-black/35 to-transparent px-2.5 pb-1.5 pt-7" aria-hidden="true"></span>
          <span className="absolute inset-x-0 bottom-0 truncate px-2.5 pb-1.5 text-xs font-bold text-white">{game.title}</span>
        </Link>
      ))}

      {guideTopic && (
        <Link
          href="/guides"
          aria-label="Explore game guides"
          className="group relative col-span-2 flex aspect-[16/6] overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-br from-accent to-card transition-[border-color] duration-150 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:aspect-auto motion-reduce:transition-none"
        >
          <span className="absolute inset-y-0 right-0 w-[42%]" aria-hidden="true" style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 30%)", WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 30%)" }}>
            <Image src={guideTopic.cover.src} alt="" fill loading="lazy" className="object-cover" sizes="260px" />
          </span>
          <span className="relative z-10 flex min-w-0 flex-1 flex-col justify-center gap-1 p-4 md:p-5">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-primary">Guides</span>
            <span className="text-base font-extrabold tracking-tight md:text-lg">Game Guides: get good, faster</span>
            <span className="line-clamp-1 text-xs text-muted-foreground md:text-sm">Release dates, tips and getting-started help{guideTopic ? ` · Latest: ${guideTopic.name}` : ""}</span>
            <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-bold text-primary md:text-sm">
              Explore guides
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </span>
          </span>
        </Link>
      )}
    </section>
  );
}
