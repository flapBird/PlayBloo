-- Public catalogue aggregation and atomic engagement counters.
-- Apply after 00004_updates_submissions_and_metadata.sql.

CREATE OR REPLACE FUNCTION public_category_counts()
RETURNS TABLE(category_id UUID, game_count BIGINT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT gc.category_id, COUNT(*)::BIGINT
  FROM game_categories gc
  INNER JOIN games g ON g.id = gc.game_id
  WHERE g.is_published = true
  GROUP BY gc.category_id;
$$;

REVOKE ALL ON FUNCTION public_category_counts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public_category_counts() TO service_role;

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
  ) matches
  LIMIT 500;
$$;

REVOKE ALL ON FUNCTION search_public_game_ids(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION search_public_game_ids(TEXT) TO service_role;

CREATE OR REPLACE FUNCTION increment_game_stat(p_game_id UUID, p_stat TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_stat = 'view' THEN
    UPDATE games SET view_count = view_count + 1 WHERE id = p_game_id AND is_published = true;
  ELSIF p_stat = 'play' THEN
    UPDATE games SET play_count = play_count + 1 WHERE id = p_game_id AND is_published = true;
  ELSIF p_stat = 'external_click' THEN
    UPDATE games SET external_click_count = external_click_count + 1 WHERE id = p_game_id AND is_published = true;
  ELSE
    RAISE EXCEPTION 'Unsupported stat type';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION increment_game_stat(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_game_stat(UUID, TEXT) TO service_role;
