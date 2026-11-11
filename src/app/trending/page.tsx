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

const SIBLINGS = [
  { label: "New browser games", href: "/new-games" },
  { label: "Most played browser games", href: "/popular" },
];

export default async function TrendingPage({ searchParams }: Props) {
  const page = pageNumber((await searchParams).page);
  const [feed, additions] = await Promise.all([
    getCachedLandingPage("trending", page),
    getCachedRecentAdditions(),
  ]);
  const totalPages = Math.ceil(feed.total / LANDING_PAGE_SIZE);
  if (page > 1 && page > totalPages) notFound();

  const intro = (
    <>
      <p>
        Trending answers a different question than the most-played chart: not &ldquo;what has the most plays ever&rdquo;
        but &ldquo;what are visitors launching <em>this week</em>&rdquo;. The score behind the order blends play starts
        and page views and then applies a recency decay, so activity from the last couple of days counts far more than
        activity from last month. A game with a modest lifetime total can outrank an established favourite if it is
        being played hard right now.
      </p>
      <p>
        In practice the top of this list is where new arrivals prove themselves — a fresh import that gets played in its
        first days climbs fast before settling into its long-term position — alongside seasonal revivals and older games
        getting a second wave. The chart re-sorts continuously as sessions come in, so positions shift during the day
        rather than on a fixed schedule; refreshing is genuinely useful here.{" "}
        {additions.weekCount > 0
          ? <>With <strong>{additions.weekCount} games added in the last seven days</strong>, several cards on page one are titles that did not exist on the site a week ago.</>
          : null}
      </p>
      <p>
        Read this page together with its two siblings: the new-games list is ordered by arrival date and shows you
        everything fresh regardless of whether anyone has played it yet, while the most-played list records the
        all-time favourites. Trending is the overlap — what is new or resurging <em>and</em> being played.
      </p>
    </>
  );

  return (
    <GameLanding
      basePath="trending"
      eyebrow="Recency-weighted, re-sorted continuously"
      h1="Trending Browser Games"
      intro={intro}
      pageLead={<>Page {page} of the trending chart, ordered by recency-weighted play and view activity. The full introduction and the top movers are on <strong>page 1</strong>.</>}
      feed={feed}
      page={page}
      siblings={SIBLINGS}
    />
  );
}
