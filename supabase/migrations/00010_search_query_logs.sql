-- Log the two demand signals the catalogue cannot see today: submitted search
-- terms that matched zero published games, and not-found game/level URLs that
-- visitors still request (mostly stale indexed or shared links). Aggregated in
-- the admin Searches page to decide which games or aliases to add next.

CREATE TABLE search_query_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  source text NOT NULL CHECK (source IN ('search_zero', 'game_404')),
  referrer text,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_query_logs_created_at
  ON search_query_logs(created_at DESC);

-- Only the server-side service role reads and writes this table (Supabase
-- admin client bypasses RLS). No anon/authenticated policies on purpose.
ALTER TABLE search_query_logs ENABLE ROW LEVEL SECURITY;
