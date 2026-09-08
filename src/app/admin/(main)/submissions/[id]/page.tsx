"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, Check, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ExtractedValue = string | string[] | undefined;
type Submission = { id: string; source_url: string; source_type: string; developer_name: string | null; notes: string | null; status: string; extraction_status: string; extraction_error: string | null; last_fetched_at: string | null; extracted_data: Record<string, ExtractedValue>; duplicate_game: { id: string; title: string; slug: string } | null };
const textFields = [
  ["title", "Title"], ["slug", "Slug"], ["developer", "Developer"], ["publisher", "Publisher"],
  ["thumbnail_url", "Thumbnail URL"], ["cover_url", "Cover URL"], ["iframe_url", "Embed URL"], ["external_url", "External play URL"],
  ["official_website_url", "Official website"], ["release_date", "Release date"], ["last_updated_at", "Last updated"],
  ["monetization", "Monetization"], ["development_status", "Development status"], ["graphics", "Graphics"], ["multiplayer", "Multiplayer"], ["engine", "Engine"],
] as const;

export default function ReviewSubmissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [data, setData] = useState<Record<string, ExtractedValue>>({});
  const [developerName, setDeveloperName] = useState("");
  const [notes, setNotes] = useState("");
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function loadSubmission() {
      try {
        const response = await fetch(`/api/admin/submissions?id=${id}`, { cache: "no-store", signal: controller.signal });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Could not load this submission.");
        const value = payload.data as Submission;
        setSubmission(value);
        setData(value?.extracted_data || {});
        setDeveloperName(value?.developer_name || "");
        setNotes(value?.notes || "");
      } catch (loadError) {
        if (!(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(loadError instanceof Error ? loadError.message : "Could not load this submission.");
        }
      }
    }
    loadSubmission();
    return () => controller.abort();
  }, [id]);

  async function act(action: string) {
    const confirmations: Record<string, string> = {
      approve: "Approve and publish this game now?",
      duplicate: "Mark this submission as a duplicate?",
      reject: "Reject this submission? This removes it from the active review queue.",
    };
    if (confirmations[action] && !window.confirm(confirmations[action])) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/submissions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action, extractedData: data, developerName, notes, contentVerified: verified }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Action failed.");
      if (action === "save") {
        setNotice("Review changes saved.");
        return;
      }
      if (action === "dismiss_duplicate") {
        setSubmission((current) => current ? { ...current, duplicate_game: null } : current);
        setNotice("Possible duplicate cleared. You can now approve after verifying the source.");
        return;
      }
      router.push("/admin/submissions");
      router.refresh();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  }
  if (!submission) return <p role={error ? "alert" : undefined} className={error ? "rounded-xl bg-destructive/10 p-4 text-center text-sm text-destructive" : "py-10 text-center text-muted-foreground"}>{error || "Loading…"}</p>;
  const readOnly = submission.status !== "pending_review";
  return <div className="max-w-4xl space-y-6">
    <Link href="/admin/submissions" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to submissions</Link>
    <div><div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-bold">Review submission</h1><span className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{submission.extraction_status}</span></div><p className="mt-1 break-all text-sm text-muted-foreground">{submission.source_type} · <a href={submission.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{submission.source_url}</a></p><p className="mt-1 text-xs text-muted-foreground">Last source fetch: {submission.last_fetched_at ? new Date(submission.last_fetched_at).toLocaleString() : "Not completed"}</p></div>
    {submission.duplicate_game && <div className="flex flex-col gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100 sm:flex-row sm:items-center"><AlertTriangle className="h-5 w-5 shrink-0" /><div className="flex-1"><strong>Possible duplicate:</strong> <Link className="underline" href={`/game/${submission.duplicate_game.slug}`}>{submission.duplicate_game.title}</Link>. Compare both pages before deciding.</div><Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => act("dismiss_duplicate")}>Not a duplicate</Button></div>}
    {submission.extraction_error && <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Extraction {submission.extraction_status}: {submission.extraction_error}</div>}
    <div className="grid gap-5 rounded-2xl border bg-card p-5 sm:grid-cols-2">
      {textFields.map(([key, label]) => <div key={key} className="space-y-2"><Label htmlFor={key}>{label}</Label><Input id={key} value={data[key] || ""} disabled={readOnly} onChange={(event) => setData((value) => ({ ...value, [key]: event.target.value }))} /></div>)}
      {[["platforms", "Platforms"], ["categories", "Categories"], ["tags", "Tags"], ["screenshots", "Screenshot URLs"]].map(([key, label]) => <div key={key} className="space-y-2"><Label htmlFor={key}>{label} (comma-separated)</Label><Input id={key} value={Array.isArray(data[key]) ? data[key].join(", ") : data[key] || ""} disabled={readOnly} onChange={(event) => setData((value) => ({ ...value, [key]: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))} /></div>)}
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="short_description">Short description</Label><Textarea id="short_description" value={data.short_description || ""} disabled={readOnly} onChange={(event) => setData((value) => ({ ...value, short_description: event.target.value }))} /></div>
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" rows={8} value={data.description || ""} disabled={readOnly} onChange={(event) => setData((value) => ({ ...value, description: event.target.value }))} /></div>
      <div className="space-y-2"><Label htmlFor="developerName">Submitted developer name</Label><Input id="developerName" value={developerName} disabled={readOnly} onChange={(event) => setDeveloperName(event.target.value)} /></div>
      <div className="space-y-2 sm:col-span-2"><Label htmlFor="notes">Submitter notes</Label><Textarea id="notes" value={notes} disabled={readOnly} onChange={(event) => setNotes(event.target.value)} /></div>
      {!readOnly && <label className="flex items-start gap-3 sm:col-span-2"><input type="checkbox" checked={verified} onChange={(event) => setVerified(event.target.checked)} className="mt-1" /><span className="text-sm"><strong>Mark imported descriptive content as verified</strong><br/><span className="text-muted-foreground">Only enable this after comparing the fields above with the linked source. Otherwise factual content remains hidden publicly.</span></span></label>}
    </div>
    {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    {notice && <p role="status" aria-live="polite" className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}
    {!readOnly && <div className="flex flex-wrap gap-3"><Button variant="outline" disabled={busy} onClick={() => act("save")}><Save className="mr-2 h-4 w-4" />Save review</Button><Button disabled={busy || Boolean(submission.duplicate_game)} onClick={() => act("approve")}><Check className="mr-2 h-4 w-4" />Approve & publish</Button><Button variant="outline" disabled={busy} onClick={() => act("duplicate")}><AlertTriangle className="mr-2 h-4 w-4" />Mark duplicate</Button><Button variant="destructive" disabled={busy} onClick={() => act("reject")}><X className="mr-2 h-4 w-4" />Reject</Button></div>}
  </div>;
}
