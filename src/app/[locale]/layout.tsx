import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { assertLocale, htmlLang, isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { organizationLd, serialiseJsonLd, webSiteLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { catalogueForStorefront } from "@/lib/catalogue/storefront";
import { syncProductSlugs } from "@/lib/slug-map";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    other: { "og:site_name": `${site.brandName}${site.brandSuffix}` },
    title: {
      default: `${site.brandName}${site.brandSuffix} — ${dict.brandTagline}`,
      template: `%s | ${site.brandName}${site.brandSuffix}`,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = assertLocale(raw);
  const dict = getDictionary(locale);

  // The live catalogue is passed to the cart so a browser reconciles against
  // the same prices the server will charge. Without this, an admin price edit
  // would make every existing cart show a total that checkout then refuses.
  const catalogue = await catalogueForStorefront();
  // Keep the language switcher's slug translations in step with the live
  // catalogue, so a product created in the admin translates across languages.
  syncProductSlugs(catalogue);

  return (
    <html lang={htmlLang[locale]} dir="ltr">
      <body className="min-h-screen antialiased">
        <a href="#main" className="skip-link">
          {dict.common.skipToContent}
        </a>
        <CartProvider catalogue={catalogue}>
          <SiteHeader locale={locale} />
          <main id="main">{children}</main>
          <SiteFooter locale={locale} />
        </CartProvider>
        <script
          type="application/ld+json"
          // Structured data built from our own literals only.
          dangerouslySetInnerHTML={{
            __html: serialiseJsonLd({
              "@context": "https://schema.org",
              "@graph": [organizationLd(locale), webSiteLd(locale)],
            }),
          }}
        />
      </body>
    </html>
  );
}
