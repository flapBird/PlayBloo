"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, RefreshCw, TriangleAlert, CheckCircle2 } from "lucide-react";

export interface MetricTrend {
  count: number;
  latest: number | null;
  p50: number | null;
  p95: number | null;
  max: number | null;
  average: number | null;
  daily: Array<{ day: string; average: number; count: number }>;
}

export interface MonitoringData {
  publishedGames: number;
  sitemapUrls: number;
  shardThreshold: number;
  shardUsage: number;
  gameRender: MetricTrend;
  sitemapGenerate: MetricTrend;
  historyDays: number;
}

interface ProbeResult {
  path: string;
  cache: string | null;
  ttfbMs: number;
  totalMs: number;
  status: number;
  cached: boolean;
}

interface ProbeSummary {
  total: number;
  cached: number;
  hitRate: number;
  ttfbP50: number | null;
  ttfbP95: number | null;
  ttfbMax: number | null;
}

function formatMs(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  if (value >= 1000) return `${(value / 1000).toFixed(2)}s`;
  return `${Math.round(value)}ms`;
}

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
}

/** A simple inline bar chart, avoiding a charting dependency in the bundle. */
function TrendBars({ points, unit }: { points: Array<{ day: string; average: number }>; unit: string }) {
  if (points.length === 0) return <p className="text-sm text-muted-foreground">No samples yet.</p>;
  const max = Math.max(...points.map((point) => point.average), 1);
  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-24">
        {points.map((point) => (
          <div key={point.day} className="flex-1 flex flex-col items-center gap-1" title={`${point.day}: ${formatMs(point.average)}`}>
            <div
              className="w-full bg-primary/70 rounded-t"
              style={{ height: `${Math.max(3, (point.average / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{points[0]?.day}</span>
        <span>peak {formatMs(max)}{unit}</span>
        <span>{points[points.length - 1]?.day}</span>
      </div>
    </div>
  );
}

export function MonitoringPanel({ initial }: { initial: MonitoringData }) {
  const [data] = useState(initial);
  const [probes, setProbes] = useState<ProbeResult[]>([]);
  const [summary, setSummary] = useState<ProbeSummary | null>(null);
  const [probing, setProbing] = useState(false);
  const [error, setError] = useState("");

  const runProbe = useCallback(async () => {
    setProbing(true);
    setError("");
    try {
      const response = await fetch("/api/admin/monitoring", { method: "POST" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Probe failed.");
      setProbes(payload.data?.probes || []);
      setSummary(payload.data?.summary || null);
    } catch (probeError) {
      setError(probeError instanceof Error ? probeError.message : "Probe failed.");
    } finally {
      setProbing(false);
    }
  }, []);

  // Run one probe on load so the page opens with live figures.
  useEffect(() => {
    const timer = setTimeout(() => void runProbe(), 0);
    return () => clearTimeout(timer);
  }, [runProbe]);

  const hitRate = summary?.hitRate ?? null;
  const healthy = hitRate === null ? null : hitRate >= 0.8;
  const shardClose = data.shardUsage >= 0.5;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Cache Hit Rate</p>
          <p className="text-3xl font-bold mt-1">
            {hitRate === null ? "—" : `${Math.round(hitRate * 100)}%`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {summary ? `${summary.cached}/${summary.total} probed` : "not probed yet"}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Probed TTFB p95</p>
          <p className="text-3xl font-bold mt-1">{formatMs(summary?.ttfbP95)}</p>
          <p className="text-xs text-muted-foreground mt-1">p50 {formatMs(summary?.ttfbP50)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Published Games</p>
          <p className="text-3xl font-bold mt-1">{formatNumber(data.publishedGames)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            sitemap {formatNumber(data.sitemapUrls)} URLs
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Shard Threshold</p>
          <p className="text-3xl font-bold mt-1">
            {Math.round(data.shardUsage * 100)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatNumber(data.publishedGames)} / {formatNumber(data.shardThreshold)} games
          </p>
        </div>
      </div>

      {healthy !== null && (
        <div
          className={`flex items-center gap-2 rounded-xl border p-4 text-sm ${
            healthy ? "text-emerald-600" : "text-destructive"
          }`}
        >
          {healthy ? <CheckCircle2 className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4" />}
          <span>
            {healthy
              ? "Crawlers are mostly served from cache. New pages are pre-rendered and ready."
              : "Most probed pages were rendered on demand. Crawlers pay the render cost on every new URL."}
          </span>
        </div>
      )}

      {shardClose && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <TriangleAlert className="h-4 w-4" />
          <span>
            The catalogue is past half of the sitemap shard threshold. Plan the split before it reaches{" "}
            {formatNumber(data.shardThreshold)} games.
          </span>
        </div>
      )}

      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Crawl Probe</h2>
          <button
            type="button"
            onClick={() => void runProbe()}
            disabled={probing}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${probing ? "animate-spin" : ""}`} />
            {probing ? "Probing..." : "Run probe"}
          </button>
        </div>
        {error && (
          <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive mb-4">
            {error}
          </p>
        )}
        {probes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Path</th>
                  <th className="text-left py-2 font-medium">Cache</th>
                  <th className="text-right py-2 font-medium">TTFB</th>
                  <th className="text-right py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {probes.map((probe) => (
                  <tr key={probe.path} className="border-b last:border-0">
                    <td className="py-2 font-mono text-xs">{probe.path}</td>
                    <td className="py-2">
                      {probe.cached ? (
                        <span className="text-emerald-600">{probe.cache || "CACHED"}</span>
                      ) : (
                        <span className="text-amber-600">RENDERED</span>
                      )}
                    </td>
                    <td className="text-right py-2">{formatMs(probe.ttfbMs)}</td>
                    <td className="text-right py-2">{formatMs(probe.totalMs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No probe results yet.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-1">Cold Render Time</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Server-side render cost when a page is not in cache ({data.gameRender.count} samples)
          </p>
          <TrendBars points={data.gameRender.daily} unit="" />
          <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
            <div><p className="text-muted-foreground">p50</p><p className="font-semibold">{formatMs(data.gameRender.p50)}</p></div>
            <div><p className="text-muted-foreground">p95</p><p className="font-semibold">{formatMs(data.gameRender.p95)}</p></div>
            <div><p className="text-muted-foreground">max</p><p className="font-semibold">{formatMs(data.gameRender.max)}</p></div>
            <div><p className="text-muted-foreground">avg</p><p className="font-semibold">{formatMs(data.gameRender.average)}</p></div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-1">Sitemap Generation</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Time to build the sitemap ({data.sitemapGenerate.count} samples, hourly revalidation)
          </p>
          <TrendBars points={data.sitemapGenerate.daily} unit="" />
          <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
            <div><p className="text-muted-foreground">p50</p><p className="font-semibold">{formatMs(data.sitemapGenerate.p50)}</p></div>
            <div><p className="text-muted-foreground">p95</p><p className="font-semibold">{formatMs(data.sitemapGenerate.p95)}</p></div>
            <div><p className="text-muted-foreground">max</p><p className="font-semibold">{formatMs(data.sitemapGenerate.max)}</p></div>
            <div><p className="text-muted-foreground">avg</p><p className="font-semibold">{formatMs(data.sitemapGenerate.average)}</p></div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Activity className="h-3.5 w-3.5" />
        History covers the last {data.historyDays} days. Metrics are stored in the playbloo-metrics bucket and are
        best-effort: a failed write never affects a page.
      </p>
    </div>
  );
}
