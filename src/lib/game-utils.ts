import type { Game, GamePlayMode, GameSource } from "@/lib/types";
import { NEW_GAME_BADGE_DAYS, UPDATED_GAME_BADGE_DAYS } from "@/lib/constants";

type PlayableGame = Pick<Game, "iframe_url" | "external_url"> &
  Partial<Pick<Game, "original_game_url" | "official_website_url">>;

export function getGamePlayMode(game: PlayableGame): GamePlayMode {
  if (game.iframe_url?.trim()) return "embedded";
  if (game.external_url?.trim() || game.original_game_url?.trim() || game.official_website_url?.trim()) return "external";
  return "unavailable";
}

export function getExternalGameUrl(game: PlayableGame): string | null {
  const value = game.external_url?.trim() || game.original_game_url?.trim() || game.official_website_url?.trim() || null;
  return isSafeWebUrl(value) ? value : null;
}

export function isSafeWebUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isDateWithinDays(value: string | null | undefined, days: number): boolean {
  if (!value) return false;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return false;
  const age = Date.now() - timestamp;
  return age >= 0 && age <= days * 24 * 60 * 60 * 1000;
}

export function getDiscoveryStatusBadge(game: Partial<Pick<Game, "is_trending" | "added_at" | "created_at" | "last_updated_at">>): "TRENDING" | "NEW" | "UPDATED" | null {
  if (game.is_trending) return "TRENDING";
  if (isDateWithinDays(game.added_at || game.created_at, NEW_GAME_BADGE_DAYS)) return "NEW";
  if (isDateWithinDays(game.last_updated_at, UPDATED_GAME_BADGE_DAYS)) return "UPDATED";
  return null;
}

/**
 * Some official game/CDN image hosts reject server-side proxy requests. Sending
 * those URLs through Next Image causes repeated 4xx transformations on Vercel.
 * Keep the exception narrow so compatible sources still get responsive images.
 */
export function shouldBypassImageOptimization(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    return new URL(value).hostname.toLowerCase() === "img.itch.zone";
  } catch {
    return false;
  }
}

export function getGameSources(game: Game): GameSource[] {
  const sources = Array.isArray(game.sources) ? game.sources : [];
  const normalized = sources.filter(
    (source): source is GameSource =>
      Boolean(source && source.type && isSafeWebUrl(source.url)),
  );

  const primaryVerifiedAt = game.last_verified_at || null;
  const candidates: GameSource[] = [
    ...(game.source_url && game.source_type
      ? [{ type: game.source_type, url: game.source_url, verifiedAt: primaryVerifiedAt }]
      : []),
    ...(game.developer_url
      ? [{ type: "Developer", url: game.developer_url, verifiedAt: primaryVerifiedAt }]
      : []),
    ...(game.steam_url
      ? [{ type: "Steam", url: game.steam_url, verifiedAt: primaryVerifiedAt }]
      : []),
    ...(game.itch_url
      ? [{ type: "itch.io", url: game.itch_url, verifiedAt: primaryVerifiedAt }]
      : []),
    ...(game.official_website_url
      ? [{ type: "Official website", url: game.official_website_url, verifiedAt: primaryVerifiedAt }]
      : []),
  ];

  const unique = new Map<string, GameSource>();
  for (const source of [...normalized, ...candidates]) {
    if (isSafeWebUrl(source.url)) unique.set(source.url, source);
  }
  return [...unique.values()];
}

export function parseSourcesText(value: string | null | undefined): GameSource[] {
  return (value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [type, url, verifiedAt] = line.split("|").map((part) => part.trim());
      return { type, url, verifiedAt: verifiedAt || null };
    })
    .filter((source) => Boolean(source.type) && isSafeWebUrl(source.url));
}

export function formatSourcesText(sources: GameSource[] | null | undefined): string {
  return (Array.isArray(sources) ? sources : [])
    .map((source) => [source.type, source.url, source.verifiedAt || ""].join(" | "))
    .join("\n");
}
