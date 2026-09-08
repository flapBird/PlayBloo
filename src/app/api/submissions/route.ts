import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractSubmissionMetadata } from "@/lib/submissions/extractors";
import { classifySubmissionUrl } from "@/lib/submissions/url-security";

export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 20_000;
const HOURLY_LIMIT = 5;

class SubmissionRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function hasTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host.toLowerCase();
    const expectedHosts = [
      request.nextUrl.host,
      request.headers.get("x-forwarded-host"),
      request.headers.get("host"),
    ].filter((host): host is string => Boolean(host)).map((host) => host.toLowerCase());
    return expectedHosts.includes(originHost);
  } catch {
    return false;
  }
}

async function readLimitedJson(request: NextRequest): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) throw new SubmissionRequestError("Submission is too large.", 413);
  if (!request.body) throw new SubmissionRequestError("A request body is required.", 400);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_REQUEST_BYTES) {
      await reader.cancel();
      throw new SubmissionRequestError("Submission is too large.", 413);
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder().decode(buffer));
  } catch {
    throw new SubmissionRequestError("Enter valid submission details.", 400);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new SubmissionRequestError("Enter valid submission details.", 400);
  }
  return parsed as Record<string, unknown>;
}

function plainText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, maxLength) : null;
}

function fingerprintRequest(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const secret = process.env.SUBMISSION_FINGERPRINT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "playbloo-submission-v1";
  return createHmac("sha256", secret).update(forwarded).digest("hex");
}

async function findDuplicateGame(
  supabase: ReturnType<typeof createAdminClient>,
  normalizedUrl: string,
  steamAppId?: string,
  itchProjectSlug?: string,
  title?: string,
) {
  const stableIdCheck = steamAppId
    ? supabase.from("games").select("id, title, slug").eq("steam_app_id", steamAppId).limit(1)
    : itchProjectSlug
      ? supabase.from("games").select("id, title, slug").eq("itch_project_slug", itchProjectSlug).limit(1)
      : null;
  if (stableIdCheck) {
    const { data } = await stableIdCheck;
    if (data?.[0]) return data[0];
  } else {
    const results = await Promise.all([
      supabase.from("games").select("id, title, slug").eq("source_url", normalizedUrl).limit(1),
      supabase.from("games").select("id, title, slug").eq("original_game_url", normalizedUrl).limit(1),
      supabase.from("games").select("id, title, slug").eq("official_website_url", normalizedUrl).limit(1),
    ]);
    const urlMatch = results.flatMap((result) => result.data || [])[0];
    if (urlMatch) return urlMatch;
  }
  if (title) {
    const { data } = await supabase.from("games").select("id, title, slug").ilike("title", title.replace(/[%_]/g, "\\$&")).limit(1);
    if (data?.[0]) return data[0];
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    if (!hasTrustedOrigin(request)) throw new SubmissionRequestError("This submission origin is not allowed.", 403);
    const body = await readLimitedJson(request);
    // Honeypot: acknowledge bots without creating a record.
    if (body.website) return NextResponse.json({ success: true, message: "Submitted for review." });

    const sourceUrl = plainText(body.sourceUrl, 2048);
    if (!sourceUrl) return NextResponse.json({ error: "A game URL is required." }, { status: 400 });
    const email = plainText(body.email, 254);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    const developerName = plainText(body.developerName, 120);
    const notes = plainText(body.notes, 2_000);
    const classified = classifySubmissionUrl(sourceUrl);
    const fingerprint = fingerprintRequest(request);
    const supabase = createAdminClient();
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: rateError } = await supabase
      .from("game_submissions")
      .select("id", { count: "exact", head: true })
      .eq("request_fingerprint", fingerprint)
      .gte("created_at", since);
    if (rateError) {
      return NextResponse.json({ error: "Submissions are being upgraded. Please try again after the database migration is applied." }, { status: 503 });
    }
    if ((count || 0) >= HOURLY_LIMIT) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });

    const { data: existingSubmission } = await supabase
      .from("game_submissions")
      .select("id, status")
      .eq("normalized_source_url", classified.normalizedUrl)
      .in("status", ["pending_review", "approved"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existingSubmission) {
      return NextResponse.json({ success: true, possibleDuplicate: true, message: "This game is already in the review queue." });
    }

    // Claim this source before remote extraction. Migration 00007 makes this insert
    // atomic for concurrent requests, so only one request pays the fetch cost.
    const { data: queuedSubmission, error: queueError } = await supabase.from("game_submissions").insert([{
      source_url: sourceUrl,
      normalized_source_url: classified.normalizedUrl,
      source_type: classified.sourceType,
      steam_app_id: classified.steamAppId || null,
      itch_project_slug: classified.itchProjectSlug || null,
      submitter_email: email,
      developer_name: developerName,
      notes,
      status: "pending_review",
      extracted_data: {
        source_url: classified.normalizedUrl,
        source_type: classified.sourceType,
        external_url: classified.normalizedUrl,
      },
      extraction_status: "pending",
      last_fetched_at: null,
      request_fingerprint: fingerprint,
    }]).select("id").single();
    if (queueError?.code === "23505") {
      return NextResponse.json({ success: true, possibleDuplicate: true, message: "This game is already in the review queue." });
    }
    if (queueError || !queuedSubmission) throw new Error(queueError?.message || "Could not create the review record.");

    let extractedData: Record<string, unknown>;
    let extractionStatus: "success" | "partial" | "failed" = classified.sourceType === "official" ? "partial" : "success";
    let extractionError: string | null = null;
    const { data: cached } = await supabase.from("submission_source_cache").select("payload").eq("normalized_source_url", classified.normalizedUrl).gt("expires_at", new Date().toISOString()).maybeSingle();
    try {
      extractedData = cached?.payload || await extractSubmissionMetadata(classified);
      if (!cached) await supabase.from("submission_source_cache").upsert({ normalized_source_url: classified.normalizedUrl, source_type: classified.sourceType, payload: extractedData, fetched_at: new Date().toISOString(), expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString() });
      if (!extractedData.title && classified.sourceType !== "official") extractionStatus = "partial";
    } catch (error) {
      extractionStatus = "failed";
      extractionError = error instanceof Error ? error.message.slice(0, 500) : "Metadata extraction failed.";
      extractedData = {
        source_url: classified.normalizedUrl,
        source_type: classified.sourceType,
        external_url: classified.normalizedUrl,
        last_fetched_at: new Date().toISOString(),
      };
    }

    const title = typeof extractedData.title === "string" ? extractedData.title : undefined;
    const duplicate = await findDuplicateGame(supabase, classified.normalizedUrl, classified.steamAppId, classified.itchProjectSlug, title);
    const now = new Date().toISOString();
    const { error } = await supabase.from("game_submissions").update({
      extracted_data: extractedData,
      extraction_status: extractionStatus,
      extraction_error: extractionError,
      last_fetched_at: extractedData.last_fetched_at || now,
      duplicate_game_id: duplicate?.id || null,
      updated_at: now,
    }).eq("id", queuedSubmission.id);
    if (error) {
      await supabase.from("game_submissions").delete().eq("id", queuedSubmission.id).eq("extraction_status", "pending");
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      possibleDuplicate: Boolean(duplicate),
      extractionStatus,
      message: duplicate ? "Submitted for review. It may match an existing game." : "Submitted for review.",
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not submit this game.";
    const status = error instanceof SubmissionRequestError
      ? error.status
      : /URL|HTTP|HTTPS|private|Local|complete/.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
