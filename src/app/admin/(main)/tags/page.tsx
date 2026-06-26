"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Check, X } from "lucide-react";
import type { Tag } from "@/lib/types";

export default function AdminTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newName, setNewName] = useState(""); const [newSlug, setNewSlug] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState(""); const [editSlug, setEditSlug] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from("tags").select("*").order("name", { ascending: true });
    setTags(data || []);
  }

  async function add() {
    if (!newName || !newSlug) return;
    const supabase = createClient();
    await supabase.from("tags").insert([{ name: newName, slug: newSlug }]);
    setNewName(""); setNewSlug(""); load();
  }

  async function update(id: string) {
    const supabase = createClient();
    await supabase.from("tags").update({ name: editName, slug: editSlug }).eq("id", id);
    setEditing(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this tag?")) return;
    const supabase = createClient();
    await supabase.from("tags").delete().eq("id", id);
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tags</h1>
      <div className="flex gap-2 items-end">
        <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Tag name" className="w-48" /></div>
        <div className="space-y-1"><Label className="text-xs">Slug</Label><Input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="tag-slug" className="w-48" /></div>
        <Button onClick={add}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {tags.map(tag => (
              <TableRow key={tag.id}>
                <TableCell>{editing === tag.id ? <Input value={editName} onChange={e => setEditName(e.target.value)} className="w-48" /> : tag.name}</TableCell>
                <TableCell>{editing === tag.id ? <Input value={editSlug} onChange={e => setEditSlug(e.target.value)} className="w-48" /> : tag.slug}</TableCell>
                <TableCell>
                  {editing === tag.id ? (
                    <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => update(tag.id)}><Check className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button></div>
                  ) : (
                    <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => { setEditing(tag.id); setEditName(tag.name); setEditSlug(tag.slug); }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => remove(tag.id)}><Trash2 className="h-4 w-4" /></Button></div>
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
