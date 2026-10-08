#!/usr/bin/env python3
"""Read-only identity preflight. Input: two JSON arrays; output: decisions on stdout."""

import argparse
import json
import re
import unicodedata
from collections import defaultdict
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

URL_FIELDS = (
    "source_url", "original_game_url", "itch_url", "steam_url", "external_url",
    "resolved_url", "canonical_url",
)


def url_key(value):
    if not isinstance(value, str):
        return None
    try:
        url = urlsplit(value.strip())
        if url.scheme.lower() not in {"http", "https"} or not url.hostname:
            return None
        host = url.hostname.lower()
        if url.username or url.password:
            return None
        port = url.port
    except ValueError:
        return None
    path = url.path.rstrip("/")
    if host.endswith(".itch.io") and host != "www.itch.io":
        project = path.strip("/").split("/")[0]
        creator = host[:-len(".itch.io")]
        if re.fullmatch(r"[a-z0-9-]+", creator) and re.fullmatch(r"[A-Za-z0-9_-]+", project):
            return "itch:" + creator + "/" + project.lower()
    if host in {"store.steampowered.com", "www.store.steampowered.com"}:
        app = re.match(r"^/app/(\d+)(?:/|$)", path)
        if app:
            return "steam:" + str(int(app.group(1)))
    query = [(key, val) for key, val in parse_qsl(url.query, keep_blank_values=True)
             if not key.lower().startswith("utm_") and key.lower() not in {"fbclid", "gclid"}]
    # Shared homepages are insufficient to identify one game.
    if not path and not query:
        return None
    netloc = host if not port or (url.scheme.lower(), port) in {("http", 80), ("https", 443)} else f"{host}:{port}"
    return "url:" + urlunsplit((url.scheme.lower(), netloc, path, urlencode(sorted(query)), ""))


def identities(game):
    keys = set()
    itch = game.get("itch_project_slug")
    if isinstance(itch, str) and re.fullmatch(r"[a-zA-Z0-9-]+/[a-zA-Z0-9_-]+", itch.strip()):
        keys.add("itch:" + itch.strip().lower())
    steam = str(game.get("steam_app_id") or "").strip()
    if steam.isdigit():
        keys.add("steam:" + str(int(steam)))
    urls = [game.get(field) for field in URL_FIELDS]
    aliases = game.get("identity_urls", [])
    if not isinstance(aliases, list) or any(not isinstance(url, str) for url in aliases):
        raise ValueError("identity_urls must be an array of confirmed same-game URLs")
    urls.extend(aliases)
    keys.update(key for url in urls if (key := url_key(url)))
    return keys


def title_key(game):
    title = game.get("title") or ""
    if not isinstance(title, str):
        raise ValueError("title must be a string")
    return "".join(char for char in unicodedata.normalize("NFKC", title).casefold() if char.isalnum())


def read_rows(path):
    with open(path, encoding="utf-8") as handle:
        rows = json.load(handle)
    if not isinstance(rows, list) or any(not isinstance(row, dict) for row in rows):
        raise ValueError(f"{path}: expected an array of game objects")
    return rows


def classify(existing, candidates):
    identity_index, title_index, slug_index = (defaultdict(set) for _ in range(3))
    batch_identity, batch_title, batch_slug = (defaultdict(set) for _ in range(3))
    for index, game in enumerate(existing):
        for key in identities(game):
            identity_index[key].add(index)
        if title_key(game):
            title_index[title_key(game)].add(index)
        if game.get("slug"):
            slug_index[game["slug"]].add(index)
    results = []
    for index, game in enumerate(candidates):
        keys, title, slug = identities(game), title_key(game), game.get("slug")
        exact = set().union(*(identity_index[key] for key in keys)) if keys else set()
        batch = set().union(*(batch_identity[key] for key in keys)) if keys else set()
        names = title_index.get(title, set()) if title else set()
        batch_names = batch_title.get(title, set()) if title else set()
        if len(exact) > 1:
            decision = "review-identity-conflict"
        elif exact:
            decision = "duplicate-existing"
        elif batch:
            decision = "duplicate-batch"
        elif names or batch_names:
            decision = "review-same-title"
        elif not keys:
            decision = "review-missing-identity"
        else:
            decision = "new"
        results.append({
            "inputIndex": index + 1, "title": game.get("title"), "decision": decision,
            "identities": sorted(keys),
            "existingMatches": [{"arrayIndex": hit, "id": existing[hit].get("id"),
                                 "slug": existing[hit].get("slug")}
                                for hit in sorted(exact or names)],
            "batchMatches": [hit + 1 for hit in sorted(batch or batch_names)],
            "slugConflict": bool(slug and (slug_index.get(slug) or batch_slug.get(slug))),
        })
        for key in keys:
            batch_identity[key].add(index)
        if title:
            batch_title[title].add(index)
        if slug:
            batch_slug[slug].add(index)
    counts = defaultdict(int)
    for result in results:
        counts[result["decision"]] += 1
    return {"inputCount": len(candidates), "counts": dict(counts), "entries": results}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--existing", required=True)
    parser.add_argument("--candidates", required=True)
    args = parser.parse_args()
    try:
        result = classify(read_rows(args.existing), read_rows(args.candidates))
    except (ValueError, OSError) as error:
        parser.exit(2, f"Invalid input: {error}\n")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
