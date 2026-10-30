"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, Gamepad2, Loader2, Search, X } from "lucide-react";
import { CategoryIcon } from "@/components/layout/category-icons";
import type { SidebarCategory } from "@/components/layout/CategorySidebar";
import type { GuideSearchEntry } from "@/lib/guides/types";

interface GameSuggestion {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
}

interface HeaderSearchProps {
  categories: SidebarCategory[];
  guides: GuideSearchEntry[];
  autoFocus?: boolean;
  onNavigate?: () => void;
}

const MIN_GAME_QUERY = 2;
const NO_GAMES: GameSuggestion[] = [];

function SearchThumb({ src, icon }: { src?: string | null; icon: ReactNode }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className="header-search-icon">
        {icon}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt=""
      width={44}
      height={32}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-8 w-11 shrink-0 rounded-md border border-border/60 object-cover"
    />
  );
}

export function HeaderSearch({ categories, guides, autoFocus = false, onNavigate }: HeaderSearchProps) {
  const router = useRouter();
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [gameResults, setGameResults] = useState<Record<string, GameSuggestion[]>>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const term = query.trim();
  const lower = term.toLowerCase();
  const games = useMemo(
    () => (term.length >= MIN_GAME_QUERY ? gameResults[lower] ?? NO_GAMES : NO_GAMES),
    [gameResults, lower, term.length],
  );
  const gamesLoading = term.length >= MIN_GAME_QUERY && !(lower in gameResults);

  const categoryMatches = useMemo(
    () => lower
      ? categories.filter((category) => category.name.toLowerCase().includes(lower) || category.slug.includes(lower)).slice(0, 4)
      : categories.slice(0, 8),
    [categories, lower],
  );
  const guideMatches = useMemo(
    () => lower
      ? guides.filter((guide) => guide.title.toLowerCase().includes(lower) || guide.keywords.includes(lower)).slice(0, 4)
      : guides.filter((guide) => guide.kind === "topic").slice(0, 3),
    [guides, lower],
  );

  useEffect(() => {
    if (term.length < MIN_GAME_QUERY || lower in gameResults) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      let results: GameSuggestion[] = [];
      try {
        const response = await fetch(`/api/suggestions?q=${encodeURIComponent(term)}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Game suggestions failed: ${response.status}`);
        const payload = (await response.json()) as { suggestions?: GameSuggestion[] };
        results = (payload.suggestions || []).map(({ id, title, slug, thumbnail_url }) => ({ id, title, slug, thumbnail_url: thumbnail_url || null }));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
      setGameResults((previous) => (lower in previous ? previous : { ...previous, [lower]: results }));
    }, 240);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [gameResults, lower, term]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const navigate = useCallback((href: string, keepQuery = false) => {
    setOpen(false);
    setActiveIndex(-1);
    if (!keepQuery) setQuery("");
    onNavigate?.();
    router.push(href);
  }, [onNavigate, router]);

  const submitSearch = useCallback(() => {
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`, true);
  }, [navigate, term]);

  const showGames = term.length >= MIN_GAME_QUERY;
  const items = useMemo(() => [
    ...categoryMatches.map((category) => ({ href: `/category/${category.slug}` })),
    ...(showGames ? games.map((game) => ({ href: `/game/${game.slug}` })) : []),
    ...guideMatches.map((guide) => ({ href: guide.href })),
  ], [categoryMatches, games, guideMatches, showGames]);
  const allResultsIndex = items.length;
  const gameOffset = categoryMatches.length;
  const guideOffset = gameOffset + (showGames ? games.length : 0);

  const optionId = (index: number) => `${baseId}-option-${index}`;
  const optionProps = (index: number) => ({
    id: optionId(index),
    role: "option" as const,
    "aria-selected": activeIndex === index,
    tabIndex: -1,
    onMouseEnter: () => setActiveIndex(index),
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, allResultsIndex));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
    } else if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
      } else {
        inputRef.current?.blur();
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < allResultsIndex) navigate(items[activeIndex].href);
      else submitSearch();
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      onBlurCapture={(event) => {
        // relatedTarget is null when Safari blurs the input for a click on a
        // non-focusable child; keep the panel open and let pointerdown decide.
        const next = event.relatedTarget as Node | null;
        if (next && !event.currentTarget.contains(next)) {
          setOpen(false);
          setActiveIndex(-1);
        }
      }}
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
        className="header-search-form"
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search games, categories and guides"
          aria-label="Search games, categories and guides"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          className="header-search-input"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveIndex(-1);
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="header-search-clear"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : (
          <span className="hidden shrink-0 rounded-md border border-border/80 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground xl:block" aria-hidden="true">
            Enter
          </span>
        )}
      </form>

      {open && (
        <div id={panelId} role="listbox" aria-label="Search suggestions" className="header-search-panel">
          <div className="header-search-panel-scroll">
            {categoryMatches.length > 0 && (
              <div role="group" aria-label="Categories" className="header-search-group">
                <p className="header-search-label">{term ? "Categories" : "Browse categories"}</p>
                <div className="grid grid-cols-2 gap-1">
                  {categoryMatches.map((category, index) => (
                    <button
                      key={category.slug}
                      type="button"
                      {...optionProps(index)}
                      onClick={() => navigate(`/category/${category.slug}`)}
                      className="header-search-chip"
                      data-active={activeIndex === index}
                    >
                      <span className="header-search-icon">
                        <CategoryIcon slug={category.slug} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showGames && (
              <div role="group" aria-label="Games" className="header-search-group">
                <p className="header-search-label flex items-center gap-2">
                  Games
                  {gamesLoading && <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />}
                </p>
                {games.map((game, index) => {
                  const itemIndex = gameOffset + index;
                  return (
                    <button
                      key={game.id}
                      type="button"
                      {...optionProps(itemIndex)}
                      onClick={() => navigate(`/game/${game.slug}`)}
                      className="header-search-row"
                      data-active={activeIndex === itemIndex}
                    >
                      <SearchThumb src={game.thumbnail_url} icon={<Gamepad2 className="h-4 w-4" aria-hidden="true" />} />
                      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{game.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </button>
                  );
                })}
                {!gamesLoading && games.length === 0 && (
                  <p className="px-3 pb-2 pt-1 text-xs text-muted-foreground">No matching games yet.</p>
                )}
              </div>
            )}

            {guideMatches.length > 0 && (
              <div role="group" aria-label="Guides" className="header-search-group">
                <p className="header-search-label">{term ? "Guides" : "Latest guides"}</p>
                {guideMatches.map((guide, index) => {
                  const itemIndex = guideOffset + index;
                  return (
                    <button
                      key={guide.href}
                      type="button"
                      {...optionProps(itemIndex)}
                      onClick={() => navigate(guide.href)}
                      className="header-search-row"
                      data-active={activeIndex === itemIndex}
                    >
                      <SearchThumb src={guide.cover} icon={<BookOpen className="h-4 w-4" aria-hidden="true" />} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-semibold">{guide.title}</span>
                        <span className="block truncate text-[11px] text-muted-foreground">{guide.subtitle}</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              {...optionProps(allResultsIndex)}
              onClick={submitSearch}
              className="header-search-row header-search-all"
              data-active={activeIndex === allResultsIndex}
            >
              <span className="header-search-icon">
                <Search className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                {term ? <>Search all results for &ldquo;{term}&rdquo;</> : "Search the full game catalogue"}
              </span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
