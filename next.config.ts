import type { NextConfig } from "next";

const isElectron = process.env.NEXT_PUBLIC_IS_ELECTRON === 'true';

const nextConfig: NextConfig = {
  output: isElectron ? 'export' : undefined,
  // Electron needs relative paths for assets to load from "file://"
  assetPrefix: isElectron ? '.' : undefined,
  // Helper to ensure directory-based routing works smoothly
  trailingSlash: isElectron,
  images: {
    unoptimized: isElectron,
  },
};

export default nextConfig;
