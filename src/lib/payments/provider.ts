import type { Order } from "@/lib/orders";

/**
 * Payment provider boundary.
 *
 * No provider is configured, and none is claimed to be. This interface exists
 * for two reasons:
 *
 * 1. Checkout is written against it, so connecting FPX / cards / DuitNow later
 *    is an implementation rather than a rewrite of the checkout flow.
 * 2. The *shape* of the integration is a correctness decision that should be
 *    made now, not under pressure later — in particular, that an order becomes
 *    paid only from a verified provider callback, never from the browser
 *    returning to a success URL.
 *
 * A provider implementation must not be added until the owner's merchant
 * account exists and the integration has been tested against the provider's
 * sandbox. `UnconfiguredPaymentProvider` is the only implementation, and it
 * refuses every call.
 */

export type PaymentMethod = "fpx" | "card" | "duitnow-qr";

export interface PaymentIntent {
  /** Our order reference, passed through so the callback can find the order. */
  orderReference: string;
  amountSen: number;
  method: PaymentMethod;
  customerEmail: string;
}

export interface PaymentSession {
  /** Where to send the customer to pay. */
  redirectUrl: string;
  /** The provider's own id for this session, kept for reconciliation. */
  providerReference: string;
}

export interface PaymentCallback {
  /** Raw body, exactly as received. Never pre-parsed before verification. */
  rawBody: string;
  /** Provider signature header, if the provider sends one. */
  signature: string | null;
}

export type CallbackResult =
  | { ok: true; orderReference: string; paidAmountSen: number; providerReference: string }
  | { ok: false; reason: string };

export interface PaymentProvider {
  /** Stable id, stored on the order so a later reconciliation knows the source. */
  readonly id: string;
  /** Human-readable name, for the checkout screen. */
  readonly label: string;
  /** Payment methods this provider can actually take. */
  readonly methods: PaymentMethod[];
  /** True only when credentials are present and verified. */
  isConfigured(): boolean;
  createSession(intent: PaymentIntent): Promise<PaymentSession>;
  /** Verify a callback. Must return `ok: false` on any doubt. */
  verifyCallback(callback: PaymentCallback): Promise<CallbackResult>;
}

export class PaymentNotConfiguredError extends Error {
  constructor(message = "No payment provider is configured.") {
    super(message);
    this.name = "PaymentNotConfiguredError";
  }
}

/**
 * The only provider that exists: one that honestly refuses.
 *
 * Every method throws rather than returning a plausible-looking stub, because a
 * stub that returns a fake redirect URL is exactly the kind of thing that
 * reaches production and takes money it cannot account for.
 */
export class UnconfiguredPaymentProvider implements PaymentProvider {
  readonly id = "unconfigured";
  readonly label = "Not configured";
  readonly methods: PaymentMethod[] = [];

  isConfigured(): boolean {
    return false;
  }

  async createSession(intent: PaymentIntent): Promise<PaymentSession> {
    void intent;
    throw new PaymentNotConfiguredError(
      "Payments are not connected yet. No merchant account has been configured, so no payment can be taken.",
    );
  }

  async verifyCallback(callback: PaymentCallback): Promise<CallbackResult> {
    void callback;
    return { ok: false, reason: "No payment provider is configured, so no callback can be verified." };
  }
}

let activeProvider: PaymentProvider = new UnconfiguredPaymentProvider();

/** The provider in use. Swapping this one line is the integration. */
export function getPaymentProvider(): PaymentProvider {
  return activeProvider;
}

/** Test seam, mirroring the catalogue repository. */
export function setPaymentProvider(provider: PaymentProvider): void {
  activeProvider = provider;
}

export function resetPaymentProvider(): void {
  activeProvider = new UnconfiguredPaymentProvider();
}

/**
 * Whether checkout can take payment right now.
 *
 * Both conditions are required: a provider that reports itself configured, and
 * at least one method it can actually accept. A provider that claims to be
 * configured but offers no method is treated as unconfigured rather than
 * presenting an empty choice.
 */
export function paymentsAreLive(): boolean {
  return activeProvider.isConfigured() && activeProvider.methods.length > 0;
}

/**
 * The payment-side rules an order must satisfy before it can be marked paid.
 *
 * Kept here rather than in the callback handler so they can be tested without a
 * provider, and so every future implementation is held to the same standard.
 */
export const paymentGuards = {
  /**
   * A paid amount must match the order total exactly.
   *
   * Not "at least" and not "within a tolerance": a partial payment, an
   * overpayment or a currency mix-up are all reasons to refuse and reconcile by
   * hand rather than silently accept a wrong figure.
   */
  amountMatches(order: Pick<Order, "totalSen">, paidAmountSen: number): boolean {
    if (!Number.isInteger(paidAmountSen)) return false;
    if (paidAmountSen <= 0) return false;
    return paidAmountSen === order.totalSen;
  },

  /**
   * Only a pending-payment order can become paid. Anything else — already
   * paid, cancelled, expired — is a duplicate or conflicting callback, and
   * accepting it would either double-charge or revive a dead order.
   */
  statusAllowsPayment(order: Pick<Order, "status">): boolean {
    return order.status === "pending-payment";
  },
} as const;
