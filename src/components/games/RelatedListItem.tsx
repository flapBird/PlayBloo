import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
import type { GameCardGame } from "@/components/games/GameCard";
import { getGamePlayMode } from "@/lib/game-utils";
import { CoverFallback } from "@/components/games/CoverFallback";
import { GameCover } from "@/components/games/GameCover";

interface RelatedListItemProps {
  game: GameCardGame & { recommendationReason?: string };
}

/**
 * Horizontal related-game card for the detail-page sidebar: thumbnail on the
 * left, why-it's-related as the eyebrow, title below, and a mode glyph on the
 * right. Same visual language as the previous/next cards.
 */
export function RelatedListItem({ game }: RelatedListItemProps) {
  const playMode = getGamePlayMode({
    iframe_url: game.iframe_url || null,
    external_url: game.external_url || null,
    original_game_url: game.original_game_url || null,
  });

  return (
    <Link
      href={`/game/${game.slug}`}
      prefetch={false}
      className="group flex items-center gap-3 rounded-xl border p-2.5 transition-colors hover:border-primary/40 motion-reduce:transition-none"
    >
      <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
        {game.thumbnail_url ? (
          <GameCover
            src={game.thumbnail_url}
            className="transition-transform duration-200 group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
            sizes="80px"
          />
        ) : (
          <CoverFallback title={game.title} />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
          {game.recommendationReason || "Recommended"}
        </span>
        <strong className="mt-1 block truncate text-sm font-bold transition-colors group-hover:text-primary">
          {game.title}
        </strong>
      </span>
      {playMode === "embedded" && (
        <span
          title="Playable right here"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary"
        >
          <Play className="h-3 w-3 fill-current" aria-hidden="true" />
        </span>
      )}
      {playMode === "external" && (
        <span
          title="Opens on the game site"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </span>
      )}
    </Link>
  );
}
