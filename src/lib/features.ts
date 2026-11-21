/**
 * Feature flags for capabilities that are not built yet.
 *
 * These exist so the UI can be honest: a button that cannot yet complete its
 * action renders as disabled with an explicit "not available yet" label, rather
 * than appearing to work and failing at the last step. Flip these to true in
 * the same commit that implements the feature — never before.
 */
export const features = {
  /** Phase 2b: cart implemented — variant selection, persistence, cart page. */
  cart: true,
  /**
   * Whether an *online* gateway is connected.
   *
   * Still false, and it stays false until the owner approves a merchant account
   * and the integration has been tested against the provider's sandbox.
   *
   * Note what this flag does **not** mean: the shop takes orders, and they are
   * paid for — in cash, on delivery. COD is a real payment method (see
   * `src/lib/payments/methods.ts`), not the absence of one, so this flag is
   * about gateways only. Read `paymentMethods` for what a customer can choose.
   */
  payments: false,
  /** Phase 6: live chat widget. */
  liveChat: false,
} as const;

export const cartEnabled = features.cart;
