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
 * Fortnite Treasure Hunters chest tally.
 *
 * Layout: a counter column (hero count, tap button, quick actions) beside an
 * odds sidebar that turns the count into live Pirate Token probabilities
 * using Epic's published per-chest odds. The tap button is deliberately the
 * largest element on mobile and a controlled ~half-width card action on
 * desktop, so quick actions stay reachable without a second look.
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
    <div className="grid items-start gap-4 lg:grid-cols-5">
      {/* Counter column: hero count, tap button, quick actions */}
      <section aria-label="Chest counter" className="rounded-2xl border bg-card/50 p-5 sm:p-6 lg:col-span-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Chests opened</p>
          <p className="rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums text-muted-foreground">
            Today: {today}
          </p>
        </div>

        <div className="mt-5 text-center">
          <p
            className="text-7xl font-black tabular-nums leading-none tracking-tight sm:text-8xl"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {state ? total.toLocaleString("en-US") : "—"}
          </p>
          {milestone && (
            <div className="mx-auto mt-5 max-w-xs">
              <div
                className="h-1.5 overflow-hidden rounded-full bg-muted"
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
              <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">
                {milestone - total} to go until {milestone} chests
              </p>
            </div>
          )}
          {!milestone && state && total > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">All milestones cleared. The counter keeps counting anyway.</p>
          )}
        </div>

        <button
          type="button"
          disabled={!state}
          onClick={() => add(1)}
          aria-label="Count one chest opened"
          className="mt-6 flex h-20 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-xl"
        >
          <Plus className="h-5 w-5" aria-hidden="true" /> Opened a chest
        </button>

        <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            disabled={!state}
            onClick={() => add(5)}
            className="h-10 rounded-xl border bg-background px-3 text-sm font-bold tabular-nums transition hover:bg-muted disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            +5
          </button>
          <button
            type="button"
            disabled={!state}
            onClick={() => add(10)}
            className="h-10 rounded-xl border bg-background px-3 text-sm font-bold tabular-nums transition hover:bg-muted disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            +10
          </button>
          <button
            type="button"
            disabled={!state || total === 0}
            onClick={() => add(-1)}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border bg-background px-3 text-sm font-bold transition hover:bg-muted disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" /> Undo
          </button>
          <button
            type="button"
            disabled={!state || total === 0}
            onClick={reset}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-destructive/40 bg-background px-3 text-sm font-bold text-destructive transition hover:bg-muted disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reset
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Auto-saves in this browser only — no account, nothing uploaded. Clearing site data resets it.
        </p>
      </section>

      {/* Odds sidebar: live Pirate Token probabilities */}
      <aside aria-label="Pirate Token odds" className="rounded-2xl border bg-card/50 p-5 lg:col-span-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold tracking-tight">Pirate Token odds</h3>
          <button
            type="button"
            aria-pressed={treasureHour}
            onClick={() => setTreasureHour((value) => !value)}
            className="rounded-full border px-2.5 py-1 text-[11px] font-bold transition hover:bg-muted aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Treasure Hour ×1.5
          </button>
        </div>

        <div className="mt-5 rounded-xl bg-muted/30 p-4 text-center" role="status" aria-live="polite">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Your token chance</p>
          <p className="mt-1 text-3xl font-black tabular-nums tracking-tight text-primary">
            {state && total > 0 ? formatPercent(chance) : "—"}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {state && total > 0
              ? `At least one token across ${total.toLocaleString("en-US")} chests`
              : "Count a chest above to see the live chance."}
          </p>
        </div>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">Odds per chest</dt>
            <dd className="font-bold tabular-nums text-foreground">1 in {oneIn.toLocaleString("en-US")}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">Coin-flip needs</dt>
            <dd className="font-bold tabular-nums text-foreground">≈ {coinFlipChests(oneIn).toLocaleString("en-US")} chests</dd>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">Milestone</dt>
            <dd className="font-bold tabular-nums text-foreground">{milestone ? milestone.toLocaleString("en-US") : "cleared"}</dd>
          </div>
        </dl>
        {treasureHour && (
          <p className="mt-3 text-xs font-bold text-primary">Boosted Saturday window — odds recalculated above.</p>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          Odds are Epic&apos;s published per-chest figures for a normal match; Treasure Hours multiply them as announced.
          They describe chance, not luck — the counter never predicts a drop.
        </p>
      </aside>
    </div>
  );
}
