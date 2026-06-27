"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Menu, X, ChevronDown } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-card/95 backdrop-blur-lg supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto">
        {/* Main row */}
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-black tracking-tight text-foreground hover:text-primary transition-colors">
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
                className="w-full pl-10 bg-muted border-0 text-sm h-10 rounded-xl"
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
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3">
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

        {/* Category bar - Desktop */}
        <nav className="hidden md:flex items-center gap-1.5 px-4 pb-2 overflow-x-auto">
          <Link
            href="/"
            className={`inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors ${
              pathname === "/" ? "bg-indigo-50 text-indigo-600" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            All Games
          </Link>
          {mainCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-4 text-sm font-bold transition-colors ${
                currentCategory === cat.slug ? "bg-indigo-50 text-indigo-600" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/search"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground px-3 transition-colors"
          >
            View All <ChevronDown className="h-3 w-3 ml-0.5" />
          </Link>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50">
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
