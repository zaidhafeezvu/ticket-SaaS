import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Enable optimistic client cache
    optimisticClientCache: true,
    // Enable partial prerendering
    ppr: false, // Can enable when stable
  },

  // Configure compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  async headers() {
    // Only enforce HTTPS in production
    if (process.env.NODE_ENV === "production") {
      return [
        {
          source: "/:path*",
          headers: [
            {
              key: "Strict-Transport-Security",
              value: "max-age=31536000; includeSubDomains",
            },
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
      ];
    }
    return [];
  },
};

export default nextConfig;
