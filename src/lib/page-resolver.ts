import type { Locale } from "@/i18n/config";
import type { Category, PageKey } from "@/content/types";
import { categories, categoryBySlug } from "@/content/categories";
import {
  aboutPage,
  careGuidePage,
  contactPage,
  leatherGuidePage,
  type ContentPage,
} from "@/content/pages-core";
import {
  faqPage,
  privacyPage,
  returnsPage,
  shippingPage,
  termsPage,
} from "@/content/pages-policy";

/** Maps a content page to its route-table key, so links never drift. */
export const pageRouteKeys: Record<PageKey, string> = {
  about: "about",
  contact: "contact",
  shipping: "shipping",
  returns: "returns",
  faq: "faq",
  "leather-guide": "leatherGuide",
  "care-guide": "careGuide",
  privacy: "privacy",
  terms: "terms",
};

export const contentPages: Record<PageKey, ContentPage> = {
  about: aboutPage,
  contact: contactPage,
  shipping: shippingPage,
  returns: returnsPage,
  faq: faqPage,
  "leather-guide": leatherGuidePage,
  "care-guide": careGuidePage,
  privacy: privacyPage,
  terms: termsPage,
};

export type ResolvedPage =
  | { kind: "category"; category: Category }
  | { kind: "content"; key: PageKey; page: ContentPage };

/**
 * One flat slug space per language. Category slugs and editorial slugs are
 * kept distinct within each language, so a single dynamic route can serve
 * both without ambiguous matches.
 */
export function resolveSlug(locale: Locale, slug: string): ResolvedPage | null {
  const category = categoryBySlug(locale, slug);
  if (category) return { kind: "category", category };

  for (const [key, page] of Object.entries(contentPages) as [PageKey, ContentPage][]) {
    if (page.slug[locale] === slug) return { kind: "content", key, page };
  }
  return null;
}

/** Every (locale, slug) pair, used for static generation and sitemaps. */
export function allLocalisedSlugs(): { locale: Locale; slug: string }[] {
  const out: { locale: Locale; slug: string }[] = [];
  const localesList: Locale[] = ["en", "ms", "zh"];
  for (const locale of localesList) {
    for (const category of categories) out.push({ locale, slug: category.slug[locale] });
    for (const page of Object.values(contentPages)) out.push({ locale, slug: page.slug[locale] });
  }
  return out;
}

/** Slugs that must never collide within a language. Guarded by a build check. */
export function assertUniqueSlugs(): void {
  const localesList: Locale[] = ["en", "ms", "zh"];
  for (const locale of localesList) {
    const seen = new Map<string, string>();
    const add = (slug: string, owner: string) => {
      const existing = seen.get(slug);
      if (existing) {
        throw new Error(`Duplicate slug "${slug}" in ${locale}: ${existing} and ${owner}`);
      }
      seen.set(slug, owner);
    };
    for (const category of categories) add(category.slug[locale], `category:${category.id}`);
    for (const [key, page] of Object.entries(contentPages)) add(page.slug[locale], `page:${key}`);
  }
}
