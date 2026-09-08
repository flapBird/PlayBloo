-- P1 metadata, update history, and moderated submission workflow.
-- Apply after 00003_game_sources_and_discovery.sql.

ALTER TABLE games ADD COLUMN IF NOT EXISTS added_at TIMESTAMPTZ;
UPDATE games SET added_at = created_at WHERE added_at IS NULL;
ALTER TABLE games ALTER COLUMN added_at SET DEFAULT NOW();
ALTER TABLE games ALTER COLUMN added_at SET NOT NULL;

ALTER TABLE games ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMPTZ;
ALTER TABLE games ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS official_website_url TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS steam_app_id TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS itch_project_slug TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS platforms TEXT[] NOT NULL DEFAULT '{}'::TEXT[];
ALTER TABLE games ADD COLUMN IF NOT EXISTS monetization TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS development_status TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS graphics TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS multiplayer TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS engine TEXT;
ALTER TABLE games ADD COLUMN IF NOT EXISTS screenshots JSONB NOT NULL DEFAULT '[]'::JSONB;
ALTER TABLE games ADD COLUMN IF NOT EXISTS external_click_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE games DROP CONSTRAINT IF EXISTS games_monetization_check;
ALTER TABLE games ADD CONSTRAINT games_monetization_check
  CHECK (monetization IS NULL OR monetization IN ('free', 'free-with-ads', 'freemium', 'paid'));
ALTER TABLE games DROP CONSTRAINT IF EXISTS games_development_status_check;
ALTER TABLE games ADD CONSTRAINT games_development_status_check
  CHECK (development_status IS NULL OR development_status IN ('upcoming', 'demo', 'early-access', 'released', 'discontinued'));
ALTER TABLE games DROP CONSTRAINT IF EXISTS games_screenshots_is_array;
ALTER TABLE games ADD CONSTRAINT games_screenshots_is_array CHECK (jsonb_typeof(screenshots) = 'array');

CREATE INDEX IF NOT EXISTS idx_games_added_at ON games(added_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_games_last_updated_at ON games(last_updated_at DESC) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_games_platforms ON games USING GIN(platforms);
CREATE INDEX IF NOT EXISTS idx_games_monetization ON games(monetization) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_games_development_status ON games(development_status) WHERE is_published = true;
CREATE UNIQUE INDEX IF NOT EXISTS idx_games_steam_app_id_unique ON games(steam_app_id) WHERE steam_app_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_games_itch_project_slug_unique ON games(itch_project_slug) WHERE itch_project_slug IS NOT NULL;

CREATE TABLE IF NOT EXISTS game_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  version TEXT,
  title TEXT NOT NULL,
  summary TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  source_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_game_updates_game_published ON game_updates(game_id, published_at DESC);
ALTER TABLE game_updates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published game updates are public" ON game_updates;
CREATE POLICY "Published game updates are public" ON game_updates FOR SELECT USING (
  EXISTS (SELECT 1 FROM games WHERE games.id = game_updates.game_id AND games.is_published = true)
);

CREATE TABLE IF NOT EXISTS game_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  normalized_source_url TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('steam', 'itch', 'official')),
  steam_app_id TEXT,
  itch_project_slug TEXT,
  submitter_email TEXT,
  developer_name TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected', 'duplicate')),
  extracted_data JSONB NOT NULL DEFAULT '{}'::JSONB,
  extraction_status TEXT NOT NULL DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'success', 'partial', 'failed')),
  extraction_error TEXT,
  last_fetched_at TIMESTAMPTZ,
  duplicate_game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  request_fingerprint TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  approved_game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_game_submissions_status_created ON game_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_submissions_normalized_url ON game_submissions(normalized_source_url);
CREATE INDEX IF NOT EXISTS idx_game_submissions_steam_app_id ON game_submissions(steam_app_id) WHERE steam_app_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_game_submissions_itch_slug ON game_submissions(itch_project_slug) WHERE itch_project_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_game_submissions_rate_limit ON game_submissions(request_fingerprint, created_at DESC) WHERE request_fingerprint IS NOT NULL;
ALTER TABLE game_submissions ENABLE ROW LEVEL SECURITY;
-- Intentionally no public policies. Public submissions and admin review use guarded server routes.

CREATE TABLE IF NOT EXISTS submission_source_cache (
  normalized_source_url TEXT PRIMARY KEY,
  source_type TEXT NOT NULL CHECK (source_type IN ('steam', 'itch', 'official')),
  payload JSONB NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_submission_source_cache_expires ON submission_source_cache(expires_at);
ALTER TABLE submission_source_cache ENABLE ROW LEVEL SECURITY;
-- Service-role only: cache contents are not a public API.
