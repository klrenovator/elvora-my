import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Local artwork only for now; original photography will replace it in
    // /public/images/products/ without a config change.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 828, 1080, 1200, 1600, 1920],
    imageSizes: [96, 160, 240, 320, 420, 560],
  },
  async redirects() {
    return [
      // Root is language-less; the middleware resolves it, but keep a hard
      // fallback for static hosting edge cases.
      { source: "/index.html", destination: "/en", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
