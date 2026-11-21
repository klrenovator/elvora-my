import type { Metadata } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/jost";
import "../globals.css";

/**
 * Admin layout.
 *
 * Deliberately outside the [locale] tree: the admin is used by the owner only,
 * in English, and is excluded from the sitemap and robots. Customer-facing
 * multilingual architecture is untouched by it.
 */
export const metadata: Metadata = {
  title: "Elvora admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[color:var(--color-surface-sunken)] antialiased">
        {children}
      </body>
    </html>
  );
}
