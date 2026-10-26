import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CategoryIcon } from "@/components/layout/category-icons";
import { getCategory, getCategoryGames } from "@/lib/category-data";
import { SITE_URL, PAGE_SIZE, MIN_INDEXABLE_CATEGORY_GAMES } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

function pageNumber(value?: string) {
  return Math.min(100, Math.max(1, parseInt(value || "1") || 1));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = pageNumber((await searchParams).page);
  const category = await getCategory(slug);
  if (!category) notFound();
  const { total } = await getCategoryGames(category.id, slug, page);
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
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export const revalidate = 3600;

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const page = pageNumber((await searchParams).page);
  const category = await getCategory(slug);
  if (!category) notFound();

  const { games, total } = await getCategoryGames(category.id, slug, page);
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (page > 1 && page > totalPages) notFound();
  const pageHref = (value: number) => value === 1 ? `/category/${slug}` : `/category/${slug}?page=${value}`;
  const visiblePages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  return (
    <div className="container mx-auto px-4 pb-8 pt-6 md:pt-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Categories", url: `${SITE_URL}/category` },
          { name: category.name, url: `${SITE_URL}/category/${category.slug}` },
        ]}
      />

      <header className="mb-6 max-w-4xl md:mb-8">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary" aria-hidden="true">
            <CategoryIcon slug={category.slug} className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{category.name} Games</h1>
        </div>
        {category.content_verified === true && category.description && (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{category.description}</p>
        )}
      </header>

      {games.length > 0 ? (
        <section aria-label={`${category.name} games`}>
          <div className="category-game-grid grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:gap-4">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} eagerImage={index < 6} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Category pages" className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
              {page > 1 && (
                <Link href={pageHref(page - 1)} prefetch={false} aria-label="Previous page" rel="prev"
                  className="flex h-10 items-center gap-1 rounded-xl border px-2.5 text-sm font-semibold transition-colors hover:bg-muted sm:px-3">
                  <ChevronLeft className="h-4 w-4" /><span className="hidden sm:inline">Previous</span>
                </Link>
              )}
              {visiblePages.map((value, index) => (
                <span key={value} className="flex items-center gap-1.5 sm:gap-2">
                  {index > 0 && visiblePages[index - 1] !== value - 1 && <span className="text-muted-foreground" aria-hidden="true">…</span>}
                  <Link href={pageHref(value)} prefetch={false} aria-label={`Page ${value}`} aria-current={value === page ? "page" : undefined}
                    className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-semibold transition-colors ${value === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                    {value}
                  </Link>
                </span>
              ))}
              {page < totalPages && (
                <Link href={pageHref(page + 1)} prefetch={false} aria-label="Next page" rel="next"
                  className="flex h-10 items-center gap-1 rounded-xl border px-2.5 text-sm font-semibold transition-colors hover:bg-muted sm:px-3">
                  <span className="hidden sm:inline">Next</span><ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </nav>
          )}
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
          <p>New games are on the way.</p>
          <Link href="/category" className="mt-3 inline-block font-semibold text-primary">Explore other categories</Link>
        </div>
      )}
    </div>
  );
}
