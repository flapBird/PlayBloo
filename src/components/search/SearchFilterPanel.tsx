"use client";

import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface PublicSearchFilters { q: string; sort: string; category?: string; playMode: string; platform?: string; price?: string; status?: string; page: number; view: "list" | "grid" }
export interface FilterOptions { categories: { id: string; name: string }[]; platforms: string[]; prices: string[]; statuses: string[]; hasReleaseDates: boolean; hasUpdates: boolean }

function Fields({ filters, options }: { filters: PublicSearchFilters; options: FilterOptions }) {
  const field = "h-11 w-full rounded-xl border bg-background px-3 text-sm";
  return <>
    <label className="relative"><span className="mb-1.5 block text-xs font-bold">Search</span><Search className="absolute bottom-3.5 left-3.5 h-4 w-4 text-muted-foreground" /><input name="q" type="search" defaultValue={filters.q} placeholder="Name, developer, genre or tag" className={`${field} pl-10`} /></label>
    <label><span className="mb-1.5 block text-xs font-bold">Genre</span><select name="category" defaultValue={filters.category || ""} className={field}><option value="">All genres</option>{options.categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
    <label><span className="mb-1.5 block text-xs font-bold">Playable</span><select name="playMode" defaultValue={filters.playMode} className={field}><option value="all">All games</option><option value="embedded">Playable Here</option></select></label>
    {options.platforms.length > 0 && <label><span className="mb-1.5 block text-xs font-bold">Platform</span><select name="platform" defaultValue={filters.platform || ""} className={field}><option value="">All platforms</option>{options.platforms.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>}
    {options.prices.length > 0 && <label><span className="mb-1.5 block text-xs font-bold">Price</span><select name="price" defaultValue={filters.price || ""} className={field}><option value="">Any price</option>{options.prices.includes("free") && <option value="free">Free</option>}{options.prices.includes("paid") && <option value="paid">Paid</option>}</select></label>}
    {options.statuses.length > 0 && <label><span className="mb-1.5 block text-xs font-bold">Status</span><select name="status" defaultValue={filters.status || ""} className={field}><option value="">Any status</option>{options.statuses.map((item) => <option key={item} value={item}>{item.replace("-", " ")}</option>)}</select></label>}
    <label><span className="mb-1.5 block text-xs font-bold">Sort</span><select name="sort" defaultValue={filters.sort} className={field}><option value="newest">Newest Added</option>{(options.hasReleaseDates || filters.sort === "released") && <option value="released">Recently Released</option>}{(options.hasUpdates || filters.sort === "recently-updated") && <option value="recently-updated">Recently Updated</option>}<option value="trending">Trending</option><option value="popular">Popular</option><option value="hidden-gems">Hidden Gems</option></select></label>
  </>;
}

function Form({ filters, options, mobile = false }: { filters: PublicSearchFilters; options: FilterOptions; mobile?: boolean }) {
  return <form action="/search" method="get" className={mobile ? "grid gap-4" : "grid gap-4 rounded-xl border bg-card p-4"}><input type="hidden" name="view" value={filters.view} /><Fields filters={filters} options={options} /><Button type="submit" className="w-full"><Filter className="mr-2 h-4 w-4" />Apply filters</Button></form>;
}

export function SearchFilterPanel({ filters, options }: { filters: PublicSearchFilters; options: FilterOptions }) {
  return <><aside className="hidden md:block"><Form filters={filters} options={options} /></aside><div className="md:hidden"><Dialog><DialogTrigger asChild><Button variant="outline" className="w-full"><Filter className="mr-2 h-4 w-4" />Filters</Button></DialogTrigger><DialogContent className="inset-x-0 bottom-0 top-auto max-h-[88vh] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-t-3xl border-x-0 border-b-0 p-5 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"><DialogHeader><DialogTitle>Filter games</DialogTitle></DialogHeader><Form filters={filters} options={options} mobile /></DialogContent></Dialog></div></>;
}

export function ActiveFilterChips({ filters }: { filters: PublicSearchFilters }) {
  const chips = [["q", filters.q], ["category", filters.category], ["playMode", filters.playMode === "embedded" ? "Playable Here" : ""], ["platform", filters.platform], ["price", filters.price], ["status", filters.status]].filter((item) => item[1]);
  if (!chips.length) return null;
  return <div className="flex flex-wrap items-center gap-2">{chips.map(([key, label]) => <span key={key} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{label}</span>)}<a href="/search" className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground"><X className="h-3 w-3" />Clear all</a></div>;
}
