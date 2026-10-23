import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { readMetric, readRecentMetric, summarize } from "@/lib/metrics";
import {
  MONITORING_HISTORY_DAYS,
  MONITORING_PROBE_SAMPLES,
  SITEMAP_SHARD_THRESHOLD,
  SITE_URL,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

/** One probed URL and what a crawler would have experienced. */
export interface ProbeResult {
  path: string;
  /** `x-opennext-cache` as reported by the cache interceptor, if any. */
  cache: string | null;
  /** Time to first byte in milliseconds. */
  ttfbMs: number;
  /** Total time to a complete response in milliseconds. */
  totalMs: number;
  status: number;
  /** True when the response came from the R2 cache rather than a render. */
  cached: boolean;
}

async function probe(path: string): Promise<ProbeResult> {
  const startedAt = Date.now();
  try {
    const response = await fetch(`${SITE_URL}${path}`, {
      headers: { "user-agent": "PlayBloo-Monitoring/1.0" },
      // The cache interceptor only reports a status when it answered from the
      // cache, so a missing header means the request was rendered.
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
    });
    const ttfbMs = Date.now() - startedAt;
    const cache = response.headers.get("x-opennext-cache");
    // Drain the body so the measurement reflects a complete response.
    await response.arrayBuffer();
    return {
      path,
      cache,
      ttfbMs,
      totalMs: Date.now() - startedAt,
      status: response.status,
      cached: cache === "HIT" || cache === "STALE",
    };
  } catch {
    return {
      path,
      cache: null,
      ttfbMs: Date.now() - startedAt,
      totalMs: Date.now() - startedAt,
      status: 0,
      cached: false,
    };
  }
}

/** Probe a spread of catalogue pages plus the sitemap, the way a crawler would. */
async function runProbe(): Promise<ProbeResult[]> {
  const supabase = createAdminClient();
  const { data: games } = await supabase
    .from("games")
    .select("slug")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(MONITORING_PROBE_SAMPLES * 3);

  // Sample across the whole catalogue rather than only the newest games, so
  // the probe reflects the pages a crawler is most likely to request.
  const slugs = (games || []).map((game) => game.slug);
  const stride = Math.max(1, Math.floor(slugs.length / MONITORING_PROBE_SAMPLES));
  const sampled = slugs.filter((_, index) => index % stride === 0).slice(0, MONITORING_PROBE_SAMPLES);

  const paths = [...sampled.map((slug) => `/game/${slug}`), "/sitemap.xml"];
  return Promise.all(paths.map(probe));
}

export async function GET() {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const [renderSamples, sitemapSamples, sitemapUrlSamples, slowestRenders, publishedGames] = await Promise.all([
    readMetric("game_render_ms", MONITORING_HISTORY_DAYS),
    readMetric("sitemap_generate_ms", MONITORING_HISTORY_DAYS),
    readMetric("sitemap_urls", MONITORING_HISTORY_DAYS),
    readRecentMetric("game_render_ms", 1),
    supabase.from("games").select("id", { count: "exact", head: true }).eq("is_published", true),
  ]);

  const renderSummary = summarize(renderSamples);
  const sitemapSummary = summarize(sitemapSamples);
  const urlSummary = summarize(sitemapUrlSamples);

  const published = publishedGames.count || 0;
  const sitemapUrls = urlSummary.latest || 0;

  return NextResponse.json({
    data: {
      catalogue: {
        publishedGames: published,
        sitemapUrls,
        shardThreshold: SITEMAP_SHARD_THRESHOLD,
        // How close the catalogue is to needing a split sitemap.
        shardUsage: SITEMAP_SHARD_THRESHOLD ? published / SITEMAP_SHARD_THRESHOLD : 0,
      },
      gameRender: renderSummary,
      sitemapGenerate: sitemapSummary,
      sitemapUrls: urlSummary,
      slowestRenders: slowestRenders.slice(0, 10).map((sample) => ({
        slug: sample.detail || "—",
        durationMs: sample.value,
      })),
      historyDays: MONITORING_HISTORY_DAYS,
    },
  });
}

export async function POST() {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const probes = await runProbe();
  const cached = probes.filter((result) => result.cached).length;
  const ttfbValues = probes.map((result) => result.ttfbMs).sort((a, b) => a - b);

  return NextResponse.json({
    data: {
      probes,
      summary: {
        total: probes.length,
        cached,
        // A hit rate below this means crawlers are paying for renders.
        hitRate: probes.length ? cached / probes.length : 0,
        ttfbP50: ttfbValues[Math.floor(ttfbValues.length * 0.5)] ?? null,
        ttfbP95: ttfbValues[Math.floor(ttfbValues.length * 0.95)] ?? null,
        ttfbMax: ttfbValues[ttfbValues.length - 1] ?? null,
      },
    },
  });
}
