"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchX, ArrowRight } from "lucide-react";

type Suggestion = { id: string; title: string; slug: string; thumbnail_url: string | null };

/**
 * 404 page for /game/* URLs. The slug that missed is usually a mangled paste
 * (AI citation markers, trailing CJK punctuation, guessed fragments), so the
 * page guesses what the visitor meant: progressively shorter token queries
 * against /api/suggestions (which matches titles, slugs and aliases) until
 * something comes back. Server-side rescue already redirected the cleanly
 * resolvable cases (lib/slug-rescue.ts); this catches the rest.
 */
export default function GameNotFound() {
  const pathname = usePathname();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const rawSlug = decodeURIComponent(pathname.split("/")[2] || "");
  const cleaned = rawSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  const tokens = cleaned.split("-").filter(Boolean);
  const queries = [cleaned, tokens.slice(0, 2).join("-"), tokens[0]]
    .filter((q) => q && q.length >= 3)
    .filter((q, index, list) => list.indexOf(q) === index);

  useEffect(() => {
    if (queries.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const query of queries) {
        try {
          const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
          const payload = (await response.json()) as { suggestions?: Suggestion[] };
          const found = (payload.suggestions || []).filter(
            (suggestion) => suggestion.slug !== cleaned,
          );
          if (!cancelled && found.length > 0) {
            setSuggestions(found.slice(0, 3));
            return;
          }
        } catch {
          // Suggestions are a bonus, never a requirement.
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // queries derives from the pathname; the derivation is stable per slug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <SearchX className="mb-4 h-10 w-10 text-muted-foreground" />
      <h1 className="text-2xl font-black tracking-tight">Game not found</h1>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        This game URL does not match a published game. It may be an old link or a mistyped address — here is what we could find instead.
      </p>

      {suggestions.length > 0 && (
        <div className="mt-8 w-full max-w-md text-left">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Did you mean</h2>
          <ul className="space-y-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <Link
                  href={`/game/${suggestion.slug}`}
                  className="flex items-center gap-3 rounded-lg border bg-card p-2.5 transition-colors hover:bg-muted"
                >
                  {suggestion.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={suggestion.thumbnail_url} alt="" className="h-11 w-16 rounded-md object-cover" loading="lazy" />
                  )}
                  <span className="flex-1 text-sm font-semibold">{suggestion.title}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
        <Link href="/search" className="rounded-lg border px-4 py-2 transition-colors hover:bg-muted">Search all games</Link>
        <Link href="/new-games" className="rounded-lg border px-4 py-2 transition-colors hover:bg-muted">New games</Link>
        <Link href="/" className="rounded-lg border px-4 py-2 transition-colors hover:bg-muted">Home</Link>
      </div>
    </div>
  );
}
