import { NextRequest, NextResponse } from "next/server";
import { MIN_INDEXABLE_CATEGORY_GAMES } from "@/lib/constants";
import { getCachedCategoryCatalog } from "@/lib/discovery-data";

export async function GET(request: NextRequest) {
  const includeThin = new URL(request.url).searchParams.get("includeThin") === "1";
  const categories = (await getCachedCategoryCatalog())
    .filter((category) => includeThin || category.game_count >= MIN_INDEXABLE_CATEGORY_GAMES);
  return NextResponse.json(
    { data: categories },
    {
      headers: {
        "Cache-Control": includeThin
          ? "private, no-store"
          : "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400",
      },
    },
  );
}
