import type { Product, ProductVariant } from "@/content/types";
import { productById } from "@/content/products";
import { resolvePrice, type ResolvedPrice } from "@/lib/pricing";

/**
 * Cart logic, kept free of React so it can be tested directly.
 *
 * Two rules carry commercial weight and are enforced here rather than in the
 * UI:
 *
 * 1. An unpriced product cannot enter the cart. There is nothing to charge, so
 *    allowing it would produce a basket that cannot be paid for.
 * 2. A price change between adding and checking out is *surfaced*, never
 *    silently applied. The line stores the price it was added at; on
 *    reconciliation that snapshot is compared with the current price and any
 *    difference becomes a visible issue the customer must acknowledge.
 *
 * Quantities are always clamped to real stock, so the cart can never request
 * more units than exist.
 */

export interface CartLine {
  productId: string;
  variantId: string;
  quantity: number;
  /** Price at the moment of adding, in sen. Used only to detect change. */
  addedPriceSen: number;
}

export interface Cart {
  lines: CartLine[];
}

export const emptyCart: Cart = { lines: [] };

export type CartIssue =
  /** Product no longer exists or is no longer published. */
  | "unavailable"
  /** The variant was removed or the product now has no such combination. */
  | "variant-missing"
  /** Stock for this variant is zero. */
  | "out-of-stock"
  /** The product has become price-on-request since it was added. */
  | "now-on-request"
  /** The selling price is different from when the line was added. */
  | "price-changed"
  /** Requested quantity exceeds available stock. */
  | "quantity-exceeds-stock";

export interface ReconciledLine {
  line: CartLine;
  product?: Product;
  variant?: ProductVariant;
  currentPrice?: ResolvedPrice;
  /** Price to display for this line, if any. */
  lineTotalSen?: number;
  /** True when this line can be paid for as it stands. */
  orderable: boolean;
  issues: CartIssue[];
  /** Previous price, present when `price-changed` or `now-on-request` applies. */
  previousPriceSen?: number;
}

export interface ReconciledCart {
  lines: ReconciledLine[];
  /** Sum of orderable lines at *current* prices. */
  subtotalSen: number;
  /** Total units across orderable lines. */
  itemCount: number;
  /** True when at least one line cannot be checked out as-is. */
  hasIssues: boolean;
  /** True when the cart is non-empty and every line is orderable. */
  readyForCheckout: boolean;
}

export type AddResult =
  | { ok: true; cart: Cart }
  | { ok: false; reason: "not-priced" | "out-of-stock" | "variant-missing" | "invalid-quantity" };

function clampQuantity(requested: number, stock: number): number {
  if (!Number.isFinite(requested) || requested < 1) return 1;
  return Math.min(Math.floor(requested), Math.max(stock, 0));
}

function findVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((variant) => variant.id === variantId);
}

/* --------------------------------- Adding --------------------------------- */

/**
 * Add a variant to the cart.
 *
 * Refuses unpriced products outright — that is the enforcement point for the
 * "no price, no cart" rule.
 */
export function addLine(
  cart: Cart,
  product: Product,
  variantId: string,
  quantity = 1,
): AddResult {
  const price = resolvePrice(product, "en");
  if (price.kind !== "fixed") return { ok: false, reason: "not-priced" };

  const variant = findVariant(product, variantId);
  if (!variant) return { ok: false, reason: "variant-missing" };
  if (variant.stock <= 0) return { ok: false, reason: "out-of-stock" };
  if (!Number.isFinite(quantity) || quantity < 1) return { ok: false, reason: "invalid-quantity" };

  const existing = cart.lines.find(
    (line) => line.productId === product.id && line.variantId === variantId,
  );

  if (existing) {
    const nextQuantity = clampQuantity(existing.quantity + quantity, variant.stock);
    return {
      ok: true,
      cart: {
        lines: cart.lines.map((line) =>
          line.productId === product.id && line.variantId === variantId
            ? { ...line, quantity: nextQuantity }
            : line,
        ),
      },
    };
  }

  return {
    ok: true,
    cart: {
      lines: [
        ...cart.lines,
        {
          productId: product.id,
          variantId,
          quantity: clampQuantity(quantity, variant.stock),
          addedPriceSen: price.amountSen,
        },
      ],
    },
  };
}

/* -------------------------------- Updating -------------------------------- */

export function setQuantity(cart: Cart, variantId: string, quantity: number): Cart {
  if (quantity < 1) return removeLine(cart, variantId);
  return {
    lines: cart.lines.map((line) =>
      line.variantId === variantId ? { ...line, quantity: Math.floor(quantity) } : line,
    ),
  };
}

export function removeLine(cart: Cart, variantId: string): Cart {
  return { lines: cart.lines.filter((line) => line.variantId !== variantId) };
}

export function clearCart(): Cart {
  return emptyCart;
}

/* ------------------------------- Reconciling ------------------------------ */

/**
 * Reconcile the stored cart against the live catalogue.
 *
 * This is what the cart page renders and what checkout is gated on. Every line
 * is re-checked: does the product still exist and is it published, does the
 * variant still exist, is it in stock, is it still priced, and has the price
 * moved since it was added.
 */
