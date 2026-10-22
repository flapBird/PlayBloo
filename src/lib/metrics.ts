import "server-only";

import { after } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare/cloudflare-context";

/**
 * Server-side monitoring for crawl readiness.
 *
 * Two things matter for a catalogue site that grows every day: whether a
 * crawler gets a cached page (fast) or has to wait for a full render (slow),
 * and whether sitemap generation stays cheap as the catalogue grows.
 *
 * The R2 incremental cache reports hits through the `x-opennext-cache`
 * response header, but only on the intercepted path. A miss never reaches
 * the application at all — the request is served by Next.js rendering the
 * route. So the application cannot observe "I was a miss" from a header; it
 * can only observe that it ran at all. Counting renders is therefore the
 * same as counting misses, and timing the render gives the number a crawler
 * would actually wait for.
 *
 * Metrics are written to a separate R2 bucket so they never mix with the
 * page cache, and every write is best-effort: monitoring must never slow a
 * page down or fail one.
 */

const BUCKET_BINDING = "METRICS_BUCKET";
const METRICS_PREFIX = "metrics";

/**
 * The subset of the R2 bucket API this module uses.
 *
 * `cloudflare-env.d.ts` is excluded from the TypeScript project, so the
 * generated `R2Bucket` type is not in scope here. Declaring the small part
 * that is actually used keeps this module self-contained.
 */
interface MetricsObject {
  text(): Promise<string>;
}

interface MetricsListResult {
  objects: MetricsObject[];
  truncated: boolean;
  cursor?: string;
}

interface MetricsBucket {
  put(
    key: string,
    value: string,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<MetricsListResult>;
}

/** A single recorded measurement. */
export interface MetricSample {
  /** Metric name, e.g. `game_render_ms`. */
  name: string;
  /** Numeric value of the measurement. */
  value: number;
  /** Milliseconds since the epoch, used for ordering samples. */
  at: number;
  /** Optional free-form context, e.g. the slug that was rendered. */
  detail?: string;
}

function getMetricsBucket() {
  try {
    // The sync accessor throws when there is no request context, which is the
    // case during a static build and in local `next dev`. Metrics are then
    // simply not recorded.
    const { env } = getCloudflareContext();
    const bindings = env as unknown as Record<string, MetricsBucket | undefined>;
    return bindings?.[BUCKET_BINDING];
  } catch {
    return undefined;
  }
}

function sampleKey(sample: MetricSample) {
  const day = new Date(sample.at).toISOString().slice(0, 10);
  // A random suffix keeps concurrent samples from overwriting each other.
  const unique = `${sample.at}-${Math.random().toString(36).slice(2, 8)}`;
  return `${METRICS_PREFIX}/${sample.name}/${day}/${unique}.json`;
}

/**
 * Record one measurement.
 *
 * Never throws and never rejects: a monitoring failure must not surface as a
 * page failure. The write is scheduled with `after()` so it completes after
 * the response is sent rather than delaying it.
 */
export function recordMetric(name: string, value: number, detail?: string) {
  const bucket = getMetricsBucket();
  if (!bucket) return;

  const sample: MetricSample = { name, value, at: Date.now(), ...(detail ? { detail } : {}) };

  const write = () =>
    bucket
      .put(sampleKey(sample), JSON.stringify(sample), {
        httpMetadata: { contentType: "application/json" },
      })
      .catch(() => {});

  try {
    // `after` keeps the write alive past the response. It throws outside a
    // request scope, which is the case during a static build.
    after(write);
  } catch {
    write();
  }
}

/**
 * Read recorded samples for a metric, newest first.
 *
 * Samples live under `metrics/<name>/<day>/<unique>.json`, so the listing
 * is a prefix scan. The scan is bounded by the caller-supplied limit.
 */
export async function readMetric(name: string, limit = 2000): Promise<MetricSample[]> {
  const bucket = getMetricsBucket();
  if (!bucket) return [];

  const samples: MetricSample[] = [];
  let cursor: string | undefined;

  do {
    const listed = await bucket.list({ prefix: `${METRICS_PREFIX}/${name}/`, limit: 1000, cursor });
    for (const object of listed.objects) {
      const body = await object.text();
      try {
        samples.push(JSON.parse(body) as MetricSample);
      } catch {
        // Ignore an unreadable sample rather than failing the whole read.
      }
    }
    cursor = listed.truncated ? listed.cursor : undefined;
  } while (cursor && samples.length < limit);

  return samples.sort((a, b) => b.at - a.at).slice(0, limit);
}

/**
 * Start a timer that reports how long a unit of work took.
 *
 * The timing lives here rather than in the component body because React's
 * purity rules reject `Date.now()` inside a render. Calling `elapsed()`
 * records the duration in milliseconds since the timer was started.
 */
export function startTimer(): () => number {
  const startedAt = Date.now();
  return () => Date.now() - startedAt;
}

export interface MetricSummary {
  name: string;
  count: number;
  latest: number | null;
  min: number | null;
  max: number | null;
  average: number | null;
  /** 50th percentile of the recorded values. */
  p50: number | null;
  /** 95th percentile of the recorded values. */
  p95: number | null;
  /** Daily averages, oldest first, as `YYYY-MM-DD` -> average value. */
  daily: Array<{ day: string; average: number; count: number }>;
}

/** Reduce raw samples to the figures the admin panel displays. */
export function summarize(samples: MetricSample[]): MetricSummary {
  const values = samples.map((sample) => sample.value).sort((a, b) => a - b);
  const count = values.length;
  const summary: MetricSummary = {
    name: samples[0]?.name || "",
    count,
    latest: count ? values[count - 1] : null,
    min: count ? values[0] : null,
    max: count ? values[count - 1] : null,
    average: count ? values.reduce((sum, value) => sum + value, 0) / count : null,
    p50: count ? values[Math.min(count - 1, Math.floor(count * 0.5))] : null,
    p95: count ? values[Math.min(count - 1, Math.floor(count * 0.95))] : null,
    daily: [],
  };

  const byDay = new Map<string, number[]>();
  for (const sample of samples) {
    const day = new Date(sample.at).toISOString().slice(0, 10);
    const list = byDay.get(day) || [];
    list.push(sample.value);
    byDay.set(day, list);
  }
  summary.daily = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, list]) => ({
      day,
      average: list.reduce((sum, value) => sum + value, 0) / list.length,
      count: list.length,
    }));

  return summary;
}
