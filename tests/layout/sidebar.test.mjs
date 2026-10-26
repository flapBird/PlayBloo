import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as React from 'react';
import * as jsx from 'react/jsx-runtime';
import { renderToStaticMarkup } from 'react-dom/server';
import * as icons from 'lucide-react';

const code = ts.transpileModule(await readFile(new URL('../../src/components/layout/CategorySidebar.tsx', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
function render(url) {
  const location = new URL(url, 'https://playbloo.net');
  const exports = {};
  vm.runInNewContext(code, { exports, require(name) {
    if (name === 'react') return React;
    if (name === 'react/jsx-runtime') return jsx;
    if (name === 'lucide-react') return icons;
    if (name === 'next/navigation') return { usePathname: () => location.pathname, useSearchParams: () => location.searchParams };
    if (name === 'next/link') return { default: (props) => { const attrs = { ...props }; delete attrs.prefetch; return jsx.jsx('a', attrs); } };
    if (name === '@/components/layout/category-icons') return { CategoryIcon: ({ className }) => jsx.jsx('svg', { className }) };
    throw new Error(`Unexpected import ${name}`);
  } });
  return renderToStaticMarkup(jsx.jsx(exports.CategorySidebar, {
    categories: [{ name: 'Arcade', slug: 'arcade', gameCount: 987654 }], children: jsx.jsx('main', { children: 'Page content' }),
  }));
}
const activeLabels = (html) => [...html.matchAll(/<a\b[^>]*aria-label="([^"]+)"[^>]*aria-current="page"/g)].map(match => match[1]);

test('Home and Recently played match their own destinations', () => {
  assert.deepEqual(activeLabels(render('/')), ['Home']);
  assert.deepEqual(activeLabels(render('/recently-played')), ['Recently played']);
});

test('New, Hot Games and Trending are distinct even though they share the search route', () => {
  for (const [url, label] of [
    ['/search', 'New'], ['/search?sort=newest', 'New'],
    ['/search?sort=popular&page=2&view=list', 'Hot Games'], ['/search?sort=trending', 'Trending'],
  ]) assert.deepEqual(activeLabels(render(url)), [label]);
  assert.deepEqual(activeLabels(render('/search?q=chess')), []);
  assert.deepEqual(activeLabels(render('/search?sort=released')), []);
});

test('category and category index remain independently highlighted', () => {
  assert.deepEqual(activeLabels(render('/category/arcade?page=2')), ['Arcade Games']);
  assert.deepEqual(activeLabels(render('/category')), ['All categories']);
});

test('collapsed server markup retains accessible links without showing game counts or hiding page content', () => {
  const html = render('/');
  assert.match(html, /aria-expanded="false"/);
  for (const name of ['Home', 'Recently played', 'New', 'Hot Games', 'Trending', 'Arcade Games']) assert.ok(html.includes(`aria-label="${name}"`));
  assert.doesNotMatch(html, /987654/);
  assert.match(html, /<main>Page content<\/main>/);
});
