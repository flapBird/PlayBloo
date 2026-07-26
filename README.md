# PlayBloo

> Free online browser games platform — [https://playbloo.net/](https://playbloo.net/)

PlayBloo is a curated browser-based game discovery platform. It focuses on showcasing embedded games in a clean, minimal interface with fast load times and no clutter.

## Features

### Game discovery
- **Browse and search** — Games are organized by category (Action, Puzzle, Driving, Strategy, 20+ more), tags, and curated series.
- **Trending and new** — Homepage sections for newly added games and most popular titles.
- **Continue Playing** — Recently played games are persisted locally, so you can pick up where you left off.

### Game pages
- **Embedded play** — Games load in an iframe directly on the page, no external redirects or pop-ups. Games hosted externally get a play button that opens in a new tab.
- **Walkthroughs** — Some games include level-by-level walkthroughs with video guides for the trickiest stages.
- **Game metadata** — View counts, play counts, descriptions, controls, tips, features, and how-to-play for every game.

### Admin panel
A full admin dashboard at `/admin` (login-protected):

- **Game management** — Add, edit, delete and publish/unpublish games with full metadata (description, controls, tips, features, developer, publisher, release date).
- **Category, tag and series management** — CRUD for all taxonomies with sort ordering.
- **Level management** — Create and edit level walkthroughs for games.
- **Bulk import** — Import games from CSV files.
- **Dashboard** — Overview with total counts, recent games, most-viewed games, and daily view/play stats over the last 7 days (powered by Recharts).
- **SEO metadata** — Set custom meta titles and descriptions per category and series.

### Technical highlights
- **Next.js 16 App Router** — Server components, streaming metadata, and dynamic rendering where needed.
- **Supabase backend** — PostgreSQL database with row-level security, real-time stats, and admin API.
- **Structured data** — JSON-LD (WebSite, VideoGame, BreadcrumbList, CreativeWorkSeries) for search engines.
- **Sitemap** — Dynamic XML sitemap covering all games, categories, tags, series, and levels.
- **Canonical URLs** — Every page has a self-referencing canonical link.
- **Tailwind CSS 4** — Custom design with light UI, responsive grids, and hover effects.
- **Radix UI primitives** — Accessible dialog, select, tabs, dropdown, toast, and switch components.
- **TypeScript** — Full type coverage with shared types across components and API routes.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4, tailwindcss-animate |
| UI | Radix UI primitives, Lucide icons |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + admin_users table |
| Charts | Recharts |
 | Font | Geist (Geist Sans + Geist Mono) |

## Project structure

```
src/
├── app/
│   ├── page.tsx             — Homepage (new games, popular, categories, series)
│   ├── layout.tsx           — Root layout (fonts, analytics, structured data)
│   ├── about/               — About page
│   ├── category/            — Category listing + [slug] detail with game grid
│   ├── contact/             — Contact page
│   ├── game/                — Game detail, level index, level detail
│   ├── privacy/             — Privacy policy
│   ├── terms/               — Terms of service
│   ├── series/              — Series listing + [slug] detail
│   ├── tag/                 — Tag detail with game grid
│   ├── search/              — Search with sort (newest/popular) and category filter
│   ├── admin/               — Admin panel (login, dashboard, CRUD)
│   ├── api/                 — Route handlers (games, categories, tags, series, stats, admin)
│   ├── sitemap.ts           — Dynamic sitemap generation
│   ├── robots.ts            — Robots.txt
│   └── not-found.tsx        — 404 page
├── components/
│   ├── games/               — GameCard, GameIframe
│   ├── home/                — ContinuePlaying
│   ├── layout/              — Header, Footer
│   ├── levels/              — LevelEpisodes, LevelSearch
│   ├── seo/                 — JsonLd helpers (WebSite, Game, BreadcrumbList)
│   └── ui/                  — Button, Card, Dialog, Select, Tabs, etc.
├── lib/
│   ├── constants.ts         — Site config, categories, navigation
│   ├── types.ts              — Shared TypeScript interfaces
│   ├── utils.ts              — Tailwind class merge utility
│   ├── play-history.ts       — LocalStorage play history
│   └── supabase/             — Admin, server, and client Supabase clients
└── supabase/migrations/      — Database schema migrations
```

## Getting started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Database

The project uses Supabase as its database. Migrations live in `supabase/migrations/`:

- `00001_schema.sql` — Core tables: games, categories, tags, series, game_categories, game_tags, game_series, game_levels, admin_users, game_stats_daily
- `00002_add_video_url.sql` — Adds video_url column to game_levels

## License

Private project.
