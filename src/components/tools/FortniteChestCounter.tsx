"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Check, Plus, RotateCcw, Undo2 } from "lucide-react";
import { CHEST_COUNTER_STORAGE_KEY } from "@/lib/constants";
import {
  CHEST_COUNTER_CHANGE_EVENT,
  chestCounterDayKey,
  chestPacePerDay,
  getChestCounterState,
  recordChests,
  resetChestCounter,
  type ChestCounterState,
} from "@/lib/chest-counter";

/**
 * Fortnite Treasure Hunters chest tally.
 *
 * Layout: a counter column (hero count, tap button, quick actions, recent
 * pace and ETA) beside an odds sidebar (live chance, the chance ladder, and
 * the next Treasure Hour countdown). The tap button stays the largest
 * element on mobile and a controlled ~half-width card action on desktop;
 * the projections are what turn the raw count into a go/no-go decision.
 */

/** Epic's published odds, normal match (November 7, 2026). */
const TOKEN_ONE_IN_NORMAL = 137500;
/** Treasure Hour boost published for the remaining Saturdays (1.5×). */
const TOKEN_ONE_IN_TREASURE_HOUR = 91667;
const MILESTONES = [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000];
/** Ladder thresholds shown in the odds sidebar (cumulative chance targets). */
const CHANCE_LADDER = [0.01, 0.1, 0.25, 0.5, 0.75, 0.9] as const;

/**
 * Announced Treasure Hour windows: Saturdays November 14 – December 5, 2026,
 * 2–4 PM ET and 9–11 PM ET. All fall inside US standard time (EST, UTC-5)
 * after the November 1 DST end, so fixed offsets are safe here; Epic treats
 * the in-game news tab as the authority for any given Saturday.
 */
const TREASURE_HOUR_DATES = ["2026-11-14", "2026-11-21", "2026-11-28", "2026-12-05"];
const TREASURE_HOUR_WINDOWS_ET = [
  { startHour: 14, endHour: 16, label: "2–4 PM ET" },
  { startHour: 21, endHour: 23, label: "9–11 PM ET" },
] as const;

interface TreasureHourWindow {
  start: Date;
  end: Date;
  dayLabel: string;
  windowLabel: string;
}

function buildTreasureHourWindows(): TreasureHourWindow[] {
  const windows: TreasureHourWindow[] = [];
  for (const date of TREASURE_HOUR_DATES) {
    const dayLabel = new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
    for (const { startHour, endHour, label } of TREASURE_HOUR_WINDOWS_ET) {
      windows.push({
        start: new Date(`${date}T${String(startHour).padStart(2, "0")}:00:00-05:00`),
        end: new Date(`${date}T${String(endHour).padStart(2, "0")}:00:00-05:00`),
        dayLabel,
        windowLabel: label,
      });
    }
  }
  return windows.sort((a, b) => a.start.getTime() - b.start.getTime());
}

function nextTreasureHour(now: number, windows: TreasureHourWindow[]): { status: "live" | "upcoming" | "over"; window?: TreasureHourWindow } {
  const live = windows.find((window) => window.start.getTime() <= now && now < window.end.getTime());
  if (live) return { status: "live", window: live };
  const upcoming = windows.find((window) => window.start.getTime() > now);
  return upcoming ? { status: "upcoming", window: upcoming } : { status: "over" };
}

