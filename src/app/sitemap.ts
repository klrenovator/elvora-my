import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";
import { categories } from "@/content/categories";
import { alternatePaths, type RouteKey } from "@/lib/routes";
import { contentPages, pageRouteKeys } from "@/lib/page-resolver";
import type { PageKey } from "@/content/types";

/**
 * Multilingual sitemap with reciprocal hreflang alternates on every entry.
 *
 * Only pages we consider genuinely useful and complete are listed. As location
 * and article pages are added in later phases they must be registered with real
 * content before appearing here — no placeholder URLs.
 */

const categoryRoutes: Record<string, RouteKey> = {
  "mens-wallets": "mensWallets",
  "mens-belts": "mensBelts",
  "ladies-handbags": "ladiesHandbags",
  "ladies-belts": "ladiesBelts",
  "dog-collars": "dogCollars",
  "dog-leashes": "dogLeashes",
  "dog-collar-leash-sets": "dogSets",
};

function alternatesFor(paths: Record<Locale, string>): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const code = locale === "zh" ? "zh-Hans-MY" : `${locale}-MY`;
    languages[code] = `${site.url}${paths[locale]}`;
  }
  languages["x-default"] = `${site.url}${paths.en}`;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  const push = (
    paths: Record<Locale, string>,
    locale: Locale,
    priority: number,
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly",
  ) => {
    entries.push({
      url: `${site.url}${paths[locale]}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages: alternatesFor(paths) },
    });
  };

  // Home
  const homePaths = alternatePaths("home");
  for (const locale of locales) push(homePaths, locale, 1, "weekly");

  // Categories
  for (const category of categories) {
    const paths = alternatePaths(categoryRoutes[category.id]);
    for (const locale of locales) push(paths, locale, 0.9, "weekly");
  }

  // Editorial and trust pages
  const pagePriorities: Record<PageKey, number> = {
    "leather-guide": 0.8,
    faq: 0.8,
    about: 0.7,
    contact: 0.7,
    shipping: 0.6,
    returns: 0.6,
    "care-guide": 0.7,
    privacy: 0.3,
    terms: 0.3,
  };

  for (const key of Object.keys(contentPages) as PageKey[]) {
    const paths = alternatePaths(pageRouteKeys[key] as RouteKey);
    for (const locale of locales) push(paths, locale, pagePriorities[key], "monthly");
  }

  return entries;
}
