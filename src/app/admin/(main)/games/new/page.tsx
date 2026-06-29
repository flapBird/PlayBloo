"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewGame() {
  const router = useRouter();

  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [form, setForm] = useState(() => {
    // Restore draft on initial render
    try {
      const saved = localStorage.getItem("playbloo_new_game_draft");
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.form) return draft.form;
      }
    } catch {}
    return {
      title: "", slug: "", thumbnail_url: "", cover_url: "", iframe_url: "", external_url: "",
      description: "", how_to_play: "", controls: "", tips: "", features: "",
      release_date: "",
      is_published: false, is_featured: false, is_trending: false,
    };
  });

  // Restore selected categories from draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem("playbloo_new_game_draft");
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.selectedCategoryIds?.length) {
          setSelectedCategoryIds(draft.selectedCategoryIds);
        }
      }
    } catch {}
  }, []);

  // Warn on browser close/refresh
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Auto-save to localStorage on every change
  useEffect(() => {
    if (!dirty) return;
    const data = { form, selectedCategoryIds };
    try { localStorage.setItem("playbloo_new_game_draft", JSON.stringify(data)); } catch {}
  }, [form, selectedCategoryIds, dirty]);

  function clearDraft() {
    try { localStorage.removeItem("playbloo_new_game_draft"); } catch {}
  }

  useEffect(() => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(d => setCategories(d.data || []))
      .catch(() => {});
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev: typeof form) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setDirty(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving("Saving...");
    setError("");

    const res = await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        release_date: form.release_date || null,
        category_ids: selectedCategoryIds,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Failed to save game");
      setSaving("");
      return;
    }

    clearDraft();
    router.push("/admin/games");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add New Game</h1>
        <p className="text-sm text-muted-foreground">Create a new game entry</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" value={form.slug} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
            <Input id="thumbnail_url" name="thumbnail_url" value={form.thumbnail_url} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover_url">Cover URL</Label>
            <Input id="cover_url" name="cover_url" value={form.cover_url} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="external_url">External URL (opens in new tab)</Label>
            <Input id="external_url" name="external_url" value={form.external_url} onChange={handleChange} placeholder="https://example.com/game" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="iframe_url">Iframe URL</Label>
            <Input id="iframe_url" name="iframe_url" value={form.iframe_url} onChange={handleChange} placeholder="optional" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="how_to_play">How to Play</Label>
            <Textarea id="how_to_play" name="how_to_play" value={form.how_to_play} onChange={handleChange} rows={3} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="controls">Controls</Label>
            <Textarea id="controls" name="controls" value={form.controls} onChange={handleChange} rows={3} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="tips">Tips</Label>
            <Textarea id="tips" name="tips" value={form.tips} onChange={handleChange} rows={3} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="features">Features</Label>
            <Textarea id="features" name="features" value={form.features} onChange={handleChange} rows={3} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="release_date">Release Date</Label>
            <Input id="release_date" name="release_date" type="date" value={form.release_date} onChange={handleChange} />
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">Categories</Label>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(cat => (
              <label key={cat.id} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                selectedCategoryIds.includes(cat.id)
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-card border-border/60 text-muted-foreground hover:border-primary/30"
              }`}>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedCategoryIds.includes(cat.id)}
                  onChange={() => {
                    setDirty(true);
                    setSelectedCategoryIds(prev =>
                      prev.includes(cat.id)
                        ? prev.filter(id => id !== cat.id)
                        : [...prev, cat.id]
                    );
                  }}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="accent-indigo-600" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="accent-indigo-600" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" name="is_trending" checked={form.is_trending} onChange={handleChange} className="accent-indigo-600" />
            Trending
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={!!saving}>{saving ? "Saving..." : "Save Game"}</Button>
          <Button type="button" variant="outline" onClick={() => { if (dirty && !confirm("You have unsaved changes. Leave this page?")) return; router.back(); }}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
