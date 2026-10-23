#!/usr/bin/env python3
"""Import enriched + editorialized itch games into the PlayBloo Supabase DB.

Inputs:
  enriched.json  — output of parse_and_fetch.py (one record per game; ok==true)
  content.json   — { "<slug>": {short_description, description, how_to_play,
                   controls, tips, features, categories[], engine, graphics,
                   multiplayer, development_status} , ... } written by the model
                   per batch (English copy grounded in the fetched page text).

What it writes:
  games            — one row per game (external play, itch conventions)
  game_categories  — taxonomy links resolved from category slugs
  game_updates     — one "Added to PlayBloo" row per game (fills the Updates module)

Usage:
  python3 import_games.py enriched.json content.json [--dry-run] [--skip-updates] [--env /path/.env.local]

IMPORTANT (learned the hard way):
  * ALL supabase.co traffic must go DIRECT (no system proxy). Requests to
    Supabase routed through the local proxy intermittently fail with nonsense
    errors like storage "Bucket not found". This script pins no-proxy on purpose.
  * .env.local in the PlayBloo repo IS the production database.
"""
import datetime
import json
import pathlib
import re
import sys
import urllib.error
import urllib.request

VALID_CATEGORIES = {
    "action", "adventure", "arcade", "board-game", "card", "casual", "clicker",
    "driving", "educational", "fighting", "horror", "idle", "multiplayer", "music",
    "platformer", "puzzle", "racing", "rpg", "shooting", "simulation", "sports",
    "strategy", "survival", "trivia",
}
CONTENT_FIELDS = [
    "short_description", "description", "how_to_play", "controls", "tips", "features",
    "editorial_take", "meta_title", "meta_description",
]


def find_env(cli_path):
    candidates = [cli_path] if cli_path else []
    candidates += [pathlib.Path.cwd() / ".env.local",
                   pathlib.Path(__file__).resolve().parents[4] / ".env.local"]
    for c in candidates:
        if c and pathlib.Path(c).exists():
            return pathlib.Path(c)
    sys.exit("env file not found — pass --env /path/to/PlayBloo/.env.local")


def load_env(path):
    env = {}
    for line in open(path, encoding="utf-8"):
        if "=" in line:
            k, v = line.strip().split("=", 1)
            env[k] = v.strip().strip('"')
    return env["NEXT_PUBLIC_SUPABASE_URL"].rstrip("/"), env["SUPABASE_SERVICE_ROLE_KEY"]


def make_rest(base, key):
    # Direct connection ON PURPOSE — see module docstring.
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))

    def rest(path, body=None, method=None, prefer=None):
        headers = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        if prefer:
            headers["Prefer"] = prefer
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(base + path, headers=headers, method=method or ("POST" if body is not None else "GET"), data=data)
        try:
            raw = opener.open(req, timeout=60).read().decode()
            return json.loads(raw) if raw else None
        except urllib.error.HTTPError as e:
            raise RuntimeError(f"{method or 'GET'} {path} -> {e.code}: {e.read()[:300].decode(errors='replace')}") from None
    return rest


def slug_of(url):
    return re.search(r"\.itch\.io/([^/?#]+)", url).group(1)


def build_rows(recs, content, now, cats):
    rows, cat_links, problems = [], [], []
    for r in recs:
        if not r.get("ok"):
            problems.append(f"skip (fetch failed): {r.get('title')} :: {r.get('error')}")
            continue
        slug = slug_of(r["url"])
        c = content.get(slug)
        if not c:
            problems.append(f"MISSING content for slug '{slug}' — write editorial copy first")
            continue
        missing = [f for f in CONTENT_FIELDS if not c.get(f)]
        if missing:
            problems.append(f"content for '{slug}' missing fields: {missing}")
            continue
        bad_cats = [cat for cat in c["categories"] if cat not in VALID_CATEGORIES]
        if bad_cats:
            problems.append(f"invalid categories for '{slug}': {bad_cats}")
            continue
        author = (r.get("author") or "").strip() or r.get("subdomain", "")
        author_url = r.get("author_url") or (f"https://{r.get('subdomain')}.itch.io" if r.get("subdomain") else "")
        rows.append({
            "title": r["title"],
            "slug": slug,
            "thumbnail_url": r.get("rss_cover") or r.get("og_image") or "",
            "cover_url": "",
            "iframe_url": "",
            "external_url": r["url"],
            "description": c["description"],
            "short_description": c["short_description"],
            "how_to_play": c["how_to_play"],
            "controls": c["controls"],
            "tips": c["tips"],
            "features": c["features"],
            "editorial_take": c["editorial_take"],
            "meta_title": c["meta_title"],
            "meta_description": c["meta_description"],
            "release_date": (r.get("published_at") or "")[:10] or now[:10],
            "is_published": True, "is_featured": False, "is_trending": False,
            "developer": author, "publisher": "",
            "source_url": r["url"], "source_type": "itch.io",
            "original_game_url": r["url"],
            "developer_url": author_url,
            "steam_url": "", "itch_url": r["url"],
            "itch_project_slug": slug,
            "added_at": now, "last_verified_at": now,
            "platforms": ["browser"],
            "monetization": "free",
            "development_status": c.get("development_status") or "released",
            "graphics": c.get("graphics"),
            "multiplayer": c.get("multiplayer") or "single-player",
            "engine": c.get("engine"),
            "screenshots": (r.get("screenshots") or [])[:6],
            "sources": [{"url": r["url"], "type": "itch.io", "verifiedAt": now[:10]}],
            "content_verified": True,
        })
        for cat in c["categories"]:
            cat_links.append((slug, cat, cats[cat]))
    return rows, cat_links, problems


