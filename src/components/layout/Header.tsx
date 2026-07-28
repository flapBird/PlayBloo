"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X, ArrowRight, Gamepad2, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE_NAME, GAME_CATEGORIES } from "@/lib/constants";

const mainCategories = GAME_CATEGORIES.slice(0, 8);

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const match = pathname.match(/^\/category\/([^\/]+)/);
  const currentCategory = match?.[1] || null;

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
      <div className="container mx-auto">
        {/* Main row */}
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground transition-colors hover:text-primary">
              <span className="brand-mark grid h-8 w-8 place-items-center rounded-xl text-primary-foreground"><Gamepad2 className="h-4 w-4" /></span>
              {SITE_NAME}
            </Link>
          </div>

          {/* Desktop search */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                type="search"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header-search h-10 w-full rounded-xl border-0 pl-10 text-sm focus-visible:ring-primary/30"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground"
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
              className="md:hidden text-muted-foreground"
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

        {/* Category rail */}
        <nav aria-label="Game categories" className="category-nav px-3 pb-3 md:px-4 md:pb-2">
          <div className="category-nav-track flex items-center gap-1.5 overflow-x-auto">
            <Link
              href="/"
              className={`category-nav-pill ${pathname === "/" ? "is-active" : ""}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              All Games
            </Link>
            {mainCategories.map((cat, index) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`category-nav-pill ${currentCategory === cat.slug ? "is-active" : ""}`}
              >
                <span className={`category-nav-dot category-nav-dot-${index % 6}`} aria-hidden="true" />
                {cat.name}
              </Link>
            ))}
            <Link
              href="/category"
              className={`category-nav-pill category-nav-all ${pathname === "/category" ? "is-active" : ""}`}
            >
              View All <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-border/50">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {mainCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name} Games
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
