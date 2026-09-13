"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, History, Trash2 } from "lucide-react";
import { GameCard, type GameCardGame } from "@/components/games/GameCard";
import { FavoriteButton } from "@/components/games/FavoriteButton";
import { getFavorites, getRecentPlays, removePlayRecord, restorePlayRecord, LIBRARY_CHANGE_EVENT, type RecentPlayRecord } from "@/lib/user-library";

export function SavedGamesGrid({ kind }: { kind: "favorites" | "recent" }) {
  const [games, setGames] = useState<GameCardGame[]>([]);
  const [recent, setRecent] = useState<RecentPlayRecord[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [removed, setRemoved] = useState<RecentPlayRecord | null>(null);

  useEffect(() => {
    let version = 0;
    let disposed = false;
    const sync = async () => {
      const request = ++version;
      const history = getRecentPlays();
      const ids = (kind === "favorites" ? getFavorites() : history).map((item) => item.gameId);
      setRecent(history);
      setError("");
      try {
        const loaded: GameCardGame[] = [];
        // The API accepts 30 IDs per request; do not silently discard older saves.
        for (let offset = 0; offset < ids.length; offset += 30) {
          const batch = ids.slice(offset, offset + 30);
          const response = await fetch(`/api/games?ids=${encodeURIComponent(batch.join(","))}&limit=30`);
          if (!response.ok) throw new Error("load");
          const payload = await response.json();
          if (!Array.isArray(payload.data)) throw new Error("load");
          loaded.push(...payload.data);
          if (disposed || request !== version) return;
        }
        if (!disposed && request === version) setGames(loaded);
      } catch {
        if (!disposed && request === version) setError("Your library could not be loaded. Please try again.");
      } finally {
        if (!disposed && request === version) setReady(true);
      }
    };
    void sync();
    window.addEventListener(LIBRARY_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      disposed = true;
      window.removeEventListener(LIBRARY_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [kind, retry]);

  if (!ready) return <div role="status" aria-label="Loading your library" className="h-52 animate-pulse rounded-3xl bg-muted/60" />;
  const Icon = kind === "favorites" ? Heart : History;
  return <div className="space-y-5">
    {error && <div role="alert" className="rounded-xl border p-4"><p>{error}</p><button className="mt-2 min-h-11 font-bold text-primary" onClick={() => setRetry((value) => value + 1)}>Try again</button></div>}
    {removed && <div role="status" className="flex flex-wrap items-center gap-3 rounded-xl border p-3 text-sm"><span>Removed from recently played.</span><button className="min-h-11 font-bold text-primary" onClick={() => { if (restorePlayRecord(removed)) setRemoved(null); else setError("This browser could not save the change. Please try again."); }}>Undo</button></div>}
    {!games.length && !error ? <div className="rounded-3xl border border-dashed bg-card/70 px-6 py-16 text-center">
      <Icon className="mx-auto h-10 w-10 text-primary/60" />
      <h2 className="mt-4 text-lg font-black">{kind === "favorites" ? "No favorites yet" : "Nothing played yet"}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{kind === "favorites" ? "Open a game page and press Favorite to save it here." : "Games appear here after you launch a game or open its game site."}</p>
      <Link href="/search" className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">Discover games</Link>
    </div> : null}
    {games.length > 0 && <><p className="text-sm text-muted-foreground">{games.length} saved game{games.length === 1 ? "" : "s"}</p><div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {games.map((game) => {
        const record = recent.find((item) => item.gameId === game.id);
        return <div key={game.id} className="min-w-0 space-y-2"><GameCard game={game} />
          {kind === "favorites" ? <FavoriteButton gameId={game.id} gameTitle={game.title} /> : <>
            {record && <p className="text-xs leading-5 text-muted-foreground">Last played <time dateTime={new Date(record.lastPlayedAt).toISOString()}>{new Date(record.lastPlayedAt).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</time></p>}
            <button className="inline-flex min-h-11 items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground" aria-label={`Remove ${game.title} from recently played`} onClick={() => { if (removePlayRecord(game.id)) setRemoved(record || null); else setError("This browser could not save the change. Please try again."); }}><Trash2 className="h-4 w-4" />Remove</button>
          </>}
        </div>;
      })}
    </div></>}
  </div>;
}
