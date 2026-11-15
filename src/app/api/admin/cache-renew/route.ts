import { NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

/**
 * Minimal structural type for the R2 bucket binding. The global workerd types
 * (cloudflare-env.d.ts) are excluded from tsconfig, so `R2Bucket` isn't
 * visible here — and the admin route only needs get/put/list anyway.
 */
interface R2BucketBinding {
  get(
    key: string
  ): Promise<{
    body: ReadableStream;
    arrayBuffer(): Promise<ArrayBuffer>;
    json(): Promise<unknown>;
    httpMetadata?: Record<string, string>;
    customMetadata?: Record<string, string>;
  } | null>;
  put(
    key: string,
    value: ArrayBuffer | ReadableStream | string,
    options?: { httpMetadata?: Record<string, string>; customMetadata?: Record<string, string> }
  ): Promise<unknown>;
  list(options: { prefix?: string; cursor?: string; limit?: number }): Promise<{
    objects: Array<{ key: string }>;
    truncated?: boolean;
    cursor?: string;
  }>;
}

/**
 * Cache maintenance for the R2 incremental cache under manual rollout.
 *
 * - GET returns the currently live cache batch (the OpenNext build ID, i.e.
 *   the `incremental-cache/<buildId>/` folder name) and the last renewal.
 * - POST renews every cached page: each object is read and rewritten once —
 *   R2 has no metadata-only edit and no server-side copy on the Workers
 *   binding, and rewriting is what refreshes the LastModified that the
 *   bucket's deletion rule counts from. Data stays inside Cloudflare
 *   (binding to the same-region bucket, no public egress).
 *
 * The renewal runs via `waitUntil` after a fast response; progress is written
 * back to the marker object, which the UI polls.
 */

const MARKER_KEY = "maintenance/last-cache-renew";
const PREFIX = "incremental-cache/";
const TOUCH_CONCURRENCY = 8; // bounded memory: buffers at most 8 objects at a time
const STALE_RUNNING_MS = 5 * 60_000;

interface RenewMarker {
  running: boolean;
  startedAt?: string;
  finishedAt?: string;
  copied?: number;
  failed?: number;
  buildId?: string | null;
}

type Env = { NEXT_INC_CACHE_R2_BUCKET: R2BucketBinding };

function getBucket(): R2BucketBinding {
  return (getCloudflareContext().env as unknown as Env).NEXT_INC_CACHE_R2_BUCKET;
}

async function readMarker(bucket: R2BucketBinding): Promise<RenewMarker | null> {
  const obj = await bucket.get(MARKER_KEY);
  if (!obj) return null;
  try {
    return (await obj.json()) as RenewMarker;
  } catch {
    return null;
  }
}

async function writeMarker(bucket: R2BucketBinding, marker: RenewMarker) {
  await bucket.put(MARKER_KEY, JSON.stringify(marker), {
    httpMetadata: { contentType: "application/json" },
  });
}

async function renewAll(bucket: R2BucketBinding, buildId: string | null) {
  let copied = 0;
  let failed = 0;
  let cursor: string | undefined;

  do {
    const page = await bucket.list({ prefix: PREFIX, cursor, limit: 1000 });
    for (let i = 0; i < page.objects.length; i += TOUCH_CONCURRENCY) {
      const batch = page.objects.slice(i, i + TOUCH_CONCURRENCY);
      const results = await Promise.all(
        batch.map(async (object) => {
          try {
            const got = await bucket.get(object.key);
            if (!got) return false;
            const body = await got.arrayBuffer();
            await bucket.put(object.key, body, {
              httpMetadata: got.httpMetadata,
              customMetadata: got.customMetadata,
            });
            return true;
          } catch {
            return false;
          }
        })
      );
      copied += results.filter(Boolean).length;
      failed += results.filter((r) => !r).length;
    }
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);

  return { copied, failed };
}

export async function GET() {
  if (!await getAuthenticatedAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bucket = getBucket();
  const marker = await readMarker(bucket).catch(() => null);
  const buildId = process.env.OPEN_NEXT_BUILD_ID || null;
  return NextResponse.json({ buildId, lastRenew: marker });
}

export async function POST() {
  if (!await getAuthenticatedAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { env, ctx } = getCloudflareContext();
  const bucket = (env as unknown as Env).NEXT_INC_CACHE_R2_BUCKET;
  const buildId = process.env.OPEN_NEXT_BUILD_ID || null;

  const marker = await readMarker(bucket).catch(() => null);
  if (marker?.running) {
    const started = marker.startedAt ? Date.parse(marker.startedAt) : 0;
    if (Date.now() - started < STALE_RUNNING_MS) {
      return NextResponse.json({ error: "A renewal is already running.", startedAt: marker.startedAt }, { status: 409 });
    }
    // A previous run died mid-flight (e.g. worker restart) — allow a new one.
  }

  await writeMarker(bucket, { running: true, startedAt: new Date().toISOString(), buildId });

  ctx.waitUntil(
    (async () => {
      try {
        const { copied, failed } = await renewAll(bucket, buildId);
        await writeMarker(bucket, {
          running: false,
          startedAt: marker?.startedAt,
          finishedAt: new Date().toISOString(),
          copied,
          failed,
          buildId,
        });
      } catch (error) {
        await writeMarker(bucket, {
          running: false,
          finishedAt: new Date().toISOString(),
          failed: -1,
          buildId,
        }).catch(() => {});
        console.error("Cache renewal failed:", error);
      }
    })()
  );

  return NextResponse.json({ started: true, buildId });
}
