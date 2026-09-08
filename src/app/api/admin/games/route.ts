import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type SourceRecord = { type?: unknown; url?: unknown };
type JoinedCategory = { categories?: { slug?: string } | { slug?: string }[] | null };
type GameWithJoinedCategories = { categories?: JoinedCategory[] | null };

const GAME_MUTABLE_FIELDS = [
  "title", "slug", "thumbnail_url", "cover_url", "iframe_url", "external_url", "description",
  "short_description", "how_to_play", "controls", "tips", "features", "developer", "publisher",
  "source_url", "source_type", "original_game_url", "developer_url", "steam_url", "itch_url",
  "official_website_url", "steam_app_id", "itch_project_slug", "release_date", "added_at",
  "last_updated_at", "last_verified_at", "platforms", "monetization", "development_status", "graphics",
  "multiplayer", "engine", "screenshots", "sources", "is_published", "is_featured", "is_trending",
  "content_verified",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function pickMutableGameFields(body: Record<string, unknown>): Record<string, unknown> {
  const fields = Object.fromEntries(
    GAME_MUTABLE_FIELDS.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]),
  );
  // Optional unique identifiers must use SQL NULL, never an empty string.
  for (const field of ["steam_app_id", "itch_project_slug"] as const) {
    if (typeof fields[field] === "string") fields[field] = fields[field].trim() || null;
  }
  return fields;
}

async function gameWriteError(
  supabase: ReturnType<typeof createAdminClient>,
  error: { code?: string; message: string },
  fields: Record<string, unknown>,
) {
  for (const field of ["steam_app_id", "itch_project_slug"] as const) {
    if (error.code === "23505" && error.message.includes(`idx_games_${field}_unique`)) {
      const { data: conflict } = await supabase.from("games").select("id, title, slug").eq(field, fields[field]).maybeSingle();
      return NextResponse.json({
        error: `${field} “${fields[field]}” is already used by ${conflict?.title || "another game"}. Check the identifier or leave it empty if unknown.`,
        conflict,
      }, { status: 409 });
    }
  }
  return NextResponse.json({ error: error.message }, { status: 400 });
}

function getIdList(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) return undefined;
  return [...new Set(value.filter(Boolean))];
}

function hasDocumentedSource(gameData: Record<string, unknown>): boolean {
  return Boolean(
    gameData.source_url ||
    gameData.original_game_url ||
    gameData.developer_url ||
    gameData.steam_url ||
    gameData.itch_url ||
    (Array.isArray(gameData.sources) && gameData.sources.some((source: SourceRecord) => source?.type && source?.url)),
  );
}

function validateVerifiedContent(gameData: Record<string, unknown>): string | null {
  if (gameData.content_verified && !hasDocumentedSource(gameData)) {
    return "A trusted source URL is required before gameplay facts can be marked verified.";
  }
  return null;
}

