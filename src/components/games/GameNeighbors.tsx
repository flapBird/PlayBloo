"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Gamepad2 } from "lucide-react";

type Neighbor = { title: string; slug: string; thumbnail_url: string | null } | null;

function NeighborThumb({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <span className="grid h-14 w-20 shrink-0 place-items-center rounded-md border border-border/60 bg-muted/40"><Gamepad2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" /></span>;
  }
  return <Image src={src} alt="" width={80} height={56} loading="lazy" onError={() => setFailed(true)} className="h-14 w-20 shrink-0 rounded-md border border-border/60 object-cover" />;
}

export function GameNeighbors({ previous, next }: { previous: Neighbor; next: Neighbor }) {
  if (!previous && !next) return null;
  return <nav aria-label="Previous and next games" className="grid gap-3 lg:grid-cols-2">
    {previous && <Link href={`/game/${previous.slug}`} className="group flex items-center gap-3 rounded-2xl border p-4 hover:border-primary/40">
      <NeighborThumb src={previous.thumbnail_url} />
      <span className="min-w-0 flex-1"><span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground"><ArrowLeft className="h-3 w-3" />Previous game</span><strong className="mt-1 block truncate group-hover:text-primary">{previous.title}</strong></span>
    </Link>}
    {next && <Link href={`/game/${next.slug}`} className="group flex items-center gap-3 rounded-2xl border p-4 hover:border-primary/40">
      <NeighborThumb src={next.thumbnail_url} />
      <span className="min-w-0 flex-1"><span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Next game<ArrowRight className="h-3 w-3" /></span><strong className="mt-1 block truncate group-hover:text-primary">{next.title}</strong></span>
    </Link>}
  </nav>;
}
