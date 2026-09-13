"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";

interface LevelSummary {
  id: string;
  level_number: number;
  title: string;
  slug: string;
}

interface Props {
  gameSlug: string;
}

export function LevelEpisodes({ gameSlug }: Props) {
  const [levels, setLevels] = useState<LevelSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/levels/summary?game_slug=${encodeURIComponent(gameSlug)}`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("load"); return response.json(); })
      .then(data => { if (!controller.signal.aborted) { setLevels(data.levels || []); setError(false); } })
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [gameSlug, attempt]);

  if (error) return <div role="alert" className="rounded-xl border p-4"><p>Walkthroughs could not be loaded.</p><button className="min-h-11 font-bold text-primary" onClick={() => { setError(false); setLoading(true); setAttempt(value => value + 1); }}>Try again</button></div>;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (levels.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-12 text-center">
        No walkthroughs available yet. Check back soon for new guides.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-5">
        {levels.length} walkthrough{levels.length > 1 ? "s" : ""} available
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {levels.map(level => (
          <Link
            key={level.id}
            title={level.title}
            href={`/game/${gameSlug}/level/${level.slug}`}
            className="group flex min-h-12 items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <span className="text-sm font-bold flex-1 group-hover:text-primary transition-colors">
              Level {level.level_number}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
