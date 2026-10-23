#!/usr/bin/env python3
"""Mirror itch cover images into Supabase Storage and point games.thumbnail_url at them.

Why: itch thumbnails used to be hotlinked (bypassing next/image) — slow and
unstable for visitors in China, and img.itch.zone availability is out of our
control. Mirrored covers live in the PUBLIC bucket `game-media` under
covers/{slug}{ext} and are served optimized through /_next/image (the supabase
storage host is whitelisted in next.config.ts).

Usage:
  python3 mirror_covers.py [--proxy http://127.0.0.1:7890] [--env /path/.env.local] [--only-new]

Gotchas baked in (each one broke production once):
  * Storage public URL MUST include the bucket name:
      /storage/v1/object/public/game-media/covers/<slug>.png
    (a missing `game-media/` segment silently 400s every image on the site).
  * ALL supabase.co requests go DIRECT — through the local proxy they fail with
    nonsense errors (e.g. storage "Bucket not found" on an existing bucket).
  * itch image downloads default to DIRECT with pacing (0.35s) — img.itch.zone
    works without proxy from this machine, and high-frequency proxy downloads
    get rate-limited (HTTP 400). Pass --proxy only if direct fails.
  * Old thumbnail URLs are saved to covers-mirror-<date>.json for rollback.
"""
import datetime
import json
import mimetypes
import pathlib
import re
import sys
import time
import urllib.error
import urllib.request

BUCKET = "game-media"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
EXTS = (".png", ".jpg", ".jpeg", ".gif", ".webp")
# Stored as the object's cacheControl. Without it the object is stored as
# `no-cache`, so the CDN revalidates the cover on every page view — that is
# what burned the Free plan's log-ingestion quota. The `cacheControl` query
# parameter does NOT work here; it resets the object back to `no-cache`.
CACHE_CONTROL = "max-age=604800"


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


def openers(proxy):
    direct = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    if not proxy:
        return direct, direct
    proxied = urllib.request.build_opener(urllib.request.ProxyHandler({"http": proxy, "https": proxy}))
    return direct, proxied


def main():
    args = sys.argv[1:]
    proxy = args[args.index("--proxy") + 1] if "--proxy" in args else ""
    only_new = "--only-new" in args
    base, key = load_env(find_env(args[args.index("--env") + 1] if "--env" in args else None))
    direct, proxied = openers(proxy)
    dl = proxied if proxy else direct

    def rest(path, body=None, method=None, headers=None, data=None):
        h = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        h.update(headers or {})
        req = urllib.request.Request(base + path, headers=h, method=method or ("POST" if (body is not None or data is not None) else "GET"), data=data if data is not None else (json.dumps(body).encode() if body is not None else None))
        raw = direct.open(req, timeout=60).read().decode()
        return json.loads(raw) if raw else None

    # bucket exists?
    try:
        direct.open(urllib.request.Request(f"{base}/storage/v1/bucket/{BUCKET}", headers={"apikey": key, "Authorization": f"Bearer {key}"}), timeout=30)
        print(f"bucket '{BUCKET}' exists")
    except urllib.error.HTTPError:
        rest("/storage/v1/bucket", {"id": BUCKET, "name": BUCKET, "public": True})
        print(f"bucket '{BUCKET}' created (public)")
        time.sleep(2)

    games = rest("/rest/v1/games?select=id,slug,thumbnail_url&is_published=eq.true")
    targets = [g for g in games if g["thumbnail_url"] and "img.itch.zone" in g["thumbnail_url"]]
    print(f"{len(targets)} games still hotlinking itch covers")

    mapping_path = pathlib.Path(f"covers-mirror-{datetime.date.today().isoformat()}.json")
    mapping, errors = [], []
    for i, g in enumerate(targets):
        url = g["thumbnail_url"]
        ext = "." + (url.split("?")[0].rsplit(".", 1)[-1].lower() or "png")
        if ext not in EXTS:
            ext = ".png"
        object_path = f"{BUCKET}/covers/{g['slug']}{ext}"          # bucket name INCLUDED
        public_url = f"{base}/storage/v1/object/public/{BUCKET}/covers/{g['slug']}{ext}"
        try:
            data = dl.open(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=25).read()
            if len(data) < 200:
                raise RuntimeError(f"suspicious tiny download ({len(data)}B)")
            ctype = mimetypes.guess_type("x" + ext)[0] or "image/png"
            up = urllib.request.Request(f"{base}/storage/v1/object/{object_path}", data=data, method="POST",
                                        headers={"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": ctype, "x-upsert": "true",
                                                 "cache-control": CACHE_CONTROL})
            direct.open(up, timeout=30)
            rest(f"/rest/v1/games?id=eq.{g['id']}", {"thumbnail_url": public_url}, method="PATCH")
            mapping.append({"slug": g["slug"], "old": url, "new": public_url, "bytes": len(data)})
        except urllib.error.HTTPError as e:
            errors.append((g["slug"], f"HTTP {e.code}: {e.read()[:150].decode(errors='replace')}"))
        except Exception as e:
            errors.append((g["slug"], repr(e)))
        time.sleep(0.35)  # pacing: itch rate-limits bursts
        if (i + 1) % 10 == 0:
            print(f"{i + 1}/{len(targets)} done, errors: {len(errors)}")

    json.dump(mapping, open(mapping_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"DONE: {len(mapping)} mirrored -> {mapping_path}, {len(errors)} failed")
    for slug, err in errors[:10]:
        print("FAIL", slug, err)
    if not only_new and not errors:
        print("Next: run `node scripts/warm-image-cache.mjs` after the next deploy.")


if __name__ == "__main__":
    main()
