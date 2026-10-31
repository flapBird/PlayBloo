import { GACHA_PACKS_PER_DAY, GACHA_STORAGE_KEY } from "@/lib/constants";
import { LIBRARY_CHANGE_EVENT } from "@/lib/user-library";
import type { GachaRarity } from "@/lib/gacha-shared";

/**
 * Browser-local Game Gacha state, following the same localStorage patterns as
 * favorites and recently-played: one versioned key, defensive reads, a change
 * event so open components stay in sync. There is no account in V1, so
 * clearing site data resets the collection — the page says so plainly.
 */

export interface GachaCardSummary {
  gameId: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  categoryName: string | null;
  rarity: GachaRarity;
  /** True when this pull was the first time the game entered the collection. */
  isNew: boolean;
  duplicate: boolean;
}

export interface GachaCollectionEntry {
  gameId: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  categoryName: string | null;
  rarity: GachaRarity;
  firstPulledAt: number;
  lastPulledAt: number;
  pullCount: number;
}

export interface GachaPackRecord {
  openedAt: number;
  themed: boolean;
  cards: GachaCardSummary[];
}

export interface GachaState {
  version: 1;
  collection: GachaCollectionEntry[];
  /** How many packs were opened on the local day `date` (YYYY-MM-DD). */
  daily: { date: string; opened: number };
  lastPack: GachaPackRecord | null;
}

const EMPTY_STATE: GachaState = { version: 1, collection: [], daily: { date: "", opened: 0 }, lastPack: null };

/** The local (device-timezone) day, so "daily" matches the visitor's clock. */
export function gachaDayKey(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function readState(): GachaState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(GACHA_STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const value = JSON.parse(raw) as GachaState;
    if (!value || value.version !== 1 || !Array.isArray(value.collection)) return EMPTY_STATE;
    const daily = value.daily && typeof value.daily.date === "string" ? value.daily : { date: "", opened: 0 };
    return {
      version: 1,
      collection: value.collection.filter((item) => item && typeof item.gameId === "string" && typeof item.slug === "string"),
      daily: { date: daily.date, opened: Number.isFinite(daily.opened) ? daily.opened : 0 },
      lastPack: value.lastPack && Array.isArray(value.lastPack.cards) ? value.lastPack : null,
    };
  } catch {
    return EMPTY_STATE;
  }
}

function writeState(state: GachaState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GACHA_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(LIBRARY_CHANGE_EVENT, { detail: { key: GACHA_STORAGE_KEY } }));
  } catch {
    // Storage can be full or blocked; the UI treats the draw as lost rather than crashing.
  }
}

export function getGachaState(): GachaState {
  const state = readState();
  // A stored count from a previous day no longer counts against today.
  if (state.daily.date !== gachaDayKey()) return { ...state, daily: { date: gachaDayKey(), opened: 0 } };
  return state;
}

export function packsRemainingToday(state: GachaState): number {
  return Math.max(0, GACHA_PACKS_PER_DAY - state.daily.opened);
}

export function isGachaStorageEvent(event: Event): boolean {
  return event instanceof CustomEvent && event.detail?.key === GACHA_STORAGE_KEY;
}

/**
 * Persist an opened pack: upsert every pulled card into the collection and
 * advance the daily counter. Returns the updated state.
 */
export function recordGachaPack(params: {
  dateKey: string;
  themed: boolean;
  cards: GachaCardSummary[];
}): GachaState {
  const state = readState();
  const daily = state.daily.date === params.dateKey ? state.daily : { date: params.dateKey, opened: 0 };
  const byId = new Map(state.collection.map((item) => [item.gameId, item]));
  const now = Date.now();
  for (const card of params.cards) {
    const existing = byId.get(card.gameId);
    if (existing) {
      byId.set(card.gameId, { ...existing, lastPulledAt: now, pullCount: existing.pullCount + 1 });
    } else {
      byId.set(card.gameId, {
        gameId: card.gameId,
        slug: card.slug,
        title: card.title,
        thumbnailUrl: card.thumbnailUrl,
        categoryName: card.categoryName,
        rarity: card.rarity,
        firstPulledAt: now,
        lastPulledAt: now,
        pullCount: 1,
      });
    }
  }
  const next: GachaState = {
    version: 1,
    collection: [...byId.values()].sort((a, b) => b.lastPulledAt - a.lastPulledAt),
    daily: { date: params.dateKey, opened: Math.min(GACHA_PACKS_PER_DAY, daily.opened + 1) },
    lastPack: { openedAt: now, themed: params.themed, cards: params.cards },
  };
  writeState(next);
  return next;
}

export function clearGachaCollection(): void {
  writeState(EMPTY_STATE);
}
