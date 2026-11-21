import type { Metadata } from "next";
import { hreflang, locales, ogLocale, type Locale } from "@/i18n/config";
import { alternatePaths, type RouteKey } from "@/lib/routes";
import { site } from "@/lib/site";

/**
 * TODO(phase-1 follow-up): replace with a dedicated 1200x630 branded banner at
 * /images/og/elvora-leather-og.jpg. The hero photograph is used meanwhile so no
 * page ever references a missing share image.
 */
const DEFAULT_OG_IMAGE = "/images/hero/hero-leather.jpg";

export interface PageMetaInput {
  locale: Locale;
  /** Absolute path for the current language, e.g. `/ms/dompet-lelaki`. */
  path: string;
  title: string;
  description: string;
  /** Full alternate map when the page exists in more than one language. */
  alternates?: Record<Locale, string>;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
}

/**
 * Builds a complete metadata block: self-referencing canonical, reciprocal
 * hreflang links (x-default points at English), Open Graph and Twitter cards.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  alternates,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  type = "website",
}: PageMetaInput): Metadata {
  const canonical = absoluteUrl(path);

  const languageAlternates: Record<string, string> = {};
  if (alternates) {
    for (const code of locales) {
      languageAlternates[hreflang[code]] = absoluteUrl(alternates[code]);
    }
    // x-default: the language-neutral entry point, English by policy.
    languageAlternates["x-default"] = absoluteUrl(alternates.en);
  }

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.keys(languageAlternates).length ? languageAlternates : undefined,
    },
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      siteName: `${site.brandName}${site.brandSuffix}`,
      title,
      description,
      url: canonical,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      images: [{ url: absoluteUrl(image), width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

/** Convenience wrapper for the routes defined in the route table. */
export function metadataForKey(
  key: RouteKey,
  locale: Locale,
  title: string,
  description: string,
  options: Partial<PageMetaInput> = {},
): Metadata {
  const alternates = alternatePaths(key);
  return buildMetadata({
    locale,
    path: alternates[locale],
    title,
    description,
    alternates,
    ...options,
  });
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${normalised === "/" ? "" : normalised}`;
}

/** JSON.stringify is safe for our own literals; this keeps `<` out of the HTML. */
export function serialiseJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/* ------------------------------ Structured data ------------------------------ */

export function organizationLd(_locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: `${site.brandName}${site.brandSuffix}`,
    url: site.url,
    description:
      "Genuine leather wallets, belts, handbags and dog accessories manufactured in Pakistan and sold online in Malaysia.",
    areaServed: { "@type": "Country", name: "Malaysia", "@id": "https://www.wikidata.org/wiki/Q833" },
    // No logo, address or telephone is published until the owner supplies them.
  };
}

export function webSiteLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: `${site.brandName}${site.brandSuffix}`,
    inLanguage: hreflang[locale],
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionPageLd(input: {
  name: string;
  description: string;
  path: string;
  locale: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: hreflang[input.locale],
    isPartOf: { "@id": `${site.url}/#website` },
  };
}

/** FAQPage markup is emitted only for pages where the Q&A is visible. */
export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function itemListLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
