import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/game-cache.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function load(result = { data: null, error: null }) {
  const paths = [], tags = [], exports = {};
  const query = { select() { return this; }, eq() { return this; }, maybeSingle: async () => result };
  vm.runInNewContext(compiled, { exports, require(name) {
    if (name === "next/cache") return {
      revalidatePath: (...args) => paths.push(args), revalidateTag: (...args) => tags.push(args),
    };
    if (name === "@/lib/supabase/admin") return { createAdminClient: () => ({ from: () => query }) };
    throw new Error(`Unexpected import: ${name}`);
  } });
  return { ...exports, paths, tags };
}
const game = (slug = "example") => ({ slug, is_published: true,
  categories: [{ categories: { slug: "puzzle" } }], tags: [{ tags: { slug: "logic" } }],
  series: [{ series: { slug: "example-series" } }],
});

test("editing content invalidates only the affected taxonomy paths, not the whole catalog", () => {
  const app = load();
  app.revalidateGameChange(game(), game());
  assert.deepEqual(app.paths.filter(([path]) => path.startsWith("/game/")), [["/game/example", "layout"]]);
  for (const path of ["/category/puzzle", "/tag/logic", "/series/example-series", "/sitemap.xml"]) {
    assert.ok(app.paths.some(([value]) => value === path));
  }
  assert.ok(app.paths.every(([path]) => !path.includes("[slug]")));
  assert.deepEqual(app.tags.map(([tag]) => tag).sort(), ["category:puzzle", "tag:logic"]);
});

test("moving a game invalidates old and new taxonomy memberships and both slug subtrees", () => {
  const app = load();
  const after = { ...game("renamed"), categories: [{ categories: [{ slug: "arcade" }] }], tags: [], series: [] };
  app.revalidateGameChange(game(), after);
  for (const path of ["/game/example", "/game/renamed", "/category/puzzle", "/category/arcade", "/tag/logic", "/series/example-series"]) {
    assert.ok(app.paths.some(([value]) => value === path), path);
  }
  for (const tag of ["public-category-catalog", "public-recommendations", "public-search-options"]) {
    assert.ok(app.tags.some(([value, profile]) => value === tag && profile.expire === 0));
  }
});

test("publish, unpublish and delete invalidate sitemap, shared catalog and dependent walkthroughs", () => {
  for (const [before, after] of [[null, game()], [game(), { ...game(), is_published: false }], [game(), null]]) {
    const app = load();
    app.revalidateGameChange(before, after);
    assert.ok(app.paths.some(([path, type]) => path === "/game/example" && type === "layout"));
    assert.ok(app.paths.some(([path]) => path === "/sitemap.xml"));
    assert.ok(app.tags.some(([tag]) => tag === "public-recommendations"));
  }
});

test("failed dependency reads do not masquerade as missing games", async () => {
  const app = load({ data: null, error: { message: "database unavailable" } });
  await assert.rejects(app.getGameCacheSnapshot("id"), /database unavailable/);
  assert.equal(app.paths.length, 0);
  assert.equal(await load().getGameCacheSnapshot("missing"), null);
});
