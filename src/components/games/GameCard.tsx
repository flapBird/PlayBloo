import Link from "next/link";
import Image from "next/image";
import { Eye, Play } from "lucide-react";
import type { Game } from "@/lib/types";

type GameCardGame = Pick<Game, "id" | "title" | "slug" | "thumbnail_url" | "view_count">;

interface GameCardProps {
  game: GameCardGame;
  showCategory?: boolean;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/game/${game.slug}`} aria-label={`Play ${game.title}`} className="game-card group block">
      <div className="game-card-media relative aspect-square overflow-hidden rounded-2xl bg-muted">
        {/* Game thumbnail */}
        <div className="absolute inset-0 overflow-hidden">
          {game.thumbnail_url ? (
            <Image
              src={game.thumbnail_url}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, (max-width: 1280px) 16vw, 12vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Play className="h-8 w-8 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Subtle bottom fade for readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* View count badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
            <Eye className="h-2.5 w-2.5" aria-hidden="true" />
            {game.view_count.toLocaleString()}
          </span>
        </div>

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div className="game-card-play flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
            <Play className="h-4 w-4 text-primary fill-primary ml-0.5" />
          </div>
        </div>

        {/* Ring on hover */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 group-hover:ring-primary/20 transition-all duration-300 pointer-events-none" />
      </div>

      {/* Title below card */}
      <p className="mt-2.5 line-clamp-2 text-left text-xs font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
        {game.title}
      </p>
    </Link>
  );
}
