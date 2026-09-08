"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GameUpdate } from "@/lib/types";

function localDateTimeInput(value: string | Date = new Date()): string {
  const date = value instanceof Date ? value : new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function emptyForm() {
  return { id: "", version: "", title: "", summary: "", published_at: "", source_url: "" };
}

export default function AdminGameUpdatesPage() {
  const { id: gameId } = useParams<{ id: string }>();
  const [updates, setUpdates] = useState<GameUpdate[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/updates?game_id=${gameId}`, { cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not load updates.");
      setUpdates(payload.data || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load updates.");
    }
  }, [gameId]);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/admin/updates?game_id=${gameId}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Could not load updates.");
        setUpdates(payload.data || []);
      })
      .catch((loadError) => {
        if (!(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(loadError instanceof Error ? loadError.message : "Could not load updates.");
        }
      });
    return () => controller.abort();
  }, [gameId]);
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/admin/updates", { method: form.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, published_at: new Date(form.published_at).toISOString(), game_id: gameId }) });
      const value = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(value.error || "Could not save update.");
      setForm(emptyForm());
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save update.");
    }
  }
  async function remove(updateId: string) {
    if (!confirm("Delete this update record?")) return;
    setError("");
    try {
      const response = await fetch(`/api/admin/updates?id=${updateId}&game_id=${gameId}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not delete update.");
      await load();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Could not delete update.");
    }
  }
  return <div className="max-w-3xl space-y-6"><Link href={`/admin/games/${gameId}/edit`} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground"><ArrowLeft className="h-4 w-4" />Back to game</Link><div><h1 className="text-2xl font-bold">Game Updates</h1><p className="text-sm text-muted-foreground">The newest record controls the game&apos;s “Recently Updated” date.</p></div>
    <form onSubmit={save} className="grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-2"><div className="space-y-2"><Label>Title</Label><Input required value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} /></div><div className="space-y-2"><Label>Version (optional)</Label><Input value={form.version} onChange={(e) => setForm({...form,version:e.target.value})} /></div><div className="space-y-2"><Label>Published at</Label><Input required type="datetime-local" value={form.published_at} onChange={(e) => setForm({...form,published_at:e.target.value})} /></div><div className="space-y-2"><Label>Source URL</Label><Input type="url" value={form.source_url} onChange={(e) => setForm({...form,source_url:e.target.value})} /></div><div className="space-y-2 sm:col-span-2"><Label>Summary</Label><Textarea rows={5} value={form.summary} onChange={(e) => setForm({...form,summary:e.target.value})} /></div>{error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}<div className="flex gap-2 sm:col-span-2"><Button type="submit"><Plus className="mr-2 h-4 w-4" />{form.id ? "Save changes" : "Add update"}</Button>{form.id && <Button type="button" variant="outline" onClick={() => setForm(emptyForm())}>Cancel</Button>}</div></form>
    <div className="space-y-3">{updates.map((item) => <article key={item.id} className="rounded-2xl border p-4"><div className="flex justify-between gap-4"><div><div className="flex items-center gap-2"><h2 className="font-bold">{item.title}</h2>{item.version && <span className="rounded bg-muted px-2 py-0.5 text-xs">{item.version}</span>}</div><p className="mt-1 text-xs text-muted-foreground">{new Date(item.published_at).toLocaleString()}</p>{item.summary && <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{item.summary}</p>}</div><div className="flex shrink-0 gap-1"><Button size="icon" variant="ghost" onClick={() => setForm({ id:item.id, version:item.version||"", title:item.title, summary:item.summary||"", published_at:localDateTimeInput(item.published_at), source_url:item.source_url||"" })}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4" /></Button></div></div></article>)}{!updates.length && <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">No update records yet.</p>}</div>
  </div>;
}
