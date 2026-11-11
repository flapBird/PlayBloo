import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GameLanding, landingMetadata } from "@/components/landing/GameLanding";
import { getCachedLandingPage, getCachedRecentAdditions } from "@/lib/landing-feeds";
import { LANDING_PAGE_SIZE } from "@/lib/constants";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

function pageNumber(value?: string) {
  return Math.min(100, Math.max(1, parseInt(value || "1") || 1));
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // Rendered title is 45 characters; with the " | PlayBloo" suffix it stays
  // inside the 60-character limit.
  return landingMetadata(
    "new-games",
    pageNumber((await searchParams).page),
    "New Browser Games - Play the Latest Additions",
    "Every new browser game added to PlayBloo, newest first. Play the latest free HTML5 and WebGL games the day they join the catalogue - no downloads.",
  );
}

export const revalidate = 900;

const SIBLINGS = [
  { label: "Most played browser games", href: "/popular" },
  { label: "Trending this week", href: "/trending" },
];

export default async function NewGamesPage({ searchParams }: Props) {
  const page = pageNumber((await searchParams).page);
  const [feed, additions] = await Promise.all([
    getCachedLandingPage("new", page),
    getCachedRecentAdditions(),
  ]);
  const totalPages = Math.ceil(feed.total / LANDING_PAGE_SIZE);
  if (page > 1 && page > totalPages) notFound();

  const newestTitle = additions.latestTitle;
  const newestDays = additions.latestAgeDays;

  const intro = (
    <>
      <p>
        This is every game we have added to PlayBloo, sorted by the day it joined the catalogue — the top card is the
        newest addition on the site. Additions land continuously rather than in weekly batches:{" "}
        {additions.weekCount > 0
          ? <>the last seven days brought <strong>{additions.weekCount} new games</strong>{newestDays !== null && newestTitle ? <> and the latest, <strong>{newestTitle}</strong>, joined {newestDays === 0 ? "today" : newestDays === 1 ? "yesterday" : `${newestDays} days ago`}</> : null}, and the next one usually appears here within hours of being imported.</>
          : <>new games are imported and checked every week, and the next one usually appears here within hours of joining the catalogue.</>}
      </p>
      <p>
        Every entry is an independent web game — mostly HTML5 and WebGL titles from itch.io and small studios — and each
        one gets the same treatment before it shows up on this page: we verify where it actually runs, record the
        developer and release details, and mark whether you can play it right here in an embedded frame or whether it
        links out to the official page. Games that carry a &ldquo;New&rdquo; badge were added within the last two weeks;
        the badge clears automatically, so this list stays honest about what is genuinely fresh.
      </p>
      <p>
        If you visit often, page one is the only page you need — the grid is ordered newest first and each page holds 36
        games, so older additions move down as new ones arrive. Prefer rankings that reflect what other visitors are
        playing today? Try the most-played or trending lists linked below the grid.
      </p>
    </>
  );

  return (
    <GameLanding
      basePath="new-games"
      eyebrow="Fresh off the import queue"
      h1="New Browser Games"
      intro={intro}
      pageLead={<>Page {page} of the catalogue&apos;s newest additions, ordered newest first. The full introduction and the freshest cards are on <strong>page 1</strong>.</>}
      feed={feed}
      page={page}
      siblings={SIBLINGS}
    />
  );
}
