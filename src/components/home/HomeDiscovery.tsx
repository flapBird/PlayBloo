"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Flame, LayoutGrid, List, SlidersHorizontal } from "lucide-react";

export function HomeDiscovery({ grid, list, sidebar }: { grid: ReactNode; list: ReactNode; sidebar: ReactNode }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <>
      <nav aria-label="Game feed" className="discovery-toolbar mt-7">
        <div className="discovery-tabs">
          <Link href="/" className="is-active" aria-current="page">New</Link>
          <Link href="/search?sort=trending" prefetch={false}><Flame className="h-3.5 w-3.5" />Trending</Link>
          <Link href="/search?sort=released" prefetch={false}><CalendarDays className="h-3.5 w-3.5" />Released</Link>
          <Link href="/search?sort=popular" prefetch={false}>Popular</Link>
        </div>
        <div className="discovery-tools flex shrink-0 items-center gap-2">
          <Link href="/search" prefetch={false} className="discovery-tool-button"><SlidersHorizontal className="h-4 w-4" />Filters</Link>
          <button type="button" onClick={() => setView("grid")} aria-label="Grid view" aria-pressed={view === "grid"} className={`discovery-tool-button ${view === "grid" ? "is-selected" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
          <button type="button" onClick={() => setView("list")} aria-label="List view" aria-pressed={view === "list"} className={`discovery-tool-button ${view === "list" ? "is-selected" : ""}`}><List className="h-4 w-4" /></button>
        </div>
      </nav>
      <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_290px] xl:gap-10">
        <section aria-label="Newest games" className="min-w-0">
          {view === "grid" ? grid : list}
          <div className="mt-6 flex justify-center">
            <Link href={view === "list" ? "/search?view=list" : "/search"} prefetch={false} className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-bold hover:border-primary/50 hover:text-primary">Browse all games <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
        {sidebar}
      </div>
    </>
  );
}
