"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Play, Maximize2, Minimize2, ExternalLink, Gamepad2, Loader2, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameIframeProps {
  src: string;
  title: string;
  gameId: string;
  thumbnailUrl?: string | null;
  externalUrl?: string | null;
}

export function GameIframe({ src, title, gameId, thumbnailUrl, externalUrl }: GameIframeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [showWakeHint, setShowWakeHint] = useState(false);
  const tracked = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (externalUrl) return;
    setShowIframe(true);
  }, [externalUrl]);

  const trackPlay = () => {
    if (tracked.current) return;
    tracked.current = true;
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_id: gameId, type: "play" }),
    }).catch(() => {});
  };

  const showHint = () => {
    setShowWakeHint(true);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setShowWakeHint(false), 4000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    showHint();
  };

  // Always listen for clicks — hide hint immediately
  useEffect(() => {
    const hide = () => setShowWakeHint(false);
    window.addEventListener("click", hide);
    return () => window.removeEventListener("click", hide);
  }, []);

  // ESC key to exit
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  // Cover state
  if (!showIframe) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border p-8 md:p-12">
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-full max-w-xs aspect-[4/3] rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 bg-white">
              {thumbnailUrl ? (
                <Image src={thumbnailUrl} alt={title} fill className="object-cover" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-violet-100">
                  <Gamepad2 className="h-16 w-16 text-indigo-200" />
                </div>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-foreground text-center">{title}</h3>
            <button
              onClick={() => { trackPlay(); if (externalUrl) window.open(externalUrl, "_blank", "noopener,noreferrer"); }}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-primary text-white font-bold text-base shadow-lg hover:shadow-xl hover:bg-primary/90 hover:scale-105 active:scale-100 transition-all duration-200"
            >
              <Play className="h-5 w-5 fill-white" />
              <span>{externalUrl ? "Play on Website" : "Play Now"}</span>
              {externalUrl && <ExternalLink className="h-4 w-4" />}
            </button>
            {externalUrl && (
              <p className="text-sm text-muted-foreground">This game will open in a new tab</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isFullscreen ? "" : "mx-auto max-w-5xl"}>
      <div
        className={
          isFullscreen
            ? "fixed inset-0 bg-black"
            : "relative rounded-xl overflow-hidden border bg-black"
        }
        style={isFullscreen ? { zIndex: 50 } : undefined}
      >
        {/* Controls */}
        <div className="absolute top-3 right-3 flex gap-2" style={{ zIndex: 30 }}>
          {externalUrl && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => window.open(externalUrl, "_blank", "noopener,noreferrer")}
              className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white border-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFullscreen}
            className="h-8 w-8 bg-black/60 hover:bg-black/80 text-white border-0"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* Loading spinner - only on initial load */}
        {iframeLoading && !isFullscreen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60" style={{ zIndex: 10 }}>
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {/* Wake hint overlay */}
        {showWakeHint && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm" style={{ zIndex: 20 }}>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white/10 rounded-full p-4 ring-1 ring-white/20">
                <MousePointerClick className="h-8 w-8 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-wide">Click to continue</span>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={src}
          className={
            isFullscreen
              ? "w-full h-full"
              : "w-full min-h-[500px] md:min-h-[600px]"
          }
          allow="autoplay; fullscreen; gamepad; microphone; camera; clipboard-read; clipboard-write; accelerometer; gyroscope; xr-spatial-tracking"
          allowFullScreen
          title={title}
          onLoad={() => { setIframeLoading(false); trackPlay(); }}
        />
      </div>
    </div>
  );
}
