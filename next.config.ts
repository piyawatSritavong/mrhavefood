import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600],
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    const cacheHeaders = isProd
      ? [
          {
            source: "/_next/static/:path*",
            headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
          },
          {
            source: "/assets/:path*",
            headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
          },
          {
            source: "/:path*.(svg|png)",
            headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
          },
        ]
      : [];
    return [{ source: "/(.*)", headers: securityHeaders }, ...cacheHeaders];
  },
};

export default nextConfig;
