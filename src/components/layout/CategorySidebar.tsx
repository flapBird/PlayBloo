"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Flame, House, History, LayoutGrid, Sparkles, TrendingUp } from "lucide-react";
import { CategoryIcon } from "@/components/layout/category-icons";
import { useSidebar } from "@/components/layout/SidebarProvider";

export interface SidebarCategory {
  name: string;
  slug: string;
  gameCount: number;
}

const QUICK_LINKS = [
  { label: "Home", href: "/", icon: House, color: "text-lime-600 dark:text-lime-300" },
  { label: "Recently played", href: "/recently-played", icon: History, color: "text-violet-600 dark:text-violet-400" },
  { label: "New", href: "/search?sort=newest", sort: "newest", icon: Sparkles, color: "text-sky-600 dark:text-sky-400" },
  { label: "Hot Games", href: "/search?sort=popular", sort: "popular", icon: Flame, color: "text-orange-600 dark:text-orange-400" },
  { label: "Trending", href: "/search?sort=trending", sort: "trending", icon: TrendingUp, color: "text-pink-600 dark:text-pink-400" },
];

const itemClass = (active: boolean) => `relative flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${active
  ? "bg-primary/15 text-foreground ring-1 ring-inset ring-primary/30 before:absolute before:left-0 before:top-3 before:h-5 before:w-[3px] before:rounded-full before:bg-primary"
  : "text-muted-foreground hover:bg-muted hover:text-foreground"}`;
const activeIconClass = "text-lime-700 dark:text-lime-300";

interface QuickLinksProps {
  pathname: string;
  labelClass: string;
  onNavigate: () => void;
}

function QuickLinksMenu({ pathname, labelClass, onNavigate, sort }: QuickLinksProps & { sort?: string }) {
  return (
    <nav aria-label="Discover games">
      <ul className="space-y-1">
        {QUICK_LINKS.map((item) => {
          const active = item.sort ? pathname === "/search" && sort === item.sort : pathname === item.href;
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link href={item.href} prefetch={false} aria-label={item.label} aria-current={active ? "page" : undefined}
                onClick={onNavigate} className={itemClass(active)}>
                <Icon aria-hidden="true" strokeWidth={2.5} className={`h-5 w-5 shrink-0 ${active ? activeIconClass : item.color}`} />
                <span className={labelClass}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function QuickLinks(props: QuickLinksProps) {
  const searchParams = useSearchParams();
  const sort = searchParams.get("q")?.trim() ? undefined : searchParams.get("sort") || "newest";
  return <QuickLinksMenu {...props} sort={sort} />;
}

/** Hover reveals the labels over the page; the grid always keeps its width. */
export function CategorySidebar({ categories, children }: { categories: SidebarCategory[]; children: React.ReactNode }) {
  const { open } = useSidebar();
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();
  const labelClass = `min-w-0 whitespace-nowrap transition-opacity duration-150 motion-reduce:transition-none ${expanded ? "opacity-100" : "opacity-0"}`;
  const quickLinksProps = { pathname, labelClass, onNavigate: () => setExpanded(false) };

  return (
    <>
      <aside
        id="desktop-sidebar"
        aria-label="Game navigation"
        inert={!open}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setExpanded(true); }}
        onPointerLeave={(event) => { if (event.pointerType === "mouse") setExpanded(false); }}
        onFocusCapture={(event) => { if (event.target.matches(":focus-visible")) setExpanded(true); }}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}
        onKeyDown={(event) => { if (event.key === "Escape") setExpanded(false); }}
        className={`category-rail fixed bottom-0 left-0 top-16 z-40 hidden select-none flex-col overflow-hidden border-r border-border/60 bg-background transition-[width,box-shadow] duration-200 ease-out motion-reduce:transition-none lg:flex ${
          expanded ? "w-56 shadow-[12px_0_32px_-12px_rgba(0,0,0,0.4)]" : "w-16"
        }`}
      >
        <div id="desktop-sidebar-links" className="category-rail-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 pb-3 pt-3">
          <Suspense fallback={<QuickLinksMenu {...quickLinksProps} />}>
            <QuickLinks {...quickLinksProps} />
          </Suspense>
          <div className="mx-2 my-4 border-t border-border/70" />
          <nav aria-label="Game categories">
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
                      className={itemClass(isActive)}
                    >
                      <CategoryIcon slug={category.slug} className={`h-5 w-5 shrink-0 [&_*]:stroke-[2.5] ${isActive ? activeIconClass : "text-violet-600 dark:text-violet-400"}`} />
                      <span className={labelClass}>{category.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="border-t border-border/60 p-2">
          <Link
            prefetch={false}
            href="/category"
            aria-label="All categories"
            onClick={() => setExpanded(false)}
            aria-current={pathname === "/category" ? "page" : undefined}
            className={itemClass(pathname === "/category")}
          >
            <LayoutGrid strokeWidth={2.5} className={`h-5 w-5 shrink-0 ${pathname === "/category" ? activeIconClass : "text-violet-600 dark:text-violet-400"}`} />
            <span className={labelClass}>All categories</span>
          </Link>
        </div>
      </aside>

      <div className="site-shell-content flex min-h-0 flex-1 flex-col">
        {children}
      </div>
    </>
  );
}
