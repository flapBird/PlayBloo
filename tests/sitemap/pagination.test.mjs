import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../../src/app/sitemap.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

function loadSitemap(games, failAt = -1) {
  const calls = [];
  const client = { from(table) {
    let publishedOnly = false;
    const query = {
      select() { return query; },
      eq(column, value) { if (column === 'is_published' && value) publishedOnly = true; return query; },
      order(column) { assert.equal(column, 'id'); return query; },
      async range(start, end) {
        calls.push([start, end]);
        if (start === failAt) return { data: null, error: { message: 'database unavailable' } };
        const rows = games.filter(game => !publishedOnly || game.is_published);
        return { data: rows.slice(start, end + 1), error: null };
      },
      then(resolve, reject) {
        const data = table === 'categories' ? [{ id: 'category', slug: 'puzzle', updated_at: '2025-01-01' }] : [];
        return Promise.resolve({ data, error: null }).then(resolve, reject);
      },
    };
    return query;
  } };
  const exports = {};
  vm.runInNewContext(compiled, { exports, Date, Map, Set, require(name) {
    if (name === '@/lib/supabase/admin') return { createAdminClient: () => client };
    if (name === '@/lib/guides') return { getGuidesSitemap: () => [] };
    if (name === '@/lib/constants') return { SITE_URL: 'https://playbloo.net', MIN_INDEXABLE_CATEGORY_GAMES: 3, MIN_INDEXABLE_TAG_GAMES: 3, MIN_INDEXABLE_SERIES_GAMES: 3 };
    throw new Error(`Unexpected import ${name}`);
  } });
  return { sitemap: exports.default, calls };
}

const game = (index, is_published = true) => ({ slug: `game-${index}`, updated_at: index < 1000 ? '2025-05-06T00:00:00Z' : '2026-10-19T00:00:00Z', is_published, categories: index >= 1000 ? [{ category_id: 'category' }] : [], tags: [], series: [] });

test('includes more than 1000 published games, preserves dates and counts later-page categories', async () => {
  const games = [...Array.from({ length: 1003 }, (_, index) => game(index)), game('draft', false)];
  const { sitemap, calls } = loadSitemap(games);
  const entries = await sitemap();
  const gameEntries = entries.filter(entry => /\/game\//.test(entry.url));
  assert.equal(gameEntries.length, 1003);
  assert.equal(new Set(gameEntries.map(entry => entry.url)).size, 1003);
  assert.equal(gameEntries[0].lastModified.toISOString(), '2025-05-06T00:00:00.000Z');
  assert.equal(gameEntries.at(-1).lastModified.toISOString(), '2026-10-19T00:00:00.000Z');
  assert.ok(!entries.some(entry => entry.url.endsWith('game-draft')));
  assert.ok(entries.some(entry => entry.url.endsWith('/category/puzzle')));
  assert.deepEqual(calls, [[0, 499], [500, 999], [1000, 1499]]);
});

test('handles empty catalogs and an exact page boundary', async () => {
  for (const count of [0, 500]) {
    const { sitemap, calls } = loadSitemap(Array.from({ length: count }, (_, index) => game(index)));
    const entries = await sitemap();
    assert.equal(entries.filter(entry => /\/game\//.test(entry.url)).length, count);
    assert.equal(calls.length, count === 0 ? 1 : 2);
  }
});

test('fails instead of caching a partial sitemap when any database page fails', async () => {
  for (const failAt of [0, 500]) {
    const { sitemap } = loadSitemap(Array.from({ length: 1003 }, (_, index) => game(index)), failAt);
    await assert.rejects(sitemap(), /Could not load sitemap games: database unavailable/);
  }
});
