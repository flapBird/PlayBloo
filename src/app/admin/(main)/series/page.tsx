"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Check, X, GripHorizontal, Gamepad2, LinkIcon, XCircle } from "lucide-react";

type SeriesRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type GameRow = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
};

export default function AdminSeries() {
  const [seriesList, setSeriesList] = useState<SeriesRow[]>([]);
  // Add form
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newMetaTitle, setNewMetaTitle] = useState("");
  const [newMetaDesc, setNewMetaDesc] = useState("");
  const [newSort, setNewSort] = useState("0");
  const [newThumbnail, setNewThumbnail] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  // Edit form
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editMetaTitle, setEditMetaTitle] = useState("");
  const [editMetaDesc, setEditMetaDesc] = useState("");
  const [editSort, setEditSort] = useState("0");
  const [editThumbnail, setEditThumbnail] = useState("");
  // Manage games drawer
  const [managingGames, setManagingGames] = useState<string | null>(null);
  const [linkedGames, setLinkedGames] = useState<GameRow[]>([]);
  const [searchGames, setSearchGames] = useState("");
  const [searchResults, setSearchResults] = useState<GameRow[]>([]);
  const [addingGameId, setAddingGameId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await fetch("/api/admin/series");
    const json = await res.json();
    setSeriesList(json.data || []);
  }

  async function add() {
    if (!newName || !newSlug) return;
    setAdding(true);
    setAddError("");

    const res = await fetch("/api/admin/series", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        slug: newSlug,
        description: newDesc || null,
        meta_title: newMetaTitle || null,
        meta_description: newMetaDesc || null,
        sort_order: parseInt(newSort) || 0,
        thumbnail_url: newThumbnail || null,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setAddError(err?.error || "Failed to add series");
      setAdding(false);
      return;
    }

    setNewName(""); setNewSlug(""); setNewDesc("");
    setNewMetaTitle(""); setNewMetaDesc(""); setNewThumbnail(""); setNewSort("0");
    setAdding(false);
    load();
  }

  async function update(id: string) {
    const res = await fetch("/api/admin/series", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: editName,
        slug: editSlug,
        description: editDesc || null,
        meta_title: editMetaTitle || null,
        meta_description: editMetaDesc || null,
        sort_order: parseInt(editSort) || 0,
        thumbnail_url: editThumbnail || null,
      }),
    });

    if (res.ok) {
      setEditing(null);
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this series?")) return;
    await fetch(`/api/admin/series?id=${id}`, { method: "DELETE" });
    load();
  }

  async function openManageGames(seriesId: string) {
    setManagingGames(seriesId);
    setSearchGames("");
    setSearchResults([]);

    const res = await fetch(`/api/admin/series/games?series_id=${seriesId}`);
    const json = await res.json();
    setLinkedGames(json.data || []);
  }

  async function searchForGames(query: string) {
    setSearchGames(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const res = await fetch(`/api/admin/games?q=${encodeURIComponent(query)}&page=1`);
    const json = await res.json();
    const linkedIds = new Set(linkedGames.map(g => g.id));
    setSearchResults((json.data || []).filter((g: GameRow) => !linkedIds.has(g.id)));
  }

  async function linkGame(seriesId: string, gameId: string) {
    setAddingGameId(gameId);
    await fetch("/api/admin/series/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ series_id: seriesId, game_id: gameId }),
    });
    await openManageGames(seriesId);
    setAddingGameId(null);
  }

  async function unlinkGame(seriesId: string, gameId: string) {
    await fetch("/api/admin/series/games", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ series_id: seriesId, game_id: gameId }),
    });
    await openManageGames(seriesId);
  }

  async function moveGame(seriesId: string, gameId: string, direction: "up" | "down") {
    const idx = linkedGames.findIndex(g => g.id === gameId);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= linkedGames.length) return;

    const a = linkedGames[idx];
    const b = linkedGames[swapIdx];
    await fetch("/api/admin/series/games/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        series_id: seriesId,
        orders: [
          { game_id: a.id, sort_order: swapIdx + 1 },
          { game_id: b.id, sort_order: idx + 1 },
        ],
      }),
    });
    await openManageGames(seriesId);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Series</h1>

      {/* Add new series form */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Add New Series</h3>
        {addError && (
          <div className="mb-3 rounded-lg bg-destructive/10 border border-destructive/20 p-2 text-sm text-destructive">
            {addError}
          </div>
        )}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Name *</Label>
            <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Series name" className="w-40" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Slug *</Label>
            <Input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="series-slug" className="w-36" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Short description" className="w-56" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Meta Title</Label>
            <Input value={newMetaTitle} onChange={e => setNewMetaTitle(e.target.value)} placeholder="SEO title" className="w-44" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Meta Description</Label>
            <Input value={newMetaDesc} onChange={e => setNewMetaDesc(e.target.value)} placeholder="SEO description" className="w-52" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Order</Label>
          <div className="space-y-1">
            <Label className="text-xs">Thumbnail URL</Label>
            <Input value={newThumbnail} onChange={e => setNewThumbnail(e.target.value)} placeholder="https://..." className="w-52" />
          </div>
            <Input type="number" value={newSort} onChange={e => setNewSort(e.target.value)} className="w-16" />
          </div>
          <Button onClick={add} size="sm" disabled={adding}>
            <Plus className="h-4 w-4 mr-1" /> {adding ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>

      {/* Series table */}
      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Meta Title</TableHead>
              <TableHead className="w-16 text-center">Order</TableHead>
              <TableHead className="w-16 text-center">Games</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seriesList.map(s => (
              <TableRow key={s.id}>
                <TableCell>
                  {editing === s.id
                    ? <Input value={editName} onChange={e => setEditName(e.target.value)} className="w-40" />
                    : <span className="font-medium">{s.name}</span>}
                </TableCell>
                <TableCell>
                  {editing === s.id
                    ? <Input value={editSlug} onChange={e => setEditSlug(e.target.value)} className="w-36" />
                    : <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{s.slug}</code>}
                </TableCell>
                <TableCell className="max-w-[200px]">
                  {editing === s.id
                    ? <Textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-56 h-16 text-xs" />
                    : <span className="text-xs text-muted-foreground line-clamp-2">{s.description || "—"}</span>}
                </TableCell>
                <TableCell className="max-w-[180px]">
                  {editing === s.id ? (
                    <div className="space-y-1">
                      <Input value={editThumbnail} onChange={e => setEditThumbnail(e.target.value)} placeholder="Thumbnail URL" className="w-44 text-xs" />
                      <Input value={editMetaTitle} onChange={e => setEditMetaTitle(e.target.value)} placeholder="Meta title" className="w-44 text-xs" />
                      <Input value={editMetaDesc} onChange={e => setEditMetaDesc(e.target.value)} placeholder="Meta desc" className="w-44 text-xs" />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground line-clamp-2">{s.meta_title || "—"}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {editing === s.id
                    ? <Input type="number" value={editSort} onChange={e => setEditSort(e.target.value)} className="w-16 text-center" />
                    : <span className="text-xs">{s.sort_order}</span>}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm" onClick={() => openManageGames(s.id)} className="text-xs gap-1">
                    <Gamepad2 className="h-3.5 w-3.5" />
                    Manage
                  </Button>
                </TableCell>
                <TableCell>
                  {editing === s.id ? (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => update(s.id)}><Check className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditing(s.id);
                        setEditName(s.name);
                        setEditSlug(s.slug);
                        setEditDesc(s.description || "");
                        setEditMetaTitle(s.meta_title || "");
                        setEditMetaDesc(s.meta_description || "");
                        setEditSort(String(s.sort_order));
                        setEditThumbnail((s as any).thumbnail_url || "");
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {seriesList.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No series yet. Add one above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Manage Games Drawer */}
      {managingGames && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setManagingGames(null)} />
          <div className="relative w-full max-w-lg bg-card border-l shadow-2xl h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Manage Games — {seriesList.find(s => s.id === managingGames)?.name}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setManagingGames(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search + add */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold">Add a game to this series</Label>
              <div className="flex gap-2">
                <Input
                  value={searchGames}
                  onChange={e => searchForGames(e.target.value)}
                  placeholder="Search games by title..."
                  className="flex-1"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="rounded-lg border divide-y max-h-48 overflow-y-auto">
                  {searchResults.map(g => (
                    <div key={g.id} className="flex items-center justify-between px-3 py-2 hover:bg-muted/50">
                      <div className="flex items-center gap-2 min-w-0">
                        {g.thumbnail_url && (
                          <img src={g.thumbnail_url} alt="" className="w-8 h-6 rounded object-cover" />
                        )}
                        <span className="text-sm truncate">{g.title}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => linkGame(managingGames!, g.id)}
                        disabled={addingGameId === g.id}
                      >
                        <LinkIcon className="h-3.5 w-3.5 mr-1" />
                        {addingGameId === g.id ? "Adding..." : "Link"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {searchGames && searchResults.length === 0 && (
                <p className="text-xs text-muted-foreground">No matching games found.</p>
              )}
            </div>

            {/* Linked games */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold">
                Linked Games ({linkedGames.length})
              </Label>
              {linkedGames.length === 0 ? (
                <p className="text-sm text-muted-foreground">No games linked yet. Search above to add.</p>
              ) : (
                <div className="space-y-2">
                  {linkedGames.map((g, idx) => (
                    <div key={g.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/40">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => moveGame(managingGames!, g.id, "up")}
                          disabled={idx === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          <GripHorizontal className="h-3.5 w-3.5 rotate-90" />
                        </button>
                      </div>
                      {g.thumbnail_url && (
                        <img src={g.thumbnail_url} alt="" className="w-10 h-7 rounded object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{g.title}</p>
                        <code className="text-[10px] text-muted-foreground">{g.slug}</code>
                      </div>
                      <span className="text-[10px] text-muted-foreground">#{idx + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => unlinkGame(managingGames!, g.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
