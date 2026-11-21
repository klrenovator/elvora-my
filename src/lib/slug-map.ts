import { registerSlugTranslation, type SlugResolver } from "@/lib/routes";
import { products as seedProducts } from "@/content/products";
import type { Product } from "@/content/types";
import { locales, type Locale } from "@/i18n/config";

/**
 * Registers product slugs with the router so the language switcher turns
 * `/en/products/x` into `/ms/produk/y` exactly, in every direction.
 *
 * Two sources feed this:
 *
 * 1. **The compiled seed**, registered at module load. This keeps the switcher
 *    working on any page rendered before a database read has happened.
 * 2. **The live catalogue**, registered per request from the locale layout.
 *    Without this, a product created in the admin would have no translations
 *    registered and its language switcher would fall back to the homepage.
 *
 * The registry is process-global and keyed by slug, which is safe because the
 * catalogue is identical for every visitor — there is no per-user state here.
 */

/** Slugs seen in the live catalogue, keyed `locale>slug`. */
const liveSlugs = new Map<string, Partial<Record<Locale, string>>>();

let seeded = false;

function register(product: Product): void {
  const translationsByLocale: Record<string, Partial<Record<Locale, string>>> = {};
  for (const from of locales) {
    translationsByLocale[product.slug[from]] = product.slug;
  }

  for (const from of locales) {
    liveSlugs.set(`${from}>${product.slug[from]}`, product.slug);
    registerSlugTranslation(
      from,
      product.slug[from],
      locales
        .filter((to) => to !== from)
        .map((to) => ({ locale: to as Locale, slug: product.slug[to as Locale] })),
    );
  }
}

function registerSeedOnce(): void {
  if (seeded) return;
  seeded = true;
  for (const product of seedProducts) register(product);
}

/**
 * Register the current live catalogue.
 *
 * Called from the locale layout, which already reads the catalogue. Cheap: it
 * writes a handful of map entries per product.
 */
export function syncProductSlugs(products: Product[]): void {
  registerSeedOnce();
  for (const product of products) register(product);
}

/**
 * Fallback resolver, used when a slug was not pre-registered.
 *
 * Checks the live map first so an admin-created product still translates, then
 * the compiled seed.
 */
export const productSlugResolver: SlugResolver = (from, to, slug) => {
  const live = liveSlugs.get(`${from}>${slug}`);
  if (live?.[to]) return live[to];

  const seededProduct = seedProducts.find((item) => item.slug[from] === slug);
  return seededProduct ? seededProduct.slug[to] : null;
};

registerSeedOnce();
