/**
 * Feature flags for capabilities that are not built yet.
 *
 * These exist so the UI can be honest: a button that cannot yet complete its
 * action renders as disabled with an explicit "not available yet" label, rather
 * than appearing to work and failing at the last step. Flip these to true in
 * the same commit that implements the feature — never before.
 */
export const features = {
  /** Phase 2 step 2: cart, variant selection persistence, checkout handoff. */
  cart: false,
  /** Phase 2 step 3: payment provider (FPX / cards / DuitNow) integration. */
  payments: false,
  /** Phase 6: live chat widget. */
  liveChat: false,
} as const;

export const cartEnabled = features.cart;
