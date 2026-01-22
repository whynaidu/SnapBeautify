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
    // Enable modern image formats for better compression
    formats: ['image/avif', 'image/webp'],
    // Optimize image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow avatar images from OAuth providers
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google avatars
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub avatars
        pathname: '/**',
      },
    ],
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

  // Experimental features for performance
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'framer-motion'],
  },

  // Security headers (only for web builds, not static exports)
  // Note: CSP disabled in development as Next.js dev server applies its own restrictive CSP
  headers: !isStatic ? async () => {
    // Skip CSP in development - Next.js dev server has its own restrictions
    const cspHeader = isProduction ? {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data: https://fonts.gstatic.com",
        "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
        "media-src 'self' blob:",
        "worker-src 'self' blob:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    } : null;

    const headers = [
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
    ];

    if (cspHeader) {
      headers.unshift(cspHeader);
    }

    return [
      {
        source: '/:path*',
        headers
      }
    ];
  } : undefined,
};

export default nextConfig;
