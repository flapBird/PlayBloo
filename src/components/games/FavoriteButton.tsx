"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FAVORITES_STORAGE_KEY,
} from "@/lib/constants";
import {
  isFavorite,
  LIBRARY_CHANGE_EVENT,
  toggleFavorite,
} from "@/lib/user-library";

interface FavoriteButtonProps {
  gameId: string;
  gameTitle: string;
  compact?: boolean;
  className?: string;
}

export function FavoriteButton({ gameId, gameTitle, compact = false, className }: FavoriteButtonProps) {
  const [favorite, setFavorite] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sync = () => setFavorite(isFavorite(gameId));
    sync();
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === FAVORITES_STORAGE_KEY) sync();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(LIBRARY_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(LIBRARY_CHANGE_EVENT, sync);
    };
  }, [gameId]);

  return (
    <span className="inline-flex flex-col items-start gap-1"><button
      type="button"
      aria-label={`${favorite ? "Remove" : "Add"} ${gameTitle} ${favorite ? "from" : "to"} favorites`}
      aria-pressed={favorite}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        try { setFavorite(toggleFavorite(gameId)); setError(""); }
        catch { setError("Could not save favorites in this browser. Please try again."); }
      }}
      className={cn(
        compact
          ? "grid h-7 w-7 place-items-center rounded-lg border bg-slate-950/85 text-slate-300 transition-colors hover:border-primary/40 hover:text-primary"
          : "inline-flex h-10 items-center justify-center gap-2 rounded-xl border bg-card px-4 text-sm font-bold transition hover:border-primary/30 hover:text-primary",
        favorite && (compact ? "border-rose-400/40 bg-rose-500/20 text-rose-300" : "border-rose-400/40 bg-rose-500/15 text-rose-300"),
        className,
      )}
    >
      <Heart className={cn(compact ? "h-4 w-4" : "h-4 w-4", favorite && "fill-current")} />
      {!compact && (favorite ? "Favorited" : "Favorite")}
    </button>{error && <span role="alert" className="max-w-xs text-xs text-red-300">{error}</span>}</span>
  );
}
