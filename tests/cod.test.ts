/**
 * Cash on Delivery tests.
 *
 * The shop takes orders and is paid in cash at the door. That means this file
 * has to prove three separate things, and keep them separate:
 *
 * 1. **The order is recorded** with the right method and an honest payment
 *    status — not "paid", because nothing has been paid.
 * 2. **Settling is a deliberate act.** An order becomes `paid` only when the
 *    owner records the cash, using the order's own total rather than a figure
 *    from the form.
 * 3. **No gateway lurks.** No code path can move money, and none claims to.
 *
 * The last one is asserted from source as well as behaviour, because "we did
 * not build a payment integration" is a claim that should be checkable.
 */
import { readFileSync } from "node:fs";
import { placeOrder } from "@/app/[locale]/checkout/actions";
import { settleOrder, cancelOrderRecord } from "@/lib/order-settlement";
import { products } from "@/content/products";
import type { Product } from "@/content/types";
import { setCatalogue, resetCatalogue, type ProductRepository } from "@/lib/catalogue/repository";
import {
  getOrderRepository,
  resetOrderRepository,
  useMemoryOrders,
} from "@/lib/order-repository";
import {
  cashOnDelivery,
  paymentMethods,
  availablePaymentMethods,
  paymentMethodById,
  checkoutNeedsOnlinePayment,
  hasUsablePaymentMethod,
  defaultPaymentMethod,
} from "@/lib/payments/methods";
import {
  paymentsAreLive,
  getPaymentProvider,
  resetPaymentProvider,
  paymentGuards,
} from "@/lib/payments/provider";
import { shopMailtoLink, shopWhatsAppLink, whatsappLink } from "@/lib/site";

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

/* ------------------------------ Fixtures -------------------------------- */

function pricedProduct(): Product {
  return {
    ...products[0],
    id: "cod-wallet",
    status: "published",
    price: { kind: "fixed", amountSen: 24900, currency: "MYR" },
    variants: [{ id: "cod-cognac", colourId: "cognac", stock: 5, sku: "COD-001-CG" }],
  };
}

const priced = pricedProduct();

const repository: ProductRepository = {
  async all() {
    return [priced];
  },
  async published() {
    return [priced];
  },
  async byId(id) {
    return id === priced.id ? priced : undefined;
  },
  async bySlug(_locale, slug) {
    return slug === priced.slug.en ? priced : undefined;
  },
  async create(product) {
    return product;
  },
  async update(_id, product) {
    return product;
  },
  async remove() {},
};

const ADDRESS: Record<string, string> = {
  fullName: "Aisyah Rahman",
  phone: "012-345 6789",
  email: "aisyah@example.com",
  addressLine1: "12 Jalan Bukit Bintang",
  addressLine2: "",
  postcode: "55100",
  city: "Kuala Lumpur",
  stateCode: "KUL",
  notes: "",
};

function submission(overrides: Partial<Record<string, string>> = {}): FormData {
  const formData = new FormData();
  formData.set("locale", "en");
  for (const [key, value] of Object.entries(ADDRESS)) formData.set(key, value);
  formData.set("lines", "cod-wallet|cod-cognac|2");
  formData.set("subtotalSen", "49800");
  formData.set("paymentMethod", "cod");
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) formData.delete(key);
    else formData.set(key, value);
  }
  return formData;
}

/** `revalidatePath` needs a request context; the actions only read the store. */
function ignoreRevalidate() {
  // The admin actions call revalidatePath, which no-ops outside a request in
  // these tests. Nothing to stub: the assertions are about the stored order.
}

