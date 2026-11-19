"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Gauge, HardDrive } from "lucide-react";

/**
 * Generic game download-time estimator, shared by the /tools page and the
 * GTA 6 buying guide (embedded via a GuideSection flag). The math uses
 * decimal units on purpose — console stores and speed tests both speak
 * decimal GB and Mbps, and the GTA 6 preset's published table (200 GB at
 * 50 Mbps ≈ 8 hr 53 min) comes from exactly this arithmetic.
 */

const SIZE_PRESETS = [
  { label: "50 GB", value: 50 },
  { label: "100 GB", value: 100 },
  { label: "150 GB", value: 150 },
  { label: "GTA 6 · 200 GB", value: 200 },
];

const SPEED_PRESETS = [50, 100, 300, 500];

function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "—";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (hours > 0) return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
  if (minutes > 0) return seconds > 0 ? `${minutes} min ${seconds} sec` : `${minutes} min`;
  return `${seconds} sec`;
}

const chipBase =
  "rounded-full border px-2.5 py-1 text-xs font-bold transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none";
const chipActive = "border-primary bg-primary text-primary-foreground";
const chipIdle = "border-border bg-background text-muted-foreground";

export function DownloadTimeCalculator({ showToolLink = true }: { showToolLink?: boolean }) {
  const [sizeInput, setSizeInput] = useState("200");
  const [speedInput, setSpeedInput] = useState("100");

  const sizeGb = Number.parseFloat(sizeInput);
  const speedMbps = Number.parseFloat(speedInput);
  // 1 GB = 8,000 megabits (decimal), so seconds = GB × 8,000 ÷ Mbps.
  const seconds = useMemo(
    () => (sizeGb > 0 && speedMbps > 0 ? (sizeGb * 8_000) / speedMbps : Number.NaN),
    [sizeGb, speedMbps],
  );
  const valid = Number.isFinite(seconds);

  return (
    <div className="mt-4 rounded-2xl border bg-card/60 p-4 sm:p-5" aria-label="Download time calculator">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="download-size-gb"
            className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground"
          >
            <HardDrive className="h-3.5 w-3.5" aria-hidden="true" /> Download size (GB)
          </label>
          <input
            id="download-size-gb"
            type="number"
            inputMode="decimal"
            min={0.1}
            step="any"
            value={sizeInput}
            onChange={(event) => setSizeInput(event.target.value)}
            className="h-11 w-full rounded-lg border bg-background px-3 text-base font-bold tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SIZE_PRESETS.map((preset) => {
              const active = sizeGb === preset.value;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setSizeInput(String(preset.value))}
                  aria-pressed={active}
                  className={`${chipBase} ${active ? chipActive : chipIdle}`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="download-speed-mbps"
            className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground"
          >
            <Gauge className="h-3.5 w-3.5" aria-hidden="true" /> Connection speed (Mbps)
          </label>
          <input
            id="download-speed-mbps"
            type="number"
            inputMode="decimal"
            min={0.1}
            step="any"
            value={speedInput}
            onChange={(event) => setSpeedInput(event.target.value)}
            className="h-11 w-full rounded-lg border bg-background px-3 text-base font-bold tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SPEED_PRESETS.map((preset) => {
              const active = speedMbps === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSpeedInput(String(preset))}
                  aria-pressed={active}
                  className={`${chipBase} ${active ? chipActive : chipIdle}`}
                >
                  {preset} Mbps
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border bg-background p-4 text-center" aria-live="polite">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
          Estimated download time
        </p>
        <p className="mt-1 text-4xl font-black tabular-nums leading-none tracking-tight">
          {valid ? formatDuration(seconds) : "—"}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {valid
            ? `${sizeGb} GB at ${speedMbps} Mbps — transfer only, before install and updates.`
            : "Enter a file size and a connection speed to see an estimate."}
        </p>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Estimates use decimal units (1 GB = 1,000 MB); your console&apos;s download queue shows the real transfer size.
        {showToolLink && (
          <>
            {" "}
            <Link
              href="/tools/download-time-calculator"
              className="font-bold text-primary hover:underline"
            >
              Open the full calculator
              <ArrowUpRight className="ml-0.5 inline h-3 w-3" aria-hidden="true" />
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
