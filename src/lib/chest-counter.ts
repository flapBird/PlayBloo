import { CHEST_COUNTER_STORAGE_KEY } from "@/lib/constants";

/**
 * Browser-local Fortnite Chest Counter state, following the same localStorage
 * patterns as the gacha collection and favorites: one versioned key, defensive
 * reads, a change event so open components stay in sync. There is no account,
 * so clearing site data resets the tally — the page says so plainly.
 *
 * v2 keeps per-day counts (last 14 days) instead of a single "today" slot so
 * the tool can project a recent pace and an ETA toward chance thresholds.
 * v1 states (one daily slot) migrate on read.
 */

export interface ChestCounterState {
  version: 2;
  /** Total chests opened since the tally began. */
  total: number;
  /** Chests opened per local day (YYYY-MM-DD), pruned to the recent window. */
  byDay: Record<string, number>;
  updatedAt: number;
}

const EMPTY_STATE: ChestCounterState = { version: 2, total: 0, byDay: {}, updatedAt: 0 };
/** Days of per-day history the store keeps — 14 covers the 7-day pace window. */
const DAY_HISTORY_LIMIT = 14;

/** Fired (as `detail.key`) after every write so open tabs and components stay in sync. */
export const CHEST_COUNTER_CHANGE_EVENT = "playbloo:chest-counter-change";

/** The local (device-timezone) day, so "today" matches the visitor's clock. */
export function chestCounterDayKey(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** `days`-before-`todayKey` cutoff as a YYYY-MM-DD string (lexicographic compare). */
function dayKeyBefore(todayKey: string, days: number): string {
  const date = dayKeyToUtc(todayKey);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

/** Parse a YYYY-MM-DD key as UTC midnight (safe for day-difference math). */
function dayKeyToUtc(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function pruneByDay(byDay: Record<string, number>, todayKey: string): Record<string, number> {
  const cutoff = dayKeyBefore(todayKey, DAY_HISTORY_LIMIT - 1);
  const pruned: Record<string, number> = {};
  for (const [key, opened] of Object.entries(byDay)) {
    if (key >= cutoff && opened > 0) pruned[key] = opened;
  }
  return pruned;
}

function migrate(raw: unknown): ChestCounterState | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const total = Number(value.total);
  if (!Number.isFinite(total)) return null;
  const updatedAt = Number.isFinite(value.updatedAt as number) ? (value.updatedAt as number) : 0;
  const byDay: Record<string, number> = {};
  if (value.version === 2 && value.byDay && typeof value.byDay === "object") {
    for (const [key, opened] of Object.entries(value.byDay as Record<string, unknown>)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) && Number.isFinite(opened as number) && (opened as number) > 0) {
        byDay[key] = Math.floor(opened as number);
      }
    }
  } else if (value.version === 1 && value.daily && typeof value.daily === "object") {
    // v1 kept a single { date, opened } slot; carry it over when it held data.
    const daily = value.daily as { date?: unknown; opened?: unknown };
    if (typeof daily.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(daily.date) && Number(daily.opened) > 0) {
      byDay[daily.date] = Math.max(0, Math.floor(Number(daily.opened)));
    }
  }
  return { version: 2, total: Math.max(0, Math.floor(total)), byDay, updatedAt };
}

function readState(): ChestCounterState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(CHEST_COUNTER_STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    return migrate(JSON.parse(raw)) ?? EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

function writeState(state: ChestCounterState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHEST_COUNTER_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CHEST_COUNTER_CHANGE_EVENT, { detail: { key: CHEST_COUNTER_STORAGE_KEY } }));
  } catch {
    // Storage can be full or blocked; the UI treats the tap as lost rather than crashing.
  }
}

/** Read the tally, pruning day history so old days cannot reappear. */
export function getChestCounterState(): ChestCounterState {
  const state = readState();
  return { ...state, byDay: pruneByDay(state.byDay, chestCounterDayKey()) };
}

/**
 * Add `delta` chests (negative for undo) and return the updated state. The
 * total and the per-day counter never go below zero, so undo cannot lie.
 */
export function recordChests(delta: number, now = new Date()): ChestCounterState {
  const state = readState();
  const todayKey = chestCounterDayKey(now);
  const next: ChestCounterState = {
    version: 2,
    total: Math.max(0, state.total + delta),
    byDay: pruneByDay({ ...state.byDay, [todayKey]: Math.max(0, (state.byDay[todayKey] ?? 0) + delta) }, todayKey),
    updatedAt: now.getTime(),
  };
  writeState(next);
  return next;
}

export function resetChestCounter(): void {
  writeState(EMPTY_STATE);
}

/**
 * Average chests per calendar day over the last `windowDays` local days.
 * The divisor is the span from the first active day (capped at the window),
 * so a first session projects on its own numbers instead of `/7`. Returns
 * null when there is nothing to average yet.
 */
export function chestPacePerDay(byDay: Record<string, number>, now = new Date(), windowDays = 7): number | null {
  const todayKey = chestCounterDayKey(now);
  const cutoff = dayKeyBefore(todayKey, windowDays - 1);
  const active = Object.entries(byDay).filter(([key, opened]) => key >= cutoff && key <= todayKey && opened > 0);
  if (!active.length) return null;
  const sum = active.reduce((total, [, opened]) => total + opened, 0);
  const spanDays = Math.min(windowDays, Math.round((dayKeyToUtc(todayKey).getTime() - dayKeyToUtc(active[0][0]).getTime()) / 86_400_000) + 1);
  return sum / Math.max(1, spanDays);
}
