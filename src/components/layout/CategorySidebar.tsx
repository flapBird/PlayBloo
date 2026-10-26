"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutGrid, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { CategoryIcon } from "@/components/layout/category-icons";

export interface SidebarCategory {
  name: string;
  slug: string;
  gameCount: number;
}

/** Hover reveals the labels over the page; the grid always keeps its width. */
export function CategorySidebar({ categories, children }: { categories: SidebarCategory[]; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const labelClass = `min-w-0 whitespace-nowrap transition-opacity duration-150 motion-reduce:transition-none ${expanded ? "opacity-100" : "opacity-0"}`;

  return (
    <>
      <aside
        aria-label="Browse game categories"
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setExpanded(true); }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse") setExpanded(false); }}
        onFocusCapture={(event) => { if (event.target.matches(":focus-visible")) setExpanded(true); }}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}
        onKeyDown={(event) => { if (event.key === "Escape") setExpanded(false); }}
        className={`category-rail fixed bottom-0 left-0 top-16 z-40 hidden select-none flex-col overflow-hidden border-r border-border/60 bg-background transition-[width,box-shadow] duration-200 ease-out motion-reduce:transition-none lg:flex ${
          expanded ? "w-56 shadow-[12px_0_32px_-12px_rgba(0,0,0,0.4)]" : "w-16"
        }`}
      >
        <div className="px-2 pb-2 pt-3">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls="desktop-category-links"
            aria-label={expanded ? "Collapse categories sidebar" : "Expand categories sidebar"}
            className="flex h-10 w-full items-center gap-3 rounded-xl px-3.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
          >
            {expanded ? <PanelLeftClose className="h-5 w-5 shrink-0" /> : <PanelLeftOpen className="h-5 w-5 shrink-0" />}
            <span className={`${labelClass} text-xs font-bold uppercase tracking-wider`}>Categories</span>
          </button>
        </div>

        <nav id="desktop-category-links" aria-label="Game categories" className="category-rail-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-3">
          <ul className="space-y-1">
            {categories.map((category) => {
              const href = `/category/${category.slug}`;
              const isActive = pathname === href;
              return (
                <li key={category.slug}>
                  <Link
                    prefetch={false}
                    href={href}
                    aria-label={`${category.name} Games`}
                    onClick={() => setExpanded(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <CategoryIcon slug={category.slug} className="h-5 w-5 shrink-0" />
                    <span className={`${labelClass} flex flex-1 items-center justify-between gap-2`}>
                      <span>{category.name}</span>
                      <span className="text-[11px] font-medium tabular-nums text-muted-foreground/60">{category.gameCount}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border/60 p-2">
          <Link
            prefetch={false}
            href="/category"
            aria-label="All categories"
            onClick={() => setExpanded(false)}
            aria-current={pathname === "/category" ? "page" : undefined}
            className={`flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${
              pathname === "/category" ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <LayoutGrid className="h-5 w-5 shrink-0" />
            <span className={labelClass}>All categories</span>
          </Link>
        </div>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col lg:ml-16">
        {children}
      </div>
    </>
  );
}
