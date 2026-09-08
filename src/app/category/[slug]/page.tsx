import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { GameListItem } from "@/components/games/GameListItem";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, PAGE_SIZE, MIN_INDEXABLE_CATEGORY_GAMES } from "@/lib/constants";
import { normalizePublicGameCards, PUBLIC_GAME_CARD_FIELDS } from "@/lib/discovery-data";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const getCategory = unstable_cache(async (slug: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}, ["category-by-slug-v2"], { revalidate: 1800 });

const getGames = unstable_cache(async (slug: string, page: number) => {
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
    .select(PUBLIC_GAME_CARD_FIELDS, { count: "exact" })
    .eq("is_published", true)
    .in("id", gameIds)
    .order("created_at", { ascending: false })
    .range(from, to);

  return { games: normalizePublicGameCards(gamesData), total: count || 0 };
}, ["category-games-v2"], { revalidate: 1800 });

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageValue } = await searchParams;
  const page = Math.min(100, Math.max(1, parseInt(pageValue || "1") || 1));
  const category = await getCategory(slug);
  if (!category) return { title: "Category Not Found" };
  const { total } = await getGames(slug, 1);
  const isContentVerified = category.content_verified === true;

  const title = isContentVerified && category.meta_title
    ? category.meta_title
    : `${category.name} Games`;
  const gameLabel = total === 1 ? "game" : "games";
  const description = isContentVerified && category.meta_description
    ? category.meta_description
    : `Browse ${total} ${category.name} ${gameLabel} on PlayBloo and choose where to play.`;

   return {
     title,
     description,
     alternates: {
       canonical: page > 1 ? `/category/${slug}?page=${page}` : `/category/${slug}`,
     },
     ...(total < MIN_INDEXABLE_CATEGORY_GAMES
       ? {
           robots: {
             index: false,
             follow: true,
           },
         }
       : {}),
   };
}

export const revalidate = 1800;

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.min(100, Math.max(1, parseInt(pageStr || "1") || 1));

  const category = await getCategory(slug);
  if (!category) notFound();

  const { games, total } = await getGames(slug, page);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const isContentVerified = category.content_verified === true;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Categories", url: `${SITE_URL}/category` },
          { name: category.name, url: `${SITE_URL}/category/${category.slug}` },
        ]}
      />

      <div className="border-b pb-6">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Browse by genre</p>
        <h1 className="text-3xl font-black tracking-tight">{category.name} Games</h1>
        {isContentVerified && category.description && (
          <p className="mt-2 max-w-3xl leading-6 text-muted-foreground">{category.description}</p>
        )}
        {isContentVerified && category.source_url && (
          <a
            href={category.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Editorial source
          </a>
        )}
        <p className="mt-2 text-sm text-muted-foreground">{total} games found</p>
      </div>

      {games.length > 0 ? (
        <>
          <div className="mx-auto max-w-5xl">
            {games.map((game, index) => (
              <GameListItem key={game.id} game={game} eagerImage={index === 0} />
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
