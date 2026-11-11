import { CHEST_COUNTER_STORAGE_KEY } from "@/lib/constants";

/**
 * Browser-local Fortnite Chest Counter state, following the same localStorage
 * patterns as the gacha collection and favorites: one versioned key, defensive
 * reads, a change event so open components stay in sync. There is no account,
 * so clearing site data resets the tally — the page says so plainly.
 */

export interface ChestCounterState {
  version: 1;
  /** Total chests opened since the tally began. */
  total: number;
  /** How many chests were opened on the local day `date` (YYYY-MM-DD). */
  daily: { date: string; opened: number };
  updatedAt: number;
}

const EMPTY_STATE: ChestCounterState = { version: 1, total: 0, daily: { date: "", opened: 0 }, updatedAt: 0 };

/** Fired (as `detail.key`) after every write so open tabs and components stay in sync. */
export const CHEST_COUNTER_CHANGE_EVENT = "playbloo:chest-counter-change";

/** The local (device-timezone) day, so "today" matches the visitor's clock. */
export function chestCounterDayKey(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function readState(): ChestCounterState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(CHEST_COUNTER_STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const value = JSON.parse(raw) as ChestCounterState;
    if (!value || value.version !== 1 || !Number.isFinite(value.total)) return EMPTY_STATE;
    const daily = value.daily && typeof value.daily.date === "string" ? value.daily : { date: "", opened: 0 };
    return {
      version: 1,
      total: Math.max(0, Math.floor(value.total)),
      daily: { date: daily.date, opened: Number.isFinite(daily.opened) ? Math.max(0, Math.floor(daily.opened)) : 0 },
      updatedAt: Number.isFinite(value.updatedAt) ? value.updatedAt : 0,
    };
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

/** Read the tally, re-dating a stale daily counter so it no longer shows as "today". */
export function getChestCounterState(): ChestCounterState {
  const state = readState();
  if (state.daily.date !== chestCounterDayKey()) return { ...state, daily: { date: chestCounterDayKey(), opened: 0 } };
  return state;
}

/**
 * Add `delta` chests (negative for undo) and return the updated state. The
 * total and the daily counter never go below zero, so undo cannot lie.
 */
export function recordChests(delta: number, now = new Date()): ChestCounterState {
  const state = readState();
  const dateKey = chestCounterDayKey(now);
  const daily = state.daily.date === dateKey ? state.daily : { date: dateKey, opened: 0 };
  const next: ChestCounterState = {
    version: 1,
    total: Math.max(0, state.total + delta),
    daily: { date: dateKey, opened: Math.max(0, daily.opened + delta) },
    updatedAt: now.getTime(),
  };
  writeState(next);
  return next;
}

export function resetChestCounter(): void {
  writeState(EMPTY_STATE);
}
