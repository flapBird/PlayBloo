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
 * Samples are aggregated into one object per metric per day. Keeping every
 * sample in its own object would make reading the history cost one R2 read
 * per sample, and a day of cold renders can be thousands of samples.
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
 *
 * `list()` yields `R2Object` values, which carry no body; the body has to be
 * fetched separately with `get()`. Only `R2ObjectBody` exposes `text()`.
 */
interface MetricsObject {
  key: string;
  etag: string;
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
    options?: {
      httpMetadata?: { contentType?: string };
      onlyIf?: { etagMatches?: string; etagDoesNotMatch?: string };
    },
  ): Promise<{ etag: string } | null>;
  get(key: string): Promise<{ text(): Promise<string>; etag: string } | null>;
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<MetricsListResult>;
}

/** One metric's samples for a single day. */
interface DailyMetric {
  name: string;
  day: string;
  /** Every recorded value for the day, oldest first. */
  values: number[];
  /** The most recent samples with their context, oldest first. */
  recent: Array<{ at: number; value: number; detail?: string }>;
}

/** A single recorded measurement. */
export interface MetricSample {
  /** Metric name, e.g. `game_render_ms`. */
  name: string;
  /** Numeric value of the measurement. */
  value: number;
  /** The day the sample belongs to, as `YYYY-MM-DD`. */
  day: string;
  /** Optional free-form context, e.g. the slug that was rendered. */
  detail?: string;
}

/**
 * How many values to keep per day. Percentiles are computed from these, so
 * the sample stays representative while the object stays small.
 */
const MAX_VALUES = 2000;

/** How many contextual samples to keep per day. */
const MAX_RECENT = 50;

/** How many attempts a conditional write gets before the sample is dropped. */
const WRITE_ATTEMPTS = 5;

function getMetricsBucket() {
  // Build-time prerendering must not write metrics: the build has no real
  // request context, and 1000+ pre-rendered pages would flood the store.
  // (The existing `queryTimeout` in the game page uses the same guard.)
  if (process.env.NEXT_PHASE === "phase-production-build") return undefined;
  try {
    // The sync accessor throws when there is no request context, which is the
    // case in local `next dev`. Metrics are then simply not recorded.
    const { env } = getCloudflareContext();
    const bindings = env as unknown as Record<string, MetricsBucket | undefined>;
    return bindings?.[BUCKET_BINDING];
  } catch {
    return undefined;
  }
}

function dayKey(at: number) {
  return new Date(at).toISOString().slice(0, 10);
}

function metricKey(name: string, day: string) {
  return `${METRICS_PREFIX}/${name}/${day}.json`;
}

async function readDaily(
  bucket: MetricsBucket,
  name: string,
  day: string,
): Promise<{ data: DailyMetric; etag: string | null }> {
  const object = await bucket.get(metricKey(name, day));
  if (!object) {
    return { data: { name, day, values: [], recent: [] }, etag: null };
  }
  try {
    const parsed = JSON.parse(await object.text()) as DailyMetric;
    return {
      data: {
        name: parsed.name || name,
        day: parsed.day || day,
        values: Array.isArray(parsed.values) ? parsed.values : [],
        recent: Array.isArray(parsed.recent) ? parsed.recent : [],
      },
      etag: object.etag,
    };
  } catch {
    return { data: { name, day, values: [], recent: [] }, etag: null };
  }
}

/**
 * Start a timer that reports how long a unit of work took.
 *
 * The timing lives here rather than in the component body because React's
 * purity rules reject `Date.now()` inside a render. Calling `elapsed()`
 * reports the duration in milliseconds since the timer was started.
 */
export function startTimer(): () => number {
  const startedAt = Date.now();
  return () => Date.now() - startedAt;
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

  const at = Date.now();
  const day = dayKey(at);

  const write = async () => {
    for (let attempt = 1; attempt <= WRITE_ATTEMPTS; attempt++) {
      const { data, etag } = await readDaily(bucket, name, day);
      data.values.push(value);
      if (data.values.length > MAX_VALUES) data.values.shift();
      data.recent.push({ at, value, ...(detail ? { detail } : {}) });
      if (data.recent.length > MAX_RECENT) data.recent.shift();

      const body = JSON.stringify(data);
      // A conditional write makes concurrent updates safe: the write only
      // lands if the object has not changed since it was read, and the attempt
      // is retried against the newer version otherwise.
      const written = await bucket.put(metricKey(name, day), body, {
        httpMetadata: { contentType: "application/json" },
        onlyIf: etag ? { etagMatches: etag } : { etagDoesNotMatch: "*" },
      });
      if (written) return;
    }
  };

  try {
    // `after` keeps the write alive past the response. It throws outside a
    // request scope, which is the case during a static build.
    after(write);
  } catch {
    write().catch(() => {});
  }
}

/**
 * Read the recorded samples for a metric, one object read per day.
 */
export async function readMetric(name: string, days = 7): Promise<MetricSample[]> {
  const bucket = getMetricsBucket();
  if (!bucket) return [];

  const samples: MetricSample[] = [];
  for (let offset = 0; offset < days; offset++) {
    const day = dayKey(Date.now() - offset * 86_400_000);
    const { data } = await readDaily(bucket, name, day);
    for (const value of data.values) samples.push({ name, value, day });
  }

  return samples;
}

/**
 * Read the most recent samples with their context, newest first.
 */
export async function readRecentMetric(name: string, days = 1): Promise<MetricSample[]> {
  const bucket = getMetricsBucket();
  if (!bucket) return [];

  const samples: MetricSample[] = [];
  for (let offset = 0; offset < days; offset++) {
    const day = dayKey(Date.now() - offset * 86_400_000);
    const { data } = await readDaily(bucket, name, day);
    for (const entry of data.recent) {
      samples.push({ name, value: entry.value, day, ...(entry.detail ? { detail: entry.detail } : {}) });
    }
  }

  return samples.sort((a, b) => b.value - a.value);
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
    const list = byDay.get(sample.day) || [];
    list.push(sample.value);
    byDay.set(sample.day, list);
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
