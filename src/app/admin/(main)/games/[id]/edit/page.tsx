"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Check, X, Eye, EyeOff } from "lucide-react";

type LevelRow = {
  id: string;
  level_number: number;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  video_url: string | null;
  content: string | null;
  tips: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  view_count: number;
};

export default function EditGame() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", thumbnail_url: "", cover_url: "", iframe_url: "", external_url: "",
    description: "", how_to_play: "", controls: "", tips: "", features: "",
    release_date: "",
    is_published: false, is_featured: false, is_trending: false,
  });

  // Levels state
  const [activeTab, setActiveTab] = useState("info");
  const [levels, setLevels] = useState<LevelRow[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(false);
  // Level form
  const [levelForm, setLevelForm] = useState({
    level_number: "", title: "", slug: "", thumbnail_url: "", video_url: "",
    content: "", tips: "", meta_title: "", meta_description: "",
    is_published: false,
  });
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("playbloo_edit_game_" + params.id);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.form) setForm((prev: typeof form) => ({ ...prev, ...draft.form }));
        if (draft.selectedCategoryIds?.length) setSelectedCategoryIds(draft.selectedCategoryIds);
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

  // Auto-save to localStorage
  useEffect(() => {
    if (!dirty) return;
    const data = { form, selectedCategoryIds };
    try { localStorage.setItem("playbloo_edit_game_" + params.id, JSON.stringify(data)); } catch {}
  }, [form, selectedCategoryIds, dirty, params.id]);

  function clearDraft() {
    try { localStorage.removeItem("playbloo_edit_game_" + params.id); } catch {}
  }

  useEffect(() => {
    loadGame();
    fetch("/api/categories")
      .then(r => r.json())
      .then(d => setCategories(d.data || []))
      .catch(() => {});
  }, []);

  async function loadGame() {
    const res = await fetch("/api/admin/games?id=" + params.id);
    const { data } = await res.json();
    if (data) {
      const catRes = await fetch("/api/admin/game-categories?game_id=" + params.id);
      if (catRes.ok) {
        const catData = await catRes.json();
        setSelectedCategoryIds(catData.data?.map((gc: any) => gc.category_id) || []);
      }
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        thumbnail_url: data.thumbnail_url || "",
        cover_url: data.cover_url || "",
        iframe_url: data.iframe_url || "",
        external_url: data.external_url || "",
        description: data.description || "",
        how_to_play: data.how_to_play || "",
        controls: data.controls || "",
        tips: data.tips || "",
        features: data.features || "",
        release_date: data.release_date || "",
        is_published: data.is_published,
        is_featured: data.is_featured,
        is_trending: data.is_trending,
      });
    }
    setLoading(false);
  }

  // --- Levels ---
  async function loadLevels() {
    setLevelsLoading(true);
    const res = await fetch("/api/admin/levels?game_id=" + params.id);
    const json = await res.json();
    setLevels(json.data || []);
    setLevelsLoading(false);
  }

  function resetLevelForm() {
    setLevelForm({
      level_number: "", title: "", slug: "", thumbnail_url: "", video_url: "",
      content: "", tips: "", meta_title: "", meta_description: "",
      is_published: false,
    });
    setEditingLevelId(null);
  }

  async function addLevel() {
    if (!levelForm.title || !levelForm.slug || !levelForm.level_number) return;
    const res = await fetch("/api/admin/levels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        game_id: params.id,
        ...levelForm,
        level_number: parseInt(levelForm.level_number) || 0,
      }),
    });
    if (res.ok) {
      resetLevelForm();
      loadLevels();
    }
  }

  async function updateLevel() {
    if (!editingLevelId || !levelForm.title) return;
    const res = await fetch("/api/admin/levels", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingLevelId,
        ...levelForm,
        level_number: parseInt(levelForm.level_number) || 0,
      }),
    });
    if (res.ok) {
      resetLevelForm();
      loadLevels();
    }
  }

  async function deleteLevel(id: string) {
    if (!confirm("Delete this level?")) return;
    await fetch("/api/admin/levels?id=" + id, { method: "DELETE" });
    loadLevels();
  }

  function startEditLevel(lvl: LevelRow) {
    setEditingLevelId(lvl.id);
    setLevelForm({
      level_number: String(lvl.level_number),
      title: lvl.title,
      slug: lvl.slug,
      thumbnail_url: lvl.thumbnail_url || "",
      video_url: lvl.video_url || "",
      content: lvl.content || "",
      tips: lvl.tips || "",
      meta_title: lvl.meta_title || "",
      meta_description: lvl.meta_description || "",
      is_published: lvl.is_published,
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev: typeof form) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setDirty(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/games", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: params.id, ...form, release_date: form.release_date || null, category_ids: selectedCategoryIds }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Failed to save game");
      setSaving(false);
      return;
    }

    clearDraft();
    router.push("/admin/games");
  }

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Game</h1>
        <p className="text-sm text-muted-foreground">{form.title}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="info">Game Info</TabsTrigger>
          <TabsTrigger value="levels" onClick={loadLevels}>Levels / Walkthrough</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
                <Label htmlFor="external_url">External URL</Label>
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
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
              <Button type="button" variant="outline" onClick={() => { if (dirty && !confirm("You have unsaved changes. Leave this page?")) return; router.back(); }}>Cancel</Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="levels" className="mt-4 space-y-6">
          {/* Level form */}
          <div className="rounded-xl border bg-card p-4">
            <h3 className="text-sm font-semibold mb-3">
              {editingLevelId ? "Edit Level" : "Add New Level"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div className="space-y-1">
                <Label className="text-xs">Level # *</Label>
                <Input value={levelForm.level_number} onChange={e => setLevelForm(f => ({ ...f, level_number: e.target.value }))} type="number" placeholder="666" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Title *</Label>
                <Input value={levelForm.title} onChange={e => setLevelForm(f => ({ ...f, title: e.target.value }))} placeholder="Level 666 Walkthrough" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Slug *</Label>
                <Input value={levelForm.slug} onChange={e => setLevelForm(f => ({ ...f, slug: e.target.value }))} placeholder="level-666" />
              </div>
            </div>
            <div className="space-y-1 mb-3">
              <Label className="text-xs">Thumbnail URL</Label>
              <Input value={levelForm.thumbnail_url} onChange={e => setLevelForm(f => ({ ...f, thumbnail_url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-1 mb-3">
              <Label className="text-xs">Video URL (embed, e.g. YouTube)</Label>
              <Input value={levelForm.video_url} onChange={e => setLevelForm(f => ({ ...f, video_url: e.target.value }))} placeholder="https://www.youtube.com/embed/..." />
            </div>
            <div className="space-y-1 mb-3">
              <Label className="text-xs">Content (Walkthrough)</Label>
              <Textarea value={levelForm.content} onChange={e => setLevelForm(f => ({ ...f, content: e.target.value }))} rows={5} placeholder="Step-by-step walkthrough..." />
            </div>
            <div className="space-y-1 mb-3">
              <Label className="text-xs">Tips</Label>
              <Textarea value={levelForm.tips} onChange={e => setLevelForm(f => ({ ...f, tips: e.target.value }))} rows={2} placeholder="Key tips for this level" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="space-y-1">
                <Label className="text-xs">Meta Title</Label>
                <Input value={levelForm.meta_title} onChange={e => setLevelForm(f => ({ ...f, meta_title: e.target.value }))} placeholder="SEO title" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Meta Description</Label>
                <Input value={levelForm.meta_description} onChange={e => setLevelForm(f => ({ ...f, meta_description: e.target.value }))} placeholder="SEO description" />
              </div>
            </div>
            <div className="flex items-center gap-6 mb-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={levelForm.is_published} onChange={e => setLevelForm(f => ({ ...f, is_published: e.target.checked }))} className="accent-indigo-600" />
                Published
              </label>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={editingLevelId ? updateLevel : addLevel}>
                <Check className="h-4 w-4 mr-1" />
                {editingLevelId ? "Update Level" : "Add Level"}
              </Button>
              {editingLevelId && (
                <Button size="sm" variant="outline" onClick={resetLevelForm}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Levels table */}
          <div className="rounded-xl border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-16 text-center">Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levelsLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : levels.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No levels yet</TableCell></TableRow>
                ) : (
                  levels.map(lvl => (
                    <TableRow key={lvl.id}>
                      <TableCell className="font-mono text-sm">{lvl.level_number}</TableCell>
                      <TableCell className="font-medium">{lvl.title}</TableCell>
                      <TableCell><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{lvl.slug}</code></TableCell>
                      <TableCell className="text-center">
                        {lvl.is_published ? <Eye className="h-4 w-4 text-green-500 inline" /> : <EyeOff className="h-4 w-4 text-muted-foreground inline" />}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => startEditLevel(lvl)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteLevel(lvl.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
