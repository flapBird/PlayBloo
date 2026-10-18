import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from "next/constants.js";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Vercel bills Image Transformations per (image, width) pair. Once the quota
    // is exhausted, every new transformation 402s and production renders broken
    // images while local runs stay fine. Shipped assets (mirrored cover art,
    // pre-sized WebP in /public) are already optimized, so the optimizer adds
    // little — serve everything as-is and never spend Transformations.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "azgames.io", port: "", pathname: "/**" },
      { protocol: "https", hostname: "escaperoad.io", port: "", pathname: "/**" },
      { protocol: "https", hostname: "gamea.azgame.io", port: "", pathname: "/**" },
      { protocol: "https", hostname: "img.itch.zone", port: "", pathname: "/**" },
      { protocol: "https", hostname: "www.colorblockjam.org", port: "", pathname: "/**" },
      { protocol: "https", hostname: "oktplxtuewrginqgmkgz.supabase.co", port: "", pathname: "/storage/v1/object/**" },
      { protocol: "https", hostname: "shared.fastly.steamstatic.com", port: "", pathname: "/**" },
      { protocol: "https", hostname: "cdn.cloudflare.steamstatic.com", port: "", pathname: "/**" },
    ],
    deviceSizes: [320, 480, 640, 768, 1024, 1280],
    imageSizes: [64, 96, 160, 240],
    qualities: [60, 75],
    formats: ["image/webp"],
    minimumCacheTTL: 604800,
    maximumRedirects: 1,
  },
};

export default function configureNext(phase: string): NextConfig {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    initOpenNextCloudflareForDev();
  }

  if (phase === PHASE_PRODUCTION_BUILD) {
    const required = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ];
    const missing = required.filter((name) => !process.env[name]?.trim());
    if (missing.length) {
      throw new Error(
        `[PlayBloo build] Missing required environment variables: ${missing.join(", ")}.\n` +
        "Cloudflare Workers Builds: add these under Settings > Build > Variables and secrets (Build variables and secrets). " +
        "Settings > Variables and Secrets only configures the Worker runtime; those values are not available during builds. " +
        "Keep the runtime variables too, save the build settings, then retry the build. " +
        "For local builds, configure .env.local. See docs/cloudflare.md.",
      );
    }
  }

  return nextConfig;
}
