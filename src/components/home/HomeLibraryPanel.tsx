"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, History, Play, X } from "lucide-react";
import type { GameCardGame } from "@/components/games/GameCard";
import {
  getFavorites,
  getRecentPlays,
  LIBRARY_CHANGE_EVENT,
  removePlayRecord,
  toggleFavorite,
  type RecentPlayRecord,
} from "@/lib/user-library";

function relativeTime(timestamp: number): string {
  const elapsed = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "Just played";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function Thumbnail({ src, alt }: { src: string | null | undefined; alt: string }) {
  return (
    <span className="relative block h-11 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
      {src ? (
        <Image src={src} alt="" fill unoptimized sizes="64px" className="object-cover" />
      ) : (
        <span className="grid h-full place-items-center text-[9px] font-bold text-muted-foreground">{alt.slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  );
}

export function HomeLibraryPanel() {
  const [recent, setRecent] = useState<RecentPlayRecord[]>([]);
  const [favorites, setFavorites] = useState<GameCardGame[]>([]);
  const sequence = useRef(0);

  useEffect(() => {
    let active = true;
    const sync = async () => {
      const request = ++sequence.current;
      const recentGames = getRecentPlays(4).filter((item) => item.snapshot);
      const favoriteIds = getFavorites().slice(0, 4).map((item) => item.gameId);
      if (active) setRecent(recentGames);
      if (!favoriteIds.length) {
        if (active) setFavorites([]);
        return;
      }
      try {
        const response = await fetch(`/api/games?ids=${encodeURIComponent(favoriteIds.join(","))}&limit=4`);
        if (!response.ok) throw new Error("Favorites request failed");
        const payload = await response.json();
        if (active && request === sequence.current) setFavorites(payload.data || []);
      } catch {
        if (active && request === sequence.current) setFavorites([]);
      }
    };
    void sync();
    window.addEventListener(LIBRARY_CHANGE_EVENT, sync);
    return () => {
      active = false;
      window.removeEventListener(LIBRARY_CHANGE_EVENT, sync);
    };
  }, []);

  if (!recent.length && !favorites.length) return null;
  const libraryHref = favorites.length ? "/favorites" : "/recently-played";

  return (
    <section className="mt-5 rounded-xl border bg-card/55 p-4 md:p-5" aria-labelledby="your-library-title">
      <div className="flex items-center justify-between gap-4 border-b pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Pick up where you left off</p>
          <h2 id="your-library-title" className="mt-0.5 text-base font-extrabold tracking-tight">Your library</h2>
        </div>
        <Link href={libraryHref} className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary">
          View library <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-2 lg:gap-8">
        {recent.length > 0 && (
          <div className={favorites.length ? "" : "lg:col-span-2"}>
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground"><History className="h-3.5 w-3.5" />Recently played</div>
            <div className={`grid gap-1 sm:grid-cols-2 ${favorites.length ? "" : "lg:grid-cols-4"}`}>
              {recent.map((item) => {
                const game = item.snapshot!;
                return (
                  <article key={item.gameId} className="group flex min-w-0 items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted/55">
                    <Link href={`/game/${game.slug}`} prefetch={false}><Thumbnail src={game.thumbnailUrl} alt={game.title} /></Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/game/${game.slug}`} prefetch={false} className="block truncate text-xs font-bold group-hover:text-primary">{game.title}</Link>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">{relativeTime(item.lastPlayedAt)}</span>
                    </div>
                    <button type="button" onClick={() => removePlayRecord(item.gameId)} aria-label={`Remove ${game.title} from recently played`} className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground opacity-60 hover:bg-background hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"><X className="h-3.5 w-3.5" /></button>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {favorites.length > 0 && (
          <div className={recent.length ? "" : "lg:col-span-2"}>
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground"><Heart className="h-3.5 w-3.5" />Favorites</div>
            <div className={`grid gap-1 sm:grid-cols-2 ${recent.length ? "" : "lg:grid-cols-4"}`}>
              {favorites.map((game) => (
                <article key={game.id} className="group flex min-w-0 items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted/55">
                  <Link href={`/game/${game.slug}`} prefetch={false}><Thumbnail src={game.thumbnail_url} alt={game.title} /></Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/game/${game.slug}`} prefetch={false} className="block truncate text-xs font-bold group-hover:text-primary">{game.title}</Link>
                    <Link href={`/game/${game.slug}`} prefetch={false} className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-primary"><Play className="h-2.5 w-2.5" />Open game</Link>
                  </div>
                  <button type="button" onClick={() => toggleFavorite(game.id)} aria-label={`Remove ${game.title} from favorites`} className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-rose-400 opacity-70 hover:bg-background sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"><X className="h-3.5 w-3.5" /></button>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
