const STORAGE_KEY = "playbloo_history";
const MAX_ITEMS = 20;

export interface PlayHistoryItem {
  gameId: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  playedAt: number;
}

function getAll(): PlayHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PlayHistoryItem[];
  } catch {
    return [];
  }
}

export function addPlayRecord(item: Omit<PlayHistoryItem, "playedAt">): void {
  if (typeof window === "undefined") return;
  try {
    const list = getAll();
    // Remove existing entry for same game
    const filtered = list.filter((r) => r.gameId !== item.gameId);
    // Add to front
    filtered.unshift({ ...item, playedAt: Date.now() });
    // Keep only MAX_ITEMS
    const trimmed = filtered.slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage may be full or disabled
  }
}

export function getRecentPlays(limit: number = 8): PlayHistoryItem[] {
  return getAll().slice(0, limit);
}

export function removePlayRecord(gameId: string): void {
  if (typeof window === "undefined") return;
  try {
    const remaining = getAll().filter((item) => item.gameId !== gameId);
    if (remaining.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  } catch {}
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
