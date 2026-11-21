import type { Product } from "@/content/types";
import {
  products as seedProducts,
  productBySlug as seedBySlug,
  productById as seedById,
} from "@/content/products";
import { getCatalogue } from "@/lib/catalogue/repository";

/**
 * Storefront catalogue reads.
 *
 * Product pages use these instead of importing `@/content/products` directly,
 * so that an edit saved in the admin actually reaches the shop. This is the
 * whole point of Phase 3a: a save that the customer cannot see is not a save.
 *
 * Behaviour without a database is unchanged — the compiled seed catalogue is
 * returned, so the site builds and runs exactly as before.
 *
 * **Fallback policy.** If the database is configured but a read fails, the seed
 * catalogue is used and a warning is logged. This is a deliberate availability
 * choice: a transient database error should not take the shop down. The
 * consequence to be aware of is that during an outage customers could see
 * slightly stale prices. Checkout does *not* share this behaviour — it re-prices
 * against the same source it writes orders to and refuses on disagreement, so a
 * stale page can never charge a wrong total; it produces a "please review your
 * cart" instead.
 */

/** Products visible on the storefront: published only, in display order. */
export async function catalogueForStorefront(): Promise<Product[]> {
  try {
    return await getCatalogue().published();
  } catch (error) {
    logFallback("published", error);
    return seedProducts.filter((product) => product.status === "published");
  }
}

/** Look a published product up by its localized slug. */
export async function productForSlug(
  locale: keyof Product["slug"],
  slug: string,
): Promise<Product | undefined> {
  try {
    return await getCatalogue().bySlug(locale, slug);
  } catch (error) {
    logFallback("bySlug", error);
    return seedBySlug(locale, slug);
  }
}

/** Look a product up by id, including drafts (used for admin and cart maths). */
export async function productForId(id: string): Promise<Product | undefined> {
  try {
    return await getCatalogue().byId(id);
  } catch (error) {
    logFallback("byId", error);
    return seedById(id);
  }
}

/** Every product, drafts included. Admin only. */
export async function allProducts(): Promise<Product[]> {
  try {
    return await getCatalogue().all();
  } catch (error) {
    logFallback("all", error);
    return [...seedProducts];
  }
}

/**
 * Related products, resolved against the live catalogue and filtered so a
 * deleted or unpublished id never produces a broken link.
 */
export async function relatedFor(product: Product, all: Product[]): Promise<Product[]> {
  return product.relatedProductIds
    .map((id) => all.find((item) => item.id === id))
    .filter((item): item is Product => item !== undefined && item.status === "published")
    .slice(0, 3);
}

function logFallback(operation: string, error: unknown): void {
  // Logged rather than swallowed: a fallback that nobody notices is how a
  // database quietly stops being used.
  console.warn(
    `[catalogue] ${operation} failed, serving the compiled catalogue instead:`,
    error instanceof Error ? error.message : error,
  );
}
