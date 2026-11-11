import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { LANDING_PAGE_SIZE, SITE_URL } from "@/lib/constants";
import type { LandingFeed } from "@/lib/landing-feeds";

/**
 * Shared shell for the three indexable discovery landing pages. The page
 * files own their copy and metadata; this component owns the grid, the
 * crawlable pagination and the page-2+ lean rendering (the 150-250-word
 * intro only renders on page 1 so paginated pages stay lean duplicates).
 */
export interface GameLandingProps {
  /** Single path segment, e.g. "new-games". */
  basePath: string;
  eyebrow: string;
  h1: string;
  /** Page-1 intro copy (150-250 words), already composed with live numbers. */
  intro: ReactNode;
  /** Short page-2+ lead line instead of the full intro. */
  pageLead: ReactNode;
  feed: LandingFeed;
  page: number;
  /** Links to the sibling landing pages, rendered under the grid. */
  siblings: Array<{ label: string; href: string }>;
}

export function GameLanding({ basePath, eyebrow, h1, intro, pageLead, feed, page, siblings }: GameLandingProps) {
  const { games, total } = feed;
  const totalPages = Math.max(1, Math.ceil(total / LANDING_PAGE_SIZE));
  const pageHref = (value: number) => (value === 1 ? `/${basePath}` : `/${basePath}?page=${value}`);
  const visiblePages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
  const isFirstPage = page === 1;

  return (
    <div className="container mx-auto px-4 pb-8 pt-6 md:pt-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: h1, url: `${SITE_URL}/${basePath}` },
        ]}
      />

      <header className="mb-6 max-w-3xl md:mb-8">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{h1}{!isFirstPage && <span className="text-muted-foreground"> — page {page}</span>}</h1>
        {isFirstPage ? <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">{intro}</div> : <div className="mt-2 text-sm leading-6 text-muted-foreground">{pageLead}</div>}
      </header>

      {games.length > 0 ? (
        <section aria-label={h1}>
          <div className="category-game-grid grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:gap-4">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} eagerImage={index < 6} showDate={basePath === "new-games"} dateField="added" />
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label={`${h1} pages`} className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
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
          <p>Games will appear here soon.</p>
          <Link href="/" className="mt-3 inline-block font-semibold text-primary">Back to the homepage</Link>
        </div>
      )}

      {siblings.length > 0 && (
        <nav aria-label="More ways to browse" className="mt-10 border-t pt-5 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">More ways to browse:</span>{" "}
          {siblings.map((sibling, index) => (
            <span key={sibling.href}>
              {index > 0 && " · "}
              <Link href={sibling.href} prefetch={false} className="font-semibold text-primary hover:underline">{sibling.label}</Link>
            </span>
          ))}
        </nav>
      )}
    </div>
  );
}

/** Robots + canonical shared by the three landing pages' generateMetadata. */
export function landingMetadata(basePath: string, page: number, title: string, description: string) {
  const isPaginated = page > 1;
  return {
    title,
    description,
    alternates: {
      canonical: isPaginated ? `/${basePath}?page=${page}` : `/${basePath}`,
    },
    // Same convention as category pagination: page 1 is indexable, later
    // pages stay crawlable but out of the index.
    ...(isPaginated ? { robots: { index: false, follow: true } } : {}),
  };
}
