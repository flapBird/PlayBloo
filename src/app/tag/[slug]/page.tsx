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

async function getTag(slug: string) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("tags").select("*").eq("slug", slug).single();
  return data;
}

async function getGames(slug: string, page: number) {
  const supabase = createAdminClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: tagData } = await supabase
    .from("tags").select("id").eq("slug", slug).single();
  if (!tagData) return { games: [], total: 0 };

  const { data: tagGames } = await supabase
    .from("game_tags")
    .select("game_id")
    .eq("tag_id", tagData.id);

  const gameIds = (tagGames || []).map(gt => gt.game_id);

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
  const tag = await getTag(slug);
  if (!tag) return { title: "Tag Not Found" };
  return { title: `${tag.name} Games - Browse Free Online Games Tagged with ${tag.name}` };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1") || 1);

  const tag = await getTag(slug);
  if (!tag) notFound();

  const { games, total } = await getGames(slug, page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: `Tag: ${tag.name}`, url: `${SITE_URL}/tag/${tag.slug}` },
        ]}
      />

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Games tagged with &ldquo;{tag.name}&rdquo;</h1>
        <p className="text-sm text-muted-foreground">{total} games found</p>
      </div>

      {games.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {games.map((game: Game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link href={`/tag/${slug}?page=${page - 1}`}
                  className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm">Previous</Link>
              )}
              {page < totalPages && (
                <Link href={`/tag/${slug}?page=${page + 1}`}
                  className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm">Next</Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">No games found with this tag yet.</div>
      )}
    </div>
  );
}
