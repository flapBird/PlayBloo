"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X, Heart, History, BookOpen, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CategoryIcon } from "@/components/layout/category-icons";
import { useSidebar } from "@/components/layout/SidebarProvider";
import type { SidebarCategory } from "@/components/layout/CategorySidebar";
import { SITE_NAME } from "@/lib/constants";

export function Header({ categories = [] }: { categories?: SidebarCategory[] }) {
  const { open: sidebarOpen, toggle: toggleSidebar } = useSidebar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery, router]
  );

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

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
          <div className="flex h-16 items-center justify-between">
            <div className="flex shrink-0 items-center gap-7">
              <Link prefetch={false} href="/" className="flex items-center gap-2 text-lg font-black sm:text-xl tracking-tight text-foreground transition-colors hover:text-primary">
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
              <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
                <Link prefetch={false} href="/" className={`header-nav-link ${pathname === "/" ? "is-active" : ""}`}>Games</Link>
                <Link prefetch={false} href="/guides" aria-current={pathname === "/guides" || pathname.startsWith("/guides/") ? "page" : undefined} className={`header-nav-link ${pathname === "/guides" || pathname.startsWith("/guides/") ? "is-active" : ""}`}><BookOpen className="h-3.5 w-3.5" />Guides</Link>
                <Link prefetch={false} href="/submit-game" aria-current={pathname === "/submit-game" ? "page" : undefined} className={`header-nav-link ${pathname === "/submit-game" ? "is-active" : ""}`}>Submit a Game</Link>
              </nav>
            </div>

            {/* Desktop search */}
            <div className="mx-5 hidden max-w-md flex-1 items-center gap-3 md:flex lg:ml-auto">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchRef}
                  type="search"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="header-search h-9 w-full rounded-lg border pl-10 text-sm focus-visible:ring-0"
                />
              </form>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1">
                <Link prefetch={false} href="/recently-played" aria-label="Recently played" className="hidden md:grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-primary">
                  <History className="h-4 w-4" />
                </Link>
                <Link prefetch={false} href="/favorites" aria-label="Your favorites" className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-rose-500">
                  <Heart className="h-4 w-4" />
                </Link>
              </div>
              <ThemeToggle />
              {/* Mobile search toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 md:hidden text-muted-foreground"
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
                className="h-9 w-9 lg:hidden text-muted-foreground"
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
            <div id="mobile-search" className="md:hidden px-4 pb-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 bg-muted border-0 text-sm h-10 rounded-xl"
                  autoFocus
                />
              </form>
            </div>
          )}

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div id="mobile-menu" className="lg:hidden border-t border-border/50">
              <div className="px-4 py-3 space-y-1">
                <Link
                  prefetch={false}
                  href="/"
                  className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Games
                </Link>
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
