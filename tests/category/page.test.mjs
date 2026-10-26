import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as jsx from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';

const code = ts.transpileModule(await readFile(new URL('../../src/app/category/[slug]/page.tsx', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const arcade = { id: 'arcade-id', name: 'Arcade', slug: 'arcade', content_verified: true,
  meta_title: 'Arcade Games – Play Free Online Arcade Games', meta_description: 'Free arcade games in your browser.',
  description: 'Play quick arcade challenges.', source_url: 'https://example.com/editorial' };
const props = (page = '1') => ({ params: Promise.resolve({ slug: 'arcade' }), searchParams: Promise.resolve({ page }) });
function load({ category = arcade, total = 196, length = 24 } = {}) {
  const exports = {};
  vm.runInNewContext(code, { exports, require(name) {
    if (name === 'react/jsx-runtime') return jsx;
    if (name === 'next/navigation') return { notFound: () => { throw new Error('NOT_FOUND'); } };
    if (name === 'next/link') return { default: (props) => {
      const attributes = { ...props };
      delete attributes.prefetch;
      return jsx.jsx('a', attributes);
    } };
    if (name === 'lucide-react') return { ChevronLeft: () => null, ChevronRight: () => null };
    if (name === '@/components/games/GameCard') return { GameCard: ({ game }) => jsx.jsx('article', { 'data-game-card': game.id }) };
    if (name === '@/components/seo/JsonLd') return { BreadcrumbJsonLd: () => null };
    if (name === '@/components/layout/category-icons') return { CategoryIcon: () => null };
    if (name === '@/lib/category-data') return { getCategory: async () => category,
      getCategoryGames: async () => ({ total, games: Array.from({ length }, (_, i) => ({ id: String(i) })) }) };
    if (name === '@/lib/constants') return { SITE_URL: 'https://playbloo.net', PAGE_SIZE: 24, MIN_INDEXABLE_CATEGORY_GAMES: 3 };
    throw new Error(`Unexpected import ${name}`);
  } });
  return exports;
}

test('category renders cover cards and its introduction without editorial clutter', async () => {
  const html = renderToStaticMarkup(await load().default(props()));
  assert.equal((html.match(/data-game-card=/g) || []).length, 24);
  assert.match(html, /Arcade Games<\/h1>/);
  assert.match(html, /Play quick arcade challenges/);
  assert.doesNotMatch(html, /Browse by genre|Editorial source|games found|Related genres/);
});

test('keyword metadata, paginated canonical and thin-category noindex are preserved', async () => {
  const metadata = await load().generateMetadata(props('2'));
  assert.equal(metadata.title, arcade.meta_title);
  assert.equal(metadata.description, arcade.meta_description);
  assert.equal(metadata.alternates.canonical, '/category/arcade?page=2');
  assert.equal(metadata.robots, undefined);
  assert.equal((await load({ total: 2, length: 2 }).generateMetadata(props())).robots.index, false);
});

test('pagination can reach and highlight page 11 instead of stopping at page 10', async () => {
  const html = renderToStaticMarkup(await load({ total: 252, length: 12 }).default(props('11')));
  assert.match(html, /aria-label="Page 11" aria-current="page"/);
  assert.match(html, /href="\/category\/arcade\?page=10"/);
  assert.doesNotMatch(html, /aria-label="Next page"/);
});

test('genuinely missing categories and out-of-range pages still return not found', async () => {
  await assert.rejects(load({ category: null }).default(props()), /NOT_FOUND/);
  await assert.rejects(load({ category: null }).generateMetadata(props()), /NOT_FOUND/);
  await assert.rejects(load().default(props('99')), /NOT_FOUND/);
});
