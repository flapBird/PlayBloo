"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, Check, X, Eye, EyeOff, History, Braces, ClipboardCopy, RefreshCw, Save } from "lucide-react";
import Link from "next/link";
import { formatSourcesText, parseSourcesText } from "@/lib/game-utils";
import {
  createGameBulkDocument,
  EMPTY_GAME_FORM,
  formatGameBulkDocument,
  gameBulkDocumentToForm,
  parseGameBulkDocument,
  type GameBulkDocument,
  type GameBulkReadOnly,
  type GameForm,
} from "@/lib/admin-game-bulk";

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

type TaxonomyOption = { id: string; name: string; slug: string };

const EMPTY_READ_ONLY: GameBulkReadOnly = {
  id: "",
  view_count: 0,
  play_count: 0,
  external_click_count: 0,
  hot_score: 0,
  created_at: "",
  updated_at: "",
};

function selectedSlugs(ids: string[], options: TaxonomyOption[]): string[] {
  const selected = new Set(ids);
  return options.filter((option) => selected.has(option.id)).map((option) => option.slug);
}

function resolveTaxonomyValues(values: string[], options: TaxonomyOption[], label: string): string[] {
  const resolved = values.map((value) => {
    const normalized = value.trim().toLowerCase();
    const match = options.find((option) =>
      option.id.toLowerCase() === normalized ||
      option.slug.toLowerCase() === normalized ||
      option.name.toLowerCase() === normalized
    );
    if (!match) throw new Error(`Unknown ${label}: \"${value}\". Create it in Admin first or use an existing slug.`);
    return match.id;
  });
  return [...new Set(resolved)];
}

