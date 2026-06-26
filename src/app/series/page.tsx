import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SITE_NAME } from "@/lib/constants";

export const metadata = {
  title: "Game Series",
  description: `Browse all game series on ${SITE_NAME}. Play complete game collections.`,
};

export default async function SeriesListPage() {
  const supabase = await createServerSupabaseClient();
  const { data: series } = await supabase
    .from("series")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Game Series</h1>
        <p className="text-muted-foreground">Browse games by series</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {(series || []).map((s) => (
          <Link
            key={s.id}
            href={`/series/${s.slug}`}
            className="flex items-center justify-center h-24 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span className="font-semibold text-sm text-center px-2">{s.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
