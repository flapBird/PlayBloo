"use client";

import { useEffect } from "react";

const VIEW_DELAY_MS = 5000;

/**
 * Counts a human-visible game detail view once per browser session. Crawlers
 * that only request server HTML no longer cause a database write.
 */
export function GameViewTracker({ gameId }: { gameId: string }) {
  useEffect(() => {
    const key = `playbloo:viewed:${gameId}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      // Continue without session deduplication when storage is unavailable.
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const recordView = () => {
      if (document.visibilityState !== "visible") return;
      timer = setTimeout(() => {
        try { sessionStorage.setItem(key, "1"); } catch {}
        fetch("/api/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ game_id: gameId, type: "view" }),
          keepalive: true,
        }).catch(() => {});
      }, VIEW_DELAY_MS);
    };

    const cancelView = () => {
      if (timer) clearTimeout(timer);
      timer = undefined;
    };

    const onVisibilityChange = () => {
      cancelView();
      recordView();
    };

    recordView();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      cancelView();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [gameId]);

  return null;
}
