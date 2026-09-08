"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X, Gamepad2, Heart, History, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
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
      <div className="container mx-auto">
        {/* Main row */}
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex shrink-0 items-center gap-7">
            <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-foreground transition-colors hover:text-primary">
              <span className="brand-mark grid h-8 w-8 place-items-center rounded-lg text-primary-foreground"><Gamepad2 className="h-4 w-4" /></span>
              {SITE_NAME}
            </Link>
            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              <Link href="/" className={`header-nav-link ${pathname === "/" ? "is-active" : ""}`}>Games</Link>
              <Link href="/search?sort=recently-updated" className="header-nav-link">Updates</Link>
              <Link href="/search?sort=popular" className="header-nav-link"><Flame className="h-3.5 w-3.5" />Popular</Link>
              <Link href="/search?playMode=embedded" className="header-nav-link"><Sparkles className="h-3.5 w-3.5" />Playable</Link>
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

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 md:flex">
              <Link href="/recently-played" aria-label="Recently played" className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-primary">
                <History className="h-4 w-4" />
              </Link>
              <Link href="/favorites" aria-label="Your favorites" className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-rose-500">
                <Heart className="h-4 w-4" />
              </Link>
            </div>
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-border/50">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Games
              </Link>
              <Link href="/search?sort=recently-updated" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Updates</Link>
              <Link href="/search?sort=popular" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Popular</Link>
              <Link href="/search?playMode=embedded" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Playable Here</Link>
              <Link href="/favorites" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                <Heart className="h-4 w-4" /> Favorites
              </Link>
              <Link href="/recently-played" className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                <History className="h-4 w-4" /> Recently Played
              </Link>
              <Link href="/submit-game" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Submit a Game</Link>
              <Link href="/category" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Browse genres</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
