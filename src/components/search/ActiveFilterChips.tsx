import { X } from "lucide-react";

export interface PublicSearchFilters { q: string; sort: string; category?: string; playMode: string; platform?: string; price?: string; status?: string; page: number; view: "list" | "grid" }
export interface FilterOptions { categories: { id: string; name: string }[]; platforms: string[]; prices: string[]; statuses: string[]; hasReleaseDates: boolean; hasUpdates: boolean }

function optionLabel(value: string) {
  const names: Record<string, string> = { android: "Android", ios: "iOS", macos: "macOS", windows: "Windows", browser: "Browser", desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" };
  return names[value.toLowerCase()] || value.charAt(0).toUpperCase() + value.slice(1).replaceAll("-", " ");
}

export function ActiveFilterChips({ filters, options }: { filters: PublicSearchFilters; options: FilterOptions }) {
  const category = options.categories.find((item) => item.id === filters.category);
  const chips = [["q", filters.q], ["category", filters.category ? category?.name || "Selected genre" : ""], ["playMode", filters.playMode === "embedded" ? "Playable Here" : ""], ["platform", filters.platform ? optionLabel(filters.platform) : ""], ["price", filters.price ? optionLabel(filters.price) : ""], ["status", filters.status ? optionLabel(filters.status) : ""]].filter((item) => item[1]);
  if (!chips.length) return null;
  const hrefWithout = (removed: string[]) => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== "page" && !removed.includes(key) && value !== undefined && value !== "") query.set(key, String(value));
    });
    return `/search?${query.toString()}`;
  };
  return <div className="flex min-w-0 flex-wrap items-center gap-2">
    {chips.map(([key, label]) => <a key={key} href={hrefWithout([key!])} aria-label={`Remove ${label} filter`} className="inline-flex min-h-9 max-w-full items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/20"><span className="break-words">{label}</span><X className="h-3 w-3 shrink-0" aria-hidden="true" /></a>)}
    <a href={hrefWithout(chips.map(([key]) => key!))} className="inline-flex min-h-9 items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground">Clear all</a>
  </div>;
}
