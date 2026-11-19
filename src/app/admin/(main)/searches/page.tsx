import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { SearchX } from "lucide-react";

export const dynamic = "force-dynamic";

const RANGE_DAYS = [7, 30, 90] as const;
const SORT_MODES = ["hits", "recent"] as const;
const MAX_TABLE_ROWS = 50;
const MAX_ROWS_SCANNED = 5000;

type SortMode = (typeof SORT_MODES)[number];

interface SearchLogRow {
  query: string;
  source: string;
  referrer: string | null;
  created_at: string;
}

interface AggregatedQuery {
  query: string;
  attempts: number;
  lastSeen: string;
}

interface SearchesData {
  rangeDays: number;
  sort: SortMode;
  zeroSearches: AggregatedQuery[];
  notFoundSlugs: AggregatedQuery[];
  zeroSearchEvents: number;
  notFoundEvents: number;
  totalRows: number;
}

function aggregate(rows: SearchLogRow[], sort: SortMode): AggregatedQuery[] {
  const groups = new Map<string, AggregatedQuery>();
  for (const row of rows) {
    // Group case-insensitively: "Sonic" and "sonic" are the same demand.
    const key = row.query.toLowerCase();
    const group = groups.get(key);
    if (group) {
      group.attempts += 1;
      if (row.created_at > group.lastSeen) group.lastSeen = row.created_at;
    } else {
      groups.set(key, { query: row.query, attempts: 1, lastSeen: row.created_at });
    }
  }
  // "hits" ranks by demand volume; "recent" surfaces what visitors searched
  // for lately, day by day, regardless of how often it repeats.
  return [...groups.values()]
    .sort((a, b) =>
      sort === "recent"
        ? b.lastSeen.localeCompare(a.lastSeen) || b.attempts - a.attempts
        : b.attempts - a.attempts || a.query.localeCompare(b.query),
    )
    .slice(0, MAX_TABLE_ROWS);
}

function formatWhen(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16).replace("T", " ");
}

async function getSearchesData(rangeDays: number, sort: SortMode): Promise<SearchesData | null> {
  const since = new Date(Date.now() - rangeDays * 86_400_000).toISOString();
  const { data, error } = await createAdminClient()
    .from("search_query_logs")
    .select("query, source, referrer, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(MAX_ROWS_SCANNED);

  if (error) {
    // Migration 00010 has not been applied yet, most likely. Degrade instead
    // of crashing the admin page.
    console.error("Searches page query failed:", error.message);
    return null;
  }

  const rows = (data || []) as SearchLogRow[];
  const zeroSearchRows = rows.filter((row) => row.source === "search_zero");
  const notFoundRows = rows.filter((row) => row.source === "game_404");
  return {
    rangeDays,
    sort,
    zeroSearches: aggregate(zeroSearchRows, sort),
    notFoundSlugs: aggregate(notFoundRows, sort),
    zeroSearchEvents: zeroSearchRows.length,
    notFoundEvents: notFoundRows.length,
    totalRows: rows.length,
  };
}

function SummaryCard({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function AggregateTable({ title, description, entityLabel, rows, emptyText }: { title: string; description: string; entityLabel: string; rows: AggregatedQuery[]; emptyText: string }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="font-bold">{title}</h2>
      <p className="mt-0.5 mb-4 text-xs text-muted-foreground">{description}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 pr-4 font-semibold">{entityLabel}</th>
              <th className="py-2 pr-4 font-semibold">Hits</th>
              <th className="py-2 font-semibold">Last seen (UTC)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.query} className="border-b last:border-0">
                <td className="py-2 pr-4 font-medium break-all">{row.query}</td>
                <td className="py-2 pr-4 tabular-nums">{row.attempts}</td>
                <td className="py-2 whitespace-nowrap text-muted-foreground">{formatWhen(row.lastSeen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default async function AdminSearches({ searchParams }: { searchParams: Promise<{ days?: string; sort?: string }> }) {
  const { days, sort } = await searchParams;
  const requestedDays = Number(days);
  const rangeDays = (RANGE_DAYS as readonly number[]).includes(requestedDays) ? requestedDays : 30;
  const sortMode: SortMode = sort === "recent" ? "recent" : "hits";
  const data = await getSearchesData(rangeDays, sortMode);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <SearchX className="h-6 w-6" /> Searches
        </h1>
        <p className="text-sm text-muted-foreground">
          What visitors look for and do not find: zero-result search terms and not-found game URLs
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Range:</span>
          {RANGE_DAYS.map((option) => (
            <Link
              key={option}
              href={`/admin/searches?days=${option}&sort=${sortMode}`}
              className={`rounded-lg border px-3 py-1.5 font-semibold transition-colors ${option === rangeDays ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {option}d
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Sort:</span>
          {SORT_MODES.map((option) => (
            <Link
              key={option}
              href={`/admin/searches?days=${rangeDays}&sort=${option}`}
              className={`rounded-lg border px-3 py-1.5 font-semibold transition-colors ${option === sortMode ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {option === "hits" ? "Hits" : "Recent"}
            </Link>
          ))}
        </div>
      </div>

      {!data ? (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          The search_query_logs table is not readable. Make sure migration 00010 has been applied to this Supabase project.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard label="Zero-result searches" value={data.zeroSearchEvents} hint={`${data.zeroSearches.length} unique terms shown (top ${MAX_TABLE_ROWS})`} />
            <SummaryCard label="Not-found game URLs" value={data.notFoundEvents} hint={`${data.notFoundSlugs.length} unique paths shown (top ${MAX_TABLE_ROWS})`} />
            <SummaryCard label="Logged events" value={data.totalRows} hint={`Last ${rangeDays} days, first ${MAX_ROWS_SCANNED} scanned`} />
          </div>

          <AggregateTable
            title="Zero-result search terms"
            description="Submitted searches that matched no published game. Prime candidates for new games, aliases or tag fixes."
            entityLabel="Search term"
            rows={data.zeroSearches}
            emptyText="No zero-result searches in this range."
          />
          <AggregateTable
            title="Not-found game URLs"
            description="Game and level slugs that visitors still request without a published game behind them. Mostly stale indexed or shared links."
            entityLabel="Not-found path"
            rows={data.notFoundSlugs}
            emptyText="No not-found game URLs in this range."
          />
        </>
      )}
    </div>
  );
}
