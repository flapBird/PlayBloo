import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MIN_INDEXABLE_CATEGORY_GAMES, SITE_NAME } from "@/lib/constants";
import { ArrowUpRight, LayoutGrid } from "lucide-react";

export const metadata = {
  title: "Game Categories",
  description: `Browse all game categories on ${SITE_NAME}. Find your favorite type of game.`,
   alternates: {
     canonical: "/category",
   },
};

export default async function CategoryListPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: categories }, { data: games }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true }),
    supabase
      .from("games")
      .select("categories:game_categories(category_id)")
      .eq("is_published", true),
  ]);

  const categoryCounts = new Map<string, number>();
  for (const game of games || []) {
    for (const membership of game.categories || []) {
      categoryCounts.set(
        membership.category_id,
        (categoryCounts.get(membership.category_id) || 0) + 1,
      );
    }
  }

  const visibleCategories = (categories || []).filter(
    (category) => (categoryCounts.get(category.id) || 0) >= MIN_INDEXABLE_CATEGORY_GAMES,
  );

  return (
    <div className="container mx-auto space-y-8 px-4 py-8 md:py-10">
      <div className="genre-panel flex items-center gap-4 rounded-[1.75rem] p-6 md:p-8">
        <span className="brand-mark grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white">
          <LayoutGrid className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Find your favorite</p>
          <h1 className="text-3xl font-black tracking-tight">Game Categories</h1>
          <p className="text-sm text-muted-foreground">Browse games by category</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {visibleCategories.map((cat, index) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`group category-tile category-tile-${index % 6}`}
          >
            <span>{cat.name}</span>
            <ArrowUpRight className="h-4 w-4 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
