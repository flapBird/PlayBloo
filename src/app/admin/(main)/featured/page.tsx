"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, Save, Loader2, LayoutGrid } from "lucide-react";

interface SlotGame {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  is_published: boolean;
}

interface Slot {
  position: number;
  game: SlotGame | null;
}

const SLOT_COUNT = 5;
const SLOT_LABELS = ["1 — Big tile (lead)", "2 — Runner-up", "3 — Runner-up", "4 — Runner-up", "5 — Runner-up"];

export default function AdminHomeFeatured() {
  const [slots, setSlots] = useState<Slot[]>([]); // working copy being edited
  const [saved, setSaved] = useState<Slot[]>([]); // last persisted state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [activeSlot, setActiveSlot] = useState<number | null>(null); // slot whose picker is open
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SlotGame[]>([]);
  const [searching, setSearching] = useState(false);
  const searchSeq = useRef(0);

  const loadSlots = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/home-featured");
    const json = await res.json();
    const rows: Slot[] = Array.isArray(json.slots) ? json.slots : [];
    const current = Array.from({ length: SLOT_COUNT }, (_, i) => rows.find((r) => r.position === i + 1) || { position: i + 1, game: null });
    setSlots(current);
    setSaved(current);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => { void loadSlots(); });
  }, [loadSlots]);

  useEffect(() => {
    if (activeSlot === null) return;
    const seq = ++searchSeq.current;
    const trimmed = query.trim();
    // Debounced (or immediate for an empty query reset) and entirely inside
    // the timer callback so no state updates synchronously in the effect.
    const timer = setTimeout(async () => {
      if (!trimmed) { setResults([]); setSearching(false); return; }
      setSearching(true);
      const res = await fetch("/api/admin/games?q=" + encodeURIComponent(trimmed));
      const json = await res.json();
      if (searchSeq.current === seq) {
        setResults((json.data || []).slice(0, 6));
        setSearching(false);
      }
    }, trimmed ? 250 : 0);
    return () => clearTimeout(timer);
  }, [activeSlot, query]);

  const dirty = JSON.stringify(slots) !== JSON.stringify(saved);

  function assign(slotIndex: number, game: SlotGame) {
    setSlots((prev) => prev.map((slot, i) => (
      i === slotIndex
        ? { ...slot, game }
        : slot.game?.id === game.id ? { ...slot, game: null } : slot
    )));
    setActiveSlot(null);
    setQuery("");
    setResults([]);
    setNotice(null);
  }

  function clearSlot(slotIndex: number) {
    setSlots((prev) => prev.map((slot, i) => (i === slotIndex ? { ...slot, game: null } : slot)));
    setNotice(null);
  }

  async function save() {
    setSaving(true);
    setNotice(null);
    const payload = { slots: slots.filter((slot) => slot.game).map((slot) => ({ position: slot.position, game_id: slot.game!.id })) };
    const res = await fetch("/api/admin/home-featured", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setNotice({ kind: "error", text: json.error || "Save failed" });
    } else {
      setNotice({ kind: "ok", text: "Saved. The homepage mosaic refreshes right away (unset slots fall back to trending)." });
      await loadSlots();
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold"><LayoutGrid className="h-6 w-6" /> Home Featured</h1>
        <p className="text-sm text-muted-foreground">
          Curate the homepage featured mosaic. Position 1 is the big lead tile; 2-5 are the runner-up covers.
          Unset positions fall back to the trending ranking, and unpublished games never render publicly.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-card py-10 text-center text-sm text-muted-foreground">Loading…</div>
      ) : (
        <div className="space-y-3">
          {slots.map((slot, i) => (
            <div key={slot.position} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={slot.game ? "default" : "secondary"} className="shrink-0">{SLOT_LABELS[i]}</Badge>
                {slot.game ? (
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md border bg-secondary">
                      {slot.game.thumbnail_url && (
                        <Image src={slot.game.thumbnail_url} alt="" fill unoptimized className="object-cover" sizes="80px" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{slot.game.title}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        /game/{slot.game.slug}
                        {!slot.game.is_published && <span className="ml-2 text-destructive">draft — hidden on the homepage</span>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 text-sm text-muted-foreground">Empty — auto from trending</div>
                )}
                <div className="flex shrink-0 items-center gap-2">
                  {slot.game && (
                    <Button variant="ghost" size="icon" title="Clear slot" onClick={() => clearSlot(i)}><X className="h-4 w-4" /></Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setActiveSlot(activeSlot === i ? null : i); setQuery(""); setResults([]); }}
                  >
                    <Search className="mr-1.5 h-3.5 w-3.5" /> Pick a game
                  </Button>
                </div>
              </div>

              {activeSlot === i && (
                <div className="mt-3 border-t pt-3">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      autoFocus
                      placeholder="Search by title or slug…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    {searching && <div className="px-1 py-2 text-sm text-muted-foreground"><Loader2 className="mr-2 inline h-3.5 w-3.5 animate-spin" />Searching…</div>}
                    {!searching && query.trim() && results.length === 0 && (
                      <div className="px-1 py-2 text-sm text-muted-foreground">No games match “{query.trim()}”.</div>
                    )}
                    {!searching && results.map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => assign(i, game)}
                        className="flex w-full items-center gap-3 rounded-lg border bg-background p-2 text-left transition-colors hover:border-primary/60"
                      >
                        <span className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md border bg-secondary">
                          {game.thumbnail_url && (
                            <Image src={game.thumbnail_url} alt="" fill unoptimized className="object-cover" sizes="64px" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{game.title}</span>
                          <span className="block truncate text-xs text-muted-foreground">
                            /game/{game.slug}{!game.is_published && <span className="ml-2 text-destructive">draft</span>}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {notice && (
        <div
          className={`rounded-lg p-3 text-sm ${
            notice.kind === "ok"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving || loading || !dirty}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {saving ? "Saving…" : "Save positions"}
        </Button>
        {dirty && <span className="text-sm text-muted-foreground">Unsaved changes</span>}
      </div>
    </div>
  );
}
