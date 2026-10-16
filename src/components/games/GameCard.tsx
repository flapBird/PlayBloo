import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Gamepad2, Play } from "lucide-react";
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

export function GameCard({ game, badges = [], showDate = false, dateField = "added", eagerImage = false }: GameCardProps) {
  const playMode = getGamePlayMode({
    iframe_url: game.iframe_url || null,
    external_url: game.external_url || null,
    original_game_url: game.original_game_url || null,
    official_website_url: game.official_website_url || null,
  });
  const statusBadge = getDiscoveryStatusBadge(game);
  const visibleBadge = badges[0] || statusBadge;
  const primaryCategory = game.categories?.[0];
  const rawDate = dateField === "released" ? game.release_date : dateField === "updated" ? game.last_updated_at : game.added_at || game.created_at;
  const dateValue = rawDate ? new Date(rawDate) : null;

  return (
    <article className="game-card group relative min-w-0">
      <Link href={`/game/${game.slug}`} prefetch={false} aria-label={`View ${game.title}`} title={game.title} className="game-card-link relative">
        <div className="game-card-media relative aspect-[16/10] shrink-0 overflow-hidden rounded-xl bg-muted">
          {game.thumbnail_url ? (
            <Image
              src={game.thumbnail_url}
              alt=""
              fill
              loading={eagerImage ? "eager" : "lazy"}
              unoptimized={shouldBypassImageOptimization(game.thumbnail_url)}
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
            />
          ) : (
            <span className="flex h-full items-center justify-center bg-muted">
              <Gamepad2 className="h-9 w-9 text-muted-foreground" aria-hidden="true" />
            </span>
          )}
          {visibleBadge && <span className={`game-card-status ${visibleBadge === "TRENDING" ? "is-trending" : ""}`}>{visibleBadge === "TRENDING" ? "Trending" : visibleBadge === "NEW" ? "New" : visibleBadge === "UPDATED" ? "Updated" : visibleBadge}</span>}
        </div>
        <div className="game-card-copy">
          <h3 className="game-card-title line-clamp-2">{game.title}</h3>
          <div className="game-card-meta">
            <span className="min-w-0 truncate">{primaryCategory?.name || "Browser game"}</span>
            <span className={`game-card-mode ${playMode === "embedded" ? "is-playable" : ""}`}>
              {playMode === "embedded" ? <><Play className="h-3 w-3" aria-hidden="true" />Play here</> : playMode === "external" ? <><ExternalLink className="h-3 w-3" aria-hidden="true" />External</> : "Details only"}
            </span>
          </div>
          {(showDate && dateValue && !Number.isNaN(dateValue.getTime())) && (
            <div className="game-card-details">
              {showDate && dateValue && !Number.isNaN(dateValue.getTime()) && <time dateTime={rawDate || undefined}>{dateField === "released" ? "Released" : dateField === "updated" ? "Updated" : "Added"} {dateValue.toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" })}</time>}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
