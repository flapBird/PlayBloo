-- Category and series editorial copy must be backed by a traceable source.
-- Defaults keep every existing taxonomy row unverified until it is reviewed.

ALTER TABLE categories ADD COLUMN IF NOT EXISTS content_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;

ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_verified_content_has_source;
ALTER TABLE categories
  ADD CONSTRAINT categories_verified_content_has_source
  CHECK (content_verified = false OR source_url IS NOT NULL);

ALTER TABLE series ADD COLUMN IF NOT EXISTS content_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE series ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE series ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMPTZ;

ALTER TABLE series DROP CONSTRAINT IF EXISTS series_verified_content_has_source;
ALTER TABLE series
  ADD CONSTRAINT series_verified_content_has_source
  CHECK (content_verified = false OR source_url IS NOT NULL);

COMMENT ON COLUMN categories.content_verified IS
  'True only after description and SEO copy have been checked against source_url.';
COMMENT ON COLUMN series.content_verified IS
  'True only after description and SEO copy have been checked against source_url.';
