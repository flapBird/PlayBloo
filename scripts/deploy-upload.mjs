#!/usr/bin/env node
/**
 * Deploy-command replacement for manual-rollout setups.
 *
 * Uploads the built Worker as a new (non-active) version, then warms the
 * version's preview URL: requests go through the new version's code, so the
 * ISR renders are stored in R2 under that version's build ID. By the time the
 * version is promoted to production the cache is already hot — no warm-up
 * needed after rollout.
 *
 * Cloudflare Workers Builds runs this with the build's env (NEXT_PUBLIC_SUPABASE_URL,
 * SUPABASE_SERVICE_ROLE_KEY) already present. Warm-up failure is non-blocking:
 * pages simply fall back to on-demand generation after rollout.
 *
 * Expects `npm run build:cloudflare` to have run (Build command) — this script
 * only uploads and warms, it never builds.
 */

import { spawn } from "node:child_process";

const child = spawn("npx", ["wrangler", "versions", "upload", "--keep-vars"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: process.platform === "win32",
});

let stdout = "";
child.stdout.on("data", (chunk) => {
  stdout += chunk;
  process.stdout.write(chunk);
});
// stderr is only a stream when stdio is "pipe"; guard anyway.
child.stderr?.on("data", (chunk) => process.stderr.write(chunk));

child.on("close", (code) => {
  if (code !== 0) {
    console.error(`\nversions upload failed with exit code ${code}`);
    process.exit(code);
  }

  // wrangler prints the preview URL with an 8-char version prefix, but the
  // routable form uses the full version ID (`<version>-<name>.<subdomain>...`).
  const versionMatch = stdout.match(/Worker Version ID:\s*([a-f0-9-]{36})/);
  const previewMatch = stdout.match(/Version Preview URL:\s*(https:\/\/[a-z0-9.-]+workers\.dev\S*)/i);
  let previewUrl = previewMatch?.[1]?.replace(/[)"'<>,]$/, "");
  if (!previewUrl) {
    console.warn("\nNo preview URL found in upload output — skipping warm-up (cache will build on demand).");
    process.exit(0);
  }
  if (versionMatch && previewUrl) {
    previewUrl = previewUrl.replace(versionMatch[1].slice(0, 8), versionMatch[1]);
  }
  console.log(`\nWarming the version preview URL (${previewUrl}) so rollout traffic starts hot...`);

  const warm = spawn("node", ["scripts/warm-cache.mjs", "--base", previewUrl], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  warm.on("close", (warmCode) => {
    if (warmCode !== 0) {
      console.warn("\nWarm-up failed — NOT blocking: pages will build their cache on demand after rollout.");
    } else {
      console.log("\nPreview version is warmed. Verify it, then roll out — traffic starts on hot cache.");
    }
    process.exit(0);
  });
});
