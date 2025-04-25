import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: "/projects/structured/live",
  assetPrefix: "/projects/structured/live",
  trailingSlash: true, // ← add this!
};

export default nextConfig;
