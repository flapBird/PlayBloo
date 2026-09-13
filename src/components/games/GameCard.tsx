import Image from "next/image";
import Link from "next/link";
import { Eye, ArrowRight, Gamepad2 } from "lucide-react";
import { getDiscoveryStatusBadge, getGamePlayMode, shouldBypassImageOptimization } from "@/lib/game-utils";
import type { Category, Game } from "@/lib/types";

export type GameCardGame = Pick<Game, "id" | "title" | "slug" | "thumbnail_url" | "view_count"> &
  Partial<Pick<Game, "play_count" | "iframe_url" | "external_url" | "original_game_url" | "official_website_url" | "is_trending" | "hot_score" | "created_at" | "updated_at" | "added_at" | "release_date" | "last_updated_at" | "description" | "short_description" | "content_verified">> &
  { categories?: Array<Pick<Category, "id" | "name" | "slug">> };

interface GameCardProps {
  game: GameCardGame;
  badges?: string[];
  showDate?: boolean;
  dateField?: "added" | "released" | "updated";
  eagerImage?: boolean;
}

function formatCount(value: number | undefined): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
}

export function GameCard({ game, badges = [], showDate = false, dateField = "added", eagerImage = false }: GameCardProps) {
  const playMode = getGamePlayMode({
    iframe_url: game.iframe_url || null,
    external_url: game.external_url || null,
    original_game_url: game.original_game_url || null,
    official_website_url: game.official_website_url || null,
  });
  const modeBadge = playMode === "embedded" ? "PLAY HERE" : playMode === "external" ? "EXTERNAL" : null;
  const statusBadge = getDiscoveryStatusBadge(game);
  const priority = ["TRENDING", "NEW", "UPDATED", "PLAY HERE", "EXTERNAL"];
  const requested = [...new Set([...badges, ...(statusBadge ? [statusBadge] : []), ...(modeBadge ? [modeBadge] : [])])];
  const visibleBadges = requested.sort((a, b) => priority.indexOf(a) - priority.indexOf(b)).slice(0, 3);
  const primaryCategory = game.categories?.[0];
  const rawDate = dateField === "released" ? game.release_date : dateField === "updated" ? game.last_updated_at : game.added_at || game.created_at;
  const dateValue = rawDate ? new Date(rawDate) : null;

  return (
    <article className="game-card group relative min-w-0">
      <div className="game-card-media relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
        <Link href={`/game/${game.slug}`} prefetch={false} aria-label={`View ${game.title}`} className="absolute inset-0">
          {game.thumbnail_url ? (
            <Image
              src={game.thumbnail_url}
              alt=""
              fill
              loading={eagerImage ? "eager" : "lazy"}
              unoptimized={shouldBypassImageOptimization(game.thumbnail_url)}
              className="object-cover transition-opacity duration-200 group-hover:opacity-90"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
            />
          ) : (
            <span className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
              <Gamepad2 className="h-9 w-9 text-primary/25" />
            </span>
          )}
        </Link>

        {visibleBadges.length > 0 && (
          <div className="absolute left-2 top-2 z-10 flex max-w-[calc(100%-3rem)] flex-wrap gap-1">
            {visibleBadges.map((badge) => (
              <span
                key={badge}
                className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${
                  badge === "PLAY HERE" ? "border-emerald-500/35 bg-slate-950 text-emerald-300" : badge === "EXTERNAL" ? "border-slate-500/35 bg-slate-900/80 text-slate-300" : badge === "TRENDING" ? "border-amber-500/35 bg-slate-950 text-amber-300" : "border-indigo-400/35 bg-slate-950 text-indigo-200"
                }`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

      </div>

      <div className="pt-2">
        <Link href={`/game/${game.slug}`} prefetch={false} className="block">
          <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm">{game.title}</h3>
        </Link>
        <div className="mt-1 flex min-w-0 items-center gap-2 text-[10px] text-muted-foreground sm:text-[11px]">
          <span className="truncate">{primaryCategory?.name || (playMode === "unavailable" ? "Details only" : "Browser game")}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex shrink-0 items-center gap-1"><Eye className="h-3 w-3" />{formatCount(game.view_count)}</span>
          {showDate && dateValue ? (
            <><span aria-hidden="true">·</span><time className="shrink-0" dateTime={rawDate || undefined}>{dateValue.toLocaleDateString("en", { month: "short", day: "numeric" })}</time></>
          ) : (
            <><span aria-hidden="true">·</span><span className="shrink-0">{formatCount(game.play_count)} plays</span></>
          )}
        </div>
        <Link href={`/game/${game.slug}`} prefetch={false} className="mt-1.5 inline-flex min-h-9 items-center gap-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-primary">
          <ArrowRight className="h-3.5 w-3.5" /> View game
        </Link>
      </div>
    </article>
  );
}
