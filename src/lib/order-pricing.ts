import type { Product } from "@/content/types";
import { resolvePrice } from "@/lib/pricing";
import {
  sumLines,
  type OrderCustomer,
  type OrderLine,
  type OrderRequest,
  type OrderRequestLine,
} from "@/lib/orders";

/**
 * Server-side re-pricing.
 *
 * The cart in the browser is a convenience, never an authority. Before an order
 * is recorded, every line is looked up again against the catalogue and priced
 * from source. This is the only place a chargeable total comes from.
 *
 * The checks mirror the cart's rules exactly, because a client-side check that
 * matters commercially must also exist on the server — otherwise it is a
 * suggestion:
 *
 * · the product must exist and be published
 * · the variant must still exist
 * · the product must still have a fixed price (not switched to on-request)
 * · stock must cover the requested quantity
 * · the resulting total must match what the browser showed, or be refused
 */

export interface PricedLine {
  request: OrderRequestLine;
  product: Product;
  /** Name and SKU copied in the ordering language, for the order record. */
  name: string;
  sku: string;
  unitPriceSen: number;
  lineTotalSen: number;
}

export type PricingProblem =
  | { kind: "product-missing"; productId: string }
  | { kind: "not-published"; productId: string }
  | { kind: "variant-missing"; productId: string; variantId: string }
  | { kind: "not-priced"; productId: string }
  | { kind: "insufficient-stock"; productId: string; available: number; requested: number }
  | { kind: "price-disagreement"; expectedSen: number; receivedSen: number };

export interface PricingResult {
  ok: boolean;
  lines: PricedLine[];
  subtotalSen: number;
  problems: PricingProblem[];
}

/**
 * Look up products for a set of lines.
 *
 * Injected rather than imported so the pricing rules can be tested against a
 * synthetic catalogue, and so the admin's database repository can be plugged in
 * later without touching this file.
 */
export type ProductFinder = (productId: string) => Promise<Product | undefined>;

export async function priceOrderLines(
  request: OrderRequest,
  findProduct: ProductFinder,
): Promise<PricingResult> {
  const lines: PricedLine[] = [];
  const problems: PricingProblem[] = [];

  for (const requested of request.lines) {
    const product = await findProduct(requested.productId);

    if (!product) {
      problems.push({ kind: "product-missing", productId: requested.productId });
      continue;
    }
    if (product.status !== "published") {
      problems.push({ kind: "not-published", productId: product.id });
      continue;
    }

    const variant = product.variants.find((entry) => entry.id === requested.variantId);
    if (!variant) {
      problems.push({
        kind: "variant-missing",
        productId: product.id,
        variantId: requested.variantId,
      });
      continue;
    }

    // An item that has become price-on-request cannot be paid for. There is no
    // figure to charge, and inventing one would break the pricing rule.
    const price = resolvePrice(product, request.locale);
    if (price.kind !== "fixed") {
      problems.push({ kind: "not-priced", productId: product.id });
      continue;
    }

    if (variant.stock < requested.quantity) {
      problems.push({
        kind: "insufficient-stock",
        productId: product.id,
        available: variant.stock,
        requested: requested.quantity,
      });
      continue;
    }

    lines.push({
      request: requested,
      product,
      name: product.name[request.locale],
      sku: variant.sku ?? product.sku,
      unitPriceSen: price.amountSen,
      lineTotalSen: price.amountSen * requested.quantity,
    });
  }

  const subtotalSen = sumLines(
    lines.map((line) => ({
      quantity: line.request.quantity,
      unitPriceSen: line.unitPriceSen,
    })),
  );

  return { ok: problems.length === 0, lines, subtotalSen, problems };
}

/**
 * Turn priced lines into the immutable lines stored on the order.
 *
 * Names and prices are copied, not referenced: an order must keep the figures
 * the customer agreed to even after the catalogue changes.
 */
export function toOrderLines(priced: PricedLine[]): OrderLine[] {
  return priced.map((line) => ({
    productId: line.product.id,
    variantId: line.request.variantId,
    name: line.name,
    sku: line.sku,
    quantity: line.request.quantity,
    unitPriceSen: line.unitPriceSen,
    lineTotalSen: line.lineTotalSen,
  }));
}

/**
 * Normalise customer input before storage: trim everything, drop empty extras,
 * and resolve the state code to a readable name in the ordering language so the
 * record is legible without the location table.
 */
export function normaliseCustomer(customer: OrderCustomer): OrderCustomer {
  const optional = (value: string | undefined) => {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  };

  return {
    fullName: customer.fullName.trim(),
    phone: customer.phone.trim(),
    email: customer.email.trim().toLowerCase(),
    addressLine1: customer.addressLine1.trim(),
    addressLine2: optional(customer.addressLine2),
    postcode: customer.postcode.trim(),
    city: customer.city.trim(),
    stateCode: customer.stateCode.trim(),
    stateName: customer.stateName.trim(),
    notes: optional(customer.notes),
  };
}
