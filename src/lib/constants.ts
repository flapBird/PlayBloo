export const SITE_NAME = "PlayBloo";
export const SITE_DOMAIN = "playbloo.net";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_DESCRIPTION = "Discover browser games and explore game guides on PlayBloo, with release dates, gameplay explainers and version comparisons.";

export const PAGE_SIZE = 24;
export const ADMIN_PAGE_SIZE = 20;
export const RELATED_GAMES_LIMIT = 6;
export const TOP_GAMES_LIMIT = 10;
export const RECENT_STATS_DAYS = 7;
export const MIN_INDEXABLE_CATEGORY_GAMES = 3;
export const MIN_INDEXABLE_SERIES_GAMES = 3;
export const MIN_INDEXABLE_TAG_GAMES = 3;
export const MAX_RECENTLY_PLAYED_GAMES = 25;
export const NEW_GAME_BADGE_DAYS = 14;
export const UPDATED_GAME_BADGE_DAYS = 30;

export const FAVORITES_STORAGE_KEY = "playbloo:favorites:v1";
export const RECENTLY_PLAYED_STORAGE_KEY = "playbloo:recently-played:v1";

export const HOT_SCORE_DECAY_FACTOR = 0.9;
export const HOT_SCORE_VIEW_WEIGHT = 1;
export const HOT_SCORE_PLAY_WEIGHT = 3;
export const HOT_SCORE_RECENCY_HOURS = 48;

export const GAME_CATEGORIES = [
  { name: "Action", slug: "action" },
  { name: "Arcade", slug: "arcade" },
  { name: "Driving", slug: "driving" },
  { name: "Idle", slug: "idle" },
  { name: "Puzzle", slug: "puzzle" },
  { name: "Racing", slug: "racing" },
  { name: "Strategy", slug: "strategy" },
  { name: "Survival", slug: "survival" },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/category" },
  { label: "Series", href: "/series" },
  { label: "New Games", href: "/search?sort=newest" },
  { label: "Trending", href: "/search?sort=trending" },
];
