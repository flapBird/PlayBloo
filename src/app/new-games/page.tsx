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

export default async function NewGamesPage({ searchParams }: Props) {
  const page = pageNumber((await searchParams).page);
  const [feed, additions] = await Promise.all([
    getCachedLandingPage("new", page),
    getCachedRecentAdditions(),
  ]);
  const totalPages = Math.ceil(feed.total / LANDING_PAGE_SIZE);
  if (page > 1 && page > totalPages) notFound();

  const lead = additions.weekCount > 0
    ? <>Every game added to PlayBloo, newest first. <strong>{additions.weekCount} games</strong> joined in the last seven days{additions.latestTitle && additions.latestAgeDays !== null
      ? <> — the newest, <strong>{additions.latestTitle}</strong>, landed {additions.latestAgeDays === 0 ? "today" : additions.latestAgeDays === 1 ? "yesterday" : `${additions.latestAgeDays} days ago`}</>
      : null}.</>
    : <>Every game added to PlayBloo, newest first — fresh imports land here the moment they are published.</>;

  const about = {
    heading: "How the new-games list works",
    paragraphs: [
      <>The catalogue grows continuously: itch.io imports, editorial finds and community submissions all land here the moment they are published. Each one is verified — where it runs, who made it, whether it plays in an embedded frame or links out — before it earns a card, and the top tile is always the newest addition on the site.</>,
      <>Because arrivals are checked before listing, a game can appear a few hours after we find it — and if it breaks later, the card says so instead of silently linking a dead page.</>,
    ],
    facts: [
      { title: "Newest first", text: "The grid is ordered by the day each game joined; older games slide down as fresh ones arrive." },
      { title: "The New badge", text: "Marks games added within the last two weeks and clears automatically, so the list stays honest about what is fresh." },
      { title: "36 games per page", text: "Pagination walks down the full arrival history of the catalogue." },
    ],
  };

  return (
    <GameLanding
      basePath="new-games"
      eyebrow="Fresh off the import queue"
      h1="New Browser Games"
      lead={lead}
      about={about}
      pageLead={<>Page {page} of the catalogue&apos;s newest additions, ordered newest first. The full introduction and the freshest cards live on <strong>page 1</strong>.</>}
      feed={feed}
      page={page}
    />
  );
}
