"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { CategoryIcon } from "@/components/layout/category-icons";

const EXPANDED_STORAGE_KEY = "playbloo:sidebar-expanded:v1";

export interface SidebarCategory {
  name: string;
  slug: string;
  gameCount: number;
}

/**
 * CrazyGames-style category rail: a narrow icon strip by default, expanded to
 * a full sidebar on demand. The default is collapsed; the choice persists in
 * localStorage. Expanding pushes the page content instead of covering it, so
 * nothing shifts unexpectedly on navigation.
 */
export function CategorySidebar({ categories, children }: { categories: SidebarCategory[]; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      setExpanded(localStorage.getItem(EXPANDED_STORAGE_KEY) === "1");
    } catch {}
  }, []);

  const toggle = () => {
    setExpanded((value) => {
      const next = !value;
      try {
        localStorage.setItem(EXPANDED_STORAGE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  return (
    <>
      <aside
        className={`fixed bottom-0 left-0 top-16 z-40 hidden flex-col border-r border-border/60 bg-background/95 backdrop-blur transition-[width] duration-200 ease-out lg:flex ${
          expanded ? "w-60" : "w-16"
        }`}
      >
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse categories sidebar" : "Expand categories sidebar"}
          className="flex h-12 items-center gap-3 border-b border-border/60 px-[10px] text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? <PanelLeftClose className="h-5 w-5 shrink-0" /> : <PanelLeftOpen className="h-5 w-5 shrink-0" />}
          {expanded && <span className="text-sm font-bold">Browse genres</span>}
        </button>

        <nav aria-label="Game categories" className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3">
          <ul className="space-y-1">
            {categories.map((category) => {
              const href = `/category/${category.slug}`;
              const isActive = pathname === href;
              return (
                <li key={category.slug}>
                  <Link
                    prefetch={false}
                    href={href}
                    title={expanded ? undefined : `${category.name} Games`}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex h-10 items-center gap-3 rounded-lg px-[10px] text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } ${expanded ? "" : "justify-start"}`}
                  >
                    <CategoryIcon slug={category.slug} className="h-5 w-5 shrink-0" />
                    {expanded && (
                      <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                        <span className="truncate">{category.name}</span>
                        <span className="shrink-0 text-[11px] font-medium text-muted-foreground/70">{category.gameCount}</span>
                      </span>
                    )}
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
            title="All categories"
            className={`flex h-10 items-center gap-3 rounded-lg px-[10px] text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${
              pathname === "/category" ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <LayoutGrid className="h-5 w-5 shrink-0" />
            {expanded && <span className="truncate">All categories</span>}
          </Link>
        </div>
      </aside>

      <div className={`flex min-h-0 flex-1 flex-col transition-[margin] duration-200 ease-out ${expanded ? "lg:ml-60" : "lg:ml-16"}`}>
        {children}
      </div>
    </>
  );
}
