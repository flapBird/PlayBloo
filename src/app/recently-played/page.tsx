import type { Metadata } from "next";
import { SavedGamesGrid } from "@/components/library/SavedGamesGrid";

export const metadata: Metadata = {
  title: "Recently Played",
  robots: { index: false, follow: true },
};

export default function RecentlyPlayedPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-10 md:py-14">
      <div>
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Jump back in</p>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">Recently Played</h1>
        <p className="mt-3 text-muted-foreground">Only games you explicitly launched appear here.</p>
      </div>
      <SavedGamesGrid kind="recent" />
    </div>
  );
}
