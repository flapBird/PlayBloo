import { execFileSync } from 'node:child_process';

/** Use an existing proxy only in the local dev process; never change OS settings. */
export function getDevEnvironment(source, {
  platform = process.platform,
  readSystemProxy = () => execFileSync('/usr/sbin/scutil', ['--proxy'], { encoding: 'utf8', timeout: 2000 }),
} = {}) {
  const env = { ...source };
  if (env.NODE_USE_ENV_PROXY === '0') return env;

  const hasProxy = () => Boolean(env.https_proxy || env.HTTPS_PROXY || env.http_proxy || env.HTTP_PROXY);
  // Explicit shell / .env.local settings take precedence over macOS settings.
  if (!hasProxy() && platform === 'darwin') {
    try {
      const settings = readSystemProxy();
      const value = (key) => settings.match(new RegExp(`^\\s*${key} : (.+)$`, 'm'))?.[1]?.trim();
      for (const protocol of ['HTTP', 'HTTPS']) {
        const host = value(`${protocol}Proxy`);
        const port = value(`${protocol}Port`);
        if (value(`${protocol}Enable`) === '1' && host && /^\d+$/.test(port || '')) {
          env[`${protocol}_PROXY`] = `http://${host.includes(':') ? `[${host}]` : host}:${port}`;
        }
      }
    } catch {
      // No system proxy (or unavailable scutil): keep normal direct networking.
    }
  }

  if (hasProxy()) {
    env.NODE_USE_ENV_PROXY = '1';
    // Next's local workers, HMR and bindings must never go through the proxy.
    const bypass = [env.no_proxy ?? env.NO_PROXY, 'localhost', '127.0.0.1', '::1', '[::1]'].filter(Boolean).join(',');
    env.NO_PROXY = bypass;
    env.no_proxy = bypass;
  }
  return env;
}