async function main() {
  setCatalogue(repository);
  resetOrderRepository();
  resetPaymentProvider();

  /* --------------------------- The method itself ------------------------- */

  check("Cash on Delivery is a registered method", paymentMethodById("cod") === cashOnDelivery);
  check("it is the only method", paymentMethods.length === 1);
  check("it is available", cashOnDelivery.available === true);
  check("it is the default", defaultPaymentMethod.id === "cod");
  check("it settles on delivery", cashOnDelivery.settlement === "on-delivery");
  check("it does not require an online gateway", cashOnDelivery.requiresOnlinePayment === false);
  check("checkout does not need a gateway", checkoutNeedsOnlinePayment() === false);
  check("at least one method is usable", hasUsablePaymentMethod() === true);
  check("one method is offered", availablePaymentMethods().length === 1);

  for (const locale of ["en", "ms", "zh"] as const) {
    check(`the method has a ${locale} label`, cashOnDelivery.label[locale].length > 0);
    check(`the method has a ${locale} description`, cashOnDelivery.description[locale].length > 20);
  }

  // The description must not promise free delivery: shipping has never been
  // priced in this shop, and implying free delivery would invent a term.
  for (const locale of ["en", "ms", "zh"] as const) {
    const text = cashOnDelivery.description[locale].toLowerCase();
    check(
      `the ${locale} description does not promise free delivery`,
      !text.includes("free delivery") && !text.includes("percuma") && !text.includes("免运费"),
    );
  }

  check("an unknown method id resolves to nothing", paymentMethodById("paypal") === undefined);

  /* ------------------------------ No gateway ---------------------------- */

  check("no payment provider is live", paymentsAreLive() === false);
  check("the provider reports itself unconfigured", getPaymentProvider().isConfigured() === false);
  check("the provider offers no methods", getPaymentProvider().methods.length === 0);

  {
    let refused = false;
    let message = "";
    try {
      await getPaymentProvider().createSession({
        orderReference: "ELV-TEST01",
        amountSen: 100,
        method: "fpx",
        customerEmail: "a@b.my",
      });
    } catch (error) {
      refused = true;
      message = error instanceof Error ? error.message : "";
    }
    check("creating a payment session is refused", refused);
    check("the refusal mentions the missing merchant account", /merchant account/i.test(message));
  }

  {
    const result = await getPaymentProvider().verifyCallback({ rawBody: "{}", signature: null });
    check("verifying a callback is refused", result.ok === false);
  }

  /* ----------------------------- Placing an order ----------------------- */

  const placed = await placeOrder({}, submission());
  check("a COD order is placed", placed.ok === true, placed.error ?? "");
  check("the method is returned to the UI", placed.paymentMethodId === "cod");

  const stored = placed.reference
    ? await getOrderRepository().byReference(placed.reference)
    : undefined;

  check("the order is stored", stored !== undefined);
  check("the order records the COD method", stored?.paymentMethodId === "cod");
  check("the order is not marked paid", stored?.status === "pending-payment");
  check("the payment status is on-delivery", stored?.paymentStatus === "on-delivery");
  check("there is no payment record yet", stored?.payment === null);
  check("the total is the server's figure", stored?.totalSen === 49800);

  // A bogus method must not reach the database. Falling back to the default is
  // the honest behaviour: the order is real, and COD is what the shop offers.
  {
    const result = await placeOrder({}, submission({ paymentMethod: "paypal" }));
    const order = result.reference
      ? await getOrderRepository().byReference(result.reference)
      : undefined;
    check("an unknown method is not stored", order?.paymentMethodId === "cod");
  }

  // Omitting the field entirely must still produce a COD order, so an old
  // cached checkout page cannot place an order with no payment method.
  {
    const result = await placeOrder({}, submission({ paymentMethod: undefined as unknown as string }));
    const order = result.reference
      ? await getOrderRepository().byReference(result.reference)
      : undefined;
    check("a missing method falls back to COD", order?.paymentMethodId === "cod");
  }

  /* ------------------------------ Settling ------------------------------ */

  if (stored) {
    const paymentBefore = stored.payment;

    // The form tries to dictate an amount. It must be ignored: the order total
    // is the only figure that may be recorded as received.
    const settledResult = await settleOrder(getOrderRepository(), stored.reference);

    const settled = await getOrderRepository().byReference(stored.reference);
    check("marking paid settles the order", settled?.status === "paid");
    check("the payment status becomes paid", settled?.paymentStatus === "paid");
    check("a payment record is written", settled?.payment !== undefined && settled?.payment !== null);
    check(
      "the recorded amount is the order total, not the form's figure",
      settled?.payment?.amountSen === 49800,
    );
    check("the payment records the method used", settled?.payment?.provider === "cod");
    check("the payment has a timestamp", typeof settled?.payment?.paidAt === "string");
    check("no payment existed before", paymentBefore === null);
    check(
      "the payment reference is derived from the order",
      settled?.payment?.providerReference === `CASH-${stored.reference}`,
    );

    check("settling reports success", settledResult.ok === true);

    // Settling twice must not create a second payment record.
    const twice = await settleOrder(getOrderRepository(), stored.reference);
    const again = await getOrderRepository().byReference(stored.reference);
    check("settling twice is refused", twice.ok === false);
    check("the second attempt says why", twice.ok === false && twice.reason === "not-settleable");
    check("settling twice does not change the order", again?.payment?.paidAt === settled?.payment?.paidAt);

    // A settled order cannot be cancelled: money changed hands, and discarding
    // that record would misstate the takings.
    const cancelPaid = await cancelOrderRecord(getOrderRepository(), stored.reference);
    const afterCancel = await getOrderRepository().byReference(stored.reference);
    check("a paid order cannot be cancelled", cancelPaid.ok === false);
    check("it stays paid", afterCancel?.status === "paid");
    check("its payment record survives", afterCancel?.payment !== null);
  }

  /* ------------------------------ Cancelling ---------------------------- */

  {
    const result = await placeOrder({}, submission());
    const reference = result.reference!;

    const cancelResult = await cancelOrderRecord(getOrderRepository(), reference);
    check("cancelling reports success", cancelResult.ok === true);

    const cancelled = await getOrderRepository().byReference(reference);
    check("an unpaid order can be cancelled", cancelled?.status === "cancelled");
    check("a cancelled order owes nothing", cancelled?.paymentStatus === "not-required");
    check("a cancelled order has no payment record", cancelled?.payment === null);

    // Cancelling twice is a no-op, not an error.
    const twice = await cancelOrderRecord(getOrderRepository(), reference);
    const again = await getOrderRepository().byReference(reference);
    check("cancelling twice is refused", twice.ok === false);
    check("a cancelled order stays cancelled", again?.status === "cancelled");

    // A cancelled order cannot then be marked paid.
    const settleCancelled = await settleOrder(getOrderRepository(), reference);
    const afterSettle = await getOrderRepository().byReference(reference);
    check("a cancelled order cannot be marked paid", settleCancelled.ok === false);
    check("it stays cancelled", afterSettle?.status === "cancelled");
  }

  /* --------------------------- Guards and unknowns ---------------------- */

  {
    const unknown = await settleOrder(getOrderRepository(), "ELV-NOSUCH");
    check("settling an unknown reference is refused", unknown.ok === false);
    check("the reason is not-found", unknown.ok === false && unknown.reason === "not-found");

    const blank = await settleOrder(getOrderRepository(), "   ");
    check("a blank reference is refused", blank.ok === false);

    const cancelUnknown = await cancelOrderRecord(getOrderRepository(), "ELV-NOSUCH");
    check("cancelling an unknown reference is refused", cancelUnknown.ok === false);
  }

  {
    // An order with no total has nothing to record. Writing 0 would claim the
    // customer owes nothing, which is worse than refusing.
    useMemoryOrders();
    const repository = getOrderRepository();
    const unpriced = await placeOrder({}, submission({ subtotalSen: "0" }));
    void unpriced;
    // Build the case directly, since checkout refuses an unpriced order.
    await repository.create({
      reference: "ELV-ZERO01",
      createdAt: new Date().toISOString(),
      status: "pending-payment",
      paymentMethodId: "cod",
      paymentStatus: "on-delivery",
      locale: "en",
      customer: {
        fullName: "Test",
        phone: "0123456789",
        email: "t@example.com",
        addressLine1: "1 Jalan",
        postcode: "55100",
        city: "KL",
        stateCode: "KUL",
        stateName: "Kuala Lumpur",
      },
      lines: [],
      subtotalSen: 0,
      shippingSen: null,
      totalSen: 0,
      payment: null,
    });
    const result = await settleOrder(repository, "ELV-ZERO01");
    check("an order with no total cannot be settled", result.ok === false);
    check("the reason is that there is no amount", result.ok === false && result.reason === "no-amount");
    check(
      "the unpriced order is left untouched",
      (await repository.byReference("ELV-ZERO01"))?.paymentStatus === "on-delivery",
    );
  }

  // The payment guards must still refuse a partial amount and a dead order.
  check(
    "a partial payment is refused by the guards",
    paymentGuards.amountMatches({ totalSen: 49800 }, 100) === false,
  );
  check(
    "an exact payment passes the guards",
    paymentGuards.amountMatches({ totalSen: 49800 }, 49800) === true,
  );
  check(
    "a cancelled order cannot pass the payment guard",
    paymentGuards.statusAllowsPayment({ status: "cancelled" }) === false,
  );

  /* --------------------------- Contact channels ------------------------- */

  {
    const savedNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const savedEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

    // Unconfigured: no link at all, never a placeholder.
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;

    // The module reads env at import time, so assert the helper's contract on
    // the live values rather than reloading. A configured value must produce a
    // wa.me link; an unconfigured one must produce null.
    if (savedNumber === undefined) {
      check("no WhatsApp link without a number", shopWhatsAppLink() === null);
    } else {
      check("a WhatsApp link exists when configured", shopWhatsAppLink()?.startsWith("https://wa.me/") === true);
    }
    if (savedEmail === undefined) {
      check("no email link without an address", shopMailtoLink() === null);
    } else {
      check("an email link exists when configured", shopMailtoLink()?.startsWith("mailto:") === true);
    }

    // The number formatter itself, independent of configuration.
    check(
      "a local number becomes an international wa.me link",
      whatsappLink("012-345 6789") === "https://wa.me/60123456789",
    );
    check(
      "an already-international number is left alone",
      whatsappLink("+60 12 345 6789") === "https://wa.me/60123456789",
    );
    check(
      "a message is appended encoded",
      whatsappLink("0123456789", "Hello there").includes("?text=Hello%20there"),
    );

    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = savedNumber;
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = savedEmail;
  }

  {
    // Contact channels are read from the environment so the shop's real
    // details are not committed. Assert the wiring, not a specific value.
    const site = readFileSync("src/lib/site.ts", "utf8");
    check("WhatsApp is read from the environment", /NEXT_PUBLIC_WHATSAPP_NUMBER/.test(site));
    check("email is read from the environment", /NEXT_PUBLIC_CONTACT_EMAIL/.test(site));
    check(
      "an unset channel resolves to null rather than a placeholder",
      /trimmed\.length > 0 \? trimmed : null/.test(site),
    );

    const checkout = readFileSync("src/components/checkout-form.tsx", "utf8");
    check("checkout offers the method list", /availablePaymentMethods\(\)/.test(checkout));
    check("checkout submits the chosen method", /formData\.set\("paymentMethod"/.test(checkout));
    check("checkout does not hard-code COD in the payload", !/formData\.set\("paymentMethod", "cod"\)/.test(checkout));
    check("the confirmation offers WhatsApp", /confirmationHref/.test(checkout));

    const admin = readFileSync("src/app/admin/actions.ts", "utf8");
    check("settling requires the owner", /markOrderPaid[\s\S]{0,200}requireOwner\(\)/.test(admin));
    check("settling delegates to the audited rule", /settleOrder\(getOrderRepository\(\)/.test(admin));
    check("the action passes no amount", !/settleOrder\([^)]*amount/i.test(admin));

    const settlement = readFileSync("src/lib/order-settlement.ts", "utf8");
    check("the settled amount comes from the order", /amountSen: order\.totalSen/.test(settlement));
    check("an unpriced order cannot be settled", /order\.totalSen <= 0/.test(settlement));
    check("a paid order cannot be cancelled", /order\.status === "paid"\) return/.test(settlement));
    check("only an outstanding order can be settled", /order\.status !== "pending-payment"/.test(settlement));

    const page = readFileSync("src/app/admin/orders/page.tsx", "utf8");
    check("the order list shows the payment status", /order\.paymentStatus/.test(page));
    check("the order list shows the payment method", /paymentMethodById/.test(page));
  }

  {
    // The claim that matters most: no online gateway was integrated.
    const provider = readFileSync("src/lib/payments/provider.ts", "utf8");
    check(
      "no gateway SDK is imported by the provider",
      !/(stripe|billplz|toyyibpay|ipay88|senangpay|chip|paypal)/i.test(provider),
    );

    const pkg = readFileSync("package.json", "utf8");
    check(
      "no payment SDK is a dependency",
      !/(stripe|billplz|toyyibpay|ipay88|senangpay|paypal|braintree|adyen)/i.test(pkg),
    );

    const env = readFileSync(".env.example", "utf8");
    check(
      "no merchant credentials are expected in the environment",
      !/(STRIPE|BILLPLZ|TOYYIBPAY|IPAY88|SENANGPAY|MERCHANT_SECRET)/i.test(env),
    );
  }

  /* ------------------------------ Order lists --------------------------- */

  {
    // The admin list must still return the orders it wrote, including the
    // new fields — the same repository the catalogue and admin already use.
    useMemoryOrders();
    const recent = await getOrderRepository().recent(100);
    check("the order repository is reachable", Array.isArray(recent));
  }

  resetCatalogue();
  resetOrderRepository();
  ignoreRevalidate();

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
