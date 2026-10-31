"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Flame, LayoutGrid, List, Zap } from "lucide-react";
import { GameCard } from "@/components/games/GameCard";
import { GameListItem } from "@/components/games/GameListItem";
import type { HomeFeeds, HomeFeedSort } from "@/lib/home-feeds";

const tabs = [
  { sort: "newest", label: "New", icon: null },
  { sort: "trending", label: "Trending", icon: Flame },
  { sort: "released", label: "Released", icon: CalendarDays },
  { sort: "popular", label: "Popular", icon: null },
] as const;

export function HomeDiscovery({ feeds, sidebar }: { feeds: HomeFeeds; sidebar?: ReactNode }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<HomeFeedSort>("newest");
  const activeTab = tabs.find((tab) => tab.sort === sort)!;
  const { games, failed } = feeds[sort];
  const query = new URLSearchParams();
  if (sort !== "newest") query.set("sort", sort);
  if (view === "list") query.set("view", view);
  const browseHref = `/search${query.size ? `?${query}` : ""}`;

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setSort(tabs[next].sort);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  return (
    <>
      <div className="discovery-toolbar home-discovery-toolbar mt-7">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <div role="tablist" aria-label="Game feed" className="discovery-tabs">
            {tabs.map((tab, index) => (
              <button key={tab.sort} type="button" role="tab" id={`feed-tab-${tab.sort}`} aria-controls="home-game-feed" aria-selected={sort === tab.sort} tabIndex={sort === tab.sort ? 0 : -1} onClick={() => setSort(tab.sort)} onKeyDown={(event) => handleTabKey(event, index)} className={sort === tab.sort ? "is-active" : ""}>
                {tab.icon && <tab.icon className="h-3.5 w-3.5" aria-hidden="true" />}{tab.label}
              </button>
            ))}
          </div>
          {/* A playMode filter, not a sort — styled like a tab but visually its own thing. */}
          <Link href="/search?playMode=embedded" prefetch={false} className="discovery-instant-link">
            <Zap className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            Play instantly
          </Link>
        </div>
        <div className="discovery-tools flex shrink-0 items-center gap-3">
          <Link href={browseHref} prefetch={false} className="discovery-tool-button home-browse-button">Browse all<ArrowRight className="h-4 w-4" /></Link>
          <div role="group" aria-label="Display games as" className="home-view-switch">
            <button type="button" onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"} className={`discovery-tool-button ${view === "grid" ? "is-selected" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
            <button type="button" onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} className={`discovery-tool-button ${view === "list" ? "is-selected" : ""}`}><List className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
      <div className={`mt-6 grid items-start gap-8 xl:gap-8 ${sidebar ? "lg:grid-cols-[minmax(0,1fr)_290px]" : ""}`}>
        <section id="home-game-feed" role="tabpanel" aria-labelledby={`feed-tab-${sort}`} tabIndex={0} className="home-feed-panel min-w-0">
          <span aria-live="polite" className="sr-only">{failed ? "Games could not be loaded" : `${activeTab.label}: ${games.length} games shown`}</span>
          {games.length ? view === "grid" ? (
            <div className="home-game-grid grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
              {games.map((game, index) => <GameCard key={game.id} game={game} eagerImage={index < 4} showDate={sort === "released"} dateField={sort === "released" ? "released" : "added"} />)}
            </div>
          ) : (
            <div className="discovery-list">
              {games.map((game, index) => <GameListItem key={game.id} game={game} eagerImage={index === 0} dateField={sort === "released" ? "released" : "added"} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              <p>{failed ? "Games could not be loaded. Please try again." : sort === "released" ? "No verified release dates are available yet." : "Games will appear here soon."}</p>
              {failed && <Link href={browseHref} className="mt-3 inline-block font-semibold text-primary">Try again <ArrowRight className="inline h-3.5 w-3.5" /></Link>}
            </div>
          )}
          {games.length > 0 && <div className="mt-7 flex justify-center">
            <Link href={browseHref} prefetch={false} className="home-browse-link inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold hover:border-primary/50 hover:text-primary">Browse all {activeTab.label.toLowerCase()} games <ArrowRight className="h-4 w-4" /></Link>
          </div>}
        </section>
        {sidebar}
      </div>
    </>
  );
}
