import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
import type { GameCardGame } from "@/components/games/GameCard";
import { getGamePlayMode } from "@/lib/game-utils";
import { CoverFallback } from "@/components/games/CoverFallback";
import { GameCover } from "@/components/games/GameCover";

interface RelatedGameItemProps {
  game: GameCardGame;
}

/**
 * Immersive related-game card: full-bleed cover, the title laid over a bottom
 * gradient, and a small icon badge marking playable-here vs external. The
 * why-it's-related line is explained once at section level, not repeated on
 * every card.
 */
export function RelatedGameItem({ game }: RelatedGameItemProps) {
  const playMode = getGamePlayMode({
    iframe_url: game.iframe_url || null,
    external_url: game.external_url || null,
    original_game_url: game.original_game_url || null,
  });

  return (
    <Link
      href={`/game/${game.slug}`}
      prefetch={false}
      className="group relative flex aspect-[16/10] min-w-0 overflow-hidden rounded-xl border bg-card transition-[border-color,box-shadow] duration-150 hover:border-primary/60 hover:shadow-[0_8px_22px_rgba(0,0,0,0.28)] motion-reduce:transition-none"
    >
      <span className="absolute inset-0" aria-hidden="true">
        {game.thumbnail_url ? (
          <GameCover
            src={game.thumbnail_url}
            className="transition-transform duration-200 group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
          />
        ) : (
          <CoverFallback title={game.title} />
        )}
      </span>
      {/* Readability gradient under the title. */}
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" aria-hidden="true" />
      {playMode === "embedded" && (
        <span
          title="Playable right here"
          className="absolute right-2 top-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm"
        >
          <Play className="h-3 w-3 fill-current" aria-hidden="true" />
        </span>
      )}
      {playMode === "external" && (
        <span
          title="Opens on the game site"
          className="absolute right-2 top-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </span>
      )}
      <span className="relative z-10 mt-auto w-full truncate px-2.5 pb-2 pt-6 text-sm font-bold leading-tight text-white">
        {game.title}
      </span>
    </Link>
  );
}
