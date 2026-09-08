"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, History } from "lucide-react";
import { GameCard, type GameCardGame } from "@/components/games/GameCard";
import { getFavorites, getRecentPlays, LIBRARY_CHANGE_EVENT } from "@/lib/user-library";

interface SavedGamesGridProps {
  kind: "favorites" | "recent";
}

export function SavedGamesGrid({ kind }: SavedGamesGridProps) {
  const [games, setGames] = useState<GameCardGame[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      const ids = (kind === "favorites" ? getFavorites() : getRecentPlays())
        .map((item) => item.gameId)
        .slice(0, 30);
      if (!ids.length) {
        if (!cancelled) {
          setGames([]);
          setReady(true);
        }
        return;
      }
      try {
        const response = await fetch(`/api/games?ids=${encodeURIComponent(ids.join(","))}&limit=30`);
        const payload = await response.json();
        if (!cancelled) setGames(payload.data || []);
      } catch {
        if (!cancelled) setGames([]);
      } finally {
        if (!cancelled) setReady(true);
      }
    };
    void sync();
    window.addEventListener(LIBRARY_CHANGE_EVENT, sync);
    return () => {
      cancelled = true;
      window.removeEventListener(LIBRARY_CHANGE_EVENT, sync);
    };
  }, [kind]);

  if (!ready) return <div className="h-52 animate-pulse rounded-3xl bg-muted/60" />;

  if (!games.length) {
    const Icon = kind === "favorites" ? Heart : History;
    return (
      <div className="rounded-3xl border border-dashed bg-card/70 px-6 py-16 text-center">
        <Icon className="mx-auto h-10 w-10 text-primary/35" />
        <h2 className="mt-4 text-lg font-black">{kind === "favorites" ? "No favorites yet" : "Nothing played yet"}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {kind === "favorites" ? "Use the heart on any game to save it here." : "Games appear here after you press Play or launch an official site."}
        </p>
        <Link href="/search" className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Discover games</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {games.map((game) => <GameCard key={game.id} game={game} />)}
    </div>
  );
}
