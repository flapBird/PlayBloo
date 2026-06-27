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
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-50 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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

        {/* Gradient overlay (always visible subtly, strong on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* View count badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-flex items-center px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-md text-[10px] font-medium text-white/90">
            {game.view_count.toLocaleString()} views
          </span>
        </div>

        {/* Play button (center on hover) */}
        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            <div className="relative w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-primary/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="h-6 w-6 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Title (appears on hover at bottom) */}
        <div className="absolute inset-x-0 bottom-0 p-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="block w-full text-center px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg text-sm font-semibold text-white truncate">
            {game.title}
          </span>
        </div>

        {/* Ring on hover */}
        <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}
