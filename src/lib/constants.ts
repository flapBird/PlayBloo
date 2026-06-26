export const SITE_NAME = "PlayBloo";
export const SITE_DOMAIN = "playbloo.org";
export const SITE_URL = `https://${SITE_DOMAIN}`;
export const SITE_DESCRIPTION = "Play free online games on PlayBloo.org. Discover thousands of exciting games including action, puzzle, driving, and more. No download required.";

export const PAGE_SIZE = 24;
export const ADMIN_PAGE_SIZE = 20;
export const RELATED_GAMES_LIMIT = 6;
export const TOP_GAMES_LIMIT = 10;
export const RECENT_STATS_DAYS = 7;

export const HOT_SCORE_DECAY_FACTOR = 0.9;
export const HOT_SCORE_VIEW_WEIGHT = 1;
export const HOT_SCORE_PLAY_WEIGHT = 3;
export const HOT_SCORE_RECENCY_HOURS = 48;

export const GAME_CATEGORIES = [
  { name: "Action", slug: "action" },
  { name: "Adventure", slug: "adventure" },
  { name: "Arcade", slug: "arcade" },
  { name: "Board Game", slug: "board-game" },
  { name: "Card", slug: "card" },
  { name: "Casual", slug: "casual" },
  { name: "Clicker", slug: "clicker" },
  { name: "Driving", slug: "driving" },
  { name: "Educational", slug: "educational" },
  { name: "Fighting", slug: "fighting" },
  { name: "Horror", slug: "horror" },
  { name: "Idle", slug: "idle" },
  { name: "Multiplayer", slug: "multiplayer" },
  { name: "Music", slug: "music" },
  { name: "Platformer", slug: "platformer" },
  { name: "Puzzle", slug: "puzzle" },
  { name: "Racing", slug: "racing" },
  { name: "RPG", slug: "rpg" },
  { name: "Shooting", slug: "shooting" },
  { name: "Simulation", slug: "simulation" },
  { name: "Sports", slug: "sports" },
  { name: "Strategy", slug: "strategy" },
  { name: "Survival", slug: "survival" },
  { name: "Trivia", slug: "trivia" },
];

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/category" },
  { label: "Series", href: "/series" },
  { label: "New Games", href: "/search?sort=newest" },
  { label: "Trending", href: "/search?sort=trending" },
];
