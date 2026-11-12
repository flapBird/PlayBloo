import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { LANDING_PAGE_SIZE, SITE_URL } from "@/lib/constants";
import type { LandingFeed } from "@/lib/landing-feeds";

/**
 * Shared shell for the three indexable discovery landing pages. The page
 * files own their copy and metadata; this component owns the compact hero
 * (one lead line plus a New/Popular/Trending switcher), the grid, the
 * crawlable pagination and the "about this list" block below the grid.
 *
 * The first screen belongs to the games: the long-form intro SEO needs lives
 * below the grid (still server-rendered on page 1) instead of pushing the
 * grid under the fold. Page 2+ render only a short lead line — lean
 * duplicates of page 1, per the pagination noindex convention.
 */

const LANDING_TABS = [
  { basePath: "new-games", label: "New" },
  { basePath: "popular", label: "Popular" },
  { basePath: "trending", label: "Trending" },
];

export interface LandingAbout {
  heading: string;
  paragraphs: ReactNode[];
  /** Three scannable fact cards under the paragraphs. */
  facts: Array<{ title: string; text: string }>;
}

export interface GameLandingProps {
  /** Single path segment, e.g. "new-games". */
  basePath: string;
  eyebrow: string;
  h1: string;
  /** Page-1 lead line (~25 words) rendered under the H1. */
  lead: ReactNode;
  /** Page-1 long-form copy, rendered below the grid. */
  about: LandingAbout;
  /** Short lead line for pages 2+. */
  pageLead: ReactNode;
  feed: LandingFeed;
  page: number;
}

export function GameLanding({ basePath, eyebrow, h1, lead, about, pageLead, feed, page }: GameLandingProps) {
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

      <header className="mb-5 md:mb-6">
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{h1}{!isFirstPage && <span className="text-muted-foreground"> — page {page}</span>}</h1>
          </div>
          <nav aria-label="Discovery rankings" className="flex shrink-0 items-center gap-1 rounded-xl border bg-card p-1">
            {LANDING_TABS.map((tab) => (
              <Link key={tab.basePath} href={`/${tab.basePath}`} prefetch={false}
                aria-current={tab.basePath === basePath ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${tab.basePath === basePath ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-2.5 max-w-2xl text-sm leading-6 text-muted-foreground">{isFirstPage ? lead : pageLead}</p>
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

      {isFirstPage && (
        <section aria-label={`About ${h1.toLowerCase()}`} className="mt-10 border-t pt-6 md:mt-12">
          <h2 className="text-lg font-black tracking-tight">{about.heading}</h2>
          <div className="mt-2.5 max-w-3xl space-y-3 text-sm leading-6 text-muted-foreground">
            {about.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {about.facts.map((fact) => (
              <li key={fact.title} className="rounded-xl border bg-card p-3.5">
                <span className="block text-xs font-extrabold uppercase tracking-wide">{fact.title}</span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">{fact.text}</span>
              </li>
            ))}
          </ul>
        </section>
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
