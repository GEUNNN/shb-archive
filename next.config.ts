import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
      {
        protocol: "https",
        hostname: "i.namu.wiki",
      },
      {
        protocol: "https",
        hostname: "talkimg.imbc.com",
      },
      {
        // Cloudflare R2 — photo hosting. Covers pub-<hash>.r2.dev now and any
        // r2.dev bucket; add the custom domain here when you switch to one.
        protocol: "https",
        hostname: "**.r2.dev",
      },
    ],
  },
};

export default nextConfig;
