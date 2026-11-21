import type { Locale } from "@/i18n/config";

/**
 * Order records.
 *
 * Two rules shape this model:
 *
 * 1. **Totals are never trusted from the client.** A browser can send any
 *    number it likes; `priceOrderLines` re-reads the catalogue on the server and
 *    returns its own figure. The client's total is used only to detect a
 *    disagreement, never to charge.
 * 2. **An order records what was agreed, not what is true now.** Line prices,
 *    names and SKUs are copied in at the moment of ordering. If an
 *    administrator later changes a price, an existing order keeps the figure
 *    the customer saw — which is both the honest reading and the one an
 *    accountant expects.
 *
 * Order status reflects reality: until a payment provider is connected, an
 * order is `pending-payment` and can never become `paid`. Nothing in this file
 * has a path to marking an order paid without a verified provider callback.
 */

export type OrderStatus =
  /** Recorded, awaiting payment. The only status reachable today. */
  | "pending-payment"
  /** Payment confirmed by a provider callback. Unreachable until Phase 2d. */
  | "paid"
  /** Abandoned without payment. */
  | "expired"
  /** Cancelled at the customer's request. */
  | "cancelled";

export interface OrderLine {
  productId: string;
  variantId: string;
  /** Product name in the language the customer ordered in. */
  name: string;
  sku: string;
  quantity: number;
  /** Unit price agreed at the time of ordering, in sen. */
  unitPriceSen: number;
  lineTotalSen: number;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  postcode: string;
  city: string;
  /** State or federal territory code, e.g. "sgr". */
  stateCode: string;
  /** Resolved state name in the ordering language, copied for the record. */
  stateName: string;
  notes?: string;
}

export interface Order {
  /** Human-facing reference, e.g. "ELV-7K2M4Q". */
  reference: string;
  createdAt: string;
  status: OrderStatus;
  locale: Locale;
  customer: OrderCustomer;
  lines: OrderLine[];
  subtotalSen: number;
  /**
   * Shipping cost. `null` means "quoted after the order" — which is the current
   * behaviour and must never be stored as 0, because zero is a definite claim
   * that delivery is free.
   */
  shippingSen: number | null;
  totalSen: number;
  /** Set only by a verified provider callback. Always null today. */
  payment: OrderPayment | null;
}

export interface OrderPayment {
  provider: string;
  providerReference: string;
  paidAt: string;
  amountSen: number;
}

/**
 * A product reference the customer asked for, before server pricing.
 * Deliberately the minimum: the server looks everything else up itself.
 */
export interface OrderRequestLine {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface OrderRequest {
  locale: Locale;
  customer: OrderCustomer;
  lines: OrderRequestLine[];
  /** What the browser calculated. Used to detect disagreement, never to charge. */
  clientSubtotalSen?: number;
}

/* ------------------------------- References ------------------------------- */

/**
 * Order references are readable over the phone: six characters from an
 * alphabet with no 0/O or 1/I confusion, prefixed with the brand.
 *
 * Not a security token — it identifies an order to a human, and is not used to
 * authorise access to one.
 */
const REFERENCE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function orderReference(random: (max: number) => number = cryptoRandom): string {
  let body = "";
  for (let index = 0; index < 6; index += 1) {
    body += REFERENCE_ALPHABET[random(REFERENCE_ALPHABET.length)];
  }
  return `ELV-${body}`;
}

function cryptoRandom(max: number): number {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % max;
}

/* --------------------------------- Totals -------------------------------- */

/**
 * Sum order lines.
 *
 * Kept in integer sen throughout. The multiplication is integer × integer, so
 * there is no floating-point drift to round away — which is the whole reason
 * prices are stored in sen rather than ringgit.
 */
export function sumLines(lines: { quantity: number; unitPriceSen: number }[]): number {
  return lines.reduce((total, line) => total + line.quantity * line.unitPriceSen, 0);
}

/**
 * Compare the browser's total with the server's.
 *
 * Returns the difference in sen, or 0 when they agree. A non-zero value is a
 * refusal, not an adjustment: if the two disagree, one of them is wrong, and
 * guessing which would be worse than sending the customer back to the cart.
 */
export function totalDisagreementSen(
  clientSubtotalSen: number | undefined,
  serverSubtotalSen: number,
): number {
  if (clientSubtotalSen === undefined) return 0;
  if (!Number.isFinite(clientSubtotalSen)) return serverSubtotalSen;
  return Math.abs(Math.round(clientSubtotalSen) - serverSubtotalSen);
}

const MAX_QUANTITY_PER_LINE = 20;

/**
 * Validate the shape of an incoming request before any catalogue lookup.
 *
 * Rejecting early means a malformed or hostile body never reaches the pricing
 * code, and the error messages are about the request rather than about
 * whatever it happened to reference.
 */
export function validateOrderRequest(request: OrderRequest): string[] {
  const problems: string[] = [];

  if (request.lines.length === 0) problems.push("An order needs at least one item.");
  if (request.lines.length > 50) problems.push("An order cannot contain more than 50 lines.");

  for (const line of request.lines) {
    if (!line.productId || !line.variantId) {
      problems.push("Every item needs a product and a variant.");
      break;
    }
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      problems.push("Quantities must be whole numbers of at least 1.");
      break;
    }
    if (line.quantity > MAX_QUANTITY_PER_LINE) {
      problems.push(`No more than ${MAX_QUANTITY_PER_LINE} units of one item may be ordered.`);
      break;
    }
  }

  const { customer } = request;
  if (!customer.fullName.trim()) problems.push("A name is required.");
  if (!customer.phone.trim()) problems.push("A phone number is required.");
  if (!customer.email.trim()) problems.push("An email address is required.");
  if (!customer.addressLine1.trim()) problems.push("A street address is required.");
  if (!customer.postcode.trim()) problems.push("A postcode is required.");
  if (!customer.city.trim()) problems.push("A city or town is required.");
  if (!customer.stateCode.trim()) problems.push("A state or federal territory is required.");

  return problems;
}
