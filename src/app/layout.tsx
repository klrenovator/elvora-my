import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/jost";
import "./globals.css";
import { site } from "@/lib/site";

/**
 * Root layout. The locale-specific <html lang> is set by
 * src/app/[locale]/layout.tsx, which owns everything visible; this file only
 * establishes the document shell, fonts and global defaults.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brandName}${site.brandSuffix} — Genuine Leather in Malaysia`,
    template: `%s | ${site.brandName}${site.brandSuffix}`,
  },
  description:
    "Genuine leather wallets, belts, handbags and dog accessories, manufactured in Pakistan and delivered across Malaysia.",
  applicationName: `${site.brandName}${site.brandSuffix}`,
  formatDetection: { telephone: false, address: false, email: false },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#fcfaf6",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
