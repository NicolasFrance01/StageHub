import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow builds to succeed even with TypeScript errors in WIP pages
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
