import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GameLanding, landingMetadata } from "@/components/landing/GameLanding";
import { getCachedLandingPage } from "@/lib/landing-feeds";
import { LANDING_PAGE_SIZE } from "@/lib/constants";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

function pageNumber(value?: string) {
  return Math.min(100, Math.max(1, parseInt(value || "1") || 1));
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // Rendered title is 35 characters; with the " | PlayBloo" suffix it stays
  // inside the 60-character limit.
  return landingMetadata(
    "popular",
    pageNumber((await searchParams).page),
    "Most Played Browser Games Right Now",
    "The most played browser games on PlayBloo, ranked by real play starts. See which free online games visitors actually keep launching, updated continuously.",
  );
}

export const revalidate = 900;

export default async function PopularPage({ searchParams }: Props) {
  const page = pageNumber((await searchParams).page);
  const feed = await getCachedLandingPage("popular", page);
  const totalPages = Math.ceil(feed.total / LANDING_PAGE_SIZE);
  if (page > 1 && page > totalPages) notFound();

  const lead = <>The all-time chart: <strong>{feed.total.toLocaleString()} browser games</strong> ranked by how many visitors actually started playing them, with page views settling ties.</>;

  const about = {
    heading: "How the most-played ranking works",
    paragraphs: [
      <>Nothing here is hand-picked. Play starts are recorded on the site itself, and the order re-sorts on its own as sessions accumulate — games nobody launches never climb, however good their store page looks, while games people return to keep their ground for years.</>,
      <>Counts only ever grow, so this is the record of long-term favourites rather than this week&apos;s fad. For what is moving right now, the trending list re-weights recent activity instead.</>,
    ],
    facts: [
      { title: "Plays, not views", text: "A game climbs only when someone actually starts it, not when its page loads." },
      { title: "Ties by views", text: "Equally-played games are ordered by how often their pages were viewed." },
      { title: "Plays in place", text: "Most entries near the top launch right here in an embedded frame — in-place games are easier to start." },
    ],
  };

  return (
    <GameLanding
      basePath="popular"
      eyebrow="Ranked by real play starts"
      h1="Most Played Browser Games"
      lead={lead}
      about={about}
      pageLead={<>Page {page} of the all-time most-played ranking, ordered by play starts. The full introduction and the top of the chart are on <strong>page 1</strong>.</>}
      feed={feed}
      page={page}
    />
  );
}
