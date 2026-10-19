import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { TABLES, readAllRows, saveSnapshot } from './snapshot.mjs';

function fakeClient(rows, { cap = Infinity, response } = {}) {
  const requests = [];
  return {
    requests,
    from(table) {
      const request = { table, order: [] };
      return {
        select(columns, options) { request.columns = columns; request.options = options; return this; },
        order(column, options) { request.order.push({ column, ...options }); return this; },
        async range(start, end) {
          request.start = start;
          request.end = end;
          requests.push(request);
          if (response) return response(request, requests.length);
          const sorted = [...rows].sort((a, b) => {
            for (const { column } of request.order) {
              if (a[column] < b[column]) return -1;
              if (a[column] > b[column]) return 1;
            }
            return 0;
          });
          return { data: sorted.slice(start, start + Math.min(cap, end - start + 1)), error: null, count: rows.length };
        },
      };
    },
  };
}

test('reads beyond 1000 rows in stable id order and stops at the exact count', async () => {
  const rows = Array.from({ length: 2507 }, (_, id) => ({ id, title: `Game ${id}` })).reverse();
  const client = fakeClient(rows);
  const result = await readAllRows(client, 'games');
  assert.deepEqual(result.map(({ id }) => id), Array.from({ length: 2507 }, (_, id) => id));
  assert.deepEqual(client.requests.map(({ start, end }) => [start, end]), [[0, 999], [1000, 1999], [2000, 2999]]);
  for (const request of client.requests) {
    assert.deepEqual(request.order, [{ column: 'id', ascending: true }]);
    assert.deepEqual(request.options, { count: 'exact' });
  }
});

test('advances by actual rows when the server caps pages below the requested size', async () => {
  const rows = Array.from({ length: 1135 }, (_, id) => ({ id }));
  const client = fakeClient(rows, { cap: 200 });
  const result = await readAllRows(client, 'games');
  assert.equal(result.length, 1135);
  assert.deepEqual(client.requests.map(({ start }) => start), [0, 200, 400, 600, 800, 1000]);
});

for (const { table, identity } of TABLES.filter(({ identity }) => identity.length > 1)) {
  test(`${table} sorts by its complete composite identity`, async () => {
    const [first, second] = identity;
    const rows = [
      { [first]: 'g2', [second]: 'a' },
      { [first]: 'g1', [second]: 'b' },
      { [first]: 'g1', [second]: 'a' },
    ];
    const client = fakeClient(rows, { cap: 1 });
    const result = await readAllRows(client, table, { identity });
    assert.deepEqual(result, [rows[2], rows[1], rows[0]]);
    for (const request of client.requests) assert.deepEqual(request.order, identity.map((column) => ({ column, ascending: true })));
  });
}

test('reads an empty table', async () => {
  const client = fakeClient([]);
  assert.deepEqual(await readAllRows(client, 'games'), []);
  assert.equal(client.requests.length, 1);
});

test('query errors fail the complete read without exposing raw SDK errors', async () => {
  const client = fakeClient([], {
    response: (_request, page) => page === 1
      ? { data: [{ id: 1 }], count: 2, error: null }
      : { data: null, count: null, error: { message: 'Bearer secret-key' } },
  });
  await assert.rejects(readAllRows(client, 'games', { pageSize: 1 }), (error) => error.message.includes('query failed') && !error.message.includes('secret-key'));
});

test('network exceptions fail without exposing their message', async () => {
  const client = fakeClient([], { response() { throw new Error('https://secret-key.example'); } });
  await assert.rejects(readAllRows(client, 'games'), (error) => error.message.includes('query failed') && !error.message.includes('secret-key'));
});

test('count changes abort the read', async () => {
  const client = fakeClient([], { response: (_request, page) => ({ data: [{ id: page }], count: page === 1 ? 2 : 3, error: null }) });
  await assert.rejects(readAllRows(client, 'games', { pageSize: 1 }), /Row count changed/);
});

test('duplicate identities abort the read even when count remains unchanged', async () => {
  const client = fakeClient([], { response: () => ({ data: [{ id: 1 }], count: 2, error: null }) });
  await assert.rejects(readAllRows(client, 'games', { pageSize: 1 }), /Repeated row identity/);
});

test('duplicate composite identities abort the read', async () => {
  const client = fakeClient([], { response: () => ({ data: [{ game_id: 'a', tag_id: 'b' }], count: 2, error: null }) });
  await assert.rejects(readAllRows(client, 'game_tags', { identity: ['game_id', 'tag_id'], pageSize: 1 }), /Repeated row identity/);
});

test('incomplete and unverifiable counts abort instead of returning a partial baseline', async () => {
  const incomplete = fakeClient([], { response: (_request, page) => ({ data: page === 1 ? [{ id: 1 }] : [], count: 2, error: null }) });
  await assert.rejects(readAllRows(incomplete, 'games'), /Row count mismatch/);
  const uncounted = fakeClient([], { response: () => ({ data: [], count: null, error: null }) });
  await assert.rejects(readAllRows(uncounted, 'games'), /exact row count/);
});

test('submission selection retains research fields and excludes explicit private identifiers', () => {
  const { columns } = TABLES.find(({ table }) => table === 'game_submissions');
  const names = columns.split(',');
  assert.ok(names.includes('notes'));
  assert.ok(names.includes('extracted_data'));
  assert.ok(names.includes('status'));
  assert.ok(!names.includes('submitter_email'));
  assert.ok(!names.includes('request_fingerprint'));
  assert.ok(!names.includes('*'));
  assert.equal(TABLES.find(({ table }) => table === 'games').columns, '*');
});

test('saveSnapshot creates mode 0600 output and refuses to overwrite it', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'playbloo-snapshot-test-'));
  try {
    const filename = join(directory, 'snapshot.json');
    const data = { capturedAt: '2026-10-19T00:00:00.000Z', games: [{ id: 1 }] };
    await saveSnapshot(filename, data);
    assert.deepEqual(JSON.parse(await readFile(filename, 'utf8')), data);
    assert.equal((await stat(filename)).mode & 0o777, 0o600);
    const original = await readFile(filename, 'utf8');
    await assert.rejects(saveSnapshot(filename, { games: [] }), /Could not create/);
    assert.equal(await readFile(filename, 'utf8'), original);
    const existing = join(directory, 'existing.txt');
    await writeFile(existing, 'retain me');
    await assert.rejects(saveSnapshot(existing, data), /Could not create/);
    assert.equal(await readFile(existing, 'utf8'), 'retain me');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('a symlink entry runs --help offline without project dependencies or environment variables', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'playbloo-snapshot-link-test-'));
  try {
    const entry = join(directory, 'linked-snapshot.mjs');
    await symlink(fileURLToPath(new URL('./snapshot.mjs', import.meta.url)), entry);
    const { stdout, stderr } = await promisify(execFile)(process.execPath, [entry, '--help'], {
      cwd: directory,
      env: {},
    });
    assert.ok(stdout.length > 0);
    assert.equal(stderr, '');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
