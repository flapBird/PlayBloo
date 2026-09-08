"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Play, Maximize2, Minimize2, ExternalLink, Gamepad2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addPlayRecord } from "@/lib/play-history";
import { shouldBypassImageOptimization } from "@/lib/game-utils";

interface GameIframeProps {
  src: string | null;
  title: string;
  gameId: string;
  slug: string;
  thumbnailUrl?: string | null;
  externalUrl?: string | null;
}

export function GameIframe({ src, title, gameId, slug, thumbnailUrl, externalUrl }: GameIframeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [showWakeHint, setShowWakeHint] = useState(false);
  const tracked = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const trackPlay = () => {
    if (tracked.current) return;
    tracked.current = true;
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game_id: gameId, type: "play" }),
    }).catch(() => {});
    // A play is recorded only after an explicit launch action.
    addPlayRecord({
      gameId,
      slug,
      title,
      thumbnailUrl: thumbnailUrl ?? null,
    });
  };

  const trackExternalClick = () => {
    fetch("/api/stats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ game_id: gameId, type: "external_click" }) }).catch(() => {});
  };

  const showHint = () => {
    setShowWakeHint(true);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setShowWakeHint(false), 3000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    showHint();
  };

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

  const hasEmbeddedGame = Boolean(src?.trim());
  const hasExternalGame = Boolean(externalUrl?.trim());

  // Launch state: merely opening the detail page never counts as a play.
  if (!showIframe) {
    return (
      <div className="mx-auto max-w-5xl">
        <section className="grid gap-5 rounded-xl border bg-card p-4 sm:p-5 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:items-center md:gap-8">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border bg-muted">
              {thumbnailUrl ? (
                <Image
                  src={thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover"
                  loading="eager"
                  sizes="(max-width: 768px) calc(100vw - 4rem), 352px"
                  unoptimized={shouldBypassImageOptimization(thumbnailUrl)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                  <Gamepad2 className="h-16 w-16 text-slate-600" />
                </div>
              )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
              {hasEmbeddedGame ? "Instant play" : hasExternalGame ? "External game" : "Play status"}
            </p>
            <h2 className="mt-1.5 text-xl font-black tracking-tight md:text-2xl">
              {hasEmbeddedGame ? "Ready to play in this page" : hasExternalGame ? "Continue to the game site" : "Play link unavailable"}
            </h2>
            <p id="game-launch-note" className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              {hasEmbeddedGame
                ? `Launch ${title} here without a download. It only counts as played after you press the button.`
                : hasExternalGame
                  ? `${title} opens in a new tab. Play history is recorded only when you continue.`
                  : "No working embedded or external play link has been verified yet."}
            </p>
            <button
              onClick={() => {
                if (!hasEmbeddedGame && !hasExternalGame) return;
                trackPlay();
                if (hasEmbeddedGame) setShowIframe(true);
                else if (hasExternalGame) { trackExternalClick(); window.open(externalUrl as string, "_blank", "noopener,noreferrer"); }
              }}
              disabled={!hasEmbeddedGame && !hasExternalGame}
              aria-describedby="game-launch-note"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{hasEmbeddedGame ? "Launch game" : hasExternalGame ? "Open game site" : "Currently unavailable"}</span>
              {hasExternalGame && <ExternalLink className="h-4 w-4" />}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={isFullscreen ? "" : "mx-auto max-w-5xl"}>
      <div
        className={
          isFullscreen
            ? "fixed inset-0 z-50 bg-black"
            : "relative rounded-xl overflow-hidden border bg-black"
        }
      >
        {/* Controls */}
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          {externalUrl && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => { trackExternalClick(); window.open(externalUrl, "_blank", "noopener,noreferrer"); }}
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
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {/* Wake hint */}
        {showWakeHint && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 text-white text-sm px-4 py-2 rounded-full animate-pulse">
              Click the game to continue
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={src || undefined}
          className={
            isFullscreen
              ? "w-full h-full"
              : "w-full min-h-[500px] md:min-h-[600px]"
          }
          allow="autoplay; fullscreen; gamepad; microphone; camera; clipboard-read; clipboard-write; accelerometer; gyroscope; xr-spatial-tracking"
          allowFullScreen
          title={title}
          onLoad={() => setIframeLoading(false)}
        />
      </div>
    </div>
  );
}
