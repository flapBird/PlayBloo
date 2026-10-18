import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";

let resolveIpv4;
let resolveIpv6;
let dnsCalls;
let fetchCalls;

mock.module("node:dns/promises", {
  exports: {
    resolve4: (host) => { dnsCalls.push(["A", host]); return resolveIpv4(host); },
    resolve6: (host) => { dnsCalls.push(["AAAA", host]); return resolveIpv6(host); },
  },
});

const { classifySubmissionUrl, safeFetchText } = await import("../../src/lib/submissions/url-security.ts");
const dnsError = (code) => Object.assign(new Error(`DNS ${code}`), { code });
const html = () => new Response("<title>Game</title>", { headers: { "Content-Type": "text/html" } });
const options = { allowedHost: () => true, allowedContentTypes: ["text/html"] };

beforeEach(() => {
  dnsCalls = [];
  fetchCalls = [];
  resolveIpv4 = async () => ["93.184.216.34"];
  resolveIpv6 = async () => ["2606:4700:4700::1111"];
  mock.method(globalThis, "fetch", async (url, init) => {
    fetchCalls.push([url.toString(), init]);
    return html();
  });
});

afterEach(() => mock.restoreAll());

test("checks A and AAAA records before fetching a public destination", async () => {
  const result = await safeFetchText("https://games.example/title", options);
  assert.deepEqual(dnsCalls, [["A", "games.example"], ["AAAA", "games.example"]]);
  assert.equal(result.text, "<title>Game</title>");
  assert.equal(result.finalUrl, "https://games.example/title");
  assert.equal(fetchCalls.length, 1);
  assert.equal(fetchCalls[0][1].redirect, "manual");
  assert.ok(fetchCalls[0][1].signal instanceof AbortSignal);
});

test("supports single-stack hosts only when the other family has no records", async (t) => {
  for (const [family, code] of [["A", "ENODATA"], ["AAAA", "ENOTFOUND"]]) {
    await t.test(`${family} absent with ${code}`, async () => {
      resolveIpv4 = async () => ["93.184.216.34"];
      resolveIpv6 = async () => ["2606:4700:4700::1111"];
      if (family === "A") resolveIpv4 = async () => { throw dnsError(code); };
      else resolveIpv6 = async () => { throw dnsError(code); };
      await safeFetchText("https://games.example", options);
    });
  }
});

test("rejects an empty DNS result", async () => {
  resolveIpv4 = async () => { throw dnsError("ENOTFOUND"); };
  resolveIpv6 = async () => { throw dnsError("ENODATA"); };
  await assert.rejects(safeFetchText("https://games.example", options), /Unsafe destination/);
  assert.equal(fetchCalls.length, 0);
});

test("rejects a private address in either family even with public addresses", async (t) => {
  for (const [family, address] of [["A", "10.0.0.1"], ["AAAA", "fd00::1"], ["AAAA", "::ffff:127.0.0.1"]]) {
    await t.test(address, async () => {
      resolveIpv4 = async () => family === "A" ? ["93.184.216.34", address] : ["93.184.216.34"];
      resolveIpv6 = async () => family === "AAAA" ? ["2606:4700:4700::1111", address] : ["2606:4700:4700::1111"];
      await assert.rejects(safeFetchText("https://games.example", options), /Unsafe destination/);
      assert.equal(fetchCalls.length, 0);
    });
  }
});

test("fails closed on DNS errors instead of accepting the successful family", async (t) => {
  for (const [family, code] of [["A", "ESERVFAIL"], ["AAAA", "ETIMEOUT"], ["AAAA", "ECONNREFUSED"]]) {
    await t.test(`${family} ${code}`, async () => {
      resolveIpv4 = async () => ["93.184.216.34"];
      resolveIpv6 = async () => ["2606:4700:4700::1111"];
      if (family === "A") resolveIpv4 = async () => { throw dnsError(code); };
      else resolveIpv6 = async () => { throw dnsError(code); };
      await assert.rejects(safeFetchText("https://games.example", options), { code });
      assert.equal(fetchCalls.length, 0);
    });
  }
});

test("waits for both families and applies the DNS timeout", async () => {
  resolveIpv6 = () => new Promise(() => {});
  await assert.rejects(safeFetchText("https://games.example", { ...options, timeoutMs: 20 }), /DNS lookup timed out/);
  assert.equal(fetchCalls.length, 0);
});

test("validates IP literals directly without asking DNS", async () => {
  await safeFetchText("https://93.184.216.34/game", options);
  await safeFetchText("https://[2606:4700:4700::1111]/game", options);
  for (const host of ["127.0.0.1", "10.0.0.1", "[::1]", "[fd00::1]", "[::ffff:127.0.0.1]"]) {
    await assert.rejects(safeFetchText(`https://${host}/game`, options), /Unsafe destination/);
    assert.throws(() => classifySubmissionUrl(`https://${host}/game`), /network URLs/);
  }
  assert.deepEqual(dnsCalls, []);
  assert.equal(fetchCalls.length, 2);
});

test("checks every redirect destination before the next request", async () => {
  resolveIpv4 = async (host) => host === "private.example" ? ["192.168.1.2"] : ["93.184.216.34"];
  mock.restoreAll();
  mock.method(globalThis, "fetch", async (url) => {
    fetchCalls.push(url.toString());
    return new Response(null, { status: 302, headers: { Location: "https://private.example/game" } });
  });
  await assert.rejects(safeFetchText("https://games.example", options), /Unsafe destination/);
  assert.deepEqual(fetchCalls, ["https://games.example/"]);
  assert.deepEqual(dnsCalls, [["A", "games.example"], ["AAAA", "games.example"], ["A", "private.example"], ["AAAA", "private.example"]]);
});

test("retains allowed-host, protocol, and port checks on redirects", async (t) => {
  for (const destination of ["https://other.example/game", "ftp://games.example/game", "https://games.example:8080/game"]) {
    await t.test(destination, async () => {
      mock.restoreAll();
      mock.method(globalThis, "fetch", async () => new Response(null, { status: 302, headers: { Location: destination } }));
      await assert.rejects(safeFetchText("https://games.example", { ...options, allowedHost: (host) => host === "games.example" }), /unsupported (host|protocol or port)/);
    });
  }
});
