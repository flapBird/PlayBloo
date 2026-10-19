#!/usr/bin/env node
import { createRequire } from 'node:module';
import { realpathSync } from 'node:fs';
import { open, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SUBMISSION_COLUMNS = [
  'id', 'source_url', 'normalized_source_url', 'source_type', 'steam_app_id',
  'itch_project_slug', 'developer_name', 'notes', 'status', 'extracted_data',
  'extraction_status', 'extraction_error', 'last_fetched_at', 'duplicate_game_id',
  'reviewed_at', 'reviewed_by', 'approved_game_id', 'created_at', 'updated_at',
].join(',');

// Submissions deliberately exclude submitter_email and request_fingerprint.
// notes/extracted_data can still contain personal information: keep the snapshot private.
export const TABLES = Object.freeze([
  { table: 'game_submissions', key: 'submissions', columns: SUBMISSION_COLUMNS, identity: ['id'] },
  { table: 'games', key: 'games', columns: '*', identity: ['id'] },
  { table: 'categories', key: 'categories', columns: '*', identity: ['id'] },
  { table: 'tags', key: 'tags', columns: '*', identity: ['id'] },
  { table: 'series', key: 'series', columns: '*', identity: ['id'] },
  { table: 'game_categories', key: 'gameCategories', columns: '*', identity: ['game_id', 'category_id'] },
  { table: 'game_tags', key: 'gameTags', columns: '*', identity: ['game_id', 'tag_id'] },
  { table: 'game_series', key: 'gameSeries', columns: '*', identity: ['game_id', 'series_id'] },
]);

class SnapshotError extends Error {}

/** Read a table completely; the client is injected and this module never mutates it. */
export async function readAllRows(client, table, {
  columns = '*',
  identity = ['id'],
  pageSize = 1000,
} = {}) {
  if (!/^[a-z][a-z0-9_]*$/.test(table)) throw new SnapshotError('Invalid table name.');
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) throw new SnapshotError('Invalid page size.');
  if (!Array.isArray(identity) || identity.length === 0 || identity.some((column) => !/^[a-z][a-z0-9_]*$/.test(column))) {
    throw new SnapshotError('A stable row identity is required.');
  }

  const rows = [];
  const seen = new Set();
  let expectedCount;
  for (let offset = 0; ;) {
    let result;
    try {
      let query = client.from(table).select(columns, { count: 'exact' });
      for (const column of identity) query = query.order(column, { ascending: true });
      result = await query.range(offset, offset + pageSize - 1);
    } catch {
      // Do not echo raw SDK/network errors: they can contain URLs or credentials.
      throw new SnapshotError(`Could not read ${table}; query failed.`);
    }
    if (!result || result.error || !Array.isArray(result.data)) {
      throw new SnapshotError(`Could not read ${table}; query failed.`);
    }
    const { data, count } = result;
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new SnapshotError(`Could not verify the exact row count for ${table}.`);
    }
    if (expectedCount === undefined) expectedCount = count;
    if (count !== expectedCount) throw new SnapshotError(`Row count changed while reading ${table}; retry when edits have stopped.`);

    for (const row of data) {
      if (!row || identity.some((column) => row[column] === null || row[column] === undefined)) {
        throw new SnapshotError(`Missing row identity in ${table}.`);
      }
      const rowIdentity = JSON.stringify(identity.map((column) => row[column]));
      if (seen.has(rowIdentity)) throw new SnapshotError(`Repeated row identity in ${table}; retry when edits have stopped.`);
      seen.add(rowIdentity);
      rows.push(row);
    }
    if (rows.length > expectedCount) throw new SnapshotError(`Row count mismatch in ${table}; no snapshot was saved.`);
    // Stop at the verified exact count; an extra range can trigger PostgREST 416.
    if (rows.length === expectedCount) return rows;
    if (data.length === 0) throw new SnapshotError(`Row count mismatch in ${table}; no snapshot was saved.`);
    // PostgREST may cap a request below pageSize. Advance only by actual rows.
    offset += data.length;
  }
}

/** Create a private snapshot exclusively; an existing path is never overwritten. */
export async function saveSnapshot(outputPath, snapshot) {
  const serialized = `${JSON.stringify(snapshot, null, 2)}\n`;
  let file;
  try {
    file = await open(outputPath, 'wx', 0o600);
  } catch {
    throw new SnapshotError('Could not create the output file; use a new path in an existing directory.');
  }
  try {
    await file.writeFile(serialized, 'utf8');
    await file.close();
  } catch {
    await file.close().catch(() => {});
    await unlink(outputPath).catch(() => {});
    throw new SnapshotError('Could not save the snapshot; incomplete output was removed.');
  }
}

function parseArguments(argv) {
  const options = { project: process.cwd() };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--help' || argument === '-h') return { help: true };
    if (argument !== '--project' && argument !== '--output') throw new SnapshotError('Unknown argument; use --help.');
    const value = argv[++index];
    if (!value || value.startsWith('--')) throw new SnapshotError('An argument value is missing; use --help.');
    const key = argument.slice(2);
    if (key === 'output' && options.output !== undefined) throw new SnapshotError('Specify --output only once.');
    options[key] = value;
  }
  if (!options.output) throw new SnapshotError('--output is required; use --help.');
  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log(`Read-only PlayBloo submission baseline (Node.js >=24).

Usage:
  node --env-file=.env.local /path/to/snapshot.mjs --project /path/to/PlayBloo --output /private/tmp/new-baseline.json

Options:
  --project DIR   Project containing package.json and @supabase/supabase-js (default: current directory)
  --output FILE   Required new private snapshot file; existing files are never overwritten
  --help, -h      Show this help without connecting

Environment: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
The caller loads environment variables; this script does not load .env files.
Includes private notes/extracted_data. Keep the snapshot out of Git and public reports.
Reads all submission statuses and complete game/taxonomy tables; performs no database or storage writes.`);
    return;
  }
  if (Number(process.versions.node.split('.')[0]) < 24) throw new SnapshotError('Node.js >=24 is required.');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new SnapshotError('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  let createClient;
  try {
    const requireFromProject = createRequire(resolve(options.project, 'package.json'));
    ({ createClient } = requireFromProject('@supabase/supabase-js'));
  } catch {
    throw new SnapshotError('Could not load @supabase/supabase-js from the project.');
  }
  let client;
  try {
    client = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  } catch {
    throw new SnapshotError('Could not initialize the database client.');
  }
  const snapshot = { capturedAt: new Date().toISOString() };
  for (const { table, key, columns, identity } of TABLES) {
    snapshot[key] = await readAllRows(client, table, { columns, identity });
  }
  const outputPath = resolve(options.output);
  await saveSnapshot(outputPath, snapshot);
  console.log(JSON.stringify({ output: outputPath, counts: Object.fromEntries(TABLES.map(({ key }) => [key, snapshot[key].length])) }, null, 2));
}

function isMainModule() {
  if (!process.argv[1]) return false;
  try {
    // Skill installations can link the project skill into ~/.codex/skills.
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(process.argv[1]));
  } catch {
    return false;
  }
}

// Imports expose only the helpers; they do not inspect env or start the CLI.
if (isMainModule()) {
  main().catch((error) => {
    console.error(error instanceof SnapshotError ? error.message : 'Snapshot failed; no credentials were logged.');
    process.exitCode = 1;
  });
}
