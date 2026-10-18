import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from "next/constants.js";

const initializeDevBindings = mock.fn();
mock.module("@opennextjs/cloudflare", {
  exports: { initOpenNextCloudflareForDev: initializeDevBindings },
});
const { default: configureNext } = await import("../next.config.ts");
const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"];
let previous;

beforeEach(() => {
  previous = Object.fromEntries(required.map((name) => [name, process.env[name]]));
  required.forEach((name) => delete process.env[name]);
  initializeDevBindings.mock.resetCalls();
});

afterEach(() => {
  for (const [name, value] of Object.entries(previous)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

test("missing build variables fail before initializing local bindings and identify the Cloudflare build settings", () => {
  assert.throws(() => configureNext(PHASE_PRODUCTION_BUILD), (error) => {
    for (const name of required) assert.ok(error.message.includes(name));
    assert.match(error.message, /Settings > Build > Variables and secrets/);
    assert.match(error.message, /only configures the Worker runtime/);
    return true;
  });
  assert.equal(initializeDevBindings.mock.callCount(), 0);
});

test("partial configuration reports missing names without disclosing configured values", () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "   ";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "configured-public-value";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "secret-never-print-this";
  assert.throws(() => configureNext(PHASE_PRODUCTION_BUILD), (error) => {
    assert.match(error.message, /Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL\./);
    assert.ok(!error.message.includes("configured-public-value"));
    assert.ok(!error.message.includes("secret-never-print-this"));
    return true;
  });
});

test("configured production builds preserve direct images without starting a local binding proxy", () => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "example-anon-key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "example-service-role-key";
  assert.equal(configureNext(PHASE_PRODUCTION_BUILD).images.unoptimized, true);
  assert.equal(initializeDevBindings.mock.callCount(), 0);
});

test("local bindings initialize only for next dev, with runtime configuration deferred until requests", () => {
  assert.equal(configureNext(PHASE_PRODUCTION_SERVER).images.unoptimized, true);
  assert.equal(initializeDevBindings.mock.callCount(), 0);
  assert.equal(configureNext(PHASE_DEVELOPMENT_SERVER).images.unoptimized, true);
  assert.equal(initializeDevBindings.mock.callCount(), 1);
});
