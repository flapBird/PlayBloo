"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import type { Category } from "@/lib/types";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSort, setNewSort] = useState("0");
  const [newSource, setNewSource] = useState("");
  const [newVerified, setNewVerified] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editSort, setEditSort] = useState("0");
  const [editSource, setEditSource] = useState("");
  const [editVerified, setEditVerified] = useState(false);
  const [verificationSchemaAvailable, setVerificationSchemaAvailable] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
    setCategories(data || []);
    setVerificationSchemaAvailable(Boolean(data?.[0] && "content_verified" in data[0]));
  }

  async function add() {
    if (!newName || !newSlug) return;
    const supabase = createClient();
    await supabase.from("categories").insert([{
      name: newName, slug: newSlug,
      description: newDesc || null,
      sort_order: parseInt(newSort) || 0,
      ...(verificationSchemaAvailable ? {
        source_url: newSource || null,
        content_verified: newVerified,
        last_verified_at: newVerified ? new Date().toISOString() : null,
      } : {}),
    }]);
    setNewName(""); setNewSlug(""); setNewDesc(""); setNewSort("0"); setNewSource(""); setNewVerified(false);
    load();
  }

  async function update(id: string) {
    const supabase = createClient();
    await supabase.from("categories").update({
      name: editName, slug: editSlug,
      description: editDesc || null,
      sort_order: parseInt(editSort) || 0,
      ...(verificationSchemaAvailable ? {
        source_url: editSource || null,
        content_verified: editVerified,
        last_verified_at: editVerified ? new Date().toISOString() : null,
      } : {}),
    }).eq("id", id);
    setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    const supabase = createClient();
    await supabase.from("categories").delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories</h1>
        {!verificationSchemaAvailable && categories.length > 0 && (
          <p className="mt-1 text-xs text-amber-600">Apply migration 00006 to enable sourced editorial copy.</p>
        )}
      </div>
      <div className="flex gap-2 items-end flex-wrap">
        <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" className="w-36" /></div>
        <div className="space-y-1"><Label className="text-xs">Slug</Label><Input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="slug" className="w-28" /></div>
        <div className="space-y-1"><Label className="text-xs">Description</Label><Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Short description" className="w-48" /></div>
        {verificationSchemaAvailable && <div className="space-y-1"><Label className="text-xs">Editorial source</Label><Input type="url" value={newSource} onChange={e => setNewSource(e.target.value)} placeholder="https://..." className="w-52" /></div>}
        {verificationSchemaAvailable && <label className="flex h-10 items-center gap-2 text-xs font-medium"><input type="checkbox" checked={newVerified} onChange={e => setNewVerified(e.target.checked)} className="accent-emerald-600" />Verified</label>}
        <div className="space-y-1"><Label className="text-xs">Order</Label><Input type="number" value={newSort} onChange={e => setNewSort(e.target.value)} className="w-16" /></div>
        <Button onClick={add} disabled={newVerified && !newSource}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Description</TableHead>{verificationSchemaAvailable && <TableHead>Source</TableHead>}{verificationSchemaAvailable && <TableHead className="text-center">Verified</TableHead>}<TableHead className="w-16 text-center">Order</TableHead><TableHead className="w-20">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat.id}>
                <TableCell>{editing === cat.id ? <Input value={editName} onChange={e => setEditName(e.target.value)} className="w-36" /> : cat.name}</TableCell>
                <TableCell>{editing === cat.id ? <Input value={editSlug} onChange={e => setEditSlug(e.target.value)} className="w-28" /> : cat.slug}</TableCell>
                <TableCell className="max-w-xs">
                  {editing === cat.id
                    ? <Input value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-48" />
                    : <span className="text-xs text-muted-foreground truncate block">{cat.description || "—"}</span>}
                </TableCell>
                {verificationSchemaAvailable && <TableCell className="max-w-[220px]">
                  {editing === cat.id
                    ? <Input type="url" value={editSource} onChange={e => setEditSource(e.target.value)} className="w-52" />
                    : cat.source_url
                      ? <a href={cat.source_url} target="_blank" rel="noopener noreferrer" className="block truncate text-xs text-primary hover:underline">{cat.source_url}</a>
                      : <span className="text-xs text-muted-foreground">—</span>}
                </TableCell>}
                {verificationSchemaAvailable && <TableCell className="text-center">
                  {editing === cat.id
                    ? <input type="checkbox" checked={editVerified} onChange={e => setEditVerified(e.target.checked)} className="accent-emerald-600" />
                    : <span className={cat.content_verified ? "text-xs font-bold text-emerald-600" : "text-xs text-muted-foreground"}>{cat.content_verified ? "Checked" : "Pending"}</span>}
                </TableCell>}
                <TableCell className="text-center">
                  {editing === cat.id
                    ? <Input type="number" value={editSort} onChange={e => setEditSort(e.target.value)} className="w-16 text-center" />
                    : <span className="text-xs">{cat.sort_order}</span>}
                </TableCell>
                <TableCell>
                  {editing === cat.id ? (
                    <div className="flex gap-1"><Button variant="ghost" size="icon" disabled={editVerified && !editSource} onClick={() => update(cat.id)}><Check className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button></div>
                  ) : (
                    <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => { setEditing(cat.id); setEditName(cat.name); setEditSlug(cat.slug); setEditDesc(cat.description || ""); setEditSort(String(cat.sort_order)); setEditSource(cat.source_url || ""); setEditVerified(cat.content_verified === true); }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => remove(cat.id)}><Trash2 className="h-4 w-4" /></Button></div>
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
