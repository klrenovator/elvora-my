import { registerSlugTranslation, type SlugResolver } from "@/lib/routes";
import { products } from "@/content/products";
import { locales, type Locale } from "@/i18n/config";

/**
 * Registers every product's per-language slugs with the router so the language
 * switcher can translate `/en/products/x` into `/ms/produk/y` exactly.
 *
 * Done as a side effect at module load because products are static content in
 * this phase; when the catalogue becomes admin-editable this moves into the
 * request path instead.
 */
let registered = false;

export function registerProductSlugs(): void {
  if (registered) return;
  registered = true;

  for (const product of products) {
    for (const from of locales) {
      const translations = locales
        .filter((to) => to !== from)
        .map((to) => ({ locale: to as Locale, slug: product.slug[to as Locale] }));
      registerSlugTranslation(from, product.slug[from], translations);
    }
  }
}

/** Fallback resolver, used if a slug was not registered up front. */
export const productSlugResolver: SlugResolver = (from, to, slug) => {
  const product = products.find((item) => item.slug[from] === slug);
  return product ? product.slug[to] : null;
};

registerProductSlugs();
