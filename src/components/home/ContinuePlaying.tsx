"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRecentPlays, type PlayHistoryItem } from "@/lib/play-history";
import { History, Gamepad2 } from "lucide-react";

export function ContinuePlaying() {
  const [games, setGames] = useState<PlayHistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setGames(getRecentPlays(9));
  }, []);

  // Don't render anything on server or when there are no games
  if (!mounted || games.length === 0) return null;

  return (
    <section className="mb-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Continue Playing
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-3 md:gap-4">
        {games.map((item) => (
          <Link
            key={item.gameId}
            href={`/game/${item.slug}`}
            className="group rounded-xl overflow-hidden bg-card border border-border/60 hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="aspect-[4/3] bg-muted/30 overflow-hidden relative">
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 group-hover:from-indigo-100 group-hover:to-violet-100 transition-colors">
                  <Gamepad2 className="h-8 w-8 text-indigo-200" />
                </div>
              )}
            </div>
            <div className="p-2.5">
              <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
