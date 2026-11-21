import type { Locale } from "@/i18n/config";
import type { Order, OrderLine, PaymentStatus, OrderStatus } from "@/lib/orders";
import { paymentMethodOf } from "@/lib/orders";
import { paymentMethodById } from "@/lib/payments/methods";

/**
 * Order presentation helpers.
 *
 * Kept out of the page components so the same wording is used wherever an order
 * is shown, and so the rules below can be tested without rendering.
 */

/**
 * The packer's view of a line.
 *
 * `OrderLine` stores the product name and SKU as agreed at the time of
 * ordering, which is right for the record but not enough to pick an item off a
 * shelf: two variants of one product share a name. The variant id is what
 * distinguishes them, so it is surfaced as its own label rather than being
 * buried in the id or glued onto the name as a suffix.
 *
 * Nothing is invented here. If a line carries no SKU, none is displayed —
 * a made-up code on a picking list is worse than a blank.
 */
export function lineDescription(line: OrderLine, locale: Locale): {
  name: string;
  variant: string;
  sku: string | null;
  quantity: number;
} {
  void locale;
  return {
    name: line.name,
    variant: line.variantId,
    sku: line.sku?.trim() ? line.sku.trim() : null,
    quantity: line.quantity,
  };
}

/** Total units across all lines, for the "3 items" summary. */
export function totalUnits(order: Pick<Order, "lines">): number {
  return order.lines.reduce((total, line) => total + line.quantity, 0);
}

/**
 * How a payment status should be read.
 *
 * `tone` drives colour only: `owe` means money is outstanding and the owner
 * should act, `settled` means nothing is owed, `neutral` means the order is not
 * live. The words are the authority, not the colour.
 */
export function paymentStatusCopy(status: PaymentStatus): {
  label: string;
  tone: "owe" | "settled" | "neutral";
  detail: string;
} {
  switch (status) {
    case "paid":
      return { label: "Paid", tone: "settled", detail: "Money received and recorded." };
    case "on-delivery":
      return {
        label: "Cash due on delivery",
        tone: "owe",
        detail: "Not collected yet. Mark paid once the cash is in hand.",
      };
    case "unpaid":
      return {
        label: "Unpaid",
        tone: "owe",
        detail: "Delivery happened without payment. This is owed by the customer.",
      };
    case "not-required":
      return { label: "Nothing owed", tone: "settled", detail: "Cancelled before anything was due." };
  }
}

export function orderStatusCopy(status: OrderStatus): string {
  switch (status) {
    case "pending-payment":
      return "Open";
    case "paid":
      return "Paid";
    case "cancelled":
      return "Cancelled";
    case "expired":
      return "Expired";
  }
}

/** The payment method's English label, or the stored id if it is unknown. */
export function paymentMethodLabel(order: Pick<Order, "paymentMethodId">): string {
  const id = paymentMethodOf(order);
  return paymentMethodById(id)?.label.en ?? id;
}

/**
 * The full delivery address, ready to copy onto a parcel.
 *
 * Returns lines rather than a blob so the page can render each on its own row —
 * a label printer and a human both prefer that. `addressLine2` and `notes` are
 * omitted when empty instead of printing blank rows.
 */
export function addressLines(order: Pick<Order, "customer">): {
  recipient: string;
  phone: string;
  street: string[];
  locality: string;
  state: string;
  notes: string | null;
} {
  const { customer } = order;
  const street = [customer.addressLine1, customer.addressLine2]
    .map((line) => (line ?? "").trim())
    .filter(Boolean);

  return {
    recipient: customer.fullName,
    phone: customer.phone,
    street,
    locality: [customer.postcode, customer.city].filter(Boolean).join(" ").trim(),
    state: customer.stateName,
    notes: customer.notes?.trim() ? customer.notes.trim() : null,
  };
}

/**
 * A plain-text picking slip.
 *
 * The owner works from a phone at a packing table, where copying a block of text
 * into WhatsApp is more useful than a screenshot. Deliberately plain: no
 * markdown, no emoji, nothing that renders differently in a chat app.
 */
export function packingSlip(order: Order): string {
  const address = addressLines(order);
  const lines = order.lines.map((line) => {
    const description = lineDescription(line, order.locale);
    const sku = description.sku ? ` [${description.sku}]` : "";
    return `${description.quantity} x ${description.name} — ${description.variant}${sku}`;
  });

  return [
    `Order ${order.reference}`,
    `${address.recipient} · ${address.phone}`,
    ...address.street,
    `${address.locality}, ${address.state}`,
    address.notes ? `Notes: ${address.notes}` : null,
    "",
    ...lines,
    "",
    `Total: RM ${(order.totalSen / 100).toFixed(2)} (${paymentMethodLabel(order)})`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}
