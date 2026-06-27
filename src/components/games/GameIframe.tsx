"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameIframeProps {
  src: string;
  title: string;
  gameId: string;
}

export function GameIframe({ src, title, gameId }: GameIframeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tracked = useRef(false);

  // Track play on mount
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_id: gameId, type: "play" }),
    }).catch(() => {});
  }, [gameId]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      try {
        await containerRef.current.requestFullscreen();
      } catch {}
    }
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden border bg-black"
      >
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFullscreen}
            className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white border-0"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>

        <div className="w-full min-h-[500px] md:min-h-[600px] relative">
          <iframe
            src={src}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; pointer-lock; gamepad; microphone; camera; clipboard-read; clipboard-write; accelerometer; gyroscope; xr-spatial-tracking"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
