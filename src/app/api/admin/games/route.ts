import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const supabase = createAdminClient();

  // Single game lookup by id
  const id = searchParams.get("id");
  if (id) {
    const { data } = await supabase.from("games").select("*").eq("id", id).single();
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
function extractCategorySlugs(game: any): string[] {
  const cats = game?.categories || [];
  return cats
    .filter((gc: any) => gc.categories)
    .map((gc: any) => gc.categories.slug);
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
    // Search page (game lists)
    "/search",
  ];

  for (const path of paths) {
    try { revalidatePath(path, "page"); } catch {}
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { category_ids, category_names, tag_ids, series_id, ...gameData } = body;
  const supabase = createAdminClient();

  const { data, error } = await supabase.from("games").insert([gameData]).select("*, categories:game_categories(category_id, categories:categories(*))").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const gameId = data.id;

  let resolvedCategoryIds = category_ids || [];
  if (category_names && category_names.length > 0) {
    resolvedCategoryIds = await resolveCategories(supabase, category_names);
  }

  if (resolvedCategoryIds.length > 0) {
    await supabase.from("game_categories").insert(
      resolvedCategoryIds.map((catId: string) => ({ game_id: gameId, category_id: catId }))
    );
  }

  if (tag_ids && tag_ids.length > 0) {
    await supabase.from("game_tags").insert(
      tag_ids.map((tagId: string) => ({ game_id: gameId, tag_id: tagId }))
    );
  }

  if (series_id) {
    await supabase.from("game_series").insert([{ game_id: gameId, series_id }]);
  }

  revalidateGamePages(data.slug, extractCategorySlugs(data));

  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, category_ids, category_names, tag_ids, series_id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();

  // Fetch existing game first to know its slug and old categories
  const { data: existing } = await supabase.from("games").select("slug").eq("id", id).single();

  const { data, error } = await supabase.from("games").update(updates).eq("id", id).select("*, categories:game_categories(category_id, categories:categories(*))").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  let resolvedCategoryIds = category_ids || [];
  if (category_names && category_names.length > 0) {
    resolvedCategoryIds = await resolveCategories(supabase, category_names);
  }

  if (resolvedCategoryIds !== undefined) {
    await supabase.from("game_categories").delete().eq("game_id", id);
    if (resolvedCategoryIds.length > 0) {
      await supabase.from("game_categories").insert(
        resolvedCategoryIds.map((catId: string) => ({ game_id: id, category_id: catId }))
      );
    }
  }

  if (tag_ids !== undefined) {
    await supabase.from("game_tags").delete().eq("game_id", id);
    if (tag_ids.length > 0) {
      await supabase.from("game_tags").insert(
        tag_ids.map((tagId: string) => ({ game_id: id, tag_id: tagId }))
      );
    }
  }

  if (series_id !== undefined) {
    await supabase.from("game_series").delete().eq("game_id", id);
    if (series_id) {
      await supabase.from("game_series").insert([{ game_id: id, series_id }]);
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
