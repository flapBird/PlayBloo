import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookmarkCheck, LineChart, Smartphone } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

// Rendered title stays inside the AGENTS.md 60-char limit including the
// " | PlayBloo" suffix; the description stays inside 160 chars.
export const metadata: Metadata = {
  title: "Free Gaming Tools: Trackers and Counters",
  description:
    "PlayBloo's free browser tools: count Fortnite Treasure Hunters chests with auto-save and live Pirate Token odds — no account, nothing uploaded.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "Free Gaming Tools: Trackers and Counters | PlayBloo",
    description:
      "PlayBloo's free browser tools: count Fortnite Treasure Hunters chests with auto-save and live Pirate Token odds — no account, nothing uploaded.",
    url: "/tools",
    type: "website",
    images: [{ url: "/images/guides/fortnite-pirate-token.webp", width: 1600, height: 900, alt: "An illustrated Fortnite treasure map on a ship's table" }],
  },
};

export default function ToolsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Free tools</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">PlayBloo Tools</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Small, honest browser utilities built for the moments a game leaves a gap. Everything runs in your browser —
          no account, nothing uploaded, nothing to install.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/tools/fortnite-chest-counter"
          prefetch={false}
          className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <div className="relative aspect-video overflow-hidden">
            <Image
              src="/images/guides/fortnite-pirate-token.webp"
              alt="An illustrated Fortnite treasure map on a ship's table, the cover of the Fortnite Chest Counter tool"
              width={800}
              height={450}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary">Free tool</p>
            <h2 className="text-base font-extrabold tracking-tight">Fortnite Chest Counter</h2>
            <p className="text-sm text-muted-foreground">
              A tap-to-count tally for the Treasure Hunters mini-season, with your live Pirate Token odds at every chest.
            </p>
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-2 text-[11px] font-bold text-muted-foreground">
              <li className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                <BookmarkCheck className="h-3 w-3" aria-hidden="true" /> Auto-save
              </li>
              <li className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                <LineChart className="h-3 w-3" aria-hidden="true" /> Live odds
              </li>
              <li className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                <Smartphone className="h-3 w-3" aria-hidden="true" /> Mid-match ready
              </li>
            </ul>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-extrabold text-primary">
              Open tool
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </span>
          </div>
        </Link>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        One tool so far — the shelf grows when a season demands the next one. If a grind needs a tracker, tell us via{" "}
        <Link href="/contact" prefetch={false} className="font-bold text-primary hover:underline">Contact</Link> or{" "}
        <Link href="/submit-game" prefetch={false} className="font-bold text-primary hover:underline">Submit a Game</Link>.
      </p>

      <BreadcrumbJsonLd
        items={[
          { name: SITE_NAME, url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
        ]}
      />
    </div>
  );
}