function formatCountdown(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60_000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

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

/** Chests needed for a `chance` cumulative probability: folds ln(1/(1-c)) into the odds. */
function chestsForChance(chance: number, oneIn: number): number {
  return Math.ceil(Math.log(1 / (1 - chance)) * oneIn);
}

const shortDateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const yearDateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

/** ETAs beyond a year need the year — "Feb 4" alone would read as next February. */
function formatEtaDate(timestamp: number, daysOut: number): string {
  return daysOut > 365
    ? yearDateFormatter.format(new Date(timestamp))
    : shortDateFormatter.format(new Date(timestamp));
}

/**
 * A lint-clean "current time" source: the clock snapshot only changes on the
 * store's 30s tick, so React can read it during render without impurity, and
 * the server snapshot (0) keeps SSR markup deterministic.
 */
let clockSnapshot = 0;
function subscribeToClock(onStoreChange: () => void): () => void {
  const timer = window.setInterval(() => {
    clockSnapshot = Date.now();
    onStoreChange();
  }, 30_000);
  return () => window.clearInterval(timer);
}
function getClockSnapshot(): number {
  if (clockSnapshot === 0) clockSnapshot = Date.now();
  return clockSnapshot;
}

export function FortniteChestCounter() {
  const [state, setState] = useState<ChestCounterState | null>(null);
  const [treasureHour, setTreasureHour] = useState(false);
  const nowTs = useSyncExternalStore(subscribeToClock, getClockSnapshot, () => 0);

  const treasureWindows = useMemo(() => buildTreasureHourWindows(), []);

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
  const today = state ? (state.byDay[chestCounterDayKey()] ?? 0) : 0;
  const milestone = nextMilestone(total);
  const oneIn = treasureHour ? TOKEN_ONE_IN_TREASURE_HOUR : TOKEN_ONE_IN_NORMAL;
  const chance = tokenChance(total, oneIn);

  // Pace and ETA: the recent calendar-day average projected onto the
  // coin-flip threshold under the currently selected odds.
  const pace = state ? chestPacePerDay(state.byDay) : null;
  const coinFlipChests = chestsForChance(0.5, oneIn);
  const paceDaysToCoinFlip = pace && pace > 0 && total < coinFlipChests ? Math.ceil((coinFlipChests - total) / pace) : null;
  const coinFlipEta =
    paceDaysToCoinFlip !== null && nowTs > 0
      ? formatEtaDate(nowTs + paceDaysToCoinFlip * 86_400_000, paceDaysToCoinFlip)
      : null;
  const paceDisplay = pace !== null ? (pace >= 100 ? Math.round(pace).toLocaleString("en-US") : pace.toFixed(pace >= 10 ? 0 : 1)) : null;

  const treasureHourState = nowTs !== null ? nextTreasureHour(nowTs, treasureWindows) : null;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-5">
      {/* Counter column: hero count, tap button, quick actions, pace */}
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

        <div className="mt-5 rounded-xl bg-muted/30 p-4 text-sm" aria-live="polite">
          {paceDisplay ? (
            <ul className="space-y-1.5 tabular-nums text-muted-foreground">
              <li>
                Recent pace: <strong className="text-foreground">≈ {paceDisplay} chests/day</strong> over the last 7 days
              </li>
              {paceDaysToCoinFlip !== null && coinFlipEta ? (
                <li>
                  At this pace, the 50% coin-flip mark ({coinFlipChests.toLocaleString("en-US")} chests) lands{" "}
                  <strong className="text-foreground">around {coinFlipEta}</strong> — about {paceDaysToCoinFlip.toLocaleString("en-US")} more days.
                </li>
              ) : (
                <li>
                  {total >= coinFlipChests
                    ? "Coin-flip threshold passed — every chest from here is gravy."
                    : "Open chests on more days to project a coin-flip date."}
                </li>
              )}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              The pace line appears once you have counted chests — it projects your 50% coin-flip date from your last 7 days.
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Auto-saves in this browser only — no account, nothing uploaded. Clearing site data resets it.
        </p>
      </section>

      {/* Odds sidebar: live chance, ladder, Treasure Hour countdown */}
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

        <div
          className="mt-4 rounded-xl border p-3.5 text-center"
          data-live={treasureHourState?.status === "live" ? "true" : undefined}
        >
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Next Treasure Hour</p>
          {treasureHourState?.status === "live" && treasureHourState.window ? (
            <>
              <p className="mt-1 text-lg font-black text-primary">LIVE — ends {treasureHourState.window.end.toLocaleTimeString("en-US", { hour: "numeric", timeZone: "America/New_York" })} ET</p>
              <p className="mt-1 text-xs text-muted-foreground">Turn on the ×1.5 toggle while you grind this window.</p>
            </>
          ) : treasureHourState?.status === "upcoming" && treasureHourState.window ? (
            <>
              <p className="mt-1 text-lg font-black tabular-nums tracking-tight">
                {formatCountdown(treasureHourState.window.start.getTime() - (nowTs ?? 0))}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {treasureHourState.window.dayLabel}, {treasureHourState.window.windowLabel} — odds 1.5× better while it runs.
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm font-bold text-muted-foreground">No announced windows remain — the season ends December 5.</p>
          )}
        </div>

        <div className="mt-4 rounded-xl bg-muted/30 p-4 text-center" role="status" aria-live="polite">
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

        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Chance ladder — 1 in {oneIn.toLocaleString("en-US")} per chest</p>
          <ul className="mt-2 space-y-1 text-sm">
            {CHANCE_LADDER.map((threshold) => {
              const needed = chestsForChance(threshold, oneIn);
              const passed = total >= needed;
              return (
                <li
                  key={threshold}
                  className={`flex items-baseline justify-between gap-2 tabular-nums ${passed ? "font-bold text-primary" : "text-muted-foreground"}`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {passed && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                    {formatPercent(threshold)} chance
                  </span>
                  <span>{needed.toLocaleString("en-US")} chests</span>
                </li>
              );
            })}
          </ul>
        </div>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">Milestone</dt>
            <dd className="font-bold tabular-nums text-foreground">{milestone ? milestone.toLocaleString("en-US") : "cleared"}</dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-muted-foreground">
          Odds are Epic&apos;s published per-chest figures for a normal match; Treasure Hours multiply them as announced.
          They describe chance, not luck — the counter never predicts a drop.
        </p>
      </aside>
    </div>
  );
}
