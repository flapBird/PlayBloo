import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../../src/lib/catalog.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

/**
 * A stand-in for the PostgREST client that records how the catalogue is read.
 *
 * `games` rows carry their taxonomy memberships nested on the row; the
 * taxonomy tables themselves are tiny and read straight through.
 */
function fakeClient({ rows = [], count = null, failAt = -1 } = {}) {
  const calls = [];
  const client = {
    from(table) {
      let exact = false;
      const query = {
        select(_columns, options) { exact = Boolean(options?.count === 'exact'); return query; },
        eq() { return query; },
        order() { return query; },
        async range(start, end) {
          calls.push({ table, start, end, exact });
          if (start === failAt) return { data: null, error: { message: 'database unavailable' } };
          return { data: rows.slice(start, end + 1), error: null, count };
        },
        then(resolve, reject) {
          const data = table === 'categories'
            ? [{ id: 'category', name: 'Puzzle', slug: 'puzzle', updated_at: '2025-01-01T00:00:00Z' }]
            : table === 'tags'
              ? [{ id: 'tag', slug: 'cozy', updated_at: '2025-01-01T00:00:00Z' }]
              : table === 'series'
                ? [{ id: 'series', slug: 'escape-road', updated_at: '2025-01-01T00:00:00Z' }]
                : [];
          return Promise.resolve({ data, error: null }).then(resolve, reject);
        },
      };
      return query;
    },
  };
  return { client, calls };
}

function loadModule(client) {
  const exports = {};
  vm.runInNewContext(compiled, { exports, console, Promise, Map, Set, require(name) {
    if (name === 'server-only') return {};
    if (name === '@/lib/supabase/admin') return { createAdminClient: () => client };
    throw new Error(`Unexpected import ${name}`);
  } });
  return exports;
}

const gameRow = (index) => ({
  id: `id-${index}`,
  slug: `game-${index}`,
  updated_at: '2025-05-06T00:00:00Z',
  game_categories: index % 2 === 0 ? [{ category_id: 'category' }] : [],
  game_tags: index % 3 === 0 ? [{ tag_id: 'tag' }] : [],
  game_series: index % 5 === 0 ? [{ series_id: 'series' }] : [],
});

test('reads the catalogue in 1000-row pages and asks for the exact count once', async () => {
  const rows = Array.from({ length: 1500 }, (_, index) => gameRow(index));
  const { client, calls } = fakeClient({ rows, count: rows.length });
  const { loadCatalog } = loadModule(client);
  const catalog = await loadCatalog();
  assert.equal(catalog.games.length, 1500);
  assert.deepEqual(calls.filter(call => call.table === 'games'), [
    { table: 'games', start: 0, end: 999, exact: true },
    { table: 'games', start: 1000, end: 1999, exact: false },
  ]);
});

test('reads a single page when the catalogue fits into one', async () => {
  const rows = Array.from({ length: 42 }, (_, index) => gameRow(index));
  const { client, calls } = fakeClient({ rows, count: rows.length });
  const { loadCatalog } = loadModule(client);
  const catalog = await loadCatalog();
  assert.equal(catalog.games.length, 42);
  assert.equal(calls.filter(call => call.table === 'games').length, 1);
});

test('groups the taxonomy memberships that are nested on the game rows', async () => {
  const rows = Array.from({ length: 6 }, (_, index) => gameRow(index));
  const { client } = fakeClient({ rows, count: rows.length });
  const { loadCatalog } = loadModule(client);
  const catalog = await loadCatalog();
  const plain = (value) => JSON.parse(JSON.stringify(value));
  assert.deepEqual(plain(catalog.categoryMembership), [
    { id: 'category', gameIds: ['id-0', 'id-2', 'id-4'] },
  ]);
  assert.deepEqual(plain(catalog.tagMembership), [
    { id: 'tag', gameIds: ['id-0', 'id-3'] },
  ]);
  assert.deepEqual(plain(catalog.seriesMembership), [
    { id: 'series', gameIds: ['id-0', 'id-5'] },
  ]);
});

test('fails instead of returning a partial catalogue when a page fails', async () => {
  const rows = Array.from({ length: 1500 }, (_, index) => gameRow(index));
  const { client } = fakeClient({ rows, count: rows.length, failAt: 1000 });
  const { loadCatalog } = loadModule(client);
  await assert.rejects(loadCatalog(), /Could not load catalogue games: database unavailable/);
});
