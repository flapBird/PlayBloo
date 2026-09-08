import { ExternalLink, History } from "lucide-react";
import type { GameUpdate } from "@/lib/types";

function safeSourceUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function Item({ update }: { update: GameUpdate }) { const sourceUrl = safeSourceUrl(update.source_url); return <article className="border-b py-4 last:border-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold">{update.title}</h3>{update.version && <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{update.version}</span>}</div><time className="mt-1 block text-xs text-muted-foreground" dateTime={update.published_at}>{new Date(update.published_at).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}</time>{update.summary && <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{update.summary}</p>}{sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">Update source<ExternalLink className="h-3 w-3" /></a>}</article>; }
export function GameUpdates({ updates }: { updates: GameUpdate[] }) { if (!updates.length) return null; return <section><h2 className="mb-2 flex items-center gap-2 text-xl font-bold"><History className="h-5 w-5 text-primary" />Latest Updates</h2><div className="rounded-2xl border px-4">{updates.slice(0, 3).map((item) => <Item key={item.id} update={item} />)}{updates.length > 3 && <details><summary className="cursor-pointer py-4 text-sm font-bold text-primary">View all {updates.length} updates</summary>{updates.slice(3).map((item) => <Item key={item.id} update={item} />)}</details>}</div></section>; }
