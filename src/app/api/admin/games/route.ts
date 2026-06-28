import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { GAME_CATEGORIES } from "@/lib/constants";

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

    // Look up by slug
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) {
      ids.push(existing.id);
    } else {
      // Create if not found
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

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { category_ids, category_names, tag_ids, series_id, ...gameData } = body;
  const supabase = createAdminClient();

  const { data, error } = await supabase.from("games").insert([gameData]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const gameId = data.id;

  // Resolve category_ids from existing IDs or from category_names
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

  return NextResponse.json({ data }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { id, category_ids, category_names, tag_ids, series_id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("games").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Resolve category_ids
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

  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("games").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
