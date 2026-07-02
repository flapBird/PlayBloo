"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ArrowRight, Hash } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface LevelResult {
  id: string;
  game_id: string;
  level_number: number;
  title: string;
  slug: string;
  meta_description: string | null;
  view_count: number;
  game_slug?: string;
}

interface Props {
  gameId: string;
  gameSlug: string;
}

export function LevelSearch({ gameId, gameSlug }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<LevelResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query, game_id: gameId, limit: "10" });
      const res = await fetch(`/api/levels?${params.toString()}`);
      const json = await res.json();
      setResults(json.data || []);
      setShowDropdown((json.data || []).length > 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q, search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={e => setQ(e.target.value)}
          onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
          placeholder="Search levels by number or keyword (e.g. Level 666, tips, walkthrough)..."
          className="pl-10 pr-10 h-11 text-base bg-white border-amber-400 shadow-sm focus-visible:ring-amber-400"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute z-30 mt-2 w-full rounded-xl border bg-card shadow-2xl overflow-hidden">
          <ul className="max-h-80 overflow-y-auto divide-y">
            {results.map((level) => (
              <li key={level.id}>
                <Link
                  href={`/game/${gameSlug}/level/${level.slug}`}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  onClick={() => { setShowDropdown(false); setQ(""); }}
                >
                  <div className="shrink-0 mt-0.5">
                    <Badge variant="secondary" className="gap-0.5">
                      <Hash className="h-3 w-3" />
                      {level.level_number}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{level.title}</p>
                    {level.meta_description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {level.meta_description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 py-2 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground">
              {results.length} level{results.length > 1 ? "s" : ""} found
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
