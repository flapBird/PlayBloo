import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile(new URL("../src/app/game/[slug]/page.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(`${source}\nexport { getGame, getRecommendationPool, getRelatedGames, queryTimeout };`, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
function load(result, env = {}) {
  const exports = {};
  const query = { select() { return this; }, eq() { return this; }, order() { return this; },
    limit() { return this; }, abortSignal() { return this; }, maybeSingle: async () => result,
    then(resolve, reject) { return Promise.resolve(result).then(resolve, reject); },
  };
  vm.runInNewContext(compiled, { exports, AbortSignal, console, process: { env }, require(name) {
    if (name === "react") return { cache: (fn) => fn };
    if (name === "next/cache") return { unstable_cache: (fn) => fn };
    if (name === "@/lib/supabase/admin") return { createAdminClient: () => ({ from: () => query }) };
    if (name === "@/lib/game-utils") return { getGamePlayMode: (game) => game.mode };
    return {};
  } });
  return exports;
}

test("database errors fail regeneration instead of returning a cacheable not-found result", async () => {
  await assert.rejects(load({ data: null, error: { message: "timeout" } }).getGame("example"), /Could not load game: timeout/);
  assert.equal(await load({ data: null, error: null }).getGame("missing"), null);
});

test("recommendation failures are thrown inside the data cache rather than storing an empty catalog", async () => {
  await assert.rejects(load({ data: null, error: { message: "timeout" } }).getRecommendationPool(), /timeout/);
});

test("bounded recommendation selection preserves ranking, reasons and stable ties over a full pool", () => {
  const { getRelatedGames } = load();
  const current = { id: "current", mode: "embedded" };
  for (const size of [0, 3, 6, 20, 500]) {
    const pool = Array.from({ length: size }, (_, i) => ({
      id: i === 4 ? "current" : String(i), mode: i % 3 ? "embedded" : "external",
      seriesIds: i % 11 === 0 ? ["series"] : [], categoryIds: i % 7 === 0 ? ["category"] : [],
      tagIds: i % 5 === 0 ? ["tag"] : [], is_trending: i % 4 === 0, hot_score: i % 8, play_count: i % 9,
    }));
    const expected = pool.filter((item) => item.id !== current.id).map((candidate) => ({ candidate,
      score: (candidate.seriesIds.length ? 10000 : 0) + (candidate.categoryIds.length ? 1000 : 0) +
        (candidate.tagIds.length ? 100 : 0) + (candidate.mode === "embedded" ? 10 : 0) +
        (candidate.is_trending ? 5 : 0) + Math.min(candidate.hot_score, 4),
      reason: candidate.seriesIds.length ? "Same game series" : candidate.categoryIds.length ? "Similar genre" :
        candidate.tagIds.length ? "Shared gameplay tags" : candidate.mode === "embedded" ? "Also playable here" :
        candidate.is_trending ? "Trending with players" : "Popular discovery",
    })).sort((a, b) => b.score - a.score || b.candidate.play_count - a.candidate.play_count).slice(0, 6)
      .map(({ candidate, reason }) => [candidate.id, reason]);
    const actual = getRelatedGames(current, ["category"], ["tag"], ["series"], pool);
    assert.deepEqual(JSON.parse(JSON.stringify(actual.map((item) => [item.id, item.recommendationReason]))), expected);
  }
});

test("bulk builds have a separate database wait budget from live requests", () => {
  assert.equal(load(undefined, { NEXT_PHASE: "phase-production-build" }).queryTimeout(4000), 30000);
  assert.equal(load().queryTimeout(4000), 4000);
  assert.equal(load().queryTimeout(2000), 2000);
});
