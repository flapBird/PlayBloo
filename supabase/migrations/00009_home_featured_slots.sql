-- Hand-curated positions for the homepage featured mosaic: position 1 is the
-- big lead tile, 2-5 are the runner-up covers. Rows are optional — the
-- homepage fills any unset position from the trending feed, so an empty table
-- keeps the previous behaviour. Managed from /admin/featured.

CREATE TABLE IF NOT EXISTS public.home_featured_slots (
  position INT PRIMARY KEY CHECK (position BETWEEN 1 AND 5),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.home_featured_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read home featured slots"
  ON public.home_featured_slots FOR SELECT USING (true);
