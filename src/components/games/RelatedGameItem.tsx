import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gamepad2, Play } from "lucide-react";
import type { GameCardGame } from "@/components/games/GameCard";
import { getGamePlayMode, shouldBypassImageOptimization } from "@/lib/game-utils";

interface RelatedGameItemProps {
  game: GameCardGame;
  reason: string;
}

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
      className="group grid min-w-0 grid-cols-[6.5rem_minmax(0,1fr)] gap-3 border-b py-4 transition-colors hover:border-primary/50 sm:grid-cols-[7.5rem_minmax(0,1fr)]"
    >
      <span className="relative aspect-[16/10] overflow-hidden rounded-lg border bg-muted">
        {game.thumbnail_url ? (
          <Image
            src={game.thumbnail_url}
            alt=""
            fill
            className="object-cover transition-opacity group-hover:opacity-90"
            sizes="120px"
            unoptimized={shouldBypassImageOptimization(game.thumbnail_url)}
          />
        ) : (
          <span className="flex h-full items-center justify-center"><Gamepad2 className="h-6 w-6 text-primary/30" /></span>
        )}
      </span>
      <span className="flex min-w-0 flex-col justify-center">
        <span className="truncate text-sm font-extrabold transition-colors group-hover:text-primary sm:text-base">{game.title}</span>
        <span className="mt-1 truncate text-xs text-muted-foreground">{reason}</span>
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
          {playMode === "embedded" ? <><Play className="h-3 w-3 fill-current text-emerald-400" />Playable here</> : <>{game.categories?.[0]?.name || "View details"}<ArrowRight className="h-3 w-3" /></>}
        </span>
      </span>
    </Link>
  );
}