def main():
    args = sys.argv[1:]
    if len(args) < 2:
        print(__doc__)
        sys.exit(1)
    enriched_path, content_path = args[0], args[1]
    dry = "--dry-run" in args
    do_updates = "--skip-updates" not in args
    env_path = find_env(args[args.index("--env") + 1] if "--env" in args else None)
    base, key = load_env(env_path)
    rest = make_rest(base, key)
    now = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")

    recs = json.load(open(enriched_path, encoding="utf-8"))
    content = json.load(open(content_path, encoding="utf-8"))
    cats = {c["slug"]: c["id"] for c in rest("/rest/v1/categories?select=id,slug")}
    rows, cat_links, problems = build_rows(recs, content, now, cats)

    # dedupe against DB (slug and itch_project_slug are UNIQUE) and within batch
    existing = rest("/rest/v1/games?select=slug,itch_project_slug,external_url")
    seen = ({g["slug"] for g in existing}
            | {g["itch_project_slug"] for g in existing if g["itch_project_slug"]}
            | {g["external_url"] for g in existing if g["external_url"]})
    batch_slugs = [r["slug"] for r in rows]
    rows = [r for r in rows if r["slug"] not in seen and r["external_url"] not in seen]
    dup_in_batch = {s for s in batch_slugs if batch_slugs.count(s) > 1}
    if dup_in_batch:
        problems.append(f"duplicate slugs within batch: {dup_in_batch}")

    print(f"rows to insert: {len(rows)}, category links: {len(cat_links)}")
    for p in problems:
        print("PROBLEM:", p)
    if dry:
        out = pathlib.Path(enriched_path).parent / "payload.json"
        json.dump({"rows": rows, "cat_links": cat_links}, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"DRY RUN — payload saved to {out}")
        return

    if not rows:
        print("nothing to insert")
        return
    inserted = rest("/rest/v1/games?select=id,slug", rows, prefer="return=representation")
    slug_to_id = {g["slug"]: g["id"] for g in inserted}
    links = [{"game_id": slug_to_id[s], "category_id": cid} for s, _, cid in cat_links if s in slug_to_id]
    if links:
        rest("/rest/v1/game_categories?select=game_id,category_id", links, prefer="return=representation")
    print(f"inserted {len(inserted)} games, {len(links)} category links")
    if do_updates:
        have = {u["game_id"] for u in rest("/rest/v1/game_updates?select=title,game_id") if u["title"] == "Added to PlayBloo"}
        updates = [{"game_id": slug_to_id[r["slug"]],
                    "title": "Added to PlayBloo",
                    "summary": f"{content[r['slug']]['short_description']}. Discovered on itch.io's new releases feed and added to the PlayBloo catalogue with verified source details.",
                    "published_at": now,
                    "source_url": r["external_url"]}
                   for r in rows if r["slug"] in slug_to_id and slug_to_id[r["slug"]] not in have]
        if updates:
            rest("/rest/v1/game_updates?select=id,game_id", updates, prefer="return=representation")
        print(f"inserted {len(updates)} 'Added to PlayBloo' update rows")
    print("DONE — verify a couple of /game/<slug> pages, then run mirror_covers.py")


if __name__ == "__main__":
    main()
