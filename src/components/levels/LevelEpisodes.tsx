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

  useEffect(() => {
    fetch(`/api/levels/summary?game_slug=${gameSlug}`)
      .then(r => r.json())
      .then(data => {
        setLevels(data.levels || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [gameSlug]);

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
            href={`/game/${gameSlug}/level/${level.slug}`}
            className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <span className="shrink-0 w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
              {level.level_number}
            </span>
            <span className="text-sm font-medium truncate flex-1 group-hover:text-primary transition-colors">
              {level.title}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
