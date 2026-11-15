"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

interface LastRenew {
  running?: boolean;
  startedAt?: string;
  finishedAt?: string;
  copied?: number;
  failed?: number;
  buildId?: string | null;
}

interface Status {
  buildId: string | null;
  lastRenew: LastRenew | null;
}

async function fetchStatus(): Promise<Status> {
  const res = await fetch("/api/admin/cache-renew");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Maintenance card on the admin dashboard: shows the live cache batch (the
 * OpenNext build ID that names the `incremental-cache/<buildId>/` folder in
 * R2) and a button that extends the cache's lifecycle age — useful when a
 * release is deliberately delayed past the bucket's deletion window.
 */
export function CacheMaintenanceCard() {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const next = await fetchStatus();
        if (!cancelled) {
          setStatus(next);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const renew = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/cache-renew", { method: "POST" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `HTTP ${res.status}`);
      // Poll until the background run flips the marker back to not-running.
      for (let i = 0; i < 40; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const next = await fetchStatus();
        setStatus(next);
        if (!next.lastRenew?.running) break;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, []);

  const lastRenew = status?.lastRenew;
  const running = Boolean(lastRenew?.running);

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="font-semibold mb-1">Cache maintenance</h2>
      <p className="text-sm text-muted-foreground">
        Renews every cached page in R2 (rewrite refreshes the timestamp the
        deletion rule counts from). Run this if a release is delayed beyond the
        cache expiry window.
      </p>

      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Live cache batch</dt>
          <dd className="font-mono text-xs break-all text-right">{status?.buildId || "unknown"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Last renewal</dt>
          <dd>
            {lastRenew?.finishedAt
              ? new Date(lastRenew.finishedAt).toLocaleString()
              : lastRenew?.running
                ? "in progress…"
                : "never"}
          </dd>
        </div>
        {lastRenew?.finishedAt && !running && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Last result</dt>
            <dd>
              {lastRenew.copied ?? 0} renewed{lastRenew.failed ? `, ${lastRenew.failed} failed` : ""}
            </dd>
          </div>
        )}
      </dl>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      {running && <p className="mt-3 text-sm text-primary">Renewal in progress…</p>}

      <button
        onClick={renew}
        disabled={busy || running || loading}
        className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg border bg-secondary px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${busy || running ? "animate-spin" : ""}`} />
        {running ? "Renewing…" : busy ? "Waiting for renewal…" : "Renew cache age"}
      </button>
    </div>
  );
}
