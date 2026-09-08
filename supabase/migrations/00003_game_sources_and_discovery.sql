-- P0 discovery and source-verification fields.
-- All fields are nullable/defaulted so existing game rows remain valid.

ALTER TABLE games ADD COLUMN IF NOT EXISTS developer TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS publisher TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS source_type TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS original_game_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS developer_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS steam_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS itch_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;
ALTER TABLE games ADD COLUMN IF NOT EXISTS sources JSONB NOT NULL DEFAULT '[]'::JSONB;
ALTER TABLE games ADD COLUMN IF NOT EXISTS content_verified BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE games DROP CONSTRAINT IF EXISTS games_sources_is_array;
ALTER TABLE games
  ADD CONSTRAINT games_sources_is_array
  CHECK (jsonb_typeof(sources) = 'array');

ALTER TABLE games DROP CONSTRAINT IF EXISTS games_verified_content_has_source;
ALTER TABLE games
  ADD CONSTRAINT games_verified_content_has_source
  CHECK (
    content_verified = false
    OR source_url IS NOT NULL
    OR original_game_url IS NOT NULL
    OR developer_url IS NOT NULL
    OR steam_url IS NOT NULL
    OR itch_url IS NOT NULL
    OR jsonb_array_length(sources) > 0
  );

CREATE INDEX IF NOT EXISTS idx_games_developer ON games(developer);
CREATE INDEX IF NOT EXISTS idx_games_release_date ON games(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_games_playable_published
  ON games(created_at DESC)
  WHERE is_published = true AND iframe_url IS NOT NULL AND iframe_url <> '';
