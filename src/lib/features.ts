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
   * Phase 2d: order records, server-side pricing and the payment-provider
   * boundary are complete. No provider is connected — awaiting the owner's
   * merchant account — so this stays false, and checkout records a
   * `pending-payment` order rather than taking money.
   *
   * Flip this to true only in the commit that implements and tests a real
   * provider against its sandbox.
   */
  payments: false,
  /** Phase 6: live chat widget. */
  liveChat: false,
} as const;

export const cartEnabled = features.cart;
