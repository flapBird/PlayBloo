import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getDevEnvironment } from '../scripts/dev-proxy.mjs';

const settings = `<dictionary> {
  HTTPEnable : 1
  HTTPPort : 7890
  HTTPProxy : 127.0.0.1
  HTTPSEnable : 1
  HTTPSPort : 7890
  HTTPSProxy : 127.0.0.1
}`;
const mac = { platform: 'darwin', readSystemProxy: () => settings };

test('uses an enabled macOS proxy and bypasses local dev traffic without mutating input', () => {
  const input = { NO_PROXY: 'internal.example' };
  const env = getDevEnvironment(input, mac);
  assert.equal(env.HTTPS_PROXY, 'http://127.0.0.1:7890');
  assert.equal(env.HTTP_PROXY, env.HTTPS_PROXY);
  assert.equal(env.NODE_USE_ENV_PROXY, '1');
  assert.equal(env.NO_PROXY, 'internal.example,localhost,127.0.0.1,::1,[::1]');
  assert.equal(env.no_proxy, env.NO_PROXY);
  assert.deepEqual(input, { NO_PROXY: 'internal.example' });
});

test('explicit proxy configuration wins, including lowercase Node precedence', () => {
  const env = getDevEnvironment({ https_proxy: 'http://configured.example:8080', no_proxy: 'private.example' }, {
    platform: 'darwin', readSystemProxy: () => { throw new Error('must not inspect OS proxy'); },
  });
  assert.equal(env.https_proxy, 'http://configured.example:8080');
  assert.equal(env.HTTPS_PROXY, undefined);
  assert.equal(env.NODE_USE_ENV_PROXY, '1');
  assert.ok(env.no_proxy.startsWith('private.example,'));
});

test('explicit opt-out leaves the environment unchanged', () => {
  const input = { NODE_USE_ENV_PROXY: '0', HTTPS_PROXY: 'http://configured.example:8080' };
  assert.deepEqual(getDevEnvironment(input, mac), input);
});

test('disabled, missing or unavailable system proxies preserve direct networking', () => {
  for (const readSystemProxy of [() => '', () => settings.replaceAll('Enable : 1', 'Enable : 0'), () => { throw new Error('unavailable'); }]) {
    assert.deepEqual(getDevEnvironment({}, { platform: 'darwin', readSystemProxy }), {});
  }
  assert.deepEqual(getDevEnvironment({}, { platform: 'linux', readSystemProxy: () => { throw new Error('must not call scutil'); } }), {});
});
