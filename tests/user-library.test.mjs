import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadLibrary({ disabled = false } = {}) {
  const records = new Map();
  let writesDisabled = disabled;
  const storage = {
    getItem(key) { if (disabled) throw Error('blocked'); return records.get(key) || null; },
    setItem(key, value) { if (writesDisabled) throw Error('quota'); records.set(key, value); },
    removeItem(key) { if (writesDisabled) throw Error('quota'); records.delete(key); },
  };
  function load(file, dependencies = {}) {
    const output = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    const testModule = { exports: {} };
    vm.runInNewContext(output, { exports: testModule.exports, module: testModule, require: name => dependencies[name], window: { dispatchEvent() {} }, localStorage: storage, CustomEvent: class {}, Date });
    return testModule.exports;
  }
  const constants = load('src/lib/constants.ts');
  return { api: load('src/lib/user-library.ts', { '@/lib/constants': constants }), constants, records, disableWrites: () => { writesDisabled = true; } };
}

test('favorites preserve more than 30 records and toggle off one record only', () => {
  const { api } = loadLibrary();
  for (let i = 0; i < 35; i++) assert.equal(api.toggleFavorite(`game-${i}`), true);
  assert.equal(api.getFavorites().length, 35);
  assert.equal(api.toggleFavorite('game-12'), false);
  assert.equal(api.getFavorites().length, 34);
  assert.equal(api.isFavorite('game-0'), true);
});

test('failed favorite write reports failure and keeps the saved state', () => {
  const { api, disableWrites } = loadLibrary();
  api.toggleFavorite('saved');
  disableWrites();
  assert.throws(() => api.toggleFavorite('saved'), /could not save/);
  assert.equal(api.isFavorite('saved'), true);
});

test('disabled storage does not break history reads or claim successful removal', () => {
  const { api } = loadLibrary({ disabled: true });
  assert.equal(api.getRecentPlays().length, 0);
  assert.equal(api.removePlayRecord('missing'), false);
});

test('undo restores the original play timestamp without duplicating a record', () => {
  const { api } = loadLibrary();
  api.addPlayRecord({ gameId: 'one', title: 'One', slug: 'one', thumbnailUrl: null });
  const original = api.getRecentPlays()[0];
  assert.equal(api.removePlayRecord('one'), true);
  assert.equal(api.getRecentPlays().length, 0);
  assert.equal(api.restorePlayRecord(original), true);
  assert.equal(api.restorePlayRecord(original), true);
  assert.equal(api.getRecentPlays().length, 1);
  assert.equal(api.getRecentPlays()[0].lastPlayedAt, original.lastPlayedAt);
});
