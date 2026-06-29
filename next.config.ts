import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.itch.zone",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgs.crazygames.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zapgames.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
