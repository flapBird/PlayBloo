import { createAdminClient } from "@/lib/supabase/admin";
import { readMetric, summarize } from "@/lib/metrics";
import {
  MONITORING_HISTORY_DAYS,
  SITEMAP_SHARD_THRESHOLD,
} from "@/lib/constants";
import { MonitoringPanel, type MonitoringData } from "@/components/admin/MonitoringPanel";

export const dynamic = "force-dynamic";

async function getMonitoringData(): Promise<MonitoringData> {
  const supabase = createAdminClient();
  const [renderSamples, sitemapSamples, urlSamples, publishedGames] = await Promise.all([
    readMetric("game_render_ms"),
    readMetric("sitemap_generate_ms"),
    readMetric("sitemap_urls"),
    supabase.from("games").select("id", { count: "exact", head: true }).eq("is_published", true),
  ]);

  const render = summarize(renderSamples);
  const sitemap = summarize(sitemapSamples);
  const urls = summarize(urlSamples);
  const published = publishedGames.count || 0;

  return {
    publishedGames: published,
    sitemapUrls: urls.latest || 0,
    shardThreshold: SITEMAP_SHARD_THRESHOLD,
    shardUsage: SITEMAP_SHARD_THRESHOLD ? published / SITEMAP_SHARD_THRESHOLD : 0,
    gameRender: {
      count: render.count,
      latest: render.latest,
      p50: render.p50,
      p95: render.p95,
      max: render.max,
      average: render.average,
      daily: render.daily,
    },
    sitemapGenerate: {
      count: sitemap.count,
      latest: sitemap.latest,
      p50: sitemap.p50,
      p95: sitemap.p95,
      max: sitemap.max,
      average: sitemap.average,
      daily: sitemap.daily,
    },
    historyDays: MONITORING_HISTORY_DAYS,
  };
}

export default async function AdminMonitoring() {
  const data = await getMonitoringData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Monitoring</h1>
        <p className="text-sm text-muted-foreground">
          Crawl readiness: cache hit rate, cold render cost and sitemap generation time
        </p>
      </div>

      <MonitoringPanel initial={data} />
    </div>
  );
}
