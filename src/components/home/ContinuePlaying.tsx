"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRecentPlays, removePlayRecord, type PlayHistoryItem } from "@/lib/play-history";
import { History, Gamepad2, X } from "lucide-react";

export function ContinuePlaying() {
  const [games, setGames] = useState<PlayHistoryItem[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setGames(getRecentPlays(9)));
    return () => cancelAnimationFrame(frame);
  }, []);

  const removeGame = (item: PlayHistoryItem) => {
    if (removingId) return;
    setRemovingId(item.gameId);
    window.setTimeout(() => {
      removePlayRecord(item.gameId);
      setGames((current) => current.filter((game) => game.gameId !== item.gameId));
      setRemovingId(null);
    }, 180);
  };

  if (games.length === 0) return null;

  return (
    <section className="continue-playing">
      <div className="mb-4 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
            <History className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">Your recent games</p>
            <h2 className="text-base font-black tracking-tight text-foreground">
              Continue Playing
            </h2>
          </div>
        </div>
        <p className="hidden text-xs font-medium text-muted-foreground sm:block">Pick up where you left off</p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-9">
        {games.map((item) => (
          <article
            key={item.gameId}
            className={`continue-card group relative overflow-hidden rounded-xl bg-card ${removingId === item.gameId ? "is-removing" : ""}`}
          >
            <Link href={`/game/${item.slug}`} aria-label={`Continue playing ${item.title}`} className="block">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 transition-colors group-hover:from-indigo-100 group-hover:to-violet-100">
                    <Gamepad2 className="h-8 w-8 text-indigo-200" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent" />
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-semibold text-foreground transition-colors group-hover:text-primary">
                  {item.title}
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => removeGame(item)}
              disabled={removingId !== null}
              aria-label={`Remove ${item.title} from recent games`}
              className="continue-remove"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
