import {
  FAVORITES_STORAGE_KEY,
  MAX_RECENTLY_PLAYED_GAMES,
  RECENTLY_PLAYED_STORAGE_KEY,
} from "@/lib/constants";

const LEGACY_HISTORY_KEY = "playbloo_history";
export const LIBRARY_CHANGE_EVENT = "playbloo:library-change";

export interface FavoriteRecord {
  gameId: string;
  timestamp: number;
}

export interface RecentPlayRecord {
  gameId: string;
  lastPlayedAt: number;
  snapshot?: {
    slug: string;
    title: string;
    thumbnailUrl: string | null;
  };
}

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (value.length) localStorage.setItem(key, JSON.stringify(value));
    else localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(LIBRARY_CHANGE_EVENT, { detail: { key } }));
    return true;
  } catch {
    return false;
  }
}

function migrateLegacyHistory(): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(RECENTLY_PLAYED_STORAGE_KEY)) return;
    const legacy = readArray<{
      gameId?: string;
      playedAt?: number;
      slug?: string;
      title?: string;
      thumbnailUrl?: string | null;
    }>(LEGACY_HISTORY_KEY);
    const migrated = legacy
      .filter((item) => item && item.gameId && item.slug && item.title)
      .map((item) => ({
        gameId: item.gameId as string,
        lastPlayedAt: item.playedAt || Date.now(),
        snapshot: {
          slug: item.slug as string,
          title: item.title as string,
          thumbnailUrl: item.thumbnailUrl || null,
        },
      }))
      .slice(0, MAX_RECENTLY_PLAYED_GAMES);
    if (migrated.length) localStorage.setItem(RECENTLY_PLAYED_STORAGE_KEY, JSON.stringify(migrated));
    localStorage.removeItem(LEGACY_HISTORY_KEY);
  } catch {
    // Ignore malformed legacy state.
  }
}

export function getFavorites(): FavoriteRecord[] {
  return readArray<FavoriteRecord>(FAVORITES_STORAGE_KEY)
    .filter((item) => Boolean(item) && typeof item.gameId === "string" && Number.isFinite(item.timestamp))
    .sort((a, b) => b.timestamp - a.timestamp);
}

export function isFavorite(gameId: string): boolean {
  return getFavorites().some((item) => item.gameId === gameId);
}

export function toggleFavorite(gameId: string): boolean {
  const favorites = getFavorites();
  const exists = favorites.some((item) => item.gameId === gameId);
  const saved = writeArray(
    FAVORITES_STORAGE_KEY,
    exists
      ? favorites.filter((item) => item.gameId !== gameId)
      : [{ gameId, timestamp: Date.now() }, ...favorites],
  );
  if (!saved) throw new Error("This browser could not save your favorites. Please try again.");
  return !exists;
}

export function getRecentPlays(limit = MAX_RECENTLY_PLAYED_GAMES): RecentPlayRecord[] {
  migrateLegacyHistory();
  return readArray<RecentPlayRecord>(RECENTLY_PLAYED_STORAGE_KEY)
    .filter((item) => Boolean(item) && typeof item.gameId === "string" && Number.isFinite(item.lastPlayedAt))
    .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
    .slice(0, limit);
}

export function addPlayRecord(
  item: Pick<RecentPlayRecord, "gameId"> & NonNullable<RecentPlayRecord["snapshot"]>,
): void {
  const remaining = getRecentPlays().filter((record) => record.gameId !== item.gameId);
  writeArray(RECENTLY_PLAYED_STORAGE_KEY, [
    {
      gameId: item.gameId,
      lastPlayedAt: Date.now(),
      snapshot: {
        slug: item.slug,
        title: item.title,
        thumbnailUrl: item.thumbnailUrl,
      },
    },
    ...remaining,
  ].slice(0, MAX_RECENTLY_PLAYED_GAMES));
}

export function removePlayRecord(gameId: string): boolean {
  return writeArray(
    RECENTLY_PLAYED_STORAGE_KEY,
    getRecentPlays().filter((item) => item.gameId !== gameId),
  );
}

export function clearHistory(): void {
  writeArray(RECENTLY_PLAYED_STORAGE_KEY, []);
}

export function restorePlayRecord(record: RecentPlayRecord): boolean {
  return writeArray(RECENTLY_PLAYED_STORAGE_KEY, [record, ...getRecentPlays().filter((item) => item.gameId !== record.gameId)].sort((a, b) => b.lastPlayedAt - a.lastPlayedAt).slice(0, MAX_RECENTLY_PLAYED_GAMES));
}
