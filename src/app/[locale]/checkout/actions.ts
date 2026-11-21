"use server";

import { validateAddress, type AddressInput } from "@/lib/address";
import { isLocale, type Locale } from "@/i18n/config";
import {
  orderReference,
  totalDisagreementSen,
  validateOrderRequest,
  type Order,
  type OrderCustomer,
  type OrderRequest,
} from "@/lib/orders";
import {
  normaliseCustomer,
  priceOrderLines,
  toOrderLines,
  type PricingProblem,
} from "@/lib/order-pricing";
import { getOrderRepository, OrderStorageError, ordersAreDurable } from "@/lib/order-repository";
import { getCatalogue } from "@/lib/catalogue/repository";
import { stateByCode } from "@/content/malaysia";

/**
 * Checkout server action.
 *
 * The order of operations is the security design:
 *
 * 1. Validate the request shape (cheap, and keeps junk out of the pricing path).
 * 2. Re-validate the delivery address on the server. The form already did, but
 *    a client-side check is a courtesy, not a control.
 * 3. Re-price every line from the catalogue. The browser's total is compared,
 *    never trusted.
 * 4. Record the order as `pending-payment`.
 *
 * There is deliberately no branch that marks an order paid. Payment status can
 * only move through a verified provider callback, and no provider is
 * configured — so an order placed today is a record of intent with a clear
 * "payment not taken" status, not a pretend sale.
 */

export interface CheckoutState {
  ok?: boolean;
  /** Human-readable refusal, shown above the form. */
  error?: string;
  /** Field-level address errors, keyed like the form's inputs. */
  fieldErrors?: Record<string, string>;
  /** Lines the server refused, for the "needs your attention" list. */
  problems?: PricingProblem[];
  /** Set on success. */
  reference?: string;
  /** The order total the server calculated. */
  subtotalSen?: number;
  /** Whether the order is durably stored, so the UI can be accurate. */
  durable?: boolean;
}

/**
 * Look products up through the live catalogue.
 *
 * This is the single authority on what a product costs. If the database is
 * unreachable the lookup throws and the order is refused — deliberately unlike
 * the storefront, which falls back to the seed so browsing keeps working. An
 * order must never be priced from a stale fallback.
 */
async function findProduct(productId: string) {
  return getCatalogue().byId(productId);
}

function addressFrom(formData: FormData): AddressInput {
  const text = (key: string) => String(formData.get(key) ?? "");
  return {
    fullName: text("fullName"),
    phone: text("phone"),
    email: text("email"),
    addressLine1: text("addressLine1"),
    addressLine2: text("addressLine2"),
    postcode: text("postcode"),
    city: text("city"),
    stateCode: text("stateCode") || text("state"),
    notes: text("notes"),
  };
}

function linesFrom(formData: FormData): OrderRequest["lines"] {
  // The cart is serialised into a hidden field as `productId|variantId|quantity`
  // per entry. Parsing is strict: anything malformed is dropped here and caught
  // by `validateOrderRequest` if it leaves no valid lines.
  const raw = String(formData.get("lines") ?? "");
  return raw
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [productId, variantId, quantity] = entry.split("|");
      return {
        productId: productId ?? "",
        variantId: variantId ?? "",
        quantity: Number(quantity),
      };
    })
    .filter((line) => line.productId && line.variantId && Number.isFinite(line.quantity));
}

export async function placeOrder(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const rawLocale = String(formData.get("locale") ?? "");
  if (!isLocale(rawLocale)) return { error: "Unsupported language." };
  const locale: Locale = rawLocale;

  const address = addressFrom(formData);

  // 1. Address, re-checked on the server. The browser's validation is a
  //    convenience; this is the version that decides.
  const addressErrors = validateAddress(address, locale);
  if (Object.keys(addressErrors).length > 0) {
    return {
      error: "Please correct the highlighted delivery details.",
      fieldErrors: addressErrors as Record<string, string>,
    };
  }

  // The state code is resolved to a name in the ordering language here, once,
  // so the stored order is readable without consulting the location table.
  const state = stateByCode.get(address.stateCode);
  const customer: OrderCustomer = {
    ...address,
    stateName: state ? state.name[locale] : address.stateCode,
  };

  const request: OrderRequest = {
    locale,
    customer,
    lines: linesFrom(formData),
    clientSubtotalSen: Number(formData.get("subtotalSen") ?? "") || undefined,
  };

  // 2. Request shape.
  const shapeProblems = validateOrderRequest(request);
  if (shapeProblems.length > 0) {
    return { error: shapeProblems[0] };
  }

  // 3. Server-side re-pricing. This is the number that matters.
  //
  //    A catalogue read failure is refused rather than falling back to the
  //    compiled seed: an order must never be priced from stale data. Catching
  //    it here turns what would be a 500 into a sentence the customer can act
  //    on, and guarantees no order was written.
  let priced: Awaited<ReturnType<typeof priceOrderLines>>;
  try {
    priced = await priceOrderLines(request, findProduct);
  } catch (error) {
    console.error(
      "[checkout] catalogue unavailable while pricing an order; refusing:",
      error instanceof Error ? error.message : error,
    );
    return {
      error:
        "We could not check current prices just now, so nothing has been ordered or charged. Please try again in a moment.",
    };
  }
  if (!priced.ok) {
    return {
      error: "Some items in your cart need attention before the order can be placed.",
      problems: priced.problems,
    };
  }

  // 4. Refuse a total the browser and the server disagree about. Adjusting it
  //    silently would mean charging a figure the customer did not see.
  const disagreement = totalDisagreementSen(request.clientSubtotalSen, priced.subtotalSen);
  if (disagreement > 0) {
    return {
      error: "The order total has changed since this page loaded. Please review your cart.",
      problems: [
        {
          kind: "price-disagreement",
          expectedSen: priced.subtotalSen,
          receivedSen: request.clientSubtotalSen ?? 0,
        },
      ],
      subtotalSen: priced.subtotalSen,
    };
  }

  // 5. Record it. A reference collision is retried once, then refused.
  const repository = getOrderRepository();
  const lines = toOrderLines(priced.lines);
  const storedCustomer = normaliseCustomer(request.customer);

  let order: Order | undefined;
  for (let attempt = 0; attempt < 2 && !order; attempt += 1) {
    const candidate: Order = {
      reference: orderReference(),
      createdAt: new Date().toISOString(),
      status: "pending-payment",
      locale,
      customer: storedCustomer,
      lines,
      subtotalSen: priced.subtotalSen,
      shippingSen: null,
      totalSen: priced.subtotalSen,
      payment: null,
    };
    try {
      order = await repository.create(candidate);
    } catch (error) {
      if (!(error instanceof OrderStorageError)) {
        return { error: "The order could not be recorded. Nothing has been charged." };
      }
    }
  }

  if (!order) {
    return { error: "The order could not be recorded. Nothing has been charged." };
  }

  return {
    ok: true,
    reference: order.reference,
    subtotalSen: order.totalSen,
    durable: ordersAreDurable(repository),
  };
}
