#!/usr/bin/env python3
"""Parse an itch radar export markdown and enrich each game from its itch.io page.

Input : export markdown like "# itch.io 新游戏速递 · YYYY-MM-DD（共 N 款）" with
        "## Title" + "- 游戏页面/作者/上架时间/价格/简介/封面图/..." bullet lines.
Output: enriched.json — one record per game with parsed fields + page-extracted
        fields (og:image, author, genre, engine, screenshots, page description).

Usage:
  python3 parse_and_fetch.py <export.md> <enriched.json> [--proxy http://127.0.0.1:7890] [--workers 6] [--direct]

Notes:
  * itch.io game pages are NOT reachable directly from this machine (China route);
    go through the local Clash mixed port (default 7890). --direct disables proxy.
  * img.itch.zone (covers) usually works WITHOUT proxy — cover mirroring is a
    separate script (mirror_covers.py).
  * A 404 during enrichment means the game page was deleted/privated after the
    radar crawl — record it and skip that game at import time.
"""
import html as htmllib
import json
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"


def parse_export(path):
    games, cur = [], None
    for line in open(path, encoding="utf-8").read().splitlines():
        if line.startswith("## "):
            cur = {"title": line[3:].strip()}
            games.append(cur)
        elif cur is not None:
            m = re.match(r"- (游戏页面|作者|上架时间|价格|状态|简介|封面图|建议关键词)：(.*)", line)
            if m:
                key = {"游戏页面": "url", "作者": "author", "上架时间": "published_at",
                       "价格": "price", "状态": "status", "简介": "rss_description",
                       "封面图": "rss_cover", "建议关键词": "keywords"}[m.group(1)]
                cur[key] = m.group(2).strip()
    return games


def fetch(opener, url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    with opener.open(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def meta(html, prop):
    m = (re.search(r'<meta[^>]+(?:property|name)="%s"[^>]+content="([^"]*)"' % re.escape(prop), html)
         or re.search(r'<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="%s"' % re.escape(prop), html))
    return htmllib.unescape(m.group(1)) if m else None


def clean_text(fragment):
    t = re.sub(r"<br\s*/?>", "\n", fragment)
    t = re.sub(r"</(p|div|li|h\d)>", "\n", t)
    t = re.sub(r"<li>", "- ", t)
    t = re.sub(r"<[^>]+>", "", t)
    t = htmllib.unescape(t)
    t = re.sub(r"[ \t]+", " ", t)
    return re.sub(r"\n{3,}", "\n\n", t).strip()


def info_row(html, label):
    m = re.search(r"<tr><td>%s</td><td>(.*?)</td></tr>" % re.escape(label), html, re.S)
    if not m:
        return None, None
    cell = m.group(1)
    link = re.search(r'href="([^"]+)"', cell)
    return clean_text(cell), (link.group(1) if link else None)


def extract(url, body):
    out = {"url": url, "ok": False}
    html = body
    out["og_description"] = meta(html, "og:description")
    out["og_image"] = meta(html, "og:image")
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
    out["h1"] = clean_text(m.group(1)) if m else None
    for label, key in [("Published", "published"), ("Status", "status"), ("Platforms", "platforms"),
                       ("Author", "author"), ("Made with", "engine"), ("Genre", "genre")]:
        text, link = info_row(html, label)
        out[key] = text
        out[key + "_url"] = link
    m = re.match(r"https://([a-z0-9-]+)\.itch\.io/", url)
    if m:
        out["subdomain"] = m.group(1)
    m = (re.search(r'<div class="formatted_description[^"]*"[^>]*>(.*?)</div>\s*(?:<div[^>]*class="[^"]*(?:toggle_row|more_information|game_comments)|<div id="game_comments)', html, re.S)
         or re.search(r'<div class="formatted_description[^"]*"[^>]*>(.*?)</div>', html, re.S))
    out["page_description_html"] = m.group(1) if m else None
    sm = re.search(r'class="screenshot_list"(.*?)</div>', html, re.S)
    out["screenshots"] = re.findall(r'<img[^>]+src="([^"]+)"', sm.group(1))[:6] if sm else []
    out["ok"] = True
    return out


def main():
    args = sys.argv[1:]
    if len(args) < 2:
        print(__doc__)
        sys.exit(1)
    src, out_path = args[0], args[1]
    proxy = "http://127.0.0.1:7890"
    workers = 6
    use_proxy = "--direct" not in args
    if "--proxy" in args:
        proxy = args[args.index("--proxy") + 1]
    if "--workers" in args:
        workers = int(args[args.index("--workers") + 1])

    handler = urllib.request.ProxyHandler({"http": proxy, "https": proxy} if use_proxy else {})
    opener = urllib.request.build_opener(handler)

    games = parse_export(src)
    print(f"parsed {len(games)} games from {src}", file=sys.stderr)
    results = [None] * len(games)

    def work(i, g):
        try:
            return i, {**g, **extract(g["url"], fetch(opener, g["url"]))}
        except urllib.error.HTTPError as err:
            return i, {**g, "url": g["url"], "ok": False, "error": f"HTTP {err.code}"}
        except Exception as err:
            return i, {**g, "url": g["url"], "ok": False, "error": repr(err)}

    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = [ex.submit(work, i, g) for i, g in enumerate(games)]
        for done, f in enumerate(as_completed(futs), 1):
            i, rec = f.result()
            results[i] = rec
            print(f"[{done}/{len(games)}] {'OK ' if rec.get('ok') else 'FAIL'} {rec.get('title', '?')[:40]}", file=sys.stderr)

    json.dump(results, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    ok = sum(1 for r in results if r.get("ok"))
    print(f"done: {ok}/{len(results)} fetched -> {out_path}", file=sys.stderr)
    if ok < len(results):
        print("FAILURES (review before import):", file=sys.stderr)
        for r in results:
            if not r.get("ok"):
                print(f"  {r.get('title')}: {r.get('url')} :: {r.get('error')}", file=sys.stderr)


if __name__ == "__main__":
    main()
