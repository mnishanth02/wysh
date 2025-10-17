import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for festival assets
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.convex.cloud",
      },
    ],
    // Optimize for mobile-first (320px - 768px)
    deviceSizes: [320, 375, 414, 768],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Use WebP for better performance
    formats: ["image/webp", "image/avif"],
  },

  // Performance optimizations
  compress: true,
  productionBrowserSourceMaps: false,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["@radix-ui/*"],
  },

  // Headers for performance and caching
  headers: async () => [
    {
      source: "/public/festivals/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/:path*",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
      ],
    },
  ],
};

export default nextConfig;
