import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ArrowRight, Eye, Gamepad2 } from "lucide-react";
import { getDiscoveryStatusBadge, getGamePlayMode, shouldBypassImageOptimization } from "@/lib/game-utils";
import type { GameCardGame } from "@/components/games/GameCard";

interface GameListItemProps {
  game: GameCardGame;
  badges?: string[];
  eagerImage?: boolean;
  featured?: boolean;
  position?: number;
  categorySlug?: string;
  dateField?: "added" | "released" | "updated";
}

function formatCount(value: number | undefined): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
}

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en", { month: "short", day: "numeric" });
}

export function GameListItem({
  game,
  badges = [],
  eagerImage = false,
  featured = false,
  position,
  categorySlug,
  dateField = "added",
}: GameListItemProps) {
  const playMode = getGamePlayMode({
    iframe_url: game.iframe_url || null,
    external_url: game.external_url || null,
    original_game_url: game.original_game_url || null,
    official_website_url: game.official_website_url || null,
  });
  const primaryCategory = game.categories?.find((item) => item.slug === categorySlug) || game.categories?.[0];
  const verifiedSummary = game.content_verified
    ? game.short_description || game.description
    : null;
  const factualFallback = `${primaryCategory?.name || "Browser"} game${
    playMode === "embedded"
      ? " you can launch directly on PlayBloo."
      : playMode === "external"
        ? " with an external play link."
        : ". Source verification is still in progress."
  }`;
  const rawDate = dateField === "released" ? game.release_date : dateField === "updated" ? game.last_updated_at : game.added_at || game.created_at;
  const date = formatDate(rawDate);
  const dateLabel = dateField === "released" ? "Released" : dateField === "updated" ? "Updated" : "Added";
  const modeBadge = playMode === "embedded" ? "PLAY HERE" : playMode === "external" ? "EXTERNAL" : null;
  const statusBadge = getDiscoveryStatusBadge(game);
  const visibleBadges = [...new Set([...badges, ...(statusBadge ? [statusBadge] : []), ...(modeBadge ? [modeBadge] : [])])].slice(0, 2);

  return (
    <article className={`discovery-row group ${featured ? "is-featured" : ""}`}>
      <Link
        href={`/game/${game.slug}`}
        prefetch={false}
        aria-label={`View ${game.title}`}
        className="discovery-row-media relative block overflow-hidden bg-muted"
      >
        {game.thumbnail_url ? (
          <Image
            src={game.thumbnail_url}
            alt=""
            fill
            loading={eagerImage ? "eager" : "lazy"}
            unoptimized={shouldBypassImageOptimization(game.thumbnail_url)}
            className="object-cover transition-opacity duration-150 group-hover:opacity-90"
            sizes="(max-width: 640px) 112px, 190px"
          />
        ) : (
          <span className="flex h-full items-center justify-center bg-card">
            <Gamepad2 className="h-7 w-7 text-primary/30" aria-hidden="true" />
          </span>
        )}
        {position && (
          <span className="absolute left-2 top-2 grid h-6 min-w-6 place-items-center rounded-md border border-white/15 bg-black/75 px-1 text-[10px] font-black text-white">
            {position}
          </span>
        )}
      </Link>

      <div className="min-w-0 py-0.5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/game/${game.slug}`} prefetch={false} className="block">
              <h2 className="truncate text-base font-extrabold tracking-tight transition-colors group-hover:text-primary sm:text-lg">
                {game.title}
              </h2>
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              {visibleBadges.map((badge) => (
                <span key={badge} className={`discovery-badge ${badge === "PLAY HERE" ? "is-playable" : badge === "TRENDING" ? "is-trending" : ""}`}>
                  {badge}
                </span>
              ))}
              {primaryCategory && (
                <Link href={`/category/${primaryCategory.slug}`} prefetch={false} className="discovery-tag hover:text-foreground">
                  {primaryCategory.name}
                </Link>
              )}
            </div>
          </div>

          <Link
            href={`/game/${game.slug}`}
            prefetch={false}
            className="hidden shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold text-foreground transition-colors hover:border-primary/50 hover:text-primary sm:inline-flex"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            View game
          </Link>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
          {verifiedSummary || factualFallback}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{formatCount(game.view_count)} views</span>
          <span>{formatCount(game.play_count)} plays</span>
          {date && <time dateTime={rawDate || undefined} className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{dateLabel} {date}</time>}
          <Link href={`/game/${game.slug}`} prefetch={false} className="ml-auto inline-flex min-h-9 items-center gap-1 font-bold text-primary sm:hidden">
            View game <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
