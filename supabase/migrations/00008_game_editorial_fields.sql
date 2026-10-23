-- Editorial fields that make game pages more than a restatement of the itch
-- source: an original recommendation blurb in the site's own voice, plus
-- SERP-specific title/description. All nullable; rows keep working without
-- them. `updated_at` is deliberately untouched — backfilling content must not
-- refresh sitemap lastmod dates.

ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS editorial_take TEXT,
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT;
