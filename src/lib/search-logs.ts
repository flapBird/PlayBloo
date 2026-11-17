import "server-only";

import { after } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeSearchQuery } from "@/lib/search-query";

/**
 * Demand-signal logging for the catalogue: search submissions that matched
 * zero published games, and not-found game/level URLs that visitors still
 * request (mostly stale indexed or shared links). Aggregated in the admin
 * Searches page to decide which games or aliases to add next.
 *
 * Rows land in `search_query_logs` (migration 00010). Logging must never slow
 * a page down or fail one, mirroring `metrics.ts`: the insert is scheduled
 * with `after()` so it runs after the response is sent, and every failure is
 * swallowed.
 */

export type SearchLogSource = "search_zero" | "game_404";

const BOT_USER_AGENT = /bot|crawl|spider|slurp/i;

/**
 * Same normalization rules as the search page's `clean()` and the search API:
 * strip the `ilike` operator characters plus copy-paste punctuation
 * (lib/search-query.ts), collapse whitespace and cap the length. Anything
 * shorter than two characters carries no signal worth a row.
 */
export function normalizeQuery(value = "", max = 80): string {
  return normalizeSearchQuery(value, max);
}

export function isBotUserAgent(userAgent: string | null): boolean {
  // Missing user agent is treated as a bot: real browsers always send one.
  return !userAgent || BOT_USER_AGENT.test(userAgent);
}

/**
 * Log one demand event. Never throws, never delays the response.
 *
 * `after` is not a request-time API, so calling this from a revalidated
 * (ISR) page keeps the route static and runs the write whenever the page is
 * regenerated. Request-time values such as the referer must therefore be
 * read by the caller, before this is scheduled.
 */
export function logSearchQuery(entry: { query: string; source: SearchLogSource; referrer?: string | null }): void {
  const query = normalizeQuery(entry.query);
  if (query.length < 2) return;
  const referrer = entry.referrer?.slice(0, 500) || null;
  const source = entry.source;

  const write = async () => {
    const { error } = await createAdminClient()
      .from("search_query_logs")
      .insert({ query, source, referrer });
    if (error) console.error("Search log write failed:", error.message);
  };

  try {
    after(write);
  } catch {
    // `after` throws outside a request scope (static build): best effort.
    write().catch(() => {});
  }
}

/**
 * Remember a submitted search that matched zero published games.
 *
 * The search page is already a dynamic route, so reading the request headers
 * here does not change its rendering mode. Crawler hits are skipped so
 * re-crawls of `/search?q=...` do not pollute the demand data.
 */
export async function logZeroResultSearch(query: string): Promise<void> {
  try {
    const requestHeaders = await headers();
    if (isBotUserAgent(requestHeaders.get("user-agent"))) return;
    logSearchQuery({ query, source: "search_zero", referrer: requestHeaders.get("referer") });
  } catch {
    // Outside a request scope (static build): nothing to log.
  }
}

/**
 * Remember a visitor hitting a not-found game (or level) URL.
 *
 * The game and level pages are ISR routes, so this deliberately reads no
 * request-time API — reading `headers()` would opt them into dynamic
 * rendering and defeat their cache. Only the slug is recorded; the revalidate
 * window already bounds repeated rows for the same slug.
 */
export function logGameNotFound(slug: string): void {
  logSearchQuery({ query: slug, source: "game_404" });
}
