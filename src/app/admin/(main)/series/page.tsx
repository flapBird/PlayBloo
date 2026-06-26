"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import type { Series } from "@/lib/types";

export default function AdminSeries() {
  const [series, setSeries] = useState<Series[]>([]);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSort, setNewSort] = useState("0");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editSort, setEditSort] = useState("0");

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("series").select("*").order("sort_order", { ascending: true });
    setSeries(data || []);
  }

  async function add() {
    if (!newName || !newSlug) return;
    const supabase = createClient();
    await supabase.from("series").insert([{
      name: newName, slug: newSlug,
      description: newDesc || null,
      sort_order: parseInt(newSort) || 0,
    }]);
    setNewName(""); setNewSlug(""); setNewDesc(""); setNewSort("0");
    load();
  }

  async function update(id: string) {
    const supabase = createClient();
    await supabase.from("series").update({
      name: editName, slug: editSlug,
      description: editDesc || null,
      sort_order: parseInt(editSort) || 0,
    }).eq("id", id);
    setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this series?")) return;
    const supabase = createClient();
    await supabase.from("series").delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Series</h1>
      <div className="flex gap-2 items-end flex-wrap">
        <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" className="w-36" /></div>
        <div className="space-y-1"><Label className="text-xs">Slug</Label><Input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="slug" className="w-28" /></div>
        <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Short description" className="w-48" /></div>
        <div className="space-y-1"><Label className="text-xs">Order</Label><Input type="number" value={newSort} onChange={e => setNewSort(e.target.value)} className="w-16" /></div>
        <Button onClick={add}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Description</TableHead><TableHead className="w-16 text-center">Order</TableHead><TableHead className="w-20">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {series.map(s => (
              <TableRow key={s.id}>
                <TableCell>
                  {editing === s.id
                    ? <Input value={editName} onChange={e => setEditName(e.target.value)} className="w-36" />
                    : s.name}
                </TableCell>
                <TableCell>
                  {editing === s.id
                    ? <Input value={editSlug} onChange={e => setEditSlug(e.target.value)} className="w-28" />
                    : s.slug}
                </TableCell>
                <TableCell className="max-w-xs">
                  {editing === s.id
                    ? <Input value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-48" />
                    : <span className="text-xs text-muted-foreground truncate block">{s.description || "—"}</span>}
                </TableCell>
                <TableCell className="text-center">
                  {editing === s.id
                    ? <Input type="number" value={editSort} onChange={e => setEditSort(e.target.value)} className="w-16 text-center" />
                    : <span className="text-xs">{s.sort_order}</span>}
                </TableCell>
                <TableCell>
                  {editing === s.id ? (
                    <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => update(s.id)}><Check className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button></div>
                  ) : (
                    <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => { setEditing(s.id); setEditName(s.name); setEditSlug(s.slug); setEditDesc(s.description || ""); setEditSort(String(s.sort_order)); }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button></div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
