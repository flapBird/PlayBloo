-- Prevent concurrent public submissions from creating duplicate pending reviews.
-- Apply after 00004_updates_submissions_and_metadata.sql.

-- Preserve the oldest active review and move exact duplicate queue rows out of
-- the active queue before adding constraints. Nothing is deleted.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY normalized_source_url
    ORDER BY created_at ASC, id ASC
  ) AS row_number
  FROM game_submissions
  WHERE status = 'pending_review'
)
UPDATE game_submissions AS submission
SET status = 'duplicate', updated_at = NOW()
FROM ranked
WHERE submission.id = ranked.id AND ranked.row_number > 1;

WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY steam_app_id
    ORDER BY created_at ASC, id ASC
  ) AS row_number
  FROM game_submissions
  WHERE status = 'pending_review' AND steam_app_id IS NOT NULL
)
UPDATE game_submissions AS submission
SET status = 'duplicate', updated_at = NOW()
FROM ranked
WHERE submission.id = ranked.id AND ranked.row_number > 1;

WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY itch_project_slug
    ORDER BY created_at ASC, id ASC
  ) AS row_number
  FROM game_submissions
  WHERE status = 'pending_review' AND itch_project_slug IS NOT NULL
)
UPDATE game_submissions AS submission
SET status = 'duplicate', updated_at = NOW()
FROM ranked
WHERE submission.id = ranked.id AND ranked.row_number > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_game_submissions_pending_source_unique
  ON game_submissions(normalized_source_url)
  WHERE status = 'pending_review';

CREATE UNIQUE INDEX IF NOT EXISTS idx_game_submissions_pending_steam_unique
  ON game_submissions(steam_app_id)
  WHERE status = 'pending_review' AND steam_app_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_game_submissions_pending_itch_unique
  ON game_submissions(itch_project_slug)
  WHERE status = 'pending_review' AND itch_project_slug IS NOT NULL;
