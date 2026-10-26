import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import nextEnv from '@next/env';
import { getDevEnvironment } from './dev-proxy.mjs';

nextEnv.loadEnvConfig(process.cwd(), true);
const env = getDevEnvironment(process.env);
// Let Next keep ownership of loading and watching its environment files.
delete env.__NEXT_PROCESSED_ENV;
if (env.NODE_USE_ENV_PROXY === '1') console.info('[dev] Using configured proxy for server requests; localhost stays direct.');

const require = createRequire(import.meta.url);
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', ...process.argv.slice(2)], {
  stdio: 'inherit', env,
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', (error) => { console.error('[dev] Could not start Next.js:', error.message); process.exitCode = 1; });
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 143); });
