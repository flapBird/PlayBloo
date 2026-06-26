import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/games/GameCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, PAGE_SIZE } from "@/lib/constants";
import type { Game } from "@/lib/types";

interface Props {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
    category?: string;
  }>;
}

async function searchGames(q: string, sort: string, page: number, category?: string) {
  const supabase = await createServerSupabaseClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("games")
    .select("*, categories:game_categories(category_id, categories:categories(*))", { count: "exact" })
    .eq("is_published", true);

  if (q) {
    query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
  }

  if (category) {
    query = query.eq("game_categories.category_id", category);
  }

  switch (sort) {
    case "trending":
      query = query.order("hot_score", { ascending: false });
      break;
    case "popular":
      query = query.order("view_count", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, count } = await query.range(from, to);

  const games = (data || []).map((g: any) => ({
    ...g,
    categories: g.categories?.filter((gc: any) => gc.categories).map((gc: any) => gc.categories) || [],
  }));

  return { games, total: count || 0 };
}

async function getCategories() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });
  return data || [];
}

export const metadata: Metadata = {
  title: "Search Games - Play Free Online Games",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", sort = "newest", page: pageStr, category } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1") || 1);

  const [{ games, total }, categories] = await Promise.all([
    searchGames(q, sort, page, category),
    getCategories(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Search", url: `${SITE_URL}/search` },
        ]}
      />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">
          {q ? `Search results for "${q}"` : "Browse All Games"}
        </h1>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground mr-2">Sort:</span>
          {[
            { label: "Newest", value: "newest" },
            { label: "Trending", value: "trending" },
            { label: "Popular", value: "popular" },
          ].map((s) => (
            <Link
              key={s.value}
              href={`/search?q=${encodeURIComponent(q)}&sort=${s.value}&page=1${category ? `&category=${category}` : ""}`}
              className={`inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors ${
                sort === s.value
                  ? "bg-primary text-primary-foreground"
                  : "border hover:bg-accent"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-sm text-muted-foreground mr-1">Category:</span>
            {category && (
              <Link
                href={`/search?q=${encodeURIComponent(q)}&sort=${sort}`}
                className="inline-flex h-7 items-center justify-center rounded-md px-2.5 text-xs border bg-accent"
              >
                All
              </Link>
            )}
            {categories.slice(0, 10).map((c) => (
              <Link
                key={c.id}
                href={`/search?q=${encodeURIComponent(q)}&sort=${sort}&category=${c.id}`}
                className={`inline-flex h-7 items-center justify-center rounded-md px-2.5 text-xs transition-colors ${
                  category === c.id
                    ? "bg-primary text-primary-foreground"
                    : "border hover:bg-accent"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{total} games found</p>

      {games.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {games.map((game: Game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&sort=${sort}&page=${page - 1}${category ? `&category=${category}` : ""}`}
                  className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/search?q=${encodeURIComponent(q)}&sort=${sort}&page=${page + 1}${category ? `&category=${category}` : ""}`}
                  className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {q
            ? `No games found for "${q}". Try a different search term.`
            : "No games found. Try adjusting your filters."}
        </div>
      )}
    </div>
  );
}
