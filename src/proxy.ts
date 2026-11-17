import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { resolvePastedGameSlug } from "@/lib/slug-rescue";

// Games that were removed from the catalogue and will not come back. Their
// rows are deleted from Supabase, so these URLs would otherwise 404 forever
// while Google keeps retrying them (GSC reported ~11% of crawl requests
// hitting 404s). A 410 tells Googlebot the removal is final, so it purges the
// URLs from the index and stops re-crawling them faster than a plain 404.
// When another game is permanently retired, add its slug here.
const REMOVED_GAME_SLUGS: ReadonlySet<string> = new Set([
  "and-hopes-for-all",
  "increvengeance",
  "pixel-orbit",
  "spin-the-squid",
  "bone-scrambler",
  "feed-the-ai",
]);

// Canonical slugs are lowercase [a-z0-9-]. Anything else in /game/<slug> is a
// paste artifact (trailing CJK punctuation, U+2011 dashes, AI citation
// markers, embedded spaces, a full URL or a Chinese title) and can never
// exact-match a game page, so it is worth paying Supabase round trips to
// resolve a redirect target — and only the proxy can emit a real 308, because
// the ISR page streams its loading shell before its render decides anything.
// Canonical-shaped misses skip the proxy lookups entirely and fall through to
// the ISR page, whose not-found path runs the same resolver as a mid-stream
// meta redirect; that path costs zero for the healthy game pages that
// dominate this route.
const CANONICAL_SLUG_RE = /^[a-z0-9-]+$/;

const gonePage = (slug: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Game removed - PlayBloo</title><meta name="robots" content="noindex"></head>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:12vh auto;padding:0 1.5rem;text-align:center;color:#1f2937">
<h1 style="font-size:1.5rem">This game has been removed</h1>
<p style="color:#6b7280">"${slug}" is no longer available on PlayBloo and will not return.</p>
<p><a href="/" style="color:#2563eb">Browse more games on the homepage</a></p>
</body>
</html>`;

export async function proxy(request: NextRequest) {
  const match = /^\/game\/([^/]+)$/.exec(request.nextUrl.pathname);
  if (!match) return;
  const rawSlug = match[1];

  if (REMOVED_GAME_SLUGS.has(rawSlug.toLowerCase())) {
    return new Response(gonePage(rawSlug), {
      status: 410,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  let decoded = rawSlug;
  try {
    decoded = decodeURIComponent(rawSlug);
  } catch {
    // Malformed escapes are themselves paste evidence — keep the raw value.
  }
  if (CANONICAL_SLUG_RE.test(decoded) && decoded.length <= 80) return;

  // Resolver failures must not take the route down: falling through renders
  // the regular (soft) 404 exactly as before this rescue existed.
  const rescued = await resolvePastedGameSlug(rawSlug).catch(() => null);
  if (rescued) {
    return NextResponse.redirect(new URL(`/game/${rescued}`, request.url), 308);
  }
}

// Only invoke the proxy for bare game pages; everything else skips it entirely.
export const config = {
  matcher: "/game/:slug",
};
