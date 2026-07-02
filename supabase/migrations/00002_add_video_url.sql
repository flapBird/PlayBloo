-- Add video_url to game_levels for level walkthrough video embeds
ALTER TABLE game_levels ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add RLS policy for game_levels (was missing)
ALTER TABLE game_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published game_levels"
  ON game_levels FOR SELECT
  USING (is_published = true);
