"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Neighbor = { title: string; slug: string } | null;
export function GameNeighbors({ previous, next }: { previous: Neighbor; next: Neighbor }) {
  const router = useRouter();
  useEffect(() => { const handler = (event: KeyboardEvent) => { const target = event.target as HTMLElement | null; if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName || "") || document.activeElement instanceof HTMLIFrameElement) return; if (event.key === "ArrowLeft" && previous) router.push(`/game/${previous.slug}`); if (event.key === "ArrowRight" && next) router.push(`/game/${next.slug}`); }; window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler); }, [next, previous, router]);
  if (!previous && !next) return null;
  return <nav aria-label="Previous and next games" className="grid gap-3 sm:grid-cols-2">{previous ? <Link href={`/game/${previous.slug}`} className="group rounded-2xl border p-4 hover:border-primary/40"><span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"><ArrowLeft className="h-3 w-3" />Previous game</span><strong className="mt-1 block truncate group-hover:text-primary">{previous.title}</strong></Link> : <span />}{next && <Link href={`/game/${next.slug}`} className="group rounded-2xl border p-4 text-right hover:border-primary/40"><span className="flex items-center justify-end gap-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Next game<ArrowRight className="h-3 w-3" /></span><strong className="mt-1 block truncate group-hover:text-primary">{next.title}</strong></Link>}</nav>;
}
