"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronLeft, ChevronRight, ExternalLink, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

type Row = { id: string; source_url: string; source_type: string; developer_name: string | null; status: string; extraction_status: string; extracted_data: Record<string, unknown>; duplicate_game_id: string | null; created_at: string };

export default function AdminSubmissionsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState("pending_review");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    async function loadRows() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/admin/submissions?status=${status}&page=${page}`, { cache: "no-store", signal: controller.signal });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Could not load submissions.");
        setRows(payload.data || []);
        setTotal(payload.total || 0);
        setLimit(payload.limit || 30);
      } catch (loadError) {
        if (!(loadError instanceof DOMException && loadError.name === "AbortError")) {
          setError(loadError instanceof Error ? loadError.message : "Could not load submissions.");
          setRows([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadRows();
    return () => controller.abort();
  }, [status, page]);
  const pageCount = Math.max(1, Math.ceil(total / limit));
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Game Submissions</h1><p className="text-sm text-muted-foreground">Nothing is published until an admin approves it.</p></div>
      <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }} className="h-10 rounded-xl border bg-background px-3 text-sm"><option value="pending_review">Pending review</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="duplicate">Duplicates</option><option value="all">All</option></select>
    </div>
    {error && <p role="alert" className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    {loading ? <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p> : rows.length ? <div className="overflow-hidden rounded-2xl border bg-card">
      {rows.map((row) => <div key={row.id} className="flex flex-col gap-3 border-b p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate font-bold">{String(row.extracted_data?.title || row.developer_name || "Untitled submission")}</p><span className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{row.status.replace("_", " ")}</span>{row.duplicate_game_id && <span title="Possible duplicate"><AlertTriangle className="h-4 w-4 text-amber-500" /></span>}</div><a href={row.source_url} target="_blank" rel="noopener noreferrer" className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-primary">{row.source_type} · {row.source_url}<ExternalLink className="h-3 w-3 shrink-0" /></a><p className="mt-1 text-xs text-muted-foreground">Extraction: {row.extraction_status} · {new Date(row.created_at).toLocaleString()}</p></div>
        <Link href={`/admin/submissions/${row.id}`} className="shrink-0 rounded-xl border px-4 py-2 text-center text-sm font-bold hover:border-primary/40">Review</Link>
      </div>)}
    </div> : !error && <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground"><Inbox className="mx-auto mb-3 h-8 w-8" />No submissions in this state.</div>}
    {!loading && total > limit && <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground"><span>Page {page} of {pageCount} · {total} submissions</span><div className="flex gap-2"><Button type="button" variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button><Button type="button" variant="outline" size="sm" disabled={page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button></div></div>}
  </div>;
}
