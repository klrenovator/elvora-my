import type { Locale } from "@/i18n/config";

/**
 * Payment methods.
 *
 * Cash on Delivery is the method the shop actually operates, so it is modelled
 * as a first-class method rather than as the absence of one. That distinction
 * matters: an order taken today genuinely is payable on delivery, and saying so
 * is more accurate than the previous "payment is not connected" wording, which
 * described a missing gateway rather than a working arrangement.
 *
 * Adding an online gateway later means adding a `PaymentMethod` value and a
 * `PaymentProvider` implementation — not touching checkout, the order model or
 * the database layout. `requiresOnlinePayment` is the single flag the rest of
 * the code asks; it is false for every method that exists today.
 *
 * Nothing here integrates with a gateway. No merchant account is configured, no
 * credential is read, and no code path can move money.
 */

export type PaymentMethodId = "cod";

/** How the money is expected to arrive. Drives the order's payment status. */
export type SettlementKind =
  /** Cash (or equivalent) handed over on delivery. Settled after the order. */
  | "on-delivery"
  /** Paid before dispatch, through a gateway. Not available yet. */
  | "upfront";

export interface PaymentMethod {
  id: PaymentMethodId;
  /** Name shown to the customer, in the language they are shopping in. */
  label: Record<Locale, string>;
  /** One sentence describing what happens. No promises about timing. */
  description: Record<Locale, string>;
  settlement: SettlementKind;
  /**
   * True only for methods that send the customer to an external gateway or
   * require a merchant account before an order can be placed.
   */
  requiresOnlinePayment: boolean;
  /** Whether a customer may choose this method today. */
  available: boolean;
}

/**
 * Cash on Delivery.
 *
 * The description deliberately says the delivery cost is confirmed before
 * dispatch rather than being free, because the shop has not published shipping
 * rates and the code has never stored a shipping figure. A COD method that
 * implied free delivery would be inventing a commercial term.
 */
export const cashOnDelivery: PaymentMethod = {
  id: "cod",
  label: {
    en: "Cash on delivery",
    ms: "Tunai semasa penghantaran",
    zh: "货到付款",
  },
  description: {
    en: "Pay the courier in cash when your order arrives. We confirm stock, the total and the delivery cost with you before dispatch, so nothing is owed that you have not seen.",
    ms: "Bayar secara tunai kepada kurier apabila pesanan tiba. Kami mengesahkan stok, jumlah dan kos penghantaran dengan anda sebelum dihantar, jadi tiada bayaran yang anda belum lihat.",
    zh: "收到货时以现金支付给快递员。发货前我们会与你确认库存、总额和运费，因此不会有你未曾见过的费用。",
  },
  settlement: "on-delivery",
  requiresOnlinePayment: false,
  available: true,
};

/**
 * Every method the shop can offer.
 *
 * One entry today. This array is the seam: an online method is appended here,
 * `requiresOnlinePayment` is set true, and the adjacent `PaymentProvider` is
 * written. The order, checkout and admin code read from this list rather than
 * hard-coding Cash on Delivery, so that addition does not disturb them.
 */
export const paymentMethods: PaymentMethod[] = [cashOnDelivery];

/** The method used when a customer does not choose one. */
export const defaultPaymentMethod = cashOnDelivery;

export function paymentMethodById(id: string): PaymentMethod | undefined {
  return paymentMethods.find((method) => method.id === id);
}

/** Methods a customer may pick right now. */
export function availablePaymentMethods(): PaymentMethod[] {
  return paymentMethods.filter((method) => method.available);
}

/**
 * Whether checkout needs a gateway before it can accept an order.
 *
 * False today. Every caller uses this rather than testing for `cod`, so that
 * when an online method becomes available this predicate keeps working and the
 * checkout flow does not need rewriting.
 */
export function checkoutNeedsOnlinePayment(): boolean {
  const available = availablePaymentMethods();
  return available.length > 0 && available.every((method) => method.requiresOnlinePayment);
}

/** Whether at least one method can be chosen. */
export function hasUsablePaymentMethod(): boolean {
  return availablePaymentMethods().length > 0;
}
