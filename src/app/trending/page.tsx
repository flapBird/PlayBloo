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
  // Rendered title is 32 characters; with the " | PlayBloo" suffix it stays
  // inside the 60-character limit.
  return landingMetadata(
    "trending",
    pageNumber((await searchParams).page),
    "Trending Browser Games This Week",
    "Browser games trending on PlayBloo right now, ranked by a recency-weighted play and view score. Catch new releases and revivals climbing the chart.",
  );
}

export const revalidate = 900;

export default async function TrendingPage({ searchParams }: Props) {
  const page = pageNumber((await searchParams).page);
  const [feed, additions] = await Promise.all([
    getCachedLandingPage("trending", page),
    getCachedRecentAdditions(),
  ]);
  const totalPages = Math.ceil(feed.total / LANDING_PAGE_SIZE);
  if (page > 1 && page > totalPages) notFound();

  const lead = <>What visitors are launching this week: plays and views blended with a recency decay, so <strong>the last few days outweigh last month</strong>.</>;

  const about = {
    heading: "How the trending chart works",
    paragraphs: [
      <>Trending is where new arrivals prove themselves — a fresh import that gets played in its first days climbs fast, then settles into its long-term position once the wave passes. Seasonal revivals and older games getting a second wind resurface here the same way.</>,
      <>The score re-sorts continuously as sessions come in, so positions shift during the day rather than on a schedule — refreshing genuinely helps.{" "}
      {additions.weekCount > 0
        ? <><strong>{additions.weekCount} games</strong> were added in the last seven days, and several cards on page one did not exist on the site a week ago.</>
        : null}</>,
    ],
    facts: [
      { title: "Recency-weighted", text: "Recent sessions count far more than lifetime totals in the score." },
      { title: "Continuously live", text: "No fixed refresh schedule — the chart moves as plays arrive." },
      { title: "Read it beside the others", text: "New lists by arrival date, Most Played is all-time; trending is the overlap." },
    ],
  };

  return (
    <GameLanding
      basePath="trending"
      eyebrow="Recency-weighted, re-sorted continuously"
      h1="Trending Browser Games"
      lead={lead}
      about={about}
      pageLead={<>Page {page} of the trending chart, ordered by recency-weighted play and view activity. The full introduction and the top movers are on <strong>page 1</strong>.</>}
      feed={feed}
      page={page}
    />
  );
}
