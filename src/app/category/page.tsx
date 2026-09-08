import Link from "next/link";
import { MIN_INDEXABLE_CATEGORY_GAMES, SITE_NAME } from "@/lib/constants";
import { getCachedCategoryCatalog } from "@/lib/discovery-data";
import { ArrowRight, LayoutGrid } from "lucide-react";

export const metadata = {
  title: "Game Categories",
  description: `Browse all game categories on ${SITE_NAME}. Find your favorite type of game.`,
   alternates: {
     canonical: "/category",
   },
};

export const revalidate = 1800;

export default async function CategoryListPage() {
  const visibleCategories = (await getCachedCategoryCatalog()).filter(
    (category) => category.game_count >= MIN_INDEXABLE_CATEGORY_GAMES,
  );

  return (
    <div className="container mx-auto space-y-8 px-4 py-8 md:py-10">
      <div className="flex items-center gap-4 border-b pb-6">
        <span className="brand-mark grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white">
          <LayoutGrid className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Find your favorite</p>
          <h1 className="text-3xl font-black tracking-tight">Game Categories</h1>
          <p className="text-sm text-muted-foreground">Browse games by category</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex min-h-20 items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary/45"
          >
            <span>
              <span className="block font-extrabold transition-colors group-hover:text-primary">{cat.name}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{cat.game_count} games</span>
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
