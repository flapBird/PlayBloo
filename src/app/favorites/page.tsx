import type { Metadata } from "next";
import { SavedGamesGrid } from "@/components/library/SavedGamesGrid";

export const metadata: Metadata = {
  title: "Your Favorites",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-10 md:py-14">
      <div>
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Your library</p>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">Your Favorites</h1>
        <p className="mt-3 text-muted-foreground">Saved in this browser. No account required.</p>
      </div>
      <SavedGamesGrid kind="favorites" />
    </div>
  );
}
