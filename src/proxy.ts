import type { NextRequest } from "next/server";

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

const gonePage = (slug: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Game removed - PlayBloo</title><meta name="robots" content="noindex"></head>
<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:12vh auto;padding:0 1.5rem;text-align:center;color:#1f2937">
<h1 style="font-size:1.5rem">This game has been removed</h1>
<p style="color:#6b7280">"${slug}" is no longer available on PlayBloo and will not return.</p>
<p><a href="/" style="color:#2563eb">Browse more games on the homepage</a></p>
</body>
</html>`;

export function proxy(request: NextRequest) {
  const match = /^\/game\/([^/]+)$/.exec(request.nextUrl.pathname);
  if (match && REMOVED_GAME_SLUGS.has(match[1].toLowerCase())) {
    return new Response(gonePage(match[1]), {
      status: 410,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
}

// Only invoke the proxy for bare game pages; everything else skips it entirely.
export const config = {
  matcher: "/game/:slug",
};
