import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/lib/types";

interface GameCardProps {
  game: Game;
  showCategory?: boolean;
}

export function GameCard({ game, showCategory = true }: GameCardProps) {
  return (
    <Link href={`/game/${game.slug}`} className="group block">
      <Card className="overflow-hidden bg-card border-border/60 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-indigo-50 to-violet-50 overflow-hidden">
          {game.thumbnail_url ? (
            <Image
              src={game.thumbnail_url}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Play className="h-12 w-12 text-indigo-200" />
            </div>
          )}

          {/* Hover overlay with play button */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-primary shadow-lg shadow-indigo-200 px-5 py-2.5 -translate-y-2 group-hover:translate-y-0 transition-all duration-200">
              <Play className="h-5 w-5 fill-white text-white" />
              <span className="text-sm font-bold text-white">Play Now</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {game.title}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {game.view_count.toLocaleString()} views
            </span>
            {game.categories && game.categories.length > 0 && showCategory && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 font-medium bg-indigo-50 text-indigo-600 border-0"
              >
                {game.categories[0].name}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
