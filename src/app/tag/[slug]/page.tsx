import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { GameListItem } from "@/components/games/GameListItem";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { MIN_INDEXABLE_TAG_GAMES, SITE_URL, PAGE_SIZE } from "@/lib/constants";
import { normalizePublicGameCards, PUBLIC_GAME_CARD_FIELDS } from "@/lib/discovery-data";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const getTag = unstable_cache(async (slug: string) => {
  const supabase = createAdminClient();
  const { data } = await supabase.from("tags").select("*").eq("slug", slug).single();
  return data;
}, ["tag-by-slug-v1"], { revalidate: 1800 });

const getGames = unstable_cache(async (slug: string, page: number) => {
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
    .select(PUBLIC_GAME_CARD_FIELDS, { count: "exact" })
    .eq("is_published", true)
    .in("id", gameIds)
    .order("created_at", { ascending: false })
    .range(from, to);

  return { games: normalizePublicGameCards(gamesData), total: count || 0 };
}, ["tag-games-v2"], { revalidate: 1800 });

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageValue } = await searchParams;
  const page = Math.min(100, Math.max(1, parseInt(pageValue || "1") || 1));
  const tag = await getTag(slug);
  if (!tag) return { title: "Tag Not Found" };
  const { total } = await getGames(slug, 1);
   return {
     title: `${tag.name} Games - Browse Free Online Games Tagged with ${tag.name}`,
     alternates: {
       canonical: page > 1 ? `/tag/${slug}?page=${page}` : `/tag/${slug}`,
     },
     ...(total < MIN_INDEXABLE_TAG_GAMES ? { robots: { index: false, follow: true } } : {}),
   };
}

export const revalidate = 1800;

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Math.min(100, Math.max(1, parseInt(pageStr || "1") || 1));

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

      <div className="border-b pb-6">
        <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Browse by tag</p>
        <h1 className="text-3xl font-black tracking-tight">Games tagged with &ldquo;{tag.name}&rdquo;</h1>
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
