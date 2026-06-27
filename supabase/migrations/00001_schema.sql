-- PlayBloo.org Database Schema

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags(name);

-- Series
CREATE TABLE series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_series_slug ON series(slug);
CREATE INDEX idx_series_sort_order ON series(sort_order);

-- Games
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  thumbnail_url TEXT,
  cover_url TEXT,
  iframe_url TEXT NOT NULL,
  description TEXT,
  how_to_play TEXT,
  controls TEXT,
  tips TEXT,
  features TEXT,
  release_date DATE,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  play_count INTEGER NOT NULL DEFAULT 0,
  hot_score NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_games_slug ON games(slug);
CREATE INDEX idx_games_is_published ON games(is_published);
CREATE INDEX idx_games_is_featured ON games(is_featured) WHERE is_featured = true;
CREATE INDEX idx_games_is_trending ON games(is_trending) WHERE is_trending = true;
CREATE INDEX idx_games_hot_score ON games(hot_score DESC);
CREATE INDEX idx_games_view_count ON games(view_count DESC);
CREATE INDEX idx_games_created_at ON games(created_at DESC);
CREATE INDEX idx_games_title_search ON games USING gin(to_tsvector('english', title));

-- Game Categories (many-to-many)
CREATE TABLE game_categories (
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, category_id)
);

CREATE INDEX idx_game_categories_game_id ON game_categories(game_id);
CREATE INDEX idx_game_categories_category_id ON game_categories(category_id);

-- Game Tags (many-to-many)
CREATE TABLE game_tags (
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (game_id, tag_id)
);

CREATE INDEX idx_game_tags_game_id ON game_tags(game_id);
CREATE INDEX idx_game_tags_tag_id ON game_tags(tag_id);

-- Game Series (many-to-many)
CREATE TABLE game_series (
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (game_id, series_id)
);

CREATE INDEX idx_game_series_game_id ON game_series(game_id);
CREATE INDEX idx_game_series_series_id ON game_series(series_id);

-- Daily Stats
CREATE TABLE game_stats_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  play_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(game_id, date)
);

CREATE INDEX idx_game_stats_daily_game_id ON game_stats_daily(game_id);
CREATE INDEX idx_game_stats_daily_date ON game_stats_daily(date);
CREATE INDEX idx_game_stats_daily_game_date ON game_stats_daily(game_id, date);

-- Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- Seed data: Categories
INSERT INTO categories (name, slug, description, meta_title, meta_description, sort_order) VALUES
('Action', 'action', 'Fast-paced action games that test your reflexes and timing.', 'Action Games - Play Free Online Action Games', 'Play the best free action games online.', 1),
('Adventure', 'adventure', 'Embark on epic adventures and explore new worlds.', 'Adventure Games - Play Free Online Adventure Games', 'Play free adventure games online.', 2),
('Arcade', 'arcade', 'Classic arcade games with simple controls and addictive gameplay.', 'Arcade Games - Play Free Online Arcade Games', 'Play free arcade games online.', 3),
('Board Game', 'board-game', 'Classic board games reimagined for online play.', 'Board Games - Play Free Online Board Games', 'Play free board games online.', 4),
('Card', 'card', 'Card games for all ages and skill levels.', 'Card Games - Play Free Online Card Games', 'Play free card games online.', 5),
('Casual', 'casual', 'Easy to pick up, hard to put down casual games.', 'Casual Games - Play Free Online Casual Games', 'Play free casual games online.', 6),
('Clicker', 'clicker', 'Idle clicker games where progress never stops.', 'Clicker Games - Play Free Online Clicker Games', 'Play the best free clicker games online.', 7),
('Driving', 'driving', 'Get behind the wheel in realistic driving games.', 'Driving Games - Play Free Online Driving Games', 'Play free driving games online.', 8),
('Educational', 'educational', 'Fun games that teach and challenge your mind.', 'Educational Games - Play Free Online Educational Games', 'Play free educational games online.', 9),
('Fighting', 'fighting', 'Battle opponents in intense fighting games.', 'Fighting Games - Play Free Online Fighting Games', 'Play free fighting games online.', 10),
('Horror', 'horror', 'Spooky horror games for brave players.', 'Horror Games - Play Free Online Horror Games', 'Play free horror games online.', 11),
('Idle', 'idle', 'Idle games that play themselves while you relax.', 'Idle Games - Play Free Online Idle Games', 'Play free idle games online.', 12),
('Multiplayer', 'multiplayer', 'Play with friends and players from around the world.', 'Multiplayer Games - Play Free Online Multiplayer Games', 'Play free multiplayer games online.', 13),
('Music', 'music', 'Rhythm and music games for music lovers.', 'Music Games - Play Free Online Music Games', 'Play free music games online.', 14),
('Platformer', 'platformer', 'Jump and run through challenging platform levels.', 'Platformer Games - Play Free Online Platformer Games', 'Play free platformer games online.', 15),
('Puzzle', 'puzzle', 'Challenge your brain with puzzle games.', 'Puzzle Games - Play Free Online Puzzle Games', 'Play free puzzle games online.', 16),
('Racing', 'racing', 'Race against the clock or other players.', 'Racing Games - Play Free Online Racing Games', 'Play free racing games online.', 17),
('RPG', 'rpg', 'Role-playing games with deep stories and character progression.', 'RPG Games - Play Free Online RPG Games', 'Play free RPG games online.', 18),
('Shooting', 'shooting', 'Precision shooting games and first-person action.', 'Shooting Games - Play Free Online Shooting Games', 'Play free shooting games online.', 19),
('Simulation', 'simulation', 'Realistic simulation games for every interest.', 'Simulation Games - Play Free Online Simulation Games', 'Play free simulation games online.', 20),
('Sports', 'sports', 'Sports games from soccer to basketball and everything in between.', 'Sports Games - Play Free Online Sports Games', 'Play free sports games online.', 21),
('Strategy', 'strategy', 'Test your tactical skills in strategy games.', 'Strategy Games - Play Free Online Strategy Games', 'Play free strategy games online.', 22),
('Survival', 'survival', 'Survival games that test your resourcefulness.', 'Survival Games - Play Free Online Survival Games', 'Play free survival games online.', 23),
('Trivia', 'trivia', 'Test your knowledge with trivia and quiz games.', 'Trivia Games - Play Free Online Trivia Games', 'Play free trivia games online.', 24)
ON CONFLICT (slug) DO NOTHING;

-- RLS Policies: allow public SELECT on content tables
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_series ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published games"
  ON games FOR SELECT USING (is_published = true);

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Public can read tags"
  ON tags FOR SELECT USING (true);

CREATE POLICY "Public can read series"
  ON series FOR SELECT USING (true);

CREATE POLICY "Public can read game_categories"
  ON game_categories FOR SELECT USING (true);

CREATE POLICY "Public can read game_tags"
  ON game_tags FOR SELECT USING (true);

CREATE POLICY "Public can read game_series"
  ON game_series FOR SELECT USING (true);
