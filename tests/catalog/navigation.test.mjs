import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const compile = async (name) => ts.transpileModule(
  await readFile(new URL(`../../src/lib/${name}.ts`, import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
const catalogCode = await compile('catalog');
const navCode = await compile('category-nav');

function setup({ games = [], categories = [], failure = null } = {}) {
  const state = { failure };
  const calls = [];
  const warnings = [];
  const cacheOptions = [];
  const client = {
    from(table) {
      let start = 0, end = 999, columns, count = false, published = false;
      const query = {
        select(value, options) { columns = value; count = options?.count === 'exact'; return query; },
        eq(column, value) { if (column === 'is_published') published = value; return query; },
        order() { return query; },
        range(first, last) { start = first; end = last; return query; },
        abortSignal(signal) { assert.ok(signal instanceof AbortSignal); return query; },
        then(resolve, reject) {
          calls.push({ table, columns, start, end, published });
          if (state.failure === table) return Promise.resolve({ data: null, error: { message: 'TimeoutError' } }).then(resolve, reject);
          const rows = table === 'games' ? games.filter(game => !published || game.is_published) : categories;
          return Promise.resolve({ data: rows.slice(start, end + 1), error: null, count: count ? rows.length : null }).then(resolve, reject);
        },
      };
      return query;
    },
  };
  let catalog;
  const require = (name) => {
    if (name === 'server-only') return {};
    if (name === 'next/cache') return { unstable_cache(fn, _key, options) {
      cacheOptions.push(options);
      let result;
      return async () => { if (result === undefined) result = await fn(); return result; };
    } };
    if (name === '@/lib/supabase/admin') return { createAdminClient: () => client };
    if (name === '@/lib/query-timeout') return { queryTimeout: (ms) => ms };
    if (name === '@/lib/constants') return { MIN_INDEXABLE_CATEGORY_GAMES: 3 };
    if (name === '@/lib/catalog') return catalog;
    throw new Error(`Unexpected import ${name}`);
  };
  const load = (code) => {
    const exports = {};
    vm.runInNewContext(code, { exports, require, AbortSignal, console: { warn: (...args) => warnings.push(args) } });
    return exports;
  };
  catalog = load(catalogCode);
  return { ...load(navCode), calls, warnings, cacheOptions, state };
}
const category = (id, name = id) => ({ id, name, slug: id });
const game = (id, categoryId, plays = 0, published = true) => ({
  id: String(id), is_published: published, play_count: plays,
  game_categories: [{ category_id: categoryId }],
});
const plain = (value) => JSON.parse(JSON.stringify(value));

test('navigation ranks by published plays, counts and name; excludes thin categories', async () => {
  const games = [
    ...Array.from({ length: 4 }, (_, i) => game(`casual-${i}`, 'casual', 1)),
    ...Array.from({ length: 3 }, (_, i) => game(`idle-${i}`, 'idle', 10)),
    ...Array.from({ length: 3 }, (_, i) => game(`action-${i}`, 'action', 10)),
    ...Array.from({ length: 5 }, (_, i) => game(`puzzle-${i}`, 'puzzle', 6)),
    game('hidden', 'casual', 10000, false), game('thin', 'clicker', 10000),
  ];
  const app = setup({ games, categories: ['casual', 'idle', 'action', 'puzzle', 'clicker', 'empty'].map(id => category(id)) });
  assert.deepEqual(plain(await app.getCategoryNav()), [
    { name: 'puzzle', slug: 'puzzle', gameCount: 5 },
    { name: 'action', slug: 'action', gameCount: 3 },
    { name: 'idle', slug: 'idle', gameCount: 3 },
    { name: 'casual', slug: 'casual', gameCount: 4 },
  ]);
  assert.deepEqual(app.calls.map(call => [call.table, call.columns]).sort(([a], [b]) => a.localeCompare(b)), [
    ['categories', 'id, name, slug'], ['games', 'id, play_count, game_categories(category_id)'],
  ]);
  const requests = app.calls.length;
  await app.getCategoryNav();
  assert.equal(app.calls.length, requests, 'successful navigation is cached');
  assert.deepEqual(plain(app.cacheOptions.at(-1)), {
    revalidate: 3600, tags: ['public-category-catalog', 'public-recommendations'],
  });
});

test('navigation counts games beyond the first 1000 rows', async () => {
  const app = setup({ categories: [category('idle')], games: Array.from({ length: 1005 }, (_, i) => game(i, 'idle')) });
  assert.equal((await app.getCategoryNav())[0].gameCount, 1005);
  assert.deepEqual(app.calls.filter(call => call.table === 'games').map(call => call.start), [0, 1000]);
});

for (const failure of ['games', 'categories']) {
  test(`${failure} timeout does not break layout or cache an empty result; next read recovers`, async () => {
    const app = setup({ failure, categories: [category('idle')], games: [0, 1, 2].map(i => game(i, 'idle')) });
    assert.deepEqual(plain(await app.getCategoryNav()), []);
    assert.equal(app.warnings.length, 1);
    app.state.failure = null;
    assert.deepEqual(plain(await app.getCategoryNav()), [{ name: 'idle', slug: 'idle', gameCount: 3 }]);
  });
}
