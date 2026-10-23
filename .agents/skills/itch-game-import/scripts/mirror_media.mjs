// Mirror itch covers + screenshots into Supabase Storage as WebP, keeping GIF
// animation intact (animated WebP), and point games.thumbnail_url /
// games.screenshots at the mirrored objects.
//
// Usage:
//   node .agents/skills/itch-game-import/scripts/mirror_media.mjs \
//     --enriched /tmp/itch-import/enriched.json --batch 2026-10-21
//
// Options:
//   --enriched <path>  enriched.json from parse_and_fetch.py (required)
//   --batch <date>     folder name under covers/ and screenshots/ (required)
//   --covers-only      skip screenshots
//   --repo <path>      repo root (default: this script's ../..)
//
// Why animated WebP instead of the raw GIF:
//   * itch covers are sometimes animated GIFs; the user-facing requirement is
//     that those covers keep moving on the site.
//   * animated WebP is roughly 70-90% smaller than the source GIF at the same
//     frame rate, and every browser we target plays it.
//   * sharp cannot be used for GIFs: it stacks the frames into one tall
//     strip instead of animating. ffmpeg + libwebp does it correctly.
//
// Gotchas baked in (each one broke production at least once):
//   * The storage public URL MUST include the bucket name:
//       /storage/v1/object/public/game-media/covers/<batch>/<slug>.webp
//   * ALL supabase.co traffic must go DIRECT; through a local proxy it fails
//     with nonsense errors such as "Bucket not found".
//   * itch image downloads go direct with pacing (0.35s); the proxy egress is
//     rate-limited by itch and returns HTTP 400 on bursts.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const require = createRequire(import.meta.url);
const sharp = require(path.join(process.env.PLAYBLOO_REPO || "/Users/admin/Documents/Codex/PlayBloo", "node_modules/sharp"));

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const BUCKET = "game-media";
// Seven days. Long enough for the CDN and the browser to stop revalidating
// the cover on every view, short enough that a replaced cover still reaches
// visitors within a week.
const CACHE_CONTROL = "max-age=604800";
const args = process.argv.slice(2);
const opt = (name, fallback = "") => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const ENRICHED = opt("--enriched");
const BATCH = opt("--batch");
const REPO = opt("--repo", "/Users/admin/Documents/Codex/PlayBloo");
const COVERS_ONLY = args.includes("--covers-only");
if (!ENRICHED || !BATCH) {
  console.error("usage: node mirror_media.mjs --enriched <enriched.json> --batch <YYYY-MM-DD>");
  process.exit(1);
}

