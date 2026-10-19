import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";
import queueCache from "@opennextjs/cloudflare/overrides/queue/queue-cache";
import doShardedTagCache from "@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  enableCacheInterception: true,
  // Coalesce repeated stale-page visits before they reach the DO queue.
  queue: queueCache(doQueue, { regionalCacheTtlSec: 30, waitForQueueAck: true }),
  // Read invalidations directly so admin changes do not require a zone purge token.
  tagCache: doShardedTagCache({ baseShardSize: 4, regionalCache: false }),
});
