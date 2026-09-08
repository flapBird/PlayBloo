import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function text(value: unknown, max = 12_000): string | null {
  if (typeof value !== "string") return null;
  const result = value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
  return result || null;
}

function slugify(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
}

function stringArray(value: unknown, max = 30): string[] {
  if (Array.isArray(value)) return [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean))].slice(0, max);
  if (typeof value === "string") return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))].slice(0, max);
  return [];
}

function urlText(value: unknown): string | null {
  const result = text(value, 2048);
  if (!result) return null;
  try {
    const url = new URL(result);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function urlArray(value: unknown, max = 20): string[] {
  return stringArray(value, max).map(urlText).filter((url): url is string => Boolean(url));
}

async function resolveNamedRelations(supabase: ReturnType<typeof createAdminClient>, table: "categories" | "tags", names: string[]) {
  const records = [...new Map(names.map((name) => ({ name: name.slice(0, 100), slug: slugify(name) })).filter((item) => item.slug).map((item) => [item.slug, item])).values()];
  if (!records.length) return [];

  const slugs = records.map((item) => item.slug);
  const { data: existing, error: loadError } = await supabase.from(table).select("id, slug").in("slug", slugs);
  if (loadError) throw new Error(`Could not load ${table}: ${loadError.message}`);
  const existingSlugs = new Set((existing || []).map((item) => item.slug));
  const missing = records.filter((item) => !existingSlugs.has(item.slug));
  if (missing.length) {
    const { error: createError } = await supabase.from(table).upsert(missing, { onConflict: "slug", ignoreDuplicates: true });
    if (createError) throw new Error(`Could not create ${table}: ${createError.message}`);
  }
  const { data: resolved, error: resolveError } = await supabase.from(table).select("id").in("slug", slugs);
  if (resolveError) throw new Error(`Could not resolve ${table}: ${resolveError.message}`);
  return (resolved || []).map((item) => item.id);
}

export async function GET(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createAdminClient();
  const id = request.nextUrl.searchParams.get("id");
  if (id) {
    const { data, error } = await supabase.from("game_submissions").select("*, duplicate_game:games!game_submissions_duplicate_game_id_fkey(id, title, slug)").eq("id", id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ data });
  }
  const status = request.nextUrl.searchParams.get("status") || "pending_review";
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = 30;
  let query = supabase.from("game_submissions").select("id, source_url, source_type, developer_name, status, extraction_status, extracted_data, duplicate_game_id, created_at", { count: "exact" });
  if (status !== "all") query = query.eq("status", status);
  const { data, count, error } = await query.order("created_at", { ascending: false }).range((page - 1) * limit, page * limit - 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data: data || [], total: count || 0, page, limit });
}