export async function GET(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const supabase = createAdminClient();

  // Single game lookup by id
  const id = searchParams.get("id");
  if (id) {
    const { data } = await supabase
      .from("games")
      .select("*, categories:game_categories(category_id, categories:categories(id, name, slug)), tags:game_tags(tag_id, tags:tags(id, name, slug)), series:game_series(series_id, series:series(id, name, slug))")
      .eq("id", id)
      .single();
    return NextResponse.json({ data: data || null });
  }

  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const search = searchParams.get("q") || "";
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("games").select("*", { count: "exact" });
  if (search) query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`);
  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, count } = await query;

  return NextResponse.json({
    data: data || [],
    total: count || 0,
    page,
    page_size: limit,
    total_pages: Math.ceil((count || 0) / limit),
  });
}

/** Resolve category_names → category_ids by finding or creating categories */
async function resolveCategories(
  supabase: ReturnType<typeof createAdminClient>,
  names: string[]
): Promise<string[]> {
  if (!names || names.length === 0) return [];
  const ids: string[] = [];

  for (const rawName of names) {
    const name = rawName.trim();
    if (!name) continue;

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      ids.push(existing.id);
    } else {
      const { data: created } = await supabase
        .from("categories")
        .insert([{ name, slug }])
        .select("id")
        .single();

      if (created) ids.push(created.id);
    }
  }

  return ids;
}

/** Extract category slugs from a game's joined categories */
function extractCategorySlugs(game: GameWithJoinedCategories | null): string[] {
  const cats = game?.categories || [];
  return cats
    .flatMap((membership) => {
      const category = membership.categories;
      if (Array.isArray(category)) return category.map((item) => item.slug);
      return [category?.slug];
    })
    .filter((slug): slug is string => Boolean(slug));
}

/** Revalidate only the pages affected by this game */
function revalidateGamePages(slug: string, categorySlugs: string[]) {
  const paths = [
    // Homepage (game lists)
    "/",
    // This game's detail page
    `/game/${slug}`,
    // Category pages this game belongs to
    ...categorySlugs.map((cs) => `/category/${cs}`),
    // Taxonomy relationships may be changed by the bulk editor.
    "/category",
    "/category/[slug]",
    "/tag/[slug]",
    "/series",
    "/series/[slug]",
    // Search page (game lists)
    "/search",
    "/sitemap.xml",
  ];

  for (const path of paths) {
    try { revalidatePath(path, "page"); } catch {}
  }
}

export async function POST(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body)) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const gameData = pickMutableGameFields(body);
  const categoryIds = getIdList(body.category_ids);
  const categoryNames = Array.isArray(body.category_names) && body.category_names.every((item) => typeof item === "string") ? body.category_names : undefined;
  const tagIds = getIdList(body.tag_ids);
  const seriesIds = getIdList(body.series_ids) ?? (typeof body.series_id === "string" && body.series_id ? [body.series_id] : []);
  const verificationError = validateVerifiedContent(gameData);
  if (verificationError) return NextResponse.json({ error: verificationError }, { status: 400 });
  const supabase = createAdminClient();

  const { data, error } = await supabase.from("games").insert([gameData]).select("*, categories:game_categories(category_id, categories:categories(*))").single();
  if (error) return gameWriteError(supabase, error, gameData);

  const gameId = data.id;

  let resolvedCategoryIds = categoryIds || [];
  if (categoryNames?.length) {
    resolvedCategoryIds = await resolveCategories(supabase, categoryNames);
  }

  if (resolvedCategoryIds.length > 0) {
    await supabase.from("game_categories").insert(
      resolvedCategoryIds.map((catId: string) => ({ game_id: gameId, category_id: catId }))
    );
  }

  if (tagIds?.length) {
    await supabase.from("game_tags").insert(
      tagIds.map((tagId) => ({ game_id: gameId, tag_id: tagId }))
    );
  }

  if (seriesIds.length) {
    await supabase.from("game_series").insert(
      seriesIds.map((seriesId, index) => ({ game_id: gameId, series_id: seriesId, sort_order: index })),
    );
  }

  revalidateGamePages(data.slug, extractCategorySlugs(data));

  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body)) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates = pickMutableGameFields(body);
  const categoryNames = Array.isArray(body.category_names) && body.category_names.every((item) => typeof item === "string") ? body.category_names : undefined;
  let resolvedCategoryIds = getIdList(body.category_ids);
  const tagIds = getIdList(body.tag_ids);
  const seriesIds = getIdList(body.series_ids) ?? (
    body.series_id !== undefined ? (typeof body.series_id === "string" && body.series_id ? [body.series_id] : []) : undefined
  );

  const supabase = createAdminClient();

  if (updates.content_verified) {
    const { data: sourceState } = await supabase
      .from("games")
      .select("source_url, original_game_url, developer_url, steam_url, itch_url, sources")
      .eq("id", id)
      .single();
    const verificationError = validateVerifiedContent({ ...sourceState, ...updates });
    if (verificationError) return NextResponse.json({ error: verificationError }, { status: 400 });
  }

  // Fetch existing game first to know its slug and old categories
  const { data: existing } = await supabase.from("games").select("slug").eq("id", id).single();

  const { data, error } = await supabase.from("games").update(updates).eq("id", id).select("*, categories:game_categories(category_id, categories:categories(*))").single();
  if (error) return gameWriteError(supabase, error, updates);

  if (categoryNames?.length) {
    resolvedCategoryIds = await resolveCategories(supabase, categoryNames);
  }

  if (resolvedCategoryIds !== undefined) {
    await supabase.from("game_categories").delete().eq("game_id", id);
    if (resolvedCategoryIds.length > 0) {
      await supabase.from("game_categories").insert(
        resolvedCategoryIds.map((catId: string) => ({ game_id: id, category_id: catId }))
      );
    }
  }

  if (tagIds !== undefined) {
    await supabase.from("game_tags").delete().eq("game_id", id);
    if (tagIds.length > 0) {
      await supabase.from("game_tags").insert(
        tagIds.map((tagId) => ({ game_id: id, tag_id: tagId }))
      );
    }
  }

  if (seriesIds !== undefined) {
    await supabase.from("game_series").delete().eq("game_id", id);
    if (seriesIds.length) {
      await supabase.from("game_series").insert(
        seriesIds.map((seriesId, index) => ({ game_id: id, series_id: seriesId, sort_order: index })),
      );
    }
  }

  // Revalidate old slug too (in case slug changed)
  const slugs = new Set<string>(extractCategorySlugs(data));
  const newSlug = data.slug;
  const oldSlug = existing?.slug;
  revalidateGamePages(newSlug, [...slugs]);
  if (oldSlug && oldSlug !== newSlug) {
    try { revalidatePath(`/game/${oldSlug}`, "page"); } catch {}
  }

  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  if (!await getAuthenticatedAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();

  // Fetch game info before deleting (for cache revalidation)
  const { data: game } = await supabase
    .from("games")
    .select("slug, categories:game_categories(category_id, categories:categories(*))")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (game) {
    revalidateGamePages(game.slug, extractCategorySlugs(game));
  }

  return NextResponse.json({ success: true });
}
