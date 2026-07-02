import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Game } from "@/lib/types";

interface GameCardProps {
  game: Game;
  showCategory?: boolean;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/game/${game.slug}`} className="group block">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Game thumbnail */}
        <div className="absolute inset-0 overflow-hidden">
          {game.thumbnail_url ? (
            <Image
              src={game.thumbnail_url}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
          <span className="inline-flex items-center px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded-md text-[10px] font-medium text-white/90">
            {game.view_count.toLocaleString()}
          </span>
        </div>

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Play className="h-4 w-4 text-primary fill-primary ml-0.5" />
          </div>
        </div>

        {/* Ring on hover */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 group-hover:ring-primary/20 transition-all duration-300 pointer-events-none" />
      </div>

      {/* Title below card */}
      <p className="mt-2 text-xs font-semibold text-foreground text-center leading-snug line-clamp-2 group-hover:text-primary transition-colors">
        {game.title}
      </p>
    </Link>
  );
}
