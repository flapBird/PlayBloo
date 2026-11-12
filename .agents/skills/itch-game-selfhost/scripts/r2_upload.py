#!/usr/bin/env python3
"""Upload a game directory to R2 via wrangler and verify byte-identical.

Usage:
  r2_upload.py --dir /path/to/game --target cdn-assets/games/<slug> [--limit N] [--verify-only]

- Auto-manifest: content-type by extension; cache-control max-age=300 for
  index.html and *.json, 86400 for everything else.
- Bulk upload MUST go through this script (subprocess list args): shell loops
  lose variables in subshells and blow up on quoting (2026-11-07 incident).
- Verification GETs must NOT pass -y: `r2 object get` rejects it (Unknown
  argument) while sometimes still exiting 0.
"""
import argparse, hashlib, os, subprocess, sys, tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed

WRANGLER_CWD = os.environ.get("PLAYBLOO_DIR", "/Users/admin/Documents/Codex/PlayBloo")

CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".mp3": "audio/mpeg",
    ".ogg": "audio/ogg",
    ".wav": "audio/wav",
    ".m4a": "audio/mp4",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".wasm": "application/wasm",
    ".ttf": "font/ttf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".glb": "model/gltf-binary",
    ".exr": "image/x-exr",
    ".bin": "application/octet-stream",
    ".zip": "application/zip",
    ".data": "application/octet-stream",
}
SKIP_NAMES = {".gitignore", ".DS_Store"}


def build_rows(game_dir):
    rows = []
    for root, dirs, files in os.walk(game_dir):
        dirs[:] = [d for d in dirs if d not in (".git",)]
        for f in sorted(files):
            if f in SKIP_NAMES or f.startswith("._"):
                continue
            full = os.path.join(root, f)
            rel = os.path.relpath(full, game_dir)
            ext = os.path.splitext(f)[1].lower()
            if ext not in CONTENT_TYPES:
                print(f"SKIP（未知类型）: {rel}")
                continue
            cc = "public, max-age=300" if f == "index.html" or ext == ".json" else "public, max-age=86400"
            rows.append((rel, full, CONTENT_TYPES[ext], cc))
    return rows


def wrangler(args, timeout=180):
    return subprocess.run(["npx", "--no-install", "wrangler"] + args,
                          capture_output=True, text=True, timeout=timeout, cwd=WRANGLER_CWD)


def upload(row):
    rel, full, ct, cc = row
    p = wrangler(["r2", "object", "put", f"{TARGET}/{rel}", "--file", full,
                  "--remote", "--content-type", ct, "--cache-control", cc, "-y"])
    ok = p.returncode == 0 and "Upload complete" in (p.stdout + p.stderr)
    return (rel, ok, (p.stderr or p.stdout).strip().splitlines()[-1] if not ok else "")


def verify(row):
    rel, full, _, _ = row
    with tempfile.TemporaryDirectory() as td:
        dst = os.path.join(td, "obj")
        p = wrangler(["r2", "object", "get", f"{TARGET}/{rel}", "--file", dst, "--remote"])
        out = p.stdout + p.stderr
        if p.returncode != 0 or "Download complete" not in out:
            return (rel, False, "GET失败: " + out.strip().splitlines()[-1][:120])
        local_md5 = hashlib.md5(open(full, "rb").read()).hexdigest()
        remote_md5 = hashlib.md5(open(dst, "rb").read()).hexdigest()
        return (rel, local_md5 == remote_md5, "字节不一致" if local_md5 != remote_md5 else "")


def main():
    global TARGET
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True, help="游戏本地目录")
    ap.add_argument("--target", required=True, help="桶/前缀，如 cdn-assets/games/<slug>")
    ap.add_argument("--limit", type=int, default=None, help="只处理前 N 个文件（试传用）")
    ap.add_argument("--verify-only", action="store_true", help="跳过上传只做回读校验")
    ap.add_argument("--workers", type=int, default=6)
    args = ap.parse_args()
    TARGET = args.target.rstrip("/")

    game_dir = os.path.abspath(args.dir)
    rows = build_rows(game_dir)
    if args.limit:
        rows = rows[: args.limit]
    if not rows:
        sys.exit("没有可处理的文件")
    print(f"文件数: {len(rows)}  目标: {TARGET}/")

    fails = []
    if not args.verify_only:
        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            for fut in as_completed([pool.submit(upload, r) for r in rows]):
                rel, ok, msg = fut.result()
                if not ok:
                    fails.append(rel)
                    print(f"UPLOAD FAIL {rel}: {msg}")
        print(f"--- 上传完成: {len(rows) - len(fails)}/{len(rows)} ---")

    vfails = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for fut in as_completed([pool.submit(verify, r) for r in rows]):
            rel, ok, msg = fut.result()
            if not ok:
                vfails.append(rel)
                print(f"VERIFY FAIL {rel}: {msg}")
    print(f"--- 回读校验: {len(rows) - len(vfails)}/{len(rows)} 字节一致 ---")

    if fails or vfails:
        sys.exit(1)
    print("=== 全部成功 ===")


if __name__ == "__main__":
    main()
