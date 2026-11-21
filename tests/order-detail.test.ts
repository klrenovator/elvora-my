/**
 * Order detail tests.
 *
 * The detail page is what an owner works from at a packing table, so the things
 * that matter are: the address is complete enough to put on a parcel, the
 * variant is distinguishable when two SKUs share a product name, nothing is
 * invented where the order recorded nothing, and the payment wording never
 * implies money arrived when it did not.
 */
import { readFileSync } from "node:fs";
import type { Order, OrderLine } from "@/lib/orders";
import {
  addressLines,
  lineDescription,
  orderStatusCopy,
  packingSlip,
  paymentMethodLabel,
  paymentStatusCopy,
  totalUnits,
} from "@/lib/order-detail";

let pass = 0;
let fail = 0;
const check = (name: string, cond: boolean, extra = "") => {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${extra}`);
  }
};

/* ------------------------------- Fixtures -------------------------------- */

const line = (overrides: Partial<OrderLine> = {}): OrderLine => ({
  productId: "bifold-wallet-cognac",
  variantId: "bifold-cognac",
  name: "Cognac Full Grain Bifold Wallet",
  sku: "ELV-W-CG",
  quantity: 2,
  unitPriceSen: 24900,
  lineTotalSen: 49800,
  ...overrides,
});

const order: Order = {
  reference: "ELV-7K2M4Q",
  createdAt: "2026-11-21T09:15:00.000Z",
  status: "pending-payment",
  paymentMethodId: "cod",
  paymentStatus: "on-delivery",
  locale: "en",
  customer: {
    fullName: "Aisyah Rahman",
    phone: "012-345 6789",
    email: "aisyah@example.com",
    addressLine1: "12 Jalan Bukit Bintang",
    addressLine2: "Unit 3A",
    postcode: "55100",
    city: "Kuala Lumpur",
    stateCode: "KUL",
    stateName: "Kuala Lumpur",
    notes: "Gate code 4412, leave with guard",
  },
  lines: [line()],
  subtotalSen: 49800,
  shippingSen: null,
  totalSen: 49800,
  payment: null,
};

/* ------------------------------- Address --------------------------------- */

{
  const address = addressLines(order);
  check("the recipient name is present", address.recipient === "Aisyah Rahman");
  check("the phone number is present", address.phone === "012-345 6789");
  check("both street lines are kept", address.street.length === 2);
  check("the second street line survives", address.street[1] === "Unit 3A");
  check("postcode and city are combined", address.locality === "55100 Kuala Lumpur");
  check("the state name is present", address.state === "Kuala Lumpur");
  check("delivery notes are carried through", address.notes?.includes("4412") === true);

  // Optional parts must disappear rather than leaving blank rows on the page.
  const minimal = addressLines({
    customer: { ...order.customer, addressLine2: "", notes: undefined },
  });
  check("an empty second line is dropped", minimal.street.length === 1);
  check("absent notes become null", minimal.notes === null);

  const whitespace = addressLines({
    customer: { ...order.customer, addressLine2: "   ", notes: "  " },
  });
  check("a whitespace-only second line is dropped", whitespace.street.length === 1);
  check("whitespace-only notes become null", whitespace.notes === null);
}

/* -------------------------------- Lines ---------------------------------- */

{
  const description = lineDescription(order.lines[0], "en");
  check("the product name is shown", description.name === "Cognac Full Grain Bifold Wallet");
  check("the variant is exposed separately", description.variant === "bifold-cognac");
  check("the SKU is shown", description.sku === "ELV-W-CG");
  check("the quantity is shown", description.quantity === 2);

  // A line with no SKU must not acquire one.
  const noSku = lineDescription(line({ sku: "" }), "en");
  check("an absent SKU stays null", noSku.sku === null);
  const blankSku = lineDescription(line({ sku: "   " }), "en");
  check("a whitespace SKU stays null", blankSku.sku === null);

  check("total units sums the quantities", totalUnits(order) === 2);
  check(
    "total units sums across lines",
    totalUnits({ lines: [line({ quantity: 2 }), line({ quantity: 3 })] }) === 5,
  );
  check("an empty order has no units", totalUnits({ lines: [] }) === 0);
}

/* ---------------------------- Payment wording ---------------------------- */

{
  const onDelivery = paymentStatusCopy("on-delivery");
  check("cash due on delivery is an outstanding state", onDelivery.tone === "owe");
  check("its label does not say paid", !/^paid$/i.test(onDelivery.label));
  check("the label says cash is due", /cash/i.test(onDelivery.label));

  const paid = paymentStatusCopy("paid");
  check("paid is a settled state", paid.tone === "settled");
  check("paid is labelled paid", paid.label === "Paid");

  const unpaid = paymentStatusCopy("unpaid");
  check("unpaid is outstanding", unpaid.tone === "owe");
  check("unpaid is described as owed", /owed/i.test(unpaid.detail));

  const notRequired = paymentStatusCopy("not-required");
  check("nothing owed is settled", notRequired.tone === "settled");
  check("its label does not imply money was received", !/^paid$/i.test(notRequired.label));

  check("an open order reads as Open", orderStatusCopy("pending-payment") === "Open");
  check("a paid order reads as Paid", orderStatusCopy("paid") === "Paid");
  check("a cancelled order reads as Cancelled", orderStatusCopy("cancelled") === "Cancelled");

  check("the COD method is labelled", paymentMethodLabel(order) === "Cash on delivery");
  check("a legacy order without a method reads as COD", paymentMethodLabel({}) === "Cash on delivery");
  check(
    "an unknown method id is shown as-is, not guessed",
    paymentMethodLabel({ paymentMethodId: "fpx" }) === "fpx",
  );
}

/* ------------------------------ Packing slip ----------------------------- */

{
  const slip = packingSlip(order);
  check("the reference leads the slip", slip.startsWith("Order ELV-7K2M4Q"));
  check("the recipient and phone are on it", slip.includes("Aisyah Rahman · 012-345 6789"));
  check("the street address is on it", slip.includes("12 Jalan Bukit Bintang"));
  check("the second line is on it", slip.includes("Unit 3A"));
  check("the postcode and city are on it", slip.includes("55100 Kuala Lumpur"));
  check("the state is on it", slip.includes("Kuala Lumpur"));
  check("the delivery notes are on it", slip.includes("Gate code 4412"));
  check("the quantity and name are on it", slip.includes("2 x Cognac Full Grain Bifold Wallet"));
  check("the variant is on it", slip.includes("bifold-cognac"));
  check("the SKU is on it", slip.includes("[ELV-W-CG]"));
  check("the total is on it", slip.includes("RM 498.00"));
  check("the payment method is on it", slip.includes("Cash on delivery"));
  check("no null leaks into the slip", !slip.includes("null") && !slip.includes("undefined"));
  check("no markdown leaks into the slip", !slip.includes("**") && !slip.includes("##"));

  // A slip for an order with no notes must not contain an empty "Notes:" row.
  const bare = packingSlip({ ...order, customer: { ...order.customer, notes: undefined, addressLine2: "" } });
  check("an order without notes omits the notes row", !bare.includes("Notes:"));
}

/* --------------------------- The page itself ----------------------------- */

{
  const page = readFileSync("src/app/admin/orders/[reference]/page.tsx", "utf8");

  check(
    "the page is behind the owner check",
    /if \(!\(await isOwner\(\)\)\) redirect\("\/admin\/login"\)/.test(page),
  );
  check("an unknown reference is a 404", /if \(!order\) notFound\(\)/.test(page));
  check("the reference is normalised before lookup", /toUpperCase\(\)/.test(page));
  check("the full address comes from the helper", /addressLines\(order\)/.test(page));
  check("delivery notes are shown", /address\.notes/.test(page));
  check("line items are shown", /order\.lines\.map/.test(page));
  check("the variant is shown per line", /description\.variant/.test(page));
  check("the SKU is shown per line", /description\.sku/.test(page));
  check("the payment status wording comes from the helper", /paymentStatusCopy\(order\.paymentStatus\)/.test(page));

  // The honesty rules that were true on the list page must hold here too.
  check(
    "absent delivery cost is described, not shown as zero",
    /shippingSen === null[\s\S]{0,120}Quoted before dispatch/.test(page),
  );
  check("settling is a form post to the audited action", /<form action=\{markOrderPaid\}/.test(page));
  check("cancelling is a form post", /<form action=\{cancelOrder\}/.test(page));
  check("a settled order offers no actions", /settled \? \(/.test(page));
  check("an unpriced order cannot be settled here either", /disabled=\{order\.totalSen <= 0\}/.test(page));
  check(
    "the settle button states the exact amount",
    /Mark paid — \{formatSen\(order\.totalSen, order\.locale\)\} received/.test(page),
  );
  check("the payment record is shown when present", /order\.payment\.providerReference/.test(page));

  // A customer WhatsApp link must be guarded, never a dead link.
  check("the customer link is validated first", /whatsappForCustomer\(order\.customer\.phone\)/.test(page));
  check("an unnormalisable number yields no link", /return null/.test(page));

  const list = readFileSync("src/app/admin/orders/page.tsx", "utf8");
  check("the list links to the detail view", /\/admin\/orders\/\$\{encodeURIComponent\(order\.reference\)\}/.test(list));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
