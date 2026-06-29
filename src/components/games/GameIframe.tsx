"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Play, Maximize2, Minimize2, ExternalLink, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameIframeProps {
  src: string;
  title: string;
  gameId: string;
  thumbnailUrl?: string | null;
  externalUrl?: string | null;
}

export function GameIframe({ src, title, gameId, thumbnailUrl, externalUrl }: GameIframeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const tracked = useRef(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const trackPlay = () => {
    if (tracked.current) return;
    tracked.current = true;
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_id: gameId, type: "play" }),
    }).catch(() => {});
  };

  const handlePlayClick = () => {
    trackPlay();
    if (externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setShowIframe(true);
  };

  // Fullscreen the wrapper div, not the iframe itself
  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapperRef.current?.requestFullscreen().catch(() => {});
    }
  }, []);

  // --- COVER STATE ---
  if (!showIframe) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border p-8 md:p-12">
          <div className="flex flex-col items-center gap-5">
            {/* Thumbnail */}
            <div className="relative w-full max-w-xs aspect-[4/3] rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 bg-white">
              {thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100">
                  <Gamepad2 className="h-16 w-16 text-indigo-200" />
                </div>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-foreground text-center">
              {title}
            </h3>

            {/* Play Now button */}
            <button
              onClick={handlePlayClick}
              className="relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-white font-bold text-base shadow-lg hover:shadow-xl hover:bg-primary/90 hover:scale-105 active:scale-100 transition-all duration-200"
            >
              <Play className="h-5 w-5 fill-white" />
              <span>{externalUrl ? "Play on Website" : "Play Now"}</span>
              {externalUrl && <ExternalLink className="h-4 w-4" />}
            </button>

            {externalUrl && (
              <p className="text-sm text-muted-foreground">
                This game will open in a new tab
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- IFRAME STATE ---
  return (
    <div className="mx-auto max-w-5xl">
      {/* Fullscreen wrapper — this is what we fullscreen, not the iframe */}
      <div
        ref={wrapperRef}
        className={`relative rounded-xl overflow-hidden border bg-black ${
          isFullscreen ? "flex items-center justify-center" : ""
        }`}
        style={isFullscreen ? { width: "100vw", height: "100vh" } : {}}
      >
        {/* Toolbar */}
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          {externalUrl && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => window.open(externalUrl, "_blank", "noopener,noreferrer")}
              className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white border-0"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
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

        {/* Iframe container — fills the fullscreen wrapper */}
        <div
          ref={containerRef}
          className={`w-full relative ${isFullscreen ? "h-full" : "min-h-[500px] md:min-h-[600px]"}`}
        >
          <iframe
            src={src}
            className={`absolute inset-0 w-full h-full ${isFullscreen ? "" : ""}`}
            allowFullScreen
            allow="autoplay; fullscreen; gamepad; microphone; camera; clipboard-read; clipboard-write; accelerometer; gyroscope; xr-spatial-tracking"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}
