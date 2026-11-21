import type { NextConfig } from "next";

/**
 * Allow image optimisation from the project's own Supabase Storage only.
 *
 * Parsed rather than hard-coded so the project reference is not committed to
 * the repository, and validated so a malformed value cannot become a wildcard.
 */
function supabaseImagePatterns(): NonNullable<NextConfig["images"]>["remotePatterns"] {
  const url = process.env.SUPABASE_URL;
  if (!url) return [];
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return [];
    return [
      {
        protocol: "https" as const,
        hostname: parsed.hostname,
        // Storage objects are served from /storage/v1/object/public/<bucket>/…
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    // A bad URL must not break the build; it simply allows nothing extra.
    return [];
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    /**
     * Product photos uploaded through the admin are served from Supabase
     * Storage. Without this allowlist `next/image` refuses to optimise them and
     * every uploaded photo renders as a broken image — a failure that only
     * appears once the owner has already uploaded something.
     *
     * Derived from SUPABASE_URL so no hostname is hard-coded; when the variable
     * is absent the list is empty and only local images are allowed, which is
     * the correct default for a site with no storage configured.
     */
    remotePatterns: supabaseImagePatterns(),
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
