/**
 * Client-safe Game Gacha constants and types, shared by the server pool
 * builder (`gacha.ts`), the browser-local library (`gacha-library.ts`) and
 * the gacha UI. Nothing in here may import server-only modules.
 */

export type GachaRarity = "common" | "rare" | "epic" | "legendary";

export const GACHA_RARITY_ORDER: GachaRarity[] = ["legendary", "epic", "rare", "common"];

export interface GachaRarityInfo {
  id: GachaRarity;
  label: string;
  /** Published per-card chance for a standard pack, in percent. */
  odds: number;
}

export const GACHA_RARITIES: GachaRarityInfo[] = [
  { id: "legendary", label: "Legendary", odds: 3 },
  { id: "epic", label: "Epic", odds: 12 },
  { id: "rare", label: "Rare", odds: 25 },
  { id: "common", label: "Common", odds: 60 },
];

export interface GachaPoolGame {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  rarity: GachaRarity;
}

export interface GachaTheme {
  slug: string;
  name: string;
}

export interface GachaData {
  pool: GachaPoolGame[];
  theme: GachaTheme | null;
  totalGames: number;
  counts: Record<GachaRarity, number>;
}
