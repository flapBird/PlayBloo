#!/usr/bin/env python3
"""Mark radar games as used by PlayBloo: POST /api/itch/mark-used.

Run AFTER import_games.py succeeded — feed it the urls that were actually
inserted (import_games writes imported-urls.txt next to enriched.json), so
unpicked / skipped / deduped games stay status=ready for the next batch.

Usage:
  python3 mark_used.py --urls-file /tmp/itch-import/imported-urls.txt [--date 2026-10-25]
  python3 mark_used.py https://xxx.itch.io/a https://yyy.itch.io/b   # explicit urls
  python3 mark_used.py --date 2026-10-25 --all-day                   # mark EVERYTHING that day

Notes:
  * Pass urls exactly as the API returned them (imported-urls.txt already
    does) — normalization happens server-side, but exact matches are safest.
  * Prints the response {"marked": n, "not_found": [...]} and exits non-zero
    when not_found is non-empty or nothing was marked — compare against
    batch.json before re-running.
  * Same env/network rules as fetch_batch.py: ITCH_RADAR_API_KEY in .env.local;
    the SEO host needs the local proxy (direct times out).
"""
import json
import pathlib
import sys
import urllib.error
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

    urls_file = opt("--urls-file")
    date = opt("--date", "")
    all_day = "--all-day" in args
    use_proxy = "--direct" not in args
    proxy = opt("--proxy", "http://127.0.0.1:7890")

    env = load_env(opt("--env"))
    key = (env.get("ITCH_RADAR_API_KEY") or "").strip()
    if not key:
        sys.exit("ITCH_RADAR_API_KEY is empty/missing in .env.local — issue one on the SEO console /itch page and paste it there")
    base = (env.get("ITCH_RADAR_API_BASE") or DEFAULT_BASE).rstrip("/")

    urls = [a for a in args if a.startswith("http")]
    if urls_file:
        for line in open(urls_file, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#"):
                urls.append(line)
    urls = list(dict.fromkeys(urls))  # dedupe, keep order

    if not urls and not (all_day and date):
        sys.exit("nothing to mark — pass --urls-file (from import_games.py), explicit urls, or --date + --all-day")

    body = {}
    if urls:
        body["urls"] = urls
    if date:
        body["date"] = date

    handler = urllib.request.ProxyHandler({"http": proxy, "https": proxy} if use_proxy else {})
    opener = urllib.request.build_opener(handler)
    req = urllib.request.Request(base + "/api/itch/mark-used",
                                 data=json.dumps(body).encode(),
                                 headers={"User-Agent": UA, "X-API-Key": key, "Content-Type": "application/json"},
                                 method="POST")
    print(f"POST {base}/api/itch/mark-used  urls={len(urls)}{' +date ' + date if date else ''}")
    try:
        raw = opener.open(req, timeout=60).read().decode()
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code}: {e.read()[:300].decode(errors='replace')}")
    except Exception as e:
        hint = "" if use_proxy else " (direct failed — this host usually needs the local proxy; retry without --direct)"
        sys.exit(f"request failed: {e!r}{hint}")

    data = json.loads(raw)
    marked, not_found = data.get("marked", 0), data.get("not_found", [])
    print(f"marked={marked} not_found={not_found}")
    if not_found:
        print("NOT FOUND — these urls matched no radar record; compare against batch.json", file=sys.stderr)
        sys.exit(1)
    if not marked:
        print("nothing was marked (all already used?) — verify against batch.json before re-running", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
