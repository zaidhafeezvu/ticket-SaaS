import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
