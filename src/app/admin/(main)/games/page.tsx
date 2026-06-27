"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import type { Game } from "@/lib/types";

export default function AdminGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const PAGE_SIZE = 20;

  useEffect(() => { loadGames(); }, [page, search]);

  async function loadGames() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), q: search });
    const res = await fetch("/api/admin/games?" + params.toString());
    const json = await res.json();
    setGames(json.data || []); setTotal(json.total || 0); setLoading(false);
  }

  async function togglePublish(id: string, current: boolean) {
    await fetch("/api/admin/games", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_published: !current }),
    });
    loadGames();
  }

  async function deleteGame(id: string) {
    if (!confirm("Are you sure?")) return;
    await fetch("/api/admin/games?id=" + id, { method: "DELETE" });
    loadGames();
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Games</h1><p className="text-sm text-muted-foreground">{total} games total</p></div>
        <Link href="/admin/games/new"><Button><Plus className="h-4 w-4 mr-2" />Add Game</Button></Link>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search games..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9" />
        </div>
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Slug</TableHead><TableHead className="text-center">Views</TableHead><TableHead className="text-center">Status</TableHead><TableHead className="text-center">Featured</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : games.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No games found</TableCell></TableRow>
            ) : (
              games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-medium">{game.title}</TableCell>
                  <TableCell className="text-muted-foreground">{game.slug}</TableCell>
                  <TableCell className="text-center">{game.view_count.toLocaleString()}</TableCell>
                  <TableCell className="text-center"><Badge variant={game.is_published ? "default" : "secondary"}>{game.is_published ? "Published" : "Draft"}</Badge></TableCell>
                  <TableCell className="text-center">{game.is_featured ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(game.id, game.is_published)} title="Toggle publish">{game.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                      <Link href={`/admin/games/${game.id}/edit`}><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></Link>
                      <Button variant="ghost" size="icon" onClick={() => deleteGame(game.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="flex items-center text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
