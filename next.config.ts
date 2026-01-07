import type { NextConfig } from "next";

const isElectron = process.env.NEXT_PUBLIC_IS_ELECTRON === 'true';
const isCapacitor = process.env.NEXT_PUBLIC_IS_CAPACITOR === 'true';
const isStatic = isElectron || isCapacitor;
const isProduction = process.env.NODE_ENV === 'production';

// Validate required environment variables
const requiredEnvVars = [
  'NODE_ENV',
];

requiredEnvVars.forEach(key => {
  if (!process.env[key]) {
    console.warn(`Warning: Missing environment variable: ${key}`);
  }
});

const nextConfig: NextConfig = {
  output: isStatic ? 'export' : undefined,
  // Electron and Capacitor need relative paths for assets to load from "file://"
  assetPrefix: isStatic ? '.' : undefined,
  // Helper to ensure directory-based routing works smoothly
  trailingSlash: isStatic,
  images: {
    unoptimized: isStatic,
  },

  // Production optimizations
  compress: !isStatic, // Enable compression for web
  poweredByHeader: false, // Remove X-Powered-By header
  generateEtags: isProduction, // Enable ETags for caching

  // React strict mode
  reactStrictMode: true,

  // Compiler options
  compiler: {
    // Remove console logs in production (optional)
    // removeConsole: isProduction ? { exclude: ['error', 'warn'] } : false,
  },

  // Experimental features
  experimental: {
    // Enable optimizations
  },

  // Security headers (only for web builds, not static exports)
  headers: !isStatic ? async () => {
    return [
      {
        source: '/:path*',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-inline needed for Next.js, unsafe-eval for canvas operations
              "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for CSS-in-JS
              "img-src 'self' data: blob: https:", // data: and blob: for image processing
              "font-src 'self' data:",
              "connect-src 'self'",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'", // Prevent clickjacking
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Strict Transport Security (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ];
  } : undefined,
};

export default nextConfig;