export default function EditGame() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<TaxonomyOption[]>([]);
  const [tags, setTags] = useState<TaxonomyOption[]>([]);
  const [seriesOptions, setSeriesOptions] = useState<TaxonomyOption[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedSeriesIds, setSelectedSeriesIds] = useState<string[]>([]);
  const [dirty, setDirty] = useState(false);
  const [form, setForm] = useState<GameForm>({ ...EMPTY_GAME_FORM });
  const [readOnlyFields, setReadOnlyFields] = useState<GameBulkReadOnly>({ ...EMPTY_READ_ONLY });
  const [bulkText, setBulkText] = useState("");
  const [bulkError, setBulkError] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");

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
    const data = { form, selectedCategoryIds, selectedTagIds, selectedSeriesIds };
    try { localStorage.setItem("playbloo_edit_game_" + params.id, JSON.stringify(data)); } catch {}
  }, [form, selectedCategoryIds, selectedTagIds, selectedSeriesIds, dirty, params.id]);

  function clearDraft() {
    try { localStorage.removeItem("playbloo_edit_game_" + params.id); } catch {}
  }

  useEffect(() => {
    let cancelled = false;

    async function hydrateGame() {
      const [gameRes, categoriesRes, tagsRes, seriesRes] = await Promise.all([
        fetch("/api/admin/games?id=" + params.id, { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
        fetch("/api/admin/tags", { cache: "no-store" }),
        fetch("/api/admin/series", { cache: "no-store" }),
      ]);
      const [{ data }, categoriesData, tagsData, seriesData] = await Promise.all([
        gameRes.json(),
        categoriesRes.ok ? categoriesRes.json() : Promise.resolve({ data: [] }),
        tagsRes.ok ? tagsRes.json() : Promise.resolve({ data: [] }),
        seriesRes.ok ? seriesRes.json() : Promise.resolve({ data: [] }),
      ]);
      if (cancelled) return;

      const nextCategories = (categoriesData.data || []) as TaxonomyOption[];
      const nextTags = (tagsData.data || []) as TaxonomyOption[];
      const nextSeriesOptions = (seriesData.data || []) as TaxonomyOption[];
      let nextForm: GameForm = { ...EMPTY_GAME_FORM };
      let nextCategoryIds: string[] = data?.categories?.map((membership: { category_id: string }) => membership.category_id) || [];
      let nextTagIds: string[] = data?.tags?.map((membership: { tag_id: string }) => membership.tag_id) || [];
      let nextSeriesIds: string[] = data?.series?.map((membership: { series_id: string }) => membership.series_id) || [];
      let nextReadOnly = { ...EMPTY_READ_ONLY };

      if (data) {
        nextForm = {
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
        developer: data.developer || "",
        publisher: data.publisher || "",
        source_url: data.source_url || "",
        source_type: data.source_type || "",
        original_game_url: data.original_game_url || "",
        developer_url: data.developer_url || "",
        steam_url: data.steam_url || "",
        itch_url: data.itch_url || "",
        last_verified_at: data.last_verified_at ? data.last_verified_at.slice(0, 16) : "",
        sources_text: formatSourcesText(data.sources),
        release_date: data.release_date || "",
        added_at: data.added_at ? data.added_at.slice(0, 16) : "",
        last_updated_at: data.last_updated_at ? data.last_updated_at.slice(0, 16) : "",
        short_description: data.short_description || "", official_website_url: data.official_website_url || "",
        steam_app_id: data.steam_app_id || "", itch_project_slug: data.itch_project_slug || "",
        platforms_text: (data.platforms || []).join(", "), monetization: data.monetization || "", development_status: data.development_status || "",
        graphics: data.graphics || "", multiplayer: data.multiplayer || "", engine: data.engine || "", screenshots_text: (data.screenshots || []).join("\n"),
        is_published: data.is_published,
        is_featured: data.is_featured,
        is_trending: data.is_trending,
        content_verified: data.content_verified || false,
        };
        nextReadOnly = {
          id: data.id || params.id,
          view_count: Number(data.view_count) || 0,
          play_count: Number(data.play_count) || 0,
          external_click_count: Number(data.external_click_count) || 0,
          hot_score: Number(data.hot_score) || 0,
          created_at: data.created_at || "",
          updated_at: data.updated_at || "",
        };
      }

      try {
        const saved = localStorage.getItem("playbloo_edit_game_" + params.id);
        if (saved) {
          const draft = JSON.parse(saved) as {
            form?: Partial<GameForm>;
            selectedCategoryIds?: string[];
            selectedTagIds?: string[];
            selectedSeriesIds?: string[];
          };
          if (draft.form) nextForm = { ...nextForm, ...draft.form };
          if (draft.selectedCategoryIds) nextCategoryIds = draft.selectedCategoryIds;
          if (draft.selectedTagIds) nextTagIds = draft.selectedTagIds;
          if (draft.selectedSeriesIds) nextSeriesIds = draft.selectedSeriesIds;
        }
      } catch {}

      setForm(nextForm);
      setSelectedCategoryIds(nextCategoryIds);
      setSelectedTagIds(nextTagIds);
      setSelectedSeriesIds(nextSeriesIds);
      setCategories(nextCategories);
      setTags(nextTags);
      setSeriesOptions(nextSeriesOptions);
      setReadOnlyFields(nextReadOnly);
      setBulkText(formatGameBulkDocument(createGameBulkDocument(
        nextForm,
        {
          categories: selectedSlugs(nextCategoryIds, nextCategories),
          tags: selectedSlugs(nextTagIds, nextTags),
          series: selectedSlugs(nextSeriesIds, nextSeriesOptions),
        },
        nextReadOnly,
        parseSourcesText(nextForm.sources_text),
      )));
      setLoading(false);
    }

    void hydrateGame().catch(() => {
      if (!cancelled) {
        setError("Failed to load game data.");
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [params.id]);

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setDirty(true);
  }

  function createCurrentBulkText(
    nextForm = form,
    categoryIds = selectedCategoryIds,
    tagIds = selectedTagIds,
    seriesIds = selectedSeriesIds,
  ): string {
    return formatGameBulkDocument(createGameBulkDocument(
      nextForm,
      {
        categories: selectedSlugs(categoryIds, categories),
        tags: selectedSlugs(tagIds, tags),
        series: selectedSlugs(seriesIds, seriesOptions),
      },
      readOnlyFields,
      parseSourcesText(nextForm.sources_text),
    ));
  }

  function parseBulkState(): {
    document: GameBulkDocument;
    nextForm: GameForm;
    categoryIds: string[];
    tagIds: string[];
    seriesIds: string[];
  } | null {
    setBulkError("");
    setBulkMessage("");
    try {
      const document = parseGameBulkDocument(bulkText);
      return {
        document,
        nextForm: gameBulkDocumentToForm(document),
        categoryIds: resolveTaxonomyValues(document.categories, categories, "category"),
        tagIds: resolveTaxonomyValues(document.tags, tags, "tag"),
        seriesIds: resolveTaxonomyValues(document.series, seriesOptions, "series"),
      };
    } catch (parseError) {
      setBulkError(parseError instanceof Error ? parseError.message : "Could not parse the bulk document.");
      return null;
    }
  }

  function refreshBulkText() {
    setBulkText(createCurrentBulkText());
    setBulkError("");
    setBulkMessage("Reloaded from the current form. Unsaved text edits were replaced.");
  }

  async function copyBulkText() {
    try {
      await navigator.clipboard.writeText(bulkText);
      setBulkError("");
      setBulkMessage("Copied the formatted game document.");
    } catch {
      setBulkError("Clipboard access was blocked. Select the text and copy it manually.");
    }
  }

  function applyBulkText() {
    const parsed = parseBulkState();
    if (!parsed) return;
    setForm(parsed.nextForm);
    setSelectedCategoryIds(parsed.categoryIds);
    setSelectedTagIds(parsed.tagIds);
    setSelectedSeriesIds(parsed.seriesIds);
    setBulkText(createCurrentBulkText(parsed.nextForm, parsed.categoryIds, parsed.tagIds, parsed.seriesIds));
    setDirty(true);
    setBulkMessage("Validated and applied to the form. The database has not been updated yet.");
  }

  async function saveGame(
    nextForm: GameForm,
    categoryIds: string[],
    tagIds: string[],
    seriesIds: string[],
  ): Promise<boolean> {
    setSaving(true);
    setError("");

    const { sources_text, platforms_text, screenshots_text, ...gameFields } = nextForm;
    let res: Response;
    try {
      res = await fetch("/api/admin/games", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: params.id,
          ...gameFields,
          sources: parseSourcesText(sources_text),
          platforms: platforms_text.split(",").map((value) => value.trim()).filter(Boolean),
          screenshots: screenshots_text.split("\n").map((value) => value.trim()).filter(Boolean),
          release_date: nextForm.release_date || null,
          added_at: nextForm.added_at || undefined,
          last_updated_at: nextForm.last_updated_at || null,
          monetization: nextForm.monetization || null,
          development_status: nextForm.development_status || null,
          last_verified_at: nextForm.last_verified_at || null,
          category_ids: categoryIds,
          tag_ids: tagIds,
          series_ids: seriesIds,
        }),
      });
    } catch {
      setError("Network error. The game was not updated.");
      setSaving(false);
      return false;
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error || "Failed to save game");
      setSaving(false);
      return false;
    }

    clearDraft();
    router.push("/admin/games");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await saveGame(form, selectedCategoryIds, selectedTagIds, selectedSeriesIds);
  }

  async function saveBulkText() {
    const parsed = parseBulkState();
    if (!parsed) return;
    if (!confirm("Save every editable field from this JSON document?")) return;
    const saved = await saveGame(parsed.nextForm, parsed.categoryIds, parsed.tagIds, parsed.seriesIds);
    if (!saved) setBulkError("The bulk document was valid, but the server rejected the update. See the error above.");
  }

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
        <h1 className="text-2xl font-bold">Edit Game</h1>
        <p className="text-sm text-muted-foreground">{form.title}</p>
        </div>
        <Link href={`/admin/games/${params.id}/updates`} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold hover:border-primary/40"><History className="h-4 w-4" />Updates</Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="info">Game Info</TabsTrigger>
          <TabsTrigger value="bulk"><Braces className="mr-1.5 h-4 w-4" />Bulk JSON</TabsTrigger>
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
              <div className="space-y-2 md:col-span-2"><Label htmlFor="short_description">Short Description</Label><Textarea id="short_description" name="short_description" value={form.short_description} onChange={handleChange} rows={2} /></div>
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
              <div className="space-y-2"><Label htmlFor="added_at">Added At</Label><Input id="added_at" name="added_at" type="datetime-local" value={form.added_at} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="last_updated_at">Last Game Update</Label><Input id="last_updated_at" name="last_updated_at" type="datetime-local" value={form.last_updated_at} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="platforms_text">Platforms</Label><Input id="platforms_text" name="platforms_text" value={form.platforms_text} onChange={handleChange} placeholder="Web, Windows, Android" /></div>
              <div className="space-y-2"><Label htmlFor="monetization">Monetization</Label><select id="monetization" name="monetization" value={form.monetization} onChange={handleChange} className="h-9 w-full rounded-md border bg-background px-3 text-sm"><option value="">Unknown</option><option value="free">Free</option><option value="free-with-ads">Free with ads</option><option value="freemium">Freemium</option><option value="paid">Paid</option></select></div>
              <div className="space-y-2"><Label htmlFor="development_status">Development Status</Label><select id="development_status" name="development_status" value={form.development_status} onChange={handleChange} className="h-9 w-full rounded-md border bg-background px-3 text-sm"><option value="">Unknown</option><option value="upcoming">Upcoming</option><option value="demo">Demo</option><option value="early-access">Early access</option><option value="released">Released</option><option value="discontinued">Discontinued</option></select></div>
              {(["graphics", "multiplayer", "engine"] as const).map((field) => <div key={field} className="space-y-2"><Label htmlFor={field}>{field[0].toUpperCase() + field.slice(1)}</Label><Input id={field} name={field} value={form[field]} onChange={handleChange} /></div>)}
              <div className="space-y-2">
                <Label htmlFor="developer">Developer</Label>
                <Input id="developer" name="developer" value={form.developer} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publisher">Publisher</Label>
                <Input id="publisher" name="publisher" value={form.publisher} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source_type">Primary Source Type</Label>
                <Input id="source_type" name="source_type" value={form.source_type} onChange={handleChange} placeholder="Developer / Steam / itch.io" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source_url">Primary Source URL</Label>
                <Input id="source_url" name="source_url" type="url" value={form.source_url} onChange={handleChange} />
              </div>
              {(["original_game_url", "developer_url", "steam_url", "itch_url"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>{field.replaceAll("_", " ")}</Label>
                  <Input id={field} name={field} type="url" value={form[field]} onChange={handleChange} />
                </div>
              ))}
              <div className="space-y-2"><Label htmlFor="official_website_url">Official Website URL</Label><Input id="official_website_url" name="official_website_url" type="url" value={form.official_website_url} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="steam_app_id">Steam App ID</Label><Input id="steam_app_id" name="steam_app_id" value={form.steam_app_id} onChange={handleChange} /></div>
              <div className="space-y-2"><Label htmlFor="itch_project_slug">itch.io Project Slug</Label><Input id="itch_project_slug" name="itch_project_slug" value={form.itch_project_slug} onChange={handleChange} /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="screenshots_text">Screenshot URLs</Label><Textarea id="screenshots_text" name="screenshots_text" value={form.screenshots_text} onChange={handleChange} rows={4} placeholder="One URL per line" /></div>
              <div className="space-y-2">
                <Label htmlFor="last_verified_at">Last Verified At</Label>
                <Input id="last_verified_at" name="last_verified_at" type="datetime-local" value={form.last_verified_at} onChange={handleChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="sources_text">Additional Sources</Label>
                <Textarea id="sources_text" name="sources_text" value={form.sources_text} onChange={handleChange} rows={3} placeholder="Steam | https://store.steampowered.com/... | 2026-08-29" />
                <p className="text-xs text-muted-foreground">One per line: type | URL | verified date.</p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              Publish gameplay facts only when they match a developer, Steam, itch.io, official repository, or another trusted source. Unverified Controls, Tips, Features, and mechanics stay hidden publicly.
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
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="content_verified" checked={form.content_verified} onChange={handleChange} className="accent-emerald-600" />
                Description and gameplay facts verified against sources
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
              <Button type="button" variant="outline" onClick={() => { if (dirty && !confirm("You have unsaved changes. Leave this page?")) return; router.back(); }}>Cancel</Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="bulk" className="mt-4 space-y-4">
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="font-semibold">Full game document</h2>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Copy this JSON, edit several fields, then paste it back. Categories, tags, and series use their slugs.
                  Unknown fields, missing fields, invalid types, and unknown taxonomy values are rejected before saving.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={refreshBulkText}>
                  <RefreshCw className="mr-1.5 h-4 w-4" />Reload from form
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={copyBulkText}>
                  <ClipboardCopy className="mr-1.5 h-4 w-4" />Copy JSON
                </Button>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-900 dark:text-amber-200">
              Fields inside <code>read_only</code> are included for reference but are never written. Use an empty string or empty array for unknown optional data; do not invent gameplay facts.
            </div>

            <Label htmlFor="bulk-game-json" className="mt-4 block text-xs font-bold">Formatted JSON</Label>
            <Textarea
              id="bulk-game-json"
              value={bulkText}
              onChange={(event) => {
                setBulkText(event.target.value);
                setBulkError("");
                setBulkMessage("");
              }}
              rows={34}
              spellCheck={false}
              className="mt-2 min-h-[36rem] resize-y whitespace-pre font-mono text-xs leading-5"
            />

            {bulkError && (
              <div role="alert" className="mt-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {bulkError}
              </div>
            )}
            {bulkMessage && (
              <div role="status" className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                {bulkMessage}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="button" variant="outline" onClick={applyBulkText} disabled={saving}>
                <Check className="mr-1.5 h-4 w-4" />Validate and apply to form
              </Button>
              <Button type="button" onClick={saveBulkText} disabled={saving}>
                <Save className="mr-1.5 h-4 w-4" />{saving ? "Saving..." : "Validate and save all fields"}
              </Button>
            </div>
          </div>
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
