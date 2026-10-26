import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const code = ts.transpileModule(await readFile(new URL('../../src/lib/category-data.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function setup(initial) {
  const state = { result: initial };
  const calls = [];
  const stored = new Map();
  const client = { from(table) {
    const call = { table, filters: [], order: [] };
    const query = {
      select(columns, options) { call.columns = columns; call.options = options; return query; },
      eq(...args) { call.filters.push(args); return query; },
      maybeSingle() { call.maybeSingle = true; return query; },
      order(...args) { call.order.push(args); return query; },
      range(...args) { call.range = args; return query; },
      abortSignal(signal) { assert.ok(signal instanceof AbortSignal); return query; },
      then(resolve, reject) { calls.push(call); return Promise.resolve(state.result).then(resolve, reject); },
    };
    return query;
  } };
  const exports = {};
  vm.runInNewContext(code, { exports, AbortSignal, require(name) {
    if (name === 'server-only') return {};
    if (name === 'react') return { cache: (fn) => fn };
    if (name === 'next/cache') return { unstable_cache: (fn, keys) => async () => {
      const key = JSON.stringify(keys);
      if (!stored.has(key)) stored.set(key, await fn());
      return stored.get(key);
    } };
    if (name === '@/lib/supabase/admin') return { createAdminClient: () => client };
    if (name === '@/lib/query-timeout') return { queryTimeout: (ms) => ms };
    if (name === '@/lib/constants') return { PAGE_SIZE: 24 };
    if (name === '@/lib/discovery-data') return { HOME_GAME_CARD_FIELDS: 'id,title,slug,thumbnail_url', normalizePublicGameCards: (data) => data || [] };
    throw new Error(`Unexpected import ${name}`);
  } });
  return { ...exports, state, calls };
}

const category = { id: 'arcade-id', slug: 'arcade', name: 'Arcade' };

test('a failed category read is not cached as missing, and the next read recovers', async () => {
  const app = setup({ data: null, error: { message: 'fetch failed' } });
  await assert.rejects(app.getCategory('arcade'), /Could not load category: fetch failed/);
  app.state.result = { data: category, error: null };
  assert.deepEqual(await app.getCategory('arcade'), category);
  assert.deepEqual(await app.getCategory('arcade'), category);
  assert.equal(app.calls.length, 2);
  assert.ok(app.calls[0].maybeSingle);
});

test('only a successful empty read represents a missing category', async () => {
  const app = setup({ data: null, error: null });
  assert.equal(await app.getCategory('missing'), null);
});

test('games are filtered and paged in the database, including categories above the old ID cap', async () => {
  const app = setup({ data: [{ id: 'game' }], count: 1250, error: null });
  const result = await app.getCategoryGames('arcade-id', 'arcade', 42);
  assert.equal(result.total, 1250);
  assert.equal(result.games.length, 1);
  assert.equal(app.calls.length, 1);
  const call = app.calls[0];
  assert.equal(call.table, 'games');
  assert.match(call.columns, /category_filter:game_categories!inner\(category_id\)/);
  assert.deepEqual(call.filters, [['is_published', true], ['category_filter.category_id', 'arcade-id']]);
  assert.deepEqual(call.range, [984, 1007]);
  assert.equal(call.options.count, 'exact');
  assert.equal(call.order.at(-1)[0], 'id');
});

test('failed game reads reject instead of caching an empty or noindex collection', async () => {
  const app = setup({ data: null, error: { message: 'timeout' } });
  await assert.rejects(app.getCategoryGames('arcade-id', 'arcade', 1), /Could not load category games: timeout/);
  app.state.result = { data: [{ id: 'recovered' }], count: 196, error: null };
  assert.equal((await app.getCategoryGames('arcade-id', 'arcade', 1)).total, 196);
});
