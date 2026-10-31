"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Dices, Gamepad2, MoonStar, Share2, Sparkles, Undo2 } from "lucide-react";
import { GACHA_PACKS_PER_DAY } from "@/lib/constants";
import { GACHA_RARITIES, GACHA_RARITY_ORDER, type GachaPoolGame, type GachaRarity } from "@/lib/gacha-shared";
import {
  clearGachaCollection,
  gachaDayKey,
  getGachaState,
  isGachaStorageEvent,
  packsRemainingToday,
  recordGachaPack,
  type GachaCardSummary,
  type GachaState,
} from "@/lib/gacha-library";
import { shouldBypassImageOptimization } from "@/lib/game-utils";

interface GachaGameProps {
  pool: GachaPoolGame[];
  theme: { slug: string; name: string } | null;
  totalGames: number;
}

const RARITY_STYLES: Record<GachaRarity, { frame: string; chip: string; glow: string }> = {
  legendary: {
    frame: "border-amber-400/70",
    chip: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    glow: "shadow-[0_0_24px_-4px_rgb(251_191_36_/_0.45)]",
  },
  epic: {
    frame: "border-violet-400/70",
    chip: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
    glow: "shadow-[0_0_20px_-6px_rgb(167_139_250_/_0.5)]",
  },
  rare: {
    frame: "border-sky-400/70",
    chip: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
    glow: "shadow-[0_0_16px_-6px_rgb(56_189_248_/_0.5)]",
  },
  common: {
    frame: "border-border",
    chip: "bg-muted text-muted-foreground",
    glow: "",
  },
};

function rollRarity(): GachaRarity {
  const roll = Math.random() * 100;
  if (roll < 3) return "legendary";
  if (roll < 15) return "epic";
  if (roll < 40) return "rare";
  return "common";
}

