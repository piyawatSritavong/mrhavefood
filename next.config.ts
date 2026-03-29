import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mrhavefood.com" }],
        destination: "https://mrhavefood.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    if (!isProd) return [];
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:path*.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
