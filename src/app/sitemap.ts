import type { MetadataRoute } from "next";
import { locales, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";
import { categories } from "@/content/categories";
import { alternatePaths, pathFor as pathForPath, type RouteKey } from "@/lib/routes";
import { contentPages, pageRouteKeys } from "@/lib/page-resolver";
import { catalogueForStorefront } from "@/lib/catalogue/storefront";
import { deliveryAreas } from "@/content/delivery-areas";
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

export const revalidate = 3600;

/**
 * Async because product URLs come from the live catalogue: a product created
 * in the admin must appear in the sitemap without a redeploy. The sitemap is
 * regenerated hourly, which is frequent enough for a small catalogue.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Products — published only, each with its own per-language slug.
  for (const product of await catalogueForStorefront()) {
    const paths = Object.fromEntries(
      locales.map((locale) => [
        locale,
        pathForPath("product", locale, { slug: product.slug[locale] }),
      ]),
    ) as Record<Locale, string>;
    for (const locale of locales) push(paths, locale, 0.85, "weekly");
  }

  // Delivery areas.
  //
  // Registered only for areas that exist in the geo database, so the sitemap can
  // never list a URL that 404s. `dynamicParams = false` on both location routes
  // means these are the complete set.
  const locationIndex = alternatePaths("locations");
  for (const locale of locales) push(locationIndex, locale, 0.7, "monthly");

  for (const area of deliveryAreas) {
    const paths = Object.fromEntries(
      locales.map((locale) => [locale, pathForPath("location", locale, { area: area.slug })]),
    ) as Record<Locale, string>;
    // Major centres are worth more crawl attention than small ones, but every
    // area page is a real page with unique geography, so none are excluded.
    for (const locale of locales) push(paths, locale, area.major ? 0.7 : 0.6, "monthly");
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
