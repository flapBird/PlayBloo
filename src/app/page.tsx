import type { Metadata } from "next";
import { HomeDiscovery } from "@/components/home/HomeDiscovery";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeLibraryPanel } from "@/components/home/HomeLibraryPanel";
import { getHomeContent } from "@/lib/home-feeds";

export const revalidate = 900;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const { feeds } = await getHomeContent();

  return (
    <div className="home-page pb-8">
      <div className="container mx-auto px-4 pt-5 md:pt-7">
        <section className="home-intro">
          <div className="max-w-2xl">
            <h1 className="home-title">
              Discover your <span className="text-primary">next game.</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              New browser games, ready to play. No download required.
            </p>
          </div>
        </section>

        <HomeFeatured games={feeds.trending.games} />

        {/* The guides hub lives in the featured mosaic and "Play instantly" sits
            beside the feed tabs, so the old right rail has nothing left to do. */}
        <HomeDiscovery feeds={feeds} />
        <HomeLibraryPanel />
      </div>
    </div>
  );
}
