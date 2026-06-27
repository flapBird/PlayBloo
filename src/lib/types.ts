export interface Game {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  cover_url: string | null;
  iframe_url: string;
  external_url: string | null;
  description: string | null;
  how_to_play: string | null;
  controls: string | null;
  tips: string | null;
  features: string | null;
  developer: string | null;
  publisher: string | null;
  release_date: string | null;
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
