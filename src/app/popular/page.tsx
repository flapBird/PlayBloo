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

const SIBLINGS = [
  { label: "New browser games", href: "/new-games" },
  { label: "Trending this week", href: "/trending" },
];

export default async function PopularPage({ searchParams }: Props) {
  const page = pageNumber((await searchParams).page);
  const feed = await getCachedLandingPage("popular", page);
  const totalPages = Math.ceil(feed.total / LANDING_PAGE_SIZE);
  if (page > 1 && page > totalPages) notFound();

  const intro = (
    <>
      <p>
        This ranking is the closest thing PlayBloo has to a chart: every game on the site ordered by{" "}
        <strong>how many visitors actually started playing it</strong>, with page views settling ties. Nothing here is
        hand-picked — the order comes from play sessions recorded on the site itself, and the list re-sorts on its own
        as plays accumulate. Across the {feed.total.toLocaleString()} games in the catalogue, these are the ones people
        keep coming back to.
      </p>
      <p>
        Two things are worth knowing about how the chart behaves. First, play counts only grow — a game that earned its
        position stays visible even after the initial wave moves on, which makes this page the record of all-time
        favourites rather than this week&rsquo;s fad. Second, most games near the top are titles you can launch right
        here in an embedded frame, because a game that plays in place is far easier to start than one that links out.
        Games that have never been played do not appear near the top at all, however good their store page looks.
      </p>
      <p>
        Use it as a starting point: the first page holds the 36 most-launched games, and the pagination walks you down
        the long tail in the same order. If you would rather see what is moving <em>right now</em> — new releases
        spiking, seasonal picks reviving — the trending list next to it re-weights recent activity instead of lifetime
        totals.
      </p>
    </>
  );

  return (
    <GameLanding
      basePath="popular"
      eyebrow="Ranked by real play starts"
      h1="Most Played Browser Games"
      intro={intro}
      pageLead={<>Page {page} of the all-time most-played ranking, ordered by play starts. The full introduction and the top of the chart are on <strong>page 1</strong>.</>}
      feed={feed}
      page={page}
      siblings={SIBLINGS}
    />
  );
}
