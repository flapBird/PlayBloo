import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { GameCard } from "@/components/games/GameCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, PAGE_SIZE } from "@/lib/constants";
import type { Game } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCategory(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

async function getGames(slug: string, page: number) {
  const supabase = createAdminClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: catData } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!catData) return { games: [], total: 0 };

  const { data: catGames } = await supabase
    .from("game_categories")
    .select("game_id")
    .eq("category_id", catData.id);

  const gameIds = (catGames || []).map(gc => gc.game_id);

  if (gameIds.length === 0) return { games: [], total: 0 };

  const { data: gamesData, count } = await supabase
    .from("games")
    .select(`*, categories:game_categories(category_id, categories:categories(*))`, { count: "exact" })
    .eq("is_published", true)
    .in("id", gameIds)
    .order("created_at", { ascending: false })
    .range(from, to);

  const games = (gamesData || []).map((g: any) => ({
    ...g,
    categories: g.categories?.filter((gc: any) => gc.categories).map((gc: any) => gc.categories) || [],
  }));

  return { games, total: count || 0 };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category Not Found" };

  const title = category.meta_title || `${category.name} Games - Play Free Online ${category.name} Games`;
  const description = category.meta_description || `Play the best free ${category.name} games online.`;

  return { title, description };
}

export const revalidate = 120;

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1") || 1);

  const category = await getCategory(slug);
  if (!category) notFound();

  const { games, total } = await getGames(slug, page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Categories", url: `${SITE_URL}/category` },
          { name: category.name, url: `${SITE_URL}/category/${category.slug}` },
        ]}
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{category.name} Games</h1>
        {category.description && (
          <p className="text-muted-foreground max-w-3xl">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground">{total} games found</p>
      </div>

      {games.length > 0 ? (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3 md:gap-4">
            {games.map((game: Game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/category/${slug}?page=${page - 1}`}
                  className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm"
                >
                  Previous
                </Link>
              )}
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p} className="flex items-center gap-1">
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1">...</span>}
                    <Link
                      href={`/category/${slug}?page=${p}`}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm ${
                        p === page
                          ? "bg-primary text-primary-foreground"
                          : "border hover:bg-accent"
                      }`}
                    >
                      {p}
                    </Link>
                  </span>
                ))}
              {page < totalPages && (
                <Link
                  href={`/category/${slug}?page=${page + 1}`}
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
          No games found in this category yet.
        </div>
      )}
    </div>
  );
}
