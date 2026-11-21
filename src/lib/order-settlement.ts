import type { Order } from "@/lib/orders";
import type { OrderRepository } from "@/lib/order-repository";

/**
 * Order settlement rules.
 *
 * This is where an order becomes `paid`, so it is deliberately separated from
 * the server action that calls it. Two reasons:
 *
 * 1. **It can be tested.** Authorisation needs a cookie and a request; the
 *    accounting rules do not. Keeping them apart means the rules are covered by
 *    tests that run without a browser or a live session.
 * 2. **There is one place to audit.** Every path that marks an order paid goes
 *    through `settleOrder`, so "can an order be marked paid without evidence?"
 *    is answered by reading one function.
 *
 * Cash on Delivery is the context for all of this: money arrives at the door,
 * long after the order was recorded, so recording it is a human statement that
 * the cash is in hand rather than something the system can observe.
 */

export type SettlementOutcome =
  /** The order was changed and saved. */
  | { ok: true; order: Order }
  /** Nothing changed, with a reason that can be logged or shown. */
  | { ok: false; reason: SettlementReason };

export type SettlementReason =
  /** No such order. */
  | "not-found"
  /** Not in a state that can be settled, e.g. already paid or cancelled. */
  | "not-settleable"
  /** Nothing is owed that can be recorded: the order has no total. */
  | "no-amount"
  /** The store refused the write. */
  | "store-refused";

/**
 * Record a Cash on Delivery order as paid.
 *
 * The amount is taken from the **stored order**, never from a caller. A
 * form-supplied figure would let a request mark a RM 498 order as settled in
 * full for RM 1, and the resulting record would look legitimate forever.
 *
 * Idempotent by construction: an order that is not `pending-payment` is left
 * untouched, so a double-click or a replayed request cannot create a second
 * payment record or overwrite the original timestamp.
 */
export async function settleOrder(
  repository: OrderRepository,
  reference: string,
  now: () => string = () => new Date().toISOString(),
): Promise<SettlementOutcome> {
  const trimmed = reference.trim();
  if (!trimmed) return { ok: false, reason: "not-found" };

  const order = await repository.byReference(trimmed).catch(() => undefined);
  if (!order) return { ok: false, reason: "not-found" };

  // Only an outstanding order can be settled. Anything else is a duplicate or a
  // conflicting request, and honouring it would either double-count the money
  // or revive a cancelled order.
  if (order.status !== "pending-payment") return { ok: false, reason: "not-settleable" };

  // There is no figure to record. Writing 0 would claim the customer owes
  // nothing, which is a much worse error than refusing.
  if (!Number.isInteger(order.totalSen) || order.totalSen <= 0) {
    return { ok: false, reason: "no-amount" };
  }

  const settled: Order = {
    ...order,
    status: "paid",
    paymentStatus: "paid",
    payment: {
      // The method the customer actually chose, carried onto the payment record
      // so a future online method writes its own name here without a change.
      provider: order.paymentMethodId ?? "cod",
      providerReference: `CASH-${order.reference}`,
      paidAt: now(),
      amountSen: order.totalSen,
    },
  };

  try {
    return { ok: true, order: await repository.update(trimmed, settled) };
  } catch {
    // The database refused, most likely the constraint that a paid order must
    // carry a payment record. Report it rather than retrying blindly.
    return { ok: false, reason: "store-refused" };
  }
}

/**
 * Cancel an outstanding order and record that nothing is owed.
 *
 * Refused for an order that is already paid: money changed hands, and erasing
 * that record would misstate the shop's takings. A refund is a separate, real
 * event that should be recorded rather than represented as a cancellation.
 */
export async function cancelOrderRecord(
  repository: OrderRepository,
  reference: string,
): Promise<SettlementOutcome> {
  const trimmed = reference.trim();
  if (!trimmed) return { ok: false, reason: "not-found" };

  const order = await repository.byReference(trimmed).catch(() => undefined);
  if (!order) return { ok: false, reason: "not-found" };

  if (order.status === "paid") return { ok: false, reason: "not-settleable" };
  if (order.status === "cancelled") return { ok: false, reason: "not-settleable" };

  const cancelled: Order = {
    ...order,
    status: "cancelled",
    paymentStatus: "not-required",
    payment: null,
  };

  try {
    return { ok: true, order: await repository.update(trimmed, cancelled) };
  } catch {
    return { ok: false, reason: "store-refused" };
  }
}
