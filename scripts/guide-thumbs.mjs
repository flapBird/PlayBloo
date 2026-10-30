import { mkdir, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const GUIDES_DIR = path.join(ROOT, "src/lib/guides");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC_DIR, "images/guides/thumbs");
const COVER_SRC = /cover:\s*\{[^}]*?src:\s*["'](\/images\/guides\/[^"']+)["']/g;

const sources = new Set();
for (const file of await readdir(GUIDES_DIR)) {
  if (!file.endsWith(".ts")) continue;
  const text = await readFile(path.join(GUIDES_DIR, file), "utf8");
  for (const match of text.matchAll(COVER_SRC)) sources.add(match[1]);
}

await mkdir(OUT_DIR, { recursive: true });
let created = 0;
let skipped = 0;
for (const src of [...sources].sort()) {
  const input = path.join(PUBLIC_DIR, src);
  const output = path.join(OUT_DIR, `${path.basename(src, path.extname(src))}.webp`);
  try {
    const [inputStat, outputStat] = await Promise.all([stat(input), stat(output).catch(() => null)]);
    if (outputStat && outputStat.mtimeMs >= inputStat.mtimeMs) {
      skipped += 1;
      continue;
    }
    await sharp(input)
      .resize(88, 64, { fit: "cover", position: sharp.strategy.attention })
      .webp({ quality: 70 })
      .toFile(output);
    created += 1;
  } catch (error) {
    console.warn(`skip ${src}: ${error.message}`);
  }
}
console.log(`guide thumbs: ${created} created, ${skipped} up to date, ${sources.size} covers`);
