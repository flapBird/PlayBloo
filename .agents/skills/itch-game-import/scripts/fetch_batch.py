#!/usr/bin/env python3
"""Fetch the day's itch radar batch from the SEO console API (status=ready).

Replaces the old "paste the export markdown" step: the API returns MORE fields
than the markdown export (cover_url, description, price, genres, tags,
platforms, screenshots, keywords, quality_ok/quality_notes) and the same
records flow into parse_and_fetch.py for itch-page enrichment.

Usage:
  python3 fetch_batch.py [--date YYYY-MM-DD] [--status ready] [--limit 300] \
                         [--out-dir /tmp/itch-import] [--env /path/.env.local] \
                         [--proxy http://127.0.0.1:7890] [--direct]

Outputs (under --out-dir):
  batch.json  raw API response — archive/verification record, do not edit
  games.json  working list to enrich — EDIT THIS to pick the batch (delete
              games you won't import; unpicked ones stay status=ready)

Env (.env.local):
  ITCH_RADAR_API_KEY   required — X-API-Key; issue on the SEO console /itch
                       page (plaintext shown once at creation)
  ITCH_RADAR_API_BASE  optional — default https://seo.leeswalvpn.ccwu.cc

Network: the SEO host is NOT reachable directly from this machine (timeout);
requests go through the local Clash proxy by default. --direct overrides.
"""
import json
import pathlib
import sys
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_BASE = "https://seo.leeswalvpn.ccwu.cc"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"


def load_env(cli_path):
    candidates = [cli_path] if cli_path else []
    candidates += [pathlib.Path.cwd() / ".env.local",
                   pathlib.Path(__file__).resolve().parents[4] / ".env.local"]
    for c in candidates:
        if c and pathlib.Path(c).exists():
            env = {}
            for line in open(c, encoding="utf-8"):
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    env[k] = v.strip().strip('"')
            return env
    sys.exit("env file not found — pass --env /path/to/PlayBloo/.env.local")


def main():
    args = sys.argv[1:]

    def opt(name, default=None):
        return args[args.index(name) + 1] if name in args and args.index(name) + 1 < len(args) else default

    out_dir = pathlib.Path(opt("--out-dir", "/tmp/itch-import"))
    status = opt("--status", "ready")
    limit = opt("--limit", "300")
    date = opt("--date", "")
    use_proxy = "--direct" not in args
    proxy = opt("--proxy", "http://127.0.0.1:7890")

    env = load_env(opt("--env"))
    key = (env.get("ITCH_RADAR_API_KEY") or "").strip()
    if not key:
        sys.exit("ITCH_RADAR_API_KEY is empty/missing in .env.local — issue one on the SEO console /itch page and paste it there")
    base = (env.get("ITCH_RADAR_API_BASE") or DEFAULT_BASE).rstrip("/")

    params = {"status": status, "limit": limit}
    if date:
        params["date"] = date
    url = f"{base}/api/itch/games?{urllib.parse.urlencode(params)}"

    handler = urllib.request.ProxyHandler({"http": proxy, "https": proxy} if use_proxy else {})
    opener = urllib.request.build_opener(handler)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "X-API-Key": key, "Accept": "application/json"})
    try:
        raw = opener.open(req, timeout=60).read().decode()
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code} from {url}: {e.read()[:300].decode(errors='replace')}")
    except Exception as e:
        hint = "" if use_proxy else " (direct failed — this host usually needs the local proxy; retry without --direct)"
        sys.exit(f"request failed: {e!r}{hint}")

    data = json.loads(raw)
    games = [g for g in data.get("games", []) if g.get("url")]
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "batch.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    (out_dir / "games.json").write_text(json.dumps(games, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"date={data.get('date')} status={status} count={len(games)}")
    print(f"wrote batch.json (raw archive) + games.json (working list) -> {out_dir}")
    if not games:
        print("no games returned — the radar may not have run for this date yet; try --date <earlier day>")
        return
    for i, g in enumerate(games, 1):
        qflag = "" if g.get("quality_ok") else "  [QUALITY?]"
        price = str(g.get("price") or "?")
        genres = ",".join(g.get("genres") or [])[:40]
        print(f"[{i:>3}] {price:<12} {genres:<42} {g.get('title', '?')}{qflag}")
        if not g.get("quality_ok") and g.get("quality_notes"):
            print(f"        quality: {str(g['quality_notes'])[:120]}")
    print(f"\npick the batch by EDITING {out_dir / 'games.json'} (delete games you won't import),")
    print("then run parse_and_fetch.py on it")


if __name__ == "__main__":
    main()
