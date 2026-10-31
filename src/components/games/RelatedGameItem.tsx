import Link from "next/link";
import { Play } from "lucide-react";
import type { GameCardGame } from "@/components/games/GameCard";
import { getGamePlayMode } from "@/lib/game-utils";
import { CoverFallback } from "@/components/games/CoverFallback";
import { GameCover } from "@/components/games/GameCover";

interface RelatedGameItemProps {
  game: GameCardGame;
  reason: string;
}

/** Vertical related-game card: cover on top, title and why-it's-related below. */
export function RelatedGameItem({ game, reason }: RelatedGameItemProps) {
  const playMode = getGamePlayMode({
    iframe_url: game.iframe_url || null,
    external_url: game.external_url || null,
    original_game_url: game.original_game_url || null,
  });

  return (
    <Link
      href={`/game/${game.slug}`}
      prefetch={false}
      className="group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_6px_18px_rgba(0,0,0,0.2)] motion-reduce:transition-none motion-reduce:hover:transform-none"
    >
      <span className="relative aspect-[5/4] shrink-0 overflow-hidden border-b bg-muted">
        {game.thumbnail_url ? (
          <GameCover
            src={game.thumbnail_url}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
          />
        ) : (
          <CoverFallback title={game.title} />
        )}
        {playMode === "embedded" && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            <Play className="h-3 w-3 fill-current" aria-hidden="true" />
            Play here
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-col gap-0.5 px-3 pb-3 pt-2.5">
        <span className="truncate text-sm font-bold transition-colors group-hover:text-primary">{game.title}</span>
        <span className="truncate text-xs text-muted-foreground">{reason}</span>
      </span>
    </Link>
  );
}