function rollPackSize(): number {
  const roll = Math.random();
  if (roll < 0.2) return 3;
  if (roll < 0.5) return 4;
  return 5;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function toCard(game: GachaPoolGame, isNew: boolean): GachaCardSummary {
  return {
    gameId: game.id,
    slug: game.slug,
    title: game.title,
    thumbnailUrl: game.thumbnailUrl,
    categoryName: game.categoryName,
    rarity: game.rarity,
    isNew,
    duplicate: !isNew,
  };
}

/**
 * Draw one card from `candidates`, preferring games that are not owned yet.
 * Falls back to owned games once a tier runs dry, and those count as duplicates.
 */
function pickCard(candidates: GachaPoolGame[], owned: Set<string>): GachaCardSummary | null {
  if (!candidates.length) return null;
  const fresh = shuffle(candidates.filter((game) => !owned.has(game.id)));
  if (fresh.length) return toCard(fresh[0], true);
  const dupe = shuffle(candidates)[0];
  return toCard(dupe, false);
}

export function GachaGame({ pool, theme, totalGames }: GachaGameProps) {
  const [state, setState] = useState<GachaState | null>(null);
  // The pack-opening ceremony: "burst" shakes and detonates the pack, "reveal"
  // flips the pulled cards in. Skipped entirely for reduced-motion users.
  const [phase, setPhase] = useState<"idle" | "burst" | "reveal">("idle");
  const [shareNote, setShareNote] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setState(getGachaState());
    sync();
    const onStorage = (event: Event) => {
      if (event instanceof CustomEvent && !isGachaStorageEvent(event)) return;
      sync();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const ownedIds = useMemo(() => new Set((state?.collection || []).map((item) => item.gameId)), [state]);

  const packsLeft = state ? packsRemainingToday(state) : GACHA_PACKS_PER_DAY;
  const lastPack = state?.lastPack || null;

  const openPack = useCallback(() => {
    if (!state || packsLeft === 0 || !pool.length) return;
    const dateKey = gachaDayKey();
    const packsBefore = GACHA_PACKS_PER_DAY - packsLeft;
    const wantThemed = Boolean(theme) && packsBefore === GACHA_PACKS_PER_DAY - 1;

    const cards: GachaCardSummary[] = [];
    let themed = false;
    if (wantThemed) {
      const themedPool = pool.filter((game) => game.categorySlug === theme?.slug);
      if (themedPool.length >= 3) {
        themed = true;
        const size = rollPackSize();
        const workingOwned = new Set(ownedIds);
        for (let i = 0; i < size; i += 1) {
          const card = pickCard(themedPool, workingOwned);
          if (!card) break;
          workingOwned.add(card.gameId);
          cards.push(card);
        }
      }
    }
    if (!cards.length) {
      const size = rollPackSize();
      const buckets = new Map<GachaRarity, GachaPoolGame[]>();
      for (const rarity of GACHA_RARITY_ORDER) buckets.set(rarity, pool.filter((game) => game.rarity === rarity));
      const workingOwned = new Set(ownedIds);
      let hasRarePlus = false;
      for (let i = 0; i < size; i += 1) {
        // Published odds per card, with a pity floor: a pack never ends without one Rare.
        const isLast = i === size - 1;
        const rarity = isLast && !hasRarePlus ? "rare" : rollRarity();
        if (rarity !== "common") hasRarePlus = true;
        const card = pickCard(buckets.get(rarity) || [], workingOwned);
        if (!card) continue;
        workingOwned.add(card.gameId);
        cards.push(card);
      }
    }
    if (!cards.length) return;

    setState(recordGachaPack({ dateKey, themed, cards }));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("burst");
    window.setTimeout(() => setPhase("reveal"), 950);
  }, [state, packsLeft, pool, theme, ownedIds]);

  const closeCeremony = useCallback(() => {
    setPhase("idle");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("gacha-latest-pull")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, []);

  const sharePack = useCallback(async () => {
    if (!lastPack?.cards.length) return;
    const summary = GACHA_RARITY_ORDER.map((rarity) => {
      const count = lastPack.cards.filter((card) => card.rarity === rarity).length;
      return count ? `${count} ${rarity}` : null;
    }).filter(Boolean);
    const text = `PlayBloo Game Gacha — today's pull: ${summary.join(", ")}. Draw your own free packs at https://playbloo.net/gacha`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "PlayBloo Game Gacha", text, url: "https://playbloo.net/gacha" });
        return;
      }
      await navigator.clipboard.writeText(text);
      setShareNote("Copied to clipboard");
      window.setTimeout(() => setShareNote(null), 2500);
    } catch {
      // User dismissed the share sheet; nothing to report.
    }
  }, [lastPack]);

  const collection = useMemo(() => state?.collection || [], [state]);
  const rarityCount = (rarity: GachaRarity) => collection.filter((item) => item.rarity === rarity).length;
  const todayNew = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return collection.filter((item) => item.firstPulledAt >= startOfDay.getTime()).length;
  }, [collection]);

  return (
    <div className="space-y-10">
      <section aria-label="Card packs" className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5" aria-live="polite">
            <Dices className="h-4 w-4 text-primary" aria-hidden="true" />
            Packs left today: <strong className="text-foreground">{packsLeft} / {GACHA_PACKS_PER_DAY}</strong>
          </span>
          {theme && (
            <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Final pack today: <strong className="text-foreground">{theme.name}</strong> themed
            </span>
          )}
        </div>

        {packsLeft > 0 ? (
          <button
            type="button"
            onClick={openPack}
            disabled={!state}
            aria-label={state ? "Open a card pack" : "Loading packs"}
            className="group relative grid h-72 w-48 place-items-center rounded-2xl border-2 border-primary/40 bg-gradient-to-b from-primary/15 via-card to-card transition-transform duration-200 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:scale-100 disabled:opacity-60"
          >
            <Image src="/images/brand/playbloo-ribbon.webp" alt="" width={72} height={72} className="h-16 w-16 object-contain opacity-90" />
            <span className="absolute inset-x-0 bottom-5 text-center text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground">
              Tap to open
            </span>
          </button>
        ) : (
          <div className="w-full max-w-md rounded-2xl border border-dashed border-border/70 px-6 py-7 text-center">
            <MoonStar className="mx-auto h-7 w-7 text-amber-500/80" aria-hidden="true" />
            <p className="mt-2 text-sm font-bold">All three packs are open</p>
            <p className="mt-1 text-xs text-muted-foreground">New packs refill at midnight, your time.</p>
            {todayNew > 0 && (
              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                Today: {todayNew} new {todayNew === 1 ? "game" : "games"} added to your collection
              </p>
            )}
          </div>
        )}
      </section>

      {phase !== "idle" && lastPack && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pack opening ceremony"
          onClick={phase === "reveal" ? closeCeremony : undefined}
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-black/90 backdrop-blur-sm"
        >
          {phase === "burst" ? (
            <div className="relative grid place-items-center">
              <div className="gacha-burst-rays" aria-hidden="true" />
              <div className={`gacha-burst-ring ${lastPack.themed ? "border-amber-400/90" : ""}`} aria-hidden="true" />
              <div className="gacha-burst-core absolute h-72 w-72 rounded-full bg-primary/40 blur-3xl" aria-hidden="true" />
              <div className="gacha-burst-flash absolute inset-0 rounded-full bg-white" aria-hidden="true" />
              <div className="gacha-burst-stage relative grid h-80 w-52 place-items-center rounded-2xl border-2 border-primary/50 bg-gradient-to-b from-primary/20 via-card to-card shadow-[0_0_60px_-10px_rgb(129_87_255_/_0.7)]">
                <Image src="/images/brand/playbloo-ribbon.webp" alt="" width={88} height={88} className="h-20 w-20 object-contain" />
                <span className="absolute inset-x-0 bottom-6 text-center text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Opening…
                </span>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col items-center px-4" onClick={(event) => event.stopPropagation()}>
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
              <p className={`relative mb-5 text-sm font-black uppercase tracking-[0.25em] ${lastPack.themed ? "text-amber-400" : "text-primary"}`}>
                {lastPack.themed ? "Themed pack" : "Pack"} opened
              </p>
              <ul className="relative flex max-w-4xl flex-wrap items-stretch justify-center gap-3">
                {lastPack.cards.map((card, index) => {
                  const style = RARITY_STYLES[card.rarity];
                  return (
                    <li
                      key={`${card.gameId}-${index}`}
                      className={`gacha-card-enter w-32 rounded-xl border-2 ${style.frame} ${style.glow} bg-card p-2 sm:w-40`}
                      style={{ animationDelay: `${index * 130}ms` }}
                    >
                      <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                        {card.thumbnailUrl ? (
                          <Image src={card.thumbnailUrl} alt="" fill unoptimized={shouldBypassImageOptimization(card.thumbnailUrl)} className="object-cover" sizes="176px" />
                        ) : (
                          <span className="flex h-full items-center justify-center"><Gamepad2 className="h-7 w-7 text-primary/30" aria-hidden="true" /></span>
                        )}
                        {card.isNew && <span className="absolute left-1.5 top-1.5 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-black text-white">NEW</span>}
                      </div>
                      <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${style.chip}`}>{card.rarity}</span>
                      <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug" title={card.title}>{card.title}</h3>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={closeCeremony}
                className="relative mt-6 rounded-full border-2 border-primary/60 bg-primary/15 px-8 py-2.5 text-sm font-black uppercase tracking-widest text-foreground transition-colors hover:bg-primary/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Collect
              </button>
            </div>
          )}
        </div>
      )}

      {lastPack && (
        <section id="gacha-latest-pull" aria-label="Latest pack" className="space-y-4 scroll-mt-24">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold tracking-tight">
              Latest pull
              {lastPack.themed && theme ? <span className="ml-2 text-sm font-semibold text-muted-foreground">{theme.name} themed pack</span> : null}
            </h2>
            <button
              type="button"
              onClick={sharePack}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              Share result
            </button>
          </div>
          {shareNote && <p className="text-xs font-semibold text-primary" role="status">{shareNote}</p>}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {lastPack.cards.map((card) => {
              const style = RARITY_STYLES[card.rarity];
              return (
                <li
                  key={card.gameId}
                  className={`rounded-xl border-2 ${style.frame} ${style.glow} bg-card p-2`}
                >
                  <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                    {card.thumbnailUrl ? (
                      <Image src={card.thumbnailUrl} alt="" fill unoptimized={shouldBypassImageOptimization(card.thumbnailUrl)} className="object-cover" sizes="(max-width: 640px) 45vw, 220px" />
                    ) : (
                      <span className="flex h-full items-center justify-center"><Gamepad2 className="h-7 w-7 text-primary/30" aria-hidden="true" /></span>
                    )}
                    {card.isNew && (
                      <span className="absolute left-1.5 top-1.5 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-black text-white">NEW</span>
                    )}
                  </div>
                  <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${style.chip}`}>
                    {card.rarity}
                  </span>
                  <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug" title={card.title}>{card.title}</h3>
                  <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span className="truncate">{card.categoryName || "Game"}</span>
                    <Link href={`/game/${card.slug}`} prefetch={false} target="_blank" rel="noopener" className="shrink-0 font-bold text-primary hover:underline">
                      Play →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section id="gacha-collection" aria-label="Your collection" className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-extrabold tracking-tight">Your collection</h2>
          <p className="text-sm text-muted-foreground">
            {collection.length} collected · {totalGames.toLocaleString("en")} games in the pool
          </p>
        </div>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {GACHA_RARITIES.map((rarity) => (
            <span key={rarity.id}>{rarity.label}: <strong className="text-foreground">{rarityCount(rarity.id)}</strong></span>
          ))}
        </p>
        {collection.length ? (
          <>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {collection.slice(0, 40).map((item) => {
                const style = RARITY_STYLES[item.rarity];
                return (
                  <li key={item.gameId} className={`rounded-xl border-2 ${style.frame} bg-card p-2`}>
                    <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      {item.thumbnailUrl ? (
                        <Image src={item.thumbnailUrl} alt="" fill unoptimized={shouldBypassImageOptimization(item.thumbnailUrl)} className="object-cover" sizes="(max-width: 640px) 45vw, 220px" />
                      ) : (
                        <span className="flex h-full items-center justify-center"><Gamepad2 className="h-7 w-7 text-primary/30" aria-hidden="true" /></span>
                      )}
                    </div>
                    <span className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${style.chip}`}>
                      {item.rarity}
                    </span>
                    <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug" title={item.title}>{item.title}</h3>
                    <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span>{item.pullCount > 1 ? `×${item.pullCount}` : (item.categoryName || "Game")}</span>
                      <Link href={`/game/${item.slug}`} prefetch={false} target="_blank" rel="noopener" className="shrink-0 font-bold text-primary hover:underline">
                        Play →
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
            {collection.length > 40 && (
              <p className="text-xs text-muted-foreground">Showing the 40 most recent — {collection.length - 40} more live in this browser.</p>
            )}
            <div>
              <button
                type="button"
                onClick={() => { if (window.confirm("Clear your Game Gacha collection in this browser? This cannot be undone.")) clearGachaCollection(); }}
                className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
              >
                <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                Reset collection
              </button>
            </div>
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
            No cards yet — open today&apos;s first pack to start the collection.
          </p>
        )}
      </section>
    </div>
  );
}
