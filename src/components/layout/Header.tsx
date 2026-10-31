"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, Dices, Heart, History, Menu, PanelLeftClose, PanelLeftOpen, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { CategoryIcon } from "@/components/layout/category-icons";
import { useSidebar } from "@/components/layout/SidebarProvider";
import type { SidebarCategory } from "@/components/layout/CategorySidebar";
import type { GuideSearchEntry } from "@/lib/guides/types";
import { getFavorites, LIBRARY_CHANGE_EVENT } from "@/lib/user-library";
import { SITE_NAME } from "@/lib/constants";

export function Header({ categories = [], guides = [] }: { categories?: SidebarCategory[]; guides?: GuideSearchEntry[] }) {
  const { open: sidebarOpen, toggle: toggleSidebar } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const sync = () => setFavoriteCount(getFavorites().length);
    sync();
    window.addEventListener(LIBRARY_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LIBRARY_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className="site-header sticky top-0 z-50 w-full">
      <div className="site-header-content flex w-full">
        {/* Pinned to the window edge so it stays directly above the rail */}
        <div className="absolute left-0 top-0 hidden h-16 w-16 items-center justify-center lg:flex">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-expanded={sidebarOpen}
            aria-controls="desktop-sidebar"
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {sidebarOpen ? <PanelLeftClose aria-hidden="true" className="h-5 w-5" /> : <PanelLeftOpen aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
        <div className="container mx-auto min-w-0 flex-1">
          {/* Main row */}
          <div className="flex h-16 items-center gap-3 lg:gap-5">
            <Link prefetch={false} href="/" className="flex shrink-0 items-center gap-2 text-lg font-black sm:text-xl tracking-tight text-foreground transition-colors hover:text-primary">
              <Image
                src="/images/brand/playbloo-ribbon.webp"
                alt=""
                width={36}
                height={36}
                loading="eager"
                className="site-brand-icon h-9 w-9 shrink-0 object-contain"
              />
              {SITE_NAME}
            </Link>
            <nav aria-label="Primary" className="hidden shrink-0 items-center gap-1 lg:flex">
              <Link prefetch={false} href="/guides" aria-current={pathname === "/guides" || pathname.startsWith("/guides/") ? "page" : undefined} className={`header-nav-link ${pathname === "/guides" || pathname.startsWith("/guides/") ? "is-active" : ""}`}><BookOpen className="h-3.5 w-3.5" />Guides</Link>
              <Link prefetch={false} href="/gacha" aria-current={pathname === "/gacha" ? "page" : undefined} className={`header-nav-link ${pathname === "/gacha" ? "is-active" : ""}`}><Dices className="h-3.5 w-3.5" />Gacha</Link>
              <Link prefetch={false} href="/submit-game" aria-current={pathname === "/submit-game" ? "page" : undefined} className={`header-nav-link ${pathname === "/submit-game" ? "is-active" : ""}`}>Submit a Game</Link>
            </nav>

            {/* Desktop search, centred in the space between brand and actions */}
            <div className="hidden min-w-0 flex-1 justify-center md:flex">
              <div className="w-full max-w-[34rem]">
                <HeaderSearch categories={categories} guides={guides} />
              </div>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-1.5 md:ml-0">
              <div className="header-actions">
                <Link prefetch={false} href="/recently-played" aria-label="Recently played" className="header-action hidden md:inline-flex">
                  <History className="header-action-icon" aria-hidden="true" />
                  <span className="hidden xl:inline">History</span>
                </Link>
                <Link prefetch={false} href="/favorites" aria-label={`Your favorites${favoriteCount ? ` (${favoriteCount})` : ""}`} className="header-action header-action-saved">
                  <Heart className={`header-action-icon ${favoriteCount ? "fill-current" : ""}`} aria-hidden="true" />
                  <span className="hidden xl:inline">Favorites</span>
                  {favoriteCount > 0 && <span className="header-favorite-count">{favoriteCount > 99 ? "99+" : favoriteCount}</span>}
                </Link>
                <span className="header-action-divider" aria-hidden="true" />
                <ThemeToggle />
              </div>

              {/* Mobile search toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-muted-foreground md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label={searchOpen ? "Close search" : "Open search"}
                aria-expanded={searchOpen}
                aria-controls="mobile-search"
              >
                {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>

              {/* Mobile menu */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-muted-foreground lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div id="mobile-search" className="pb-3 md:hidden">
              <HeaderSearch
                categories={categories}
                guides={guides}
                autoFocus
                onNavigate={() => setSearchOpen(false)}
              />
            </div>
          )}

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div id="mobile-menu" className="lg:hidden border-t border-border/50">
              <div className="px-4 py-3 space-y-1">
                <Link prefetch={false} href="/gacha" aria-current={pathname === "/gacha" ? "page" : undefined} className={`block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted ${pathname === "/gacha" ? "text-primary bg-muted" : ""}`} onClick={() => setMobileMenuOpen(false)}>Game Gacha</Link>
                <Link prefetch={false} href="/guides" aria-current={pathname === "/guides" || pathname.startsWith("/guides/") ? "page" : undefined} className={`block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted ${pathname === "/guides" || pathname.startsWith("/guides/") ? "text-primary bg-muted" : ""}`} onClick={() => setMobileMenuOpen(false)}>Guides</Link>
                <Link prefetch={false} href="/submit-game" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Submit a Game</Link>
                <Link prefetch={false} href="/favorites" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                  <Heart className="h-4 w-4" /> Favorites
                </Link>
                <Link prefetch={false} href="/recently-played" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                  <History className="h-4 w-4" /> Recently Played
                </Link>
              </div>
              {categories.length > 0 && (
                <div className="border-t border-border/50 px-4 py-3">
                  <p className="pb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Browse genres</p>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((category) => (
                      <Link
                        prefetch={false}
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        aria-current={pathname === `/category/${category.slug}` ? "page" : undefined}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-muted ${
                          pathname === `/category/${category.slug}` ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <CategoryIcon slug={category.slug} className="h-4 w-4 shrink-0" />
                        <span className="truncate">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                  <Link prefetch={false} href="/category" className="mt-2 block px-2 py-1.5 text-sm font-medium text-primary" onClick={() => setMobileMenuOpen(false)}>
                    All categories
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
