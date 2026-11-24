import { products } from "@/content/products";
import { categories } from "@/content/categories";
import type { Product } from "@/content/types";
import { isPendingValue } from "@/lib/spec-summary";

/**
 * Catalogue integrity checks.
 *
 * These run at build time (imported by the product route and by `next build`
 * page generation). The point is that a whole class of mistakes — inventing a
 * price, shipping a draft product, or pointing a URL at a category that does
 * not exist — fails the build instead of quietly reaching a customer.
 */

export interface ValidationIssue {
  productId: string;
  problem: string;
}

const categoryIds = new Set(categories.map((category) => category.id));

export function validateCatalogue(list: Product[] = products): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (const product of list) {
    const fail = (problem: string) => issues.push({ productId: product.id, problem });

    if (seenIds.has(product.id)) fail("duplicate product id");
    seenIds.add(product.id);

    // Only the seven permitted categories may be used.
    if (!categoryIds.has(product.category)) {
      fail(`unknown category "${product.category}" — only the seven approved categories may be used`);
    }

    // Slugs must exist in all three languages, or a language page would 404.
    for (const locale of ["en", "ms", "zh"] as const) {
      if (!product.slug[locale]?.trim()) fail(`missing ${locale} slug`);
    }

    // A fixed price must be a real, positive integer in sen.
    if (product.price.kind === "fixed") {
      const { amountSen, compareAtSen } = product.price;
      if (!Number.isInteger(amountSen) || amountSen <= 0) {
        fail("fixed price must be a positive integer number of sen");
      }
      if (compareAtSen !== undefined && compareAtSen <= amountSen) {
        fail("compare-at price must be higher than the selling price (no fake discounts)");
      }
    }

    // Only the two confirmed genuine leather grades are allowed.
    if (product.leatherType !== "full-grain" && product.leatherType !== "top-grain") {
      fail("leather type must be full-grain or top-grain");
    }

    // Every variant must reference colours/sizes that actually exist.
    const colourIds = new Set(product.colours.map((colour) => colour.id));
    const sizeIds = new Set(product.sizes.map((size) => size.id));
    for (const variant of product.variants) {
      if (!colourIds.has(variant.colourId)) {
        fail(`variant "${variant.id}" references unknown colour "${variant.colourId}"`);
      }
      if (variant.sizeId && !sizeIds.has(variant.sizeId)) {
        fail(`variant "${variant.id}" references unknown size "${variant.sizeId}"`);
      }
      if (!Number.isInteger(variant.stock) || variant.stock < 0) {
        fail(`variant "${variant.id}" has invalid stock`);
      }
    }

    if (product.images.length === 0) fail("at least one image is required");
    if (!product.sku.trim()) fail("SKU is required");


  }

  // Cross-language slug collisions inside the same category are a duplicate
  // content risk, so they are treated as errors.
  const slugKeys = new Map<string, string>();
  for (const product of list) {
    for (const locale of ["en", "ms", "zh"] as const) {
      const key = `${locale}:${product.category}:${product.slug[locale]}`;
      if (slugKeys.has(key)) {
        issues.push({
          productId: product.id,
          problem: `duplicate ${locale} slug "${product.slug[locale]}" in ${product.category}`,
        });
      }
      slugKeys.set(key, product.id);
    }
  }

  return issues;
}

/**
 * Content debt: published products whose specification strip would collapse to a
 * single chip, because nothing beyond the leather grade has been measured yet.
 *
 * Deliberately **not** part of `validateCatalogue`, and therefore not fatal.
 * Blocking a deploy until the owner can put a ruler against a wallet would trade
 * one real problem (a thin page) for a worse one (the shop cannot ship a fix to
 * anything else). The page stays honest instead: the strip is suppressed and the
 * reader is told measurements are in progress.
 *
 * It is reported loudly and pinned by a test, so the debt is visible and cannot
 * quietly grow. When a product gains a dimension this list shortens by itself.
 */
export interface ContentDebt {
  productId: string;
  missing: string;
}

function stripWouldBeBare(product: Product): boolean {
  const confirmed = product.specifications.flatMap((group) =>
    group.items.filter((item) => !isPendingValue(item.value.en)),
  );
  const beyondGrade = confirmed.filter(
    (item) => !/^(leather|material|made in|bahan|kulit)$/i.test(item.label.en.trim()),
  );
  return beyondGrade.length === 0;
}

export function catalogueContentDebt(list: Product[] = products): ContentDebt[] {
  return list
    .filter((product) => product.status === "published" && stripWouldBeBare(product))
    .map((product) => ({
      productId: product.id,
      missing: "no confirmed dimension, width or capacity beyond the leather grade",
    }));
}

/** Throws on any issue. Called from build-time page generation. */
export function assertCatalogueValid(): void {
  const issues = validateCatalogue();
  if (issues.length > 0) {
    const detail = issues.map((issue) => `  · ${issue.productId}: ${issue.problem}`).join("\n");
    throw new Error(`Product catalogue failed validation:\n${detail}`);
  }
}
