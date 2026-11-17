-- Game aliases (migration 00011): the visitor vocabulary that never appears
-- in a game title. The admin Searches page keeps showing zero-result terms
-- that ARE the site's own games — Chinese community names (我的甜蜜宠物 /
-- 异宠包裹 → MY SWEET PETS, 马戏团 → The Freak Circus), no-space typings
-- (mysweetpets) and guessed URL fragments (footbillionquiz). The search RPC
-- and /api/suggestions now match these through game_aliases; the
-- /game/[slug] 404 fallback reuses the same table for paste-artifact
-- redirects (lib/slug-rescue.ts).
--
-- Only the service role reads and writes this table (admin client bypasses
-- RLS). No anon/authenticated policies, mirroring search_query_logs (00010).

CREATE TABLE IF NOT EXISTS game_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  alias text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_game_aliases_game_alias
  ON game_aliases (game_id, lower(alias));

CREATE INDEX IF NOT EXISTS idx_game_aliases_game_id ON game_aliases (game_id);

ALTER TABLE game_aliases ENABLE ROW LEVEL SECURITY;

-- Alias rows must not carry ILIKE wildcards: the search RPC interpolates the
-- alias straight into a pattern, so a stray % or _ would silently widen the
-- match. Seeding goes through the same rule.
CREATE OR REPLACE FUNCTION assert_alias_has_no_wildcards() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.alias ~ '[%_]' THEN
    -- Literal %% is escaped: a bare % inside a RAISE format string is a
    -- parameter placeholder and would fail compilation (42601).
    RAISE EXCEPTION 'alias must not contain ILIKE wildcards (%% or _): %', NEW.alias;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_game_aliases_no_wildcards ON game_aliases;
CREATE TRIGGER trg_game_aliases_no_wildcards
  BEFORE INSERT OR UPDATE ON game_aliases
  FOR EACH ROW EXECUTE FUNCTION assert_alias_has_no_wildcards();

CREATE OR REPLACE FUNCTION search_public_game_ids(search_term TEXT)
RETURNS TABLE(game_id UUID)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT matches.game_id
  FROM (
    SELECT g.id AS game_id
    FROM games g
    WHERE g.is_published = true
      AND (
        g.title ILIKE '%' || search_term || '%'
        OR COALESCE(g.developer, '') ILIKE '%' || search_term || '%'
      )

    UNION

    SELECT gc.game_id
    FROM game_categories gc
    INNER JOIN categories c ON c.id = gc.category_id
    INNER JOIN games g ON g.id = gc.game_id AND g.is_published = true
    WHERE c.name ILIKE '%' || search_term || '%'

    UNION

    SELECT gt.game_id
    FROM game_tags gt
    INNER JOIN tags t ON t.id = gt.tag_id
    INNER JOIN games g ON g.id = gt.game_id AND g.is_published = true
    WHERE t.name ILIKE '%' || search_term || '%'

    -- 2026-11-18: alias branch. Matched in both directions — the term equals
    -- or extends the alias ("异宠包裹", "my sweet pets 网页版在线玩") or the
    -- alias covers the term. The length guard keeps short aliases from
    -- matching every query that happens to contain them.
    UNION

    SELECT a.game_id
    FROM game_aliases a
    INNER JOIN games g ON g.id = a.game_id AND g.is_published = true
    WHERE a.alias ILIKE '%' || search_term || '%'
       OR (
         char_length(a.alias) >= 3
         AND search_term ILIKE '%' || a.alias || '%'
       )
  ) matches
  LIMIT 500;
$$;

REVOKE ALL ON FUNCTION search_public_game_ids(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION search_public_game_ids(TEXT) TO service_role;

-- Seed aliases from the observed zero-result traffic (admin Searches page,
-- 2026-11-16/17). Only names that cannot match a title as-is are seeded;
-- "my sweet pets" is here so the pasted long-form query
-- ("my sweet pets 网页版在线玩") resolves through the alias-contains branch.
INSERT INTO game_aliases (game_id, alias)
SELECT g.id, v.alias
FROM (
  VALUES
    ('my-sweet-pets-demo', '我的甜蜜宠物'),
    ('my-sweet-pets-demo', '异宠包裹'),
    ('my-sweet-pets-demo', 'mysweetpets'),
    ('my-sweet-pets-demo', 'my sweet pets'),
    ('the-freak-circus', '马戏团'),
    ('footbillion', 'footbillionquiz'),
    ('footbillion', 'footbillion quiz')
) AS v(slug, alias)
INNER JOIN games g ON g.slug = v.slug
ON CONFLICT (game_id, lower(alias)) DO NOTHING;
