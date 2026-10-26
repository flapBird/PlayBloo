import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../../src/app/sitemap.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

/**
 * The catalogue read moved into `src/lib/catalog.ts`, which pages through
 * Postgres and groups the taxonomy memberships. This file covers what the
 * sitemap does with that catalogue; the paging itself is covered by
 * tests/catalog/paging.test.mjs.
 */
function loadSitemap(catalog, levels = []) {
  const exports = {};
  const client = {
    from(table) {
      const query = {
        select() { return query; },
        eq() { return query; },
        order() { return query; },
        range() { return query; },
        abortSignal() { return query; },
        then(resolve, reject) {
          const data = table === 'game_levels' ? levels : [];
          return Promise.resolve({ data, error: null }).then(resolve, reject);
        },
      };
      return query;
    },
  };
  vm.runInNewContext(compiled, { exports, Date, Map, Set, AbortSignal, require(name) {
    if (name === 'next/cache') return { unstable_cache: (fn) => fn };
    if (name === '@/lib/query-timeout') return { queryTimeout: (ms) => ms };
    if (name === '@/lib/supabase/admin') return { createAdminClient: () => client };
    if (name === '@/lib/catalog') return { getCachedCatalog: async () => catalog };
    if (name === '@/lib/guides') return { getGuidesSitemap: () => [] };
    if (name === '@/lib/metrics') return { recordMetric: () => {}, startTimer: () => () => 0 };
    if (name === '@/lib/constants') return { SITE_URL: 'https://playbloo.net', MIN_INDEXABLE_CATEGORY_GAMES: 3, MIN_INDEXABLE_TAG_GAMES: 3, MIN_INDEXABLE_SERIES_GAMES: 3 };
    throw new Error(`Unexpected import ${name}`);
  } });
  return exports.default;
}

const game = (index) => ({
  id: `id-${index}`,
  slug: `game-${index}`,
  updated_at: index < 1000 ? '2025-05-06T00:00:00Z' : '2026-10-19T00:00:00Z',
});

const catalogOf = (games, overrides = {}) => ({
  games,
  categories: [{ id: 'category', name: 'Puzzle', slug: 'puzzle', updated_at: '2025-01-01T00:00:00Z' }],
  tags: [{ id: 'tag', slug: 'cozy', updated_at: '2025-01-01T00:00:00Z' }],
  series: [{ id: 'series', slug: 'escape-road', updated_at: '2025-01-01T00:00:00Z' }],
  categoryMembership: [],
  tagMembership: [],
  seriesMembership: [],
  ...overrides,
});

test('emits every published game with its own lastmod', async () => {
  const games = [...Array.from({ length: 1003 }, (_, index) => game(index))];
  const entries = await loadSitemap(catalogOf(games))();
  const gameEntries = entries.filter(entry => /\/game\/game-\d+$/.test(entry.url));
  assert.equal(gameEntries.length, 1003);
  assert.equal(new Set(gameEntries.map(entry => entry.url)).size, 1003);
  assert.equal(gameEntries[0].lastModified.toISOString(), '2025-05-06T00:00:00.000Z');
  assert.equal(gameEntries.at(-1).lastModified.toISOString(), '2026-10-19T00:00:00.000Z');
});

test('includes a category page once it holds enough published games', async () => {
  const games = Array.from({ length: 5 }, (_, index) => game(index));
  const catalog = catalogOf(games, {
    categoryMembership: [{ id: 'category', gameIds: games.map(entry => entry.id) }],
  });
  const entries = await loadSitemap(catalog)();
  const categoryEntry = entries.find(entry => entry.url.endsWith('/category/puzzle'));
  assert.ok(categoryEntry, 'category page should be listed');
  assert.equal(categoryEntry.lastModified.toISOString(), '2025-05-06T00:00:00.000Z');
});

test('leaves out a category page that holds too few published games', async () => {
  const games = Array.from({ length: 2 }, (_, index) => game(index));
  const catalog = catalogOf(games, {
    categoryMembership: [{ id: 'category', gameIds: games.map(entry => entry.id) }],
  });
  const entries = await loadSitemap(catalog)();
  assert.ok(!entries.some(entry => entry.url.endsWith('/category/puzzle')));
});

test('handles an empty catalogue', async () => {
  const entries = await loadSitemap(catalogOf([]))();
  assert.equal(entries.filter(entry => /\/game\/game-/.test(entry.url)).length, 0);
  assert.ok(entries.some(entry => entry.url === 'https://playbloo.net/'));
});

test('lists the level pages of games that have levels', async () => {
  const levels = [
    { slug: 'level-one', updated_at: '2025-03-01T00:00:00Z', games: { slug: 'game-0' } },
    { slug: 'level-two', updated_at: '2025-04-01T00:00:00Z', games: { slug: 'game-0' } },
  ];
  const entries = await loadSitemap(catalogOf([game(0)]), levels)();
  assert.ok(entries.some(entry => entry.url.endsWith('/game/game-0/level')));
  assert.ok(entries.some(entry => entry.url.endsWith('/game/game-0/level/level-one')));
  assert.equal(
    entries.find(entry => entry.url.endsWith('/game/game-0/level/level-one')).lastModified.toISOString(),
    '2025-03-01T00:00:00.000Z',
  );
});
