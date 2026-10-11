import type { NextConfig } from "next";

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

export default nextConfig;