const env = {};
for (const line of readFileSync(`${REPO}/.env.local`, "utf8").split("\n")) {
  if (line.includes("=")) {
    const i = line.indexOf("=");
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
}
const BASE = env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const auth = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const TMP = path.join(tmpdir(), `itch-media-${BATCH}`);
mkdirSync(TMP, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function rest(p, body, method = "GET") {
  const res = await fetch(BASE + p, {
    method,
    headers: { ...auth, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${p} -> ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

async function download(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${url} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 200) throw new Error(`suspicious tiny download (${buf.length}B) ${url}`);
  return buf;
}

async function upload(objectPath, buf) {
  const res = await fetch(`${BASE}/storage/v1/object/${BUCKET}/${objectPath}`, {
    method: "POST",
    // The cache-control header is what the Storage API stores as the object's
    // cacheControl. Without it the object is stored as `no-cache`, which makes
    // the CDN revalidate every cover on every page view — that alone burned
    // the Free plan's log-ingestion quota. The `cacheControl` query parameter
    // does NOT work here: it resets the object back to `no-cache`.
    headers: { ...auth, "Content-Type": "image/webp", "x-upsert": "true", "cache-control": CACHE_CONTROL },
    body: buf,
  });
  if (!res.ok) throw new Error(`upload ${objectPath} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

async function publicGet(objectPath) {
  const url = `${BASE}/storage/v1/object/public/${BUCKET}/${objectPath}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`public GET ${objectPath} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return {
    url,
    bytes: buf.length,
    ctype: res.headers.get("content-type"),
    sha256: crypto.createHash("sha256").update(buf).digest("hex"),
  };
}

// Animated GIF -> animated WebP. sharp cannot do this (it stacks frames into
// a tall strip), so ffmpeg + libwebp is the only reliable route.
//
// Covers use a leaner setting than screenshots: a cover is shown small on
// cards, so frame rate and quality are trimmed to keep the animated file
// around a megabyte instead of two or more.
function gifToAnimatedWebp(raw, name, { maxWidth, fps, quality }) {
  const gif = path.join(TMP, `${name}.gif`);
  const out = path.join(TMP, `${name}.webp`);
  writeFileSync(gif, raw);
  execFileSync("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y", "-i", gif,
    "-vf", `fps=${fps},scale='min(${maxWidth},iw)':-2:flags=lanczos`,
    "-c:v", "libwebp", "-quality", String(quality), "-loop", "0", "-vsync", "0", out,
  ]);
  return readFileSync(out);
}

function isGif(url) {
  return /\.gif($|\?)/i.test(url);
}

async function convert(raw, url, name, { maxWidth, quality, anim }) {
  if (isGif(url)) {
    const buf = gifToAnimatedWebp(raw, name, {
      maxWidth: anim.maxWidth,
      fps: anim.fps,
      quality: anim.quality,
    });
    return { buf, animated: true };
  }
  const buf = await sharp(raw, { animated: false })
    .resize({ width: maxWidth, height: maxWidth, fit: "inside", withoutEnlargement: true })
    .webp({ quality, effort: 4 })
    .toBuffer();
  return { buf, animated: false };
}

// Animated covers: 6 fps at 560px keeps the motion (the point of mirroring
// them as animated WebP) while holding the heaviest case around 1 MB.
const COVER_OPTS = { maxWidth: 640, quality: 82, anim: { maxWidth: 560, fps: 6, quality: 42 } };
const SHOT_OPTS = { maxWidth: 1280, quality: 78, anim: { maxWidth: 640, fps: 10, quality: 52 } };

const enriched = JSON.parse(readFileSync(ENRICHED, "utf8"));
const slugs = enriched.map((g) => g.url.split(".itch.io/")[1]);
const games = await rest(`/rest/v1/games?select=id,slug,title,thumbnail_url,screenshots&slug=in.(${slugs.join(",")})`);
const bySlug = new Map(games.map((g) => [g.slug, g]));

const manifest = { batch: BATCH, entries: [], errors: [] };

for (const rec of enriched) {
  const slug = rec.url.split(".itch.io/")[1];
  const game = bySlug.get(slug);
  if (!game) {
    manifest.errors.push(`${slug}: not found in DB`);
    continue;
  }
  const entry = { slug, title: rec.title, cover: null, screenshots: [] };

  const coverUrl = rec.rss_cover || rec.og_image;
  try {
    const raw = await download(coverUrl);
    await sleep(350);
    const { buf, animated } = await convert(raw, coverUrl, `cover-${slug}`, COVER_OPTS);
    const objectPath = `covers/${BATCH}/${slug}.webp`;
    await upload(objectPath, buf);
    const check = await publicGet(objectPath);
    await rest(`/rest/v1/games?id=eq.${game.id}`, { thumbnail_url: check.url }, "PATCH");
    entry.cover = {
      source: coverUrl, objectPath, url: check.url, sourceBytes: raw.length,
      bytes: check.bytes, ctype: check.ctype, sha256: check.sha256, animated,
    };
  } catch (e) {
    manifest.errors.push(`${slug} cover: ${e.message}`);
  }

  if (!COVERS_ONLY) {
    const shots = (rec.screenshots || []).slice(0, 6);
    const newShots = [];
    for (let i = 0; i < shots.length; i++) {
      const src = shots[i];
      try {
        const raw = await download(src);
        await sleep(350);
        const { buf, animated } = await convert(raw, src, `shot-${slug}-${i + 1}`, SHOT_OPTS);
        const objectPath = `screenshots/${BATCH}/${slug}-${i + 1}.webp`;
        await upload(objectPath, buf);
        const check = await publicGet(objectPath);
        newShots.push(check.url);
        entry.screenshots.push({
          source: src, objectPath, url: check.url, sourceBytes: raw.length,
          bytes: check.bytes, ctype: check.ctype, sha256: check.sha256, animated,
        });
      } catch (e) {
        manifest.errors.push(`${slug} screenshot ${i + 1}: ${e.message}`);
      }
    }
    if (newShots.length === shots.length && newShots.length > 0) {
      await rest(`/rest/v1/games?id=eq.${game.id}`, { screenshots: newShots }, "PATCH");
    }
  }

  manifest.entries.push(entry);
  console.log(
    `${slug}: cover ${entry.cover ? entry.cover.bytes + "B" + (entry.cover.animated ? " (animated)" : "") : "FAILED"}, ` +
    `${entry.screenshots.length} screenshots (${entry.screenshots.filter((s) => s.animated).length} animated)`
  );
}

const outDir = `/tmp/itch-import-${BATCH}`;
mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "media-manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 1));
console.log(`\nmanifest -> ${outPath}`);
console.log(`ERRORS: ${manifest.errors.length}`);
for (const e of manifest.errors) console.log(" -", e);
