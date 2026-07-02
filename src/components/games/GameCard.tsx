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
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Game thumbnail */}
        <div className="absolute inset-0 overflow-hidden">
          {game.thumbnail_url ? (
            <Image
              src={game.thumbnail_url}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Play className="h-12 w-12 text-indigo-200" />
            </div>
          )}
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* View count badge */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <span className="inline-flex items-center px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[9px] font-medium text-white/90">
            {game.view_count.toLocaleString()}
          </span>
        </div>

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30">
            <Play className="h-4 w-4 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Title below card */}
      <p className="mt-2 text-xs font-medium text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
        {game.title}
      </p>
    </Link>
  );
}
