import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SITE_NAME } from "@/lib/constants";

export const metadata = {
  title: "Game Categories",
  description: `Browse all game categories on ${SITE_NAME}. Find your favorite type of game.`,
};

export default async function CategoryListPage() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Game Categories</h1>
        <p className="text-muted-foreground">Browse games by category</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-4">
        {(categories || []).map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex items-center justify-center h-24 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span className="font-semibold text-sm text-center px-2">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