export type ProductLookup = (id: string) => Product | undefined;

/**
 * The catalogue lookup is injectable so the cart can be reconciled against an
 * alternative catalogue — a fixture in tests, or later the admin-edited store —
 * instead of only the compiled-in seed data.
 */
export function reconcile(cart: Cart, lookup: ProductLookup = productById): ReconciledCart {
  const lines: ReconciledLine[] = cart.lines.map((line) => {
    const issues: CartIssue[] = [];
    const product = lookup(line.productId);

    if (!product || product.status !== "published") {
      return { line, orderable: false, issues: ["unavailable" as CartIssue] };
    }

    const variant = findVariant(product, line.variantId);
    if (!variant) {
      return { line, product, orderable: false, issues: ["variant-missing" as CartIssue] };
    }

    const currentPrice = resolvePrice(product, "en");

    if (currentPrice.kind !== "fixed") {
      return {
        line,
        product,
        variant,
        currentPrice,
        orderable: false,
        issues: ["now-on-request"],
        previousPriceSen: line.addedPriceSen,
      };
    }

    if (variant.stock <= 0) {
      return {
        line,
        product,
        variant,
        currentPrice,
        orderable: false,
        issues: ["out-of-stock"],
      };
    }

    if (currentPrice.amountSen !== line.addedPriceSen) {
      issues.push("price-changed");
    }

    if (line.quantity > variant.stock) {
      issues.push("quantity-exceeds-stock");
    }

    // Charge the current price, never the stale snapshot. A changed price is an
    // issue the customer must see, not a discount they quietly receive.
    const effectiveQuantity = Math.min(line.quantity, variant.stock);

    return {
      line,
      product,
      variant,
      currentPrice,
      lineTotalSen: currentPrice.amountSen * effectiveQuantity,
      orderable: true,
      issues,
      previousPriceSen:
        currentPrice.amountSen !== line.addedPriceSen ? line.addedPriceSen : undefined,
    };
  });

  // Only lines that can actually be paid for contribute to the subtotal.
  const subtotalSen = lines.reduce(
    (total, entry) => total + (entry.orderable ? (entry.lineTotalSen ?? 0) : 0),
    0,
  );

  const itemCount = lines.reduce(
    (total, entry) => total + (entry.orderable ? entry.line.quantity : 0),
    0,
  );

  const hasIssues = lines.some((entry) => entry.issues.length > 0);

  return {
    lines,
    subtotalSen,
    itemCount,
    hasIssues,
    readyForCheckout: lines.length > 0 && lines.every((entry) => entry.orderable) && !hasIssues,
  };
}

/**
 * Accept a price change at its current value, so the customer can proceed.
 * Called when the customer explicitly acknowledges the new total.
 */
export function acceptCurrentPrices(cart: Cart, lookup: ProductLookup = productById): Cart {
  const reconciled = reconcile(cart, lookup);
  return {
    lines: reconciled.lines
      .filter((entry) => entry.currentPrice?.kind === "fixed")
      .map((entry) => ({
        ...entry.line,
        addedPriceSen:
          entry.currentPrice?.kind === "fixed"
            ? entry.currentPrice.amountSen
            : entry.line.addedPriceSen,
        quantity: entry.variant
          ? Math.min(entry.line.quantity, Math.max(entry.variant.stock, 1))
          : entry.line.quantity,
      })),
  };
}

/** Remove every line that cannot be checked out. */
export function removeUnavailableLines(cart: Cart, lookup: ProductLookup = productById): Cart {
  const reconciled = reconcile(cart, lookup);
  return {
    lines: reconciled.lines
      .filter((entry) => entry.orderable)
      .map((entry) => entry.line),
  };
}

/* -------------------------------- Validation ------------------------------ */

/**
 * Validate untrusted cart data read from localStorage. Browsers let users edit
 * storage, so nothing from it is trusted: wrong types, negative quantities and
 * malformed entries are dropped rather than passed downstream.
 */
export function parseStoredCart(raw: unknown): Cart {
  if (!raw || typeof raw !== "object") return emptyCart;
  const candidate = raw as { lines?: unknown };
  if (!Array.isArray(candidate.lines)) return emptyCart;

  const lines: CartLine[] = [];
  for (const entry of candidate.lines) {
    if (!entry || typeof entry !== "object") continue;
    const line = entry as Partial<CartLine>;
    if (typeof line.productId !== "string" || !line.productId) continue;
    if (typeof line.variantId !== "string" || !line.variantId) continue;
    if (typeof line.quantity !== "number" || !Number.isFinite(line.quantity)) continue;
    if (line.quantity < 1 || line.quantity > 999) continue;
    if (typeof line.addedPriceSen !== "number" || !Number.isFinite(line.addedPriceSen)) continue;
    if (line.addedPriceSen < 0) continue;

    lines.push({
      productId: line.productId,
      variantId: line.variantId,
      quantity: Math.floor(line.quantity),
      addedPriceSen: Math.floor(line.addedPriceSen),
    });
  }

  return { lines };
}
