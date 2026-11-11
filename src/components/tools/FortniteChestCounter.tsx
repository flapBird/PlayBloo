"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, RotateCcw, Undo2 } from "lucide-react";
import { CHEST_COUNTER_STORAGE_KEY } from "@/lib/constants";
import {
  CHEST_COUNTER_CHANGE_EVENT,
  chestCounterDayKey,
  getChestCounterState,
  recordChests,
  resetChestCounter,
  type ChestCounterState,
} from "@/lib/chest-counter";

/**
 * Fortnite Treasure Hunters chest tally. The counter itself is a big,
 * mobile-first tap target; the odds panel turns the count into live Pirate
 * Token probabilities using Epic's published per-chest odds (see the page's
 * odds table for the full reward tier list and sources).
 */

/** Epic's published odds, normal match (November 7, 2026). */
const TOKEN_ONE_IN_NORMAL = 137500;
/** Treasure Hour boost published for the remaining Saturdays (1.5×). */
const TOKEN_ONE_IN_TREASURE_HOUR = 91667;
const MILESTONES = [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000];

function nextMilestone(total: number): number | null {
  return MILESTONES.find((milestone) => milestone > total) ?? null;
}

function formatPercent(probability: number): string {
  const percent = probability * 100;
  if (percent === 0) return "0%";
  if (percent >= 10) return `${percent.toFixed(1)}%`;
  if (percent >= 1) return `${percent.toFixed(2)}%`;
  return `${percent.toFixed(percent >= 0.01 ? 3 : 4)}%`;
}

/** P(at least one token after `chests` independent chests). */
function tokenChance(chests: number, oneIn: number): number {
  if (chests <= 0) return 0;
  return 1 - Math.pow(1 - 1 / oneIn, chests);
}

/** Chests needed for a coin-flip chance: ln(2) folds into the per-chest odds. */
function coinFlipChests(oneIn: number): number {
  return Math.round(Math.log(2) * oneIn);
}

export function FortniteChestCounter() {
  const [state, setState] = useState<ChestCounterState | null>(null);
  const [treasureHour, setTreasureHour] = useState(false);

  useEffect(() => {
    const sync = () => setState(getChestCounterState());
    sync();
    const onChange = (event: Event) => {
      if (event instanceof CustomEvent && event.detail?.key !== CHEST_COUNTER_STORAGE_KEY) return;
      sync();
    };
    window.addEventListener(CHEST_COUNTER_CHANGE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CHEST_COUNTER_CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = useCallback((delta: number) => setState(recordChests(delta)), []);
  const reset = useCallback(() => {
    if (window.confirm("Reset your chest count in this browser? This cannot be undone.")) {
      resetChestCounter();
      setState(getChestCounterState());
    }
  }, []);

  const total = state?.total ?? 0;
  const today = state && state.daily.date === chestCounterDayKey() ? state.daily.opened : 0;
  const milestone = nextMilestone(total);
  const oneIn = treasureHour ? TOKEN_ONE_IN_TREASURE_HOUR : TOKEN_ONE_IN_NORMAL;
  const chance = tokenChance(total, oneIn);

  return (
    <div className="rounded-2xl border bg-card/50 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Chests opened</p>
        <p className="rounded-full border px-3 py-1 text-xs font-bold tabular-nums text-muted-foreground">
          Today: {today}
        </p>
      </div>
      <p
        className="mt-2 text-6xl font-black tabular-nums tracking-tight sm:text-7xl"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {state ? total : "—"}
      </p>

      {milestone && (
        <div className="mt-3">
          <div
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={milestone}
            aria-valuenow={Math.min(total, milestone)}
            aria-label={`Progress to ${milestone} chests`}
          >
            <div
              className="h-full rounded-full bg-primary transition-all motion-reduce:transition-none"
              style={{ width: `${Math.min(100, (total / milestone) * 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground tabular-nums">
            {milestone - total} to go until {milestone} chests
          </p>
        </div>
      )}
      {!milestone && state && total > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">All milestones cleared. The counter keeps counting anyway.</p>
      )}

      <div className="mt-5 grid gap-2.5">
        <button
          type="button"
          disabled={!state}
          onClick={() => add(1)}
          aria-label="Count one chest opened"
          className="flex min-h-24 items-center justify-center gap-2 rounded-2xl bg-primary text-xl font-black text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-2xl"
        >
          <Plus className="h-6 w-6" aria-hidden="true" /> Opened a chest
        </button>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <button
            type="button"
            disabled={!state}
            onClick={() => add(5)}
            className="min-h-11 rounded-xl border bg-background px-4 text-sm font-bold tabular-nums transition hover:bg-muted disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            +5
          </button>
          <button
            type="button"
            disabled={!state}
            onClick={() => add(10)}
            className="min-h-11 rounded-xl border bg-background px-4 text-sm font-bold tabular-nums transition hover:bg-muted disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            +10
          </button>
          <button
            type="button"
            disabled={!state || total === 0}
            onClick={() => add(-1)}
            className="min-h-11 inline-flex items-center justify-center gap-1.5 rounded-xl border bg-background px-4 text-sm font-bold transition hover:bg-muted disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Undo2 className="h-4 w-4" aria-hidden="true" /> Undo
          </button>
          <button
            type="button"
            disabled={!state || total === 0}
            onClick={reset}
            className="min-h-11 inline-flex items-center justify-center gap-1.5 rounded-xl border border-destructive/40 bg-background px-4 text-sm font-bold text-destructive transition hover:bg-muted disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-muted/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold tracking-tight">Pirate Token odds at your count</h3>
          <button
            type="button"
            aria-pressed={treasureHour}
            onClick={() => setTreasureHour((value) => !value)}
            className="min-h-11 rounded-full border px-3 py-1.5 text-xs font-bold transition hover:bg-muted aria-pressed:bg-primary aria-pressed:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Treasure Hour ×1.5
          </button>
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground" role="status" aria-live="polite">
          <li className="tabular-nums">
            Token odds per chest: <strong className="text-foreground">1 in {oneIn.toLocaleString("en-US")}</strong>
            {treasureHour && " (boosted Saturday window)"}
          </li>
          <li className="tabular-nums">
            {state && total > 0
              ? `Chance at least one token dropped in your ${total.toLocaleString("en-US")} chests: ${formatPercent(chance)}`
              : "Count chests above to see your live token chance here."}
          </li>
          <li className="tabular-nums">
            Coin-flip chance needs about {coinFlipChests(oneIn).toLocaleString("en-US")} chests.
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Odds are Epic&apos;s published per-chest figures for a normal match; Treasure Hours multiply them as announced.
          They describe chance, not luck — the counter never predicts a drop.
        </p>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Your count is saved in this browser only — there is no account, and clearing site data resets it.
      </p>
    </div>
  );
}
