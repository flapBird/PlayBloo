import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { ClassifiedSubmissionUrl } from "./types";

const MAX_URL_LENGTH = 2048;
const BLOCKED_HOSTS = new Set(["localhost", "localhost.localdomain", "metadata.google.internal", "169.254.169.254"]);
const TRACKING_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref", "referrer"];

function isUnsafeIpv4(address: string): boolean {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [a, b, c] = parts;
  return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) ||
    (a === 192 && b === 0 && (c === 0 || c === 2)) ||
    (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
    (a === 203 && b === 0 && c === 113) || a >= 224;
}

function isUnsafeAddress(address: string): boolean {
  if (isIP(address) === 4) return isUnsafeIpv4(address);
  if (isIP(address) === 6) {
    const value = address.toLowerCase();
    return value === "::" || value === "::1" || value.startsWith("fc") || value.startsWith("fd") ||
      value.startsWith("fe8") || value.startsWith("fe9") || value.startsWith("fea") || value.startsWith("feb") ||
      value.startsWith("ff") || value.startsWith("::ffff:");
  }
  return true;
}

export function classifySubmissionUrl(raw: string): ClassifiedSubmissionUrl {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > MAX_URL_LENGTH) throw new Error("Enter a valid URL under 2,048 characters.");

  let url: URL;
  try { url = new URL(trimmed); } catch { throw new Error("Enter a complete URL, including https://."); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported.");
  if (url.username || url.password) throw new Error("URLs containing credentials are not supported.");
  url.hash = "";
  for (const param of TRACKING_PARAMS) url.searchParams.delete(param);
  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!hostname || BLOCKED_HOSTS.has(hostname) || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
    throw new Error("Local or private network URLs are not supported.");
  }
  const addressHost = hostname.replace(/^\[|\]$/g, "");
  if (isIP(addressHost) && isUnsafeAddress(addressHost)) throw new Error("Private network URLs are not supported.");

  url.hostname = hostname;
  url.pathname = url.pathname.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";
  const steamMatch = hostname === "store.steampowered.com" ? url.pathname.match(/^\/app\/(\d+)(?:\/|$)/) : null;
  const itchMatch = hostname.endsWith(".itch.io") && hostname !== "itch.io" && hostname !== "www.itch.io" ? url.pathname.match(/^\/([^/]+)/) : null;
  const sourceType = steamMatch ? "steam" : itchMatch ? "itch" : "official";
  const normalizedUrl = steamMatch
    ? `https://store.steampowered.com/app/${steamMatch[1]}`
    : itchMatch
      ? `https://${hostname}/${itchMatch[1].toLowerCase()}`
      : url.toString().replace(/\/$/, "");
  return {
    url,
    normalizedUrl,
    sourceType,
    steamAppId: steamMatch?.[1],
    itchProjectSlug: itchMatch ? `${hostname.split(".")[0]}/${itchMatch[1].toLowerCase()}` : undefined,
  };
}

async function lookupWithTimeout(host: string, timeoutMs: number): Promise<Array<{ address: string; family: number }>> {
  return new Promise<Array<{ address: string; family: number }>>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Source DNS lookup timed out.")), timeoutMs);
    lookup(host, { all: true, verbatim: true }).then(
      (addresses) => { clearTimeout(timer); resolve(addresses); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}

async function assertPublicDestination(url: URL, allowedHost: ((hostname: string) => boolean) | undefined, timeoutMs: number) {
  const host = url.hostname.toLowerCase();
  if (!['http:', 'https:'].includes(url.protocol) || (url.port && !["80", "443"].includes(url.port))) {
    throw new Error("The source redirected to an unsupported protocol or port.");
  }
  if (allowedHost && !allowedHost(host)) throw new Error("The source redirected to an unsupported host.");
  if (BLOCKED_HOSTS.has(host) || host.endsWith(".local") || host.endsWith(".internal")) throw new Error("Unsafe destination blocked.");
  const addresses = await lookupWithTimeout(host, timeoutMs);
  if (!addresses.length || addresses.some((item) => isUnsafeAddress(item.address))) throw new Error("Unsafe destination blocked.");
}

export async function safeFetchText(
  initialUrl: string,
  options: {
    allowedHost: (hostname: string) => boolean;
    allowedContentTypes?: string[];
    timeoutMs?: number;
    maxBytes?: number;
  },
): Promise<{ text: string; finalUrl: string; status: number }> {
  let url = new URL(initialUrl);
  const timeoutMs = options.timeoutMs ?? 8_000;
  const maxBytes = options.maxBytes ?? 2_000_000;
  const deadline = Date.now() + timeoutMs;

  for (let redirect = 0; redirect <= 3; redirect += 1) {
    const dnsBudget = Math.min(2_000, deadline - Date.now());
    if (dnsBudget <= 0) throw new Error("The source request timed out.");
    await assertPublicDestination(url, options.allowedHost, dnsBudget);
    const fetchBudget = deadline - Date.now();
    if (fetchBudget <= 0) throw new Error("The source request timed out.");
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(fetchBudget),
      headers: { "User-Agent": "PlayBlooSubmissionBot/1.0 (+https://playbloo.net/submit-game)" },
    });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location || redirect === 3) throw new Error("Too many source redirects.");
      url = new URL(location, url);
      continue;
    }
    if (response.status === 429) throw new Error("The source is rate limiting requests. Please try again later.");
    if (!response.ok) throw new Error(`The source returned HTTP ${response.status}.`);
    const contentType = response.headers.get("content-type")?.toLowerCase();
    if (contentType && options.allowedContentTypes?.length && !options.allowedContentTypes.some((type) => contentType.includes(type))) {
      await response.body?.cancel();
      throw new Error("The source returned an unsupported content type.");
    }
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > maxBytes) throw new Error("The source page is too large to process safely.");
    if (!response.body) throw new Error("The source returned an empty response.");
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        throw new Error("The source page is too large to process safely.");
      }
      chunks.push(value);
    }
    const buffer = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { text: new TextDecoder().decode(buffer), finalUrl: url.toString(), status: response.status };
  }
  throw new Error("Unable to fetch the source.");
}
