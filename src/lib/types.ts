export interface Game {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  cover_url: string | null;
  iframe_url: string | null;
  external_url: string | null;
  description: string | null;
  how_to_play: string | null;
  controls: string | null;
  tips: string | null;
  features: string | null;
  developer: string | null;
  publisher: string | null;
  source_url?: string | null;
  source_type?: string | null;
  original_game_url?: string | null;
  developer_url?: string | null;
  steam_url?: string | null;
  itch_url?: string | null;
  last_verified_at?: string | null;
  sources?: GameSource[] | null;
  content_verified?: boolean;
  release_date: string | null;
  added_at?: string;
  last_updated_at?: string | null;
  short_description?: string | null;
  official_website_url?: string | null;
  steam_app_id?: string | null;
  itch_project_slug?: string | null;
  platforms?: string[];
  monetization?: "free" | "free-with-ads" | "freemium" | "paid" | null;
  development_status?: "upcoming" | "demo" | "early-access" | "released" | "discontinued" | null;
  graphics?: string | null;
  multiplayer?: string | null;
  engine?: string | null;
  screenshots?: string[];
  external_click_count?: number;
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  view_count: number;
  play_count: number;
  hot_score: number;
  created_at: string;
  updated_at: string;
  categories?: Category[];
  tags?: Tag[];
  series?: Series[];
}

export interface GameUpdate {
  id: string;
  game_id: string;
  version: string | null;
  title: string;
  summary: string | null;
  published_at: string;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GameSource {
  type: string;
  url: string;
  verifiedAt: string | null;
}

export type GamePlayMode = "embedded" | "external" | "unavailable";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  content_verified?: boolean;
  source_url?: string | null;
  last_verified_at?: string | null;
  game_count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  game_count?: number;
}

export interface Series {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  content_verified?: boolean;
  source_url?: string | null;
  last_verified_at?: string | null;
  game_count?: number;
}

export interface GameWithRelations extends Game {
  categories: Category[];
  tags: Tag[];
  series: Series[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DailyStat {
  date: string;
  view_count: number;
  play_count: number;
}

export interface DashboardStats {
  total_games: number;
  total_categories: number;
  total_tags: number;
  total_series: number;
  recent_games: Game[];
  popular_games: Game[];
  recent_stats: DailyStat[];
}
