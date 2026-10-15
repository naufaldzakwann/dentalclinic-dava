import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep live preview files separate from the production build.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