export async function PATCH(request: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const id = text(body.id, 100);
  const action = body.action;
  if (!id) return NextResponse.json({ error: "Missing submission id." }, { status: 400 });
  const supabase = createAdminClient();
  const { data: submission, error: loadError } = await supabase.from("game_submissions").select("*").eq("id", id).single();
  if (loadError || !submission) return NextResponse.json({ error: "Submission not found." }, { status: 404 });

  if (action === "save") {
    const extracted = typeof body.extractedData === "object" && body.extractedData ? body.extractedData : {};
    if (JSON.stringify(extracted).length > 100_000) return NextResponse.json({ error: "Extracted review data is too large." }, { status: 413 });
    const { data: updated, error } = await supabase.from("game_submissions").update({
      extracted_data: extracted,
      developer_name: text(body.developerName, 120),
      notes: text(body.notes, 2_000),
      updated_at: new Date().toISOString(),
    }).eq("id", id).eq("status", "pending_review").select("id").maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!updated) return NextResponse.json({ error: "This submission is no longer pending review." }, { status: 409 });
    return NextResponse.json({ success: true });
  }

  if (action === "dismiss_duplicate") {
    const { data: updated, error } = await supabase.from("game_submissions").update({
      duplicate_game_id: null,
      updated_at: new Date().toISOString(),
    }).eq("id", id).eq("status", "pending_review").select("id").maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!updated) return NextResponse.json({ error: "This submission is no longer pending review." }, { status: 409 });
    return NextResponse.json({ success: true });
  }

  if (action === "reject" || action === "duplicate") {
    const { data: updated, error } = await supabase.from("game_submissions").update({
      status: action === "reject" ? "rejected" : "duplicate",
      reviewed_at: new Date().toISOString(),
      reviewed_by: admin.id,
      updated_at: new Date().toISOString(),
    }).eq("id", id).eq("status", "pending_review").select("id").maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!updated) return NextResponse.json({ error: "This submission is no longer pending review." }, { status: 409 });
    return NextResponse.json({ success: true });
  }

  if (action !== "approve") return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  if (submission.status !== "pending_review") return NextResponse.json({ error: "Only pending submissions can be approved." }, { status: 409 });
  if (submission.duplicate_game_id) return NextResponse.json({ error: "Resolve the possible duplicate before approving." }, { status: 409 });

  const value = typeof body.extractedData === "object" && body.extractedData ? body.extractedData : submission.extracted_data || {};
  const title = text(value.title, 160);
  const slug = slugify(text(value.slug, 120) || title || "");
  if (!title || !slug) return NextResponse.json({ error: "Title and slug are required before approval." }, { status: 400 });
  const { data: slugMatch } = await supabase.from("games").select("id").eq("slug", slug).maybeSingle();
  if (slugMatch) return NextResponse.json({ error: "A game with this slug already exists." }, { status: 409 });

  const allowedMonetization = ["free", "paid", "freemium", "free-with-ads"].includes(value.monetization) ? value.monetization : null;
  const allowedStatus = ["upcoming", "demo", "early-access", "released", "discontinued"].includes(value.development_status) ? value.development_status : null;
  const sourceUrl = urlText(value.source_url) || submission.normalized_source_url;
  const now = new Date().toISOString();
  const gameData = {
    title,
    slug,
    short_description: text(value.short_description, 600),
    description: text(value.description),
    thumbnail_url: urlText(value.thumbnail_url),
    cover_url: urlText(value.cover_url),
    iframe_url: urlText(value.iframe_url),
    external_url: urlText(value.external_url) || sourceUrl,
    developer: text(value.developer, 300) || submission.developer_name,
    publisher: text(value.publisher, 300),
    release_date: text(value.release_date, 50),
    last_updated_at: text(value.last_updated_at, 50),
    platforms: stringArray(value.platforms, 10),
    monetization: allowedMonetization,
    development_status: allowedStatus,
    graphics: text(value.graphics, 100),
    multiplayer: text(value.multiplayer, 100),
    engine: text(value.engine, 100),
    screenshots: urlArray(value.screenshots, 20),
    source_url: sourceUrl,
    source_type: submission.source_type,
    original_game_url: submission.normalized_source_url,
    official_website_url: urlText(value.official_website_url),
    steam_url: urlText(value.steam_url),
    steam_app_id: submission.steam_app_id,
    itch_url: urlText(value.itch_url),
    itch_project_slug: submission.itch_project_slug,
    last_verified_at: now,
    sources: [{ type: submission.source_type, url: sourceUrl, verifiedAt: now }],
    content_verified: Boolean(body.contentVerified),
    is_published: false,
  };
  const { data: game, error: createError } = await supabase.from("games").insert([gameData]).select("id, slug").single();
  if (createError || !game) return NextResponse.json({ error: createError?.message || "Could not create game." }, { status: 400 });

  try {
    const [categoryIds, tagIds] = await Promise.all([
      resolveNamedRelations(supabase, "categories", stringArray(value.categories, 12)),
      resolveNamedRelations(supabase, "tags", stringArray(value.tags, 30)),
    ]);
    const [categoryResult, tagResult] = await Promise.all([
      categoryIds.length ? supabase.from("game_categories").insert(categoryIds.map((categoryId) => ({ game_id: game.id, category_id: categoryId }))) : Promise.resolve({ error: null }),
      tagIds.length ? supabase.from("game_tags").insert(tagIds.map((tagId) => ({ game_id: game.id, tag_id: tagId }))) : Promise.resolve({ error: null }),
    ]);
    if (categoryResult.error) throw new Error(`Could not attach categories: ${categoryResult.error.message}`);
    if (tagResult.error) throw new Error(`Could not attach tags: ${tagResult.error.message}`);

    const { error: publishError } = await supabase.from("games").update({ is_published: true }).eq("id", game.id);
    if (publishError) throw new Error(`Could not publish game: ${publishError.message}`);
    const { data: reviewed, error: reviewError } = await supabase.from("game_submissions").update({ status: "approved", approved_game_id: game.id, reviewed_at: now, reviewed_by: admin.id, updated_at: now }).eq("id", id).eq("status", "pending_review").select("id").maybeSingle();
    if (reviewError || !reviewed) throw new Error(reviewError?.message || "The submission changed while it was being approved.");
  } catch (approvalError) {
    await supabase.from("games").delete().eq("id", game.id);
    return NextResponse.json({ error: approvalError instanceof Error ? approvalError.message : "Could not approve submission." }, { status: 400 });
  }
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/category");
  revalidatePath("/series");
  revalidatePath("/sitemap.xml");
  revalidatePath(`/game/${game.slug}`);
  return NextResponse.json({ success: true, game });
}
