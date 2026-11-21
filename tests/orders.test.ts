/**
 * Order and payment tests.
 *
 * Checkout is the part of the site where a bug costs money, so the negative
 * cases carry more weight than the happy path. Every rule that the cart
 * enforces in the browser is re-checked here on the server, because a
 * client-side check that matters commercially is only a suggestion.
 */
import { products } from "@/content/products";
import type { Product } from "@/content/types";
import {
  orderReference,
  sumLines,
  totalDisagreementSen,
  validateOrderRequest,
  type Order,
  type OrderCustomer,
  type OrderRequest,
} from "@/lib/orders";
import { normaliseCustomer, priceOrderLines, toOrderLines } from "@/lib/order-pricing";
import {
  MemoryOrderRepository,
  OrderStorageError,
  getOrderRepository,
  ordersAreDurable,
  resetOrderRepository,
} from "@/lib/order-repository";
import {
  UnconfiguredPaymentProvider,
  paymentGuards,
  paymentsAreLive,
  resetPaymentProvider,
} from "@/lib/payments/provider";

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

/* ------------------------------ Test fixtures ----------------------------- */

/**
 * The seed catalogue is deliberately all price-on-request, so pricing cannot be
 * tested against it. A small priced catalogue is built here instead of changing
 * the real products — inventing a price for a real product would violate the
 * rule the whole pricing engine exists to protect.
 */
function priced(overrides: Partial<Product> = {}): Product {
  return {
    ...products[0],
    id: "test-wallet",
    status: "published",
    price: { kind: "fixed", amountSen: 24900, currency: "MYR" },
    variants: [{ id: "test-cognac", colourId: "cognac", stock: 3, sku: "TST-001-CG" }],
    ...overrides,
  };
}

function unpublished(): Product {
  return priced({ id: "draft-wallet", status: "draft" });
}

function onRequest(): Product {
  return priced({ id: "quote-wallet", price: { kind: "on-request" } });
}

function lowStock(): Product {
  return priced({
    id: "scarce-wallet",
    variants: [{ id: "test-cognac", colourId: "cognac", stock: 1 }],
  });
}

const CATALOGUE = new Map<string, Product>(
  [priced(), unpublished(), onRequest(), lowStock()].map((product) => [product.id, product]),
);
const findProduct = async (id: string) => CATALOGUE.get(id);

const CUSTOMER: OrderCustomer = {
  fullName: "Aisyah Rahman",
  phone: "012-345 6789",
  email: "AISYAH@example.com",
  addressLine1: "12 Jalan Bukit Bintang",
  addressLine2: "",
  postcode: "55100",
  city: "Kuala Lumpur",
  stateCode: "KUL",
  stateName: "Kuala Lumpur",
};

function request(overrides: Partial<OrderRequest> = {}): OrderRequest {
  return {
    locale: "en",
    customer: CUSTOMER,
    lines: [{ productId: "test-wallet", variantId: "test-cognac", quantity: 2 }],
    ...overrides,
  };
}

async function main() {
  /* -------------------------- Server-side pricing ------------------------- */

  {
    const result = await priceOrderLines(request(), findProduct);
    check("valid order prices successfully", result.ok);
    check("subtotal is computed server-side", result.subtotalSen === 49800);
    check("line total is unit × quantity", result.lines[0].lineTotalSen === 49800);
    check("name copied in the ordering language", result.lines[0].name === products[0].name.en);
    check("variant SKU preferred over product SKU", result.lines[0].sku === "TST-001-CG");
  }

  {
    const result = await priceOrderLines(request({ locale: "ms" }), findProduct);
    check("Malay order copies the Malay name", result.lines[0].name === products[0].name.ms);
  }

  {
    // The central rule: the client's number has no influence on the price.
    const inflated = await priceOrderLines(
      request({ clientSubtotalSen: 1 }),
      findProduct,
    );
    check("a client total of 1 sen does not change the server total", inflated.subtotalSen === 49800);
  }

  {
    const result = await priceOrderLines(
      request({ lines: [{ productId: "ghost", variantId: "x", quantity: 1 }] }),
      findProduct,
    );
    check("unknown product refused", !result.ok && result.problems[0].kind === "product-missing");
    check("unknown product contributes nothing to the total", result.subtotalSen === 0);
  }

  {
    const result = await priceOrderLines(
      request({ lines: [{ productId: "draft-wallet", variantId: "test-cognac", quantity: 1 }] }),
      findProduct,
    );
    check("unpublished product refused", !result.ok && result.problems[0].kind === "not-published");
  }

  {
    const result = await priceOrderLines(
      request({ lines: [{ productId: "quote-wallet", variantId: "test-cognac", quantity: 1 }] }),
      findProduct,
    );
    check("price-on-request product refused at checkout", !result.ok && result.problems[0].kind === "not-priced");
  }

  {
    const result = await priceOrderLines(
      request({ lines: [{ productId: "test-wallet", variantId: "ghost", quantity: 1 }] }),
      findProduct,
    );
    check("unknown variant refused", !result.ok && result.problems[0].kind === "variant-missing");
  }

  {
    const result = await priceOrderLines(
      request({ lines: [{ productId: "scarce-wallet", variantId: "test-cognac", quantity: 2 }] }),
      findProduct,
    );
    check("quantity above stock refused", !result.ok && result.problems[0].kind === "insufficient-stock");
  }

  {
    const result = await priceOrderLines(
      request({ lines: [{ productId: "scarce-wallet", variantId: "test-cognac", quantity: 1 }] }),
      findProduct,
    );
    check("quantity equal to stock accepted", result.ok);
  }

  {
    // One bad line must not let the good lines through: a partial order would
    // charge for something the customer did not fully agree to.
    const result = await priceOrderLines(
      request({
        lines: [
          { productId: "test-wallet", variantId: "test-cognac", quantity: 1 },
          { productId: "ghost", variantId: "x", quantity: 1 },
        ],
      }),
      findProduct,
    );
    check("one bad line fails the whole order", !result.ok);
    check("the good line is still priced for display", result.lines.length === 1);
    check("the subtotal covers only the good line", result.subtotalSen === 24900);
  }

  {
    // Two lines of the same product and variant are summed, not deduplicated.
    const result = await priceOrderLines(
      request({
        lines: [
          { productId: "test-wallet", variantId: "test-cognac", quantity: 1 },
          { productId: "test-wallet", variantId: "test-cognac", quantity: 1 },
        ],
      }),
      findProduct,
    );
    check("repeated lines are summed", result.subtotalSen === 49800);
  }

  /* ----------------------------- Disagreement ---------------------------- */

  check("agreeing totals show no disagreement", totalDisagreementSen(49800, 49800) === 0);
  check("client total omitted is not a disagreement", totalDisagreementSen(undefined, 49800) === 0);
  check("lower client total detected", totalDisagreementSen(100, 49800) === 49700);
  check("higher client total detected", totalDisagreementSen(99999, 49800) > 0);
  check("NaN client total is treated as disagreement", totalDisagreementSen(Number.NaN, 49800) > 0);
  check("fractional client total rounds before comparing", totalDisagreementSen(49800.4, 49800) === 0);

  /* ------------------------------- Summing ------------------------------- */

  check("empty lines sum to zero", sumLines([]) === 0);
  check("single line sums", sumLines([{ quantity: 3, unitPriceSen: 1999 }]) === 5997);
  check(
    "many lines sum without float drift",
    sumLines([
      { quantity: 1, unitPriceSen: 10 },
      { quantity: 1, unitPriceSen: 20 },
      { quantity: 1, unitPriceSen: 30 },
    ]) === 60,
  );

  /* --------------------------- Request validation ------------------------ */

  check("a valid request has no problems", validateOrderRequest(request()).length === 0);

  check(
    "an empty order is refused",
    validateOrderRequest(request({ lines: [] })).some((p) => p.includes("at least one item")),
  );

  check(
    "more than 50 lines refused",
    validateOrderRequest(
      request({
        lines: Array.from({ length: 51 }, () => ({
          productId: "test-wallet",
          variantId: "test-cognac",
          quantity: 1,
        })),
      }),
    ).length > 0,
  );

  check(
    "zero quantity refused",
    validateOrderRequest(
      request({ lines: [{ productId: "test-wallet", variantId: "test-cognac", quantity: 0 }] }),
    ).length > 0,
  );

  check(
    "fractional quantity refused",
    validateOrderRequest(
      request({ lines: [{ productId: "test-wallet", variantId: "test-cognac", quantity: 1.5 }] }),
    ).length > 0,
  );

  check(
    "absurd quantity refused",
    validateOrderRequest(
      request({ lines: [{ productId: "test-wallet", variantId: "test-cognac", quantity: 999 }] }),
    ).some((p) => p.includes("20 units")),
  );

  check(
    "negative quantity refused",
    validateOrderRequest(
      request({ lines: [{ productId: "test-wallet", variantId: "test-cognac", quantity: -5 }] }),
    ).length > 0,
  );

  for (const [field, label] of [
    ["fullName", "name"],
    ["phone", "phone"],
    ["email", "email"],
    ["addressLine1", "street address"],
    ["postcode", "postcode"],
    ["city", "city"],
    ["stateCode", "state"],
  ] as const) {
    const problems = validateOrderRequest(
      request({ customer: { ...CUSTOMER, [field]: "   " } }),
    );
    check(`blank ${label} refused`, problems.length > 0);
  }

  check(
    "notes are optional",
    validateOrderRequest(request({ customer: { ...CUSTOMER, notes: "" } })).length === 0,
  );

  /* --------------------------- Order line copying ------------------------ */

  {
    const priced2 = await priceOrderLines(request(), findProduct);
    const lines = toOrderLines(priced2.lines);
    check("order lines copy the price", lines[0].unitPriceSen === 24900);
    check("order lines copy the name", lines[0].name === products[0].name.en);
    check("order lines copy the SKU", lines[0].sku === "TST-001-CG");
    check("order lines keep the quantity", lines[0].quantity === 2);
    check("order lines have no reference to the live product", !("product" in lines[0]));
  }

  /* -------------------------- Customer normalising ----------------------- */

  {
    const normalised = normaliseCustomer(CUSTOMER);
    check("email is lowercased", normalised.email === "aisyah@example.com");
    check("name is trimmed", normalised.fullName === "Aisyah Rahman");
    check("blank address line 2 becomes absent", normalised.addressLine2 === undefined);
    check("state name is preserved", normalised.stateName === "Kuala Lumpur");
  }

  {
    const normalised = normaliseCustomer({ ...CUSTOMER, fullName: "  Aisyah  ", notes: "  Gate 3  " });
    check("surrounding space trimmed from name", normalised.fullName === "Aisyah");
    check("notes trimmed rather than dropped", normalised.notes === "Gate 3");
  }

  /* ----------------------------- References ----------------------------- */

  {
    const reference = orderReference();
    check("reference is prefixed with the brand", reference.startsWith("ELV-"));
    check("reference is six characters after the prefix", reference.length === 10);
    check("reference avoids ambiguous characters", !/[01OI]/.test(reference.slice(4)));
    const many = new Set(Array.from({ length: 500 }, () => orderReference()));
    check("references are varied", many.size > 450, `only ${many.size} distinct`);
  }

  /* --------------------------- Order repository ------------------------- */

  resetOrderRepository();
  check("default order store is not durable", ordersAreDurable() === false);

  const repo = getOrderRepository();

  const makeOrder = (reference: string): Order => ({
    reference,
    createdAt: new Date().toISOString(),
    status: "pending-payment",
    locale: "en",
    customer: normaliseCustomer(CUSTOMER),
    lines: [
      {
        productId: "test-wallet",
        variantId: "test-cognac",
        name: "Test Wallet",
        sku: "TST-001-CG",
        quantity: 2,
        unitPriceSen: 24900,
        lineTotalSen: 49800,
      },
    ],
    subtotalSen: 49800,
    shippingSen: null,
    totalSen: 49800,
    payment: null,
  });

  await repo.create(makeOrder("ELV-AAAAAA"));
  check("order can be read back by reference", (await repo.byReference("ELV-AAAAAA"))?.reference === "ELV-AAAAAA");
  check("unknown reference returns undefined", (await repo.byReference("ELV-ZZZZZZ")) === undefined);

  let duplicateRefused = false;
  try {
    await repo.create(makeOrder("ELV-AAAAAA"));
  } catch (error) {
    duplicateRefused = error instanceof OrderStorageError;
  }
  check("duplicate reference refused rather than overwritten", duplicateRefused);
  check("the original order survives a duplicate attempt", (await repo.byReference("ELV-AAAAAA"))?.status === "pending-payment");

  await repo.update("ELV-AAAAAA", { ...makeOrder("ELV-AAAAAA"), status: "cancelled" });
  check("order status can be updated", (await repo.byReference("ELV-AAAAAA"))?.status === "cancelled");

  let updateMissingRefused = false;
  try {
    await repo.update("ELV-NOTME", makeOrder("ELV-NOTME"));
  } catch (error) {
    updateMissingRefused = error instanceof OrderStorageError;
  }
  check("updating a missing order refused", updateMissingRefused);

  {
    const second = new MemoryOrderRepository();
    await second.create({ ...makeOrder("ELV-BBBBBB"), createdAt: "2026-01-01T00:00:00.000Z" });
    await second.create({ ...makeOrder("ELV-CCCCCC"), createdAt: "2026-02-01T00:00:00.000Z" });
    const recent = await second.recent();
    check("recent orders are newest first", recent[0].reference === "ELV-CCCCCC");
    check("recent() respects the limit", (await second.recent(1)).length === 1);
  }

  resetOrderRepository();
  check("reset clears stored orders", (await getOrderRepository().byReference("ELV-AAAAAA")) === undefined);

  /* ----------------------------- Payment guards ------------------------- */

  check(
    "exact payment amount accepted",
    paymentGuards.amountMatches({ totalSen: 49800 }, 49800),
  );
  check(
    "underpayment refused",
    !paymentGuards.amountMatches({ totalSen: 49800 }, 49799),
  );
  check(
    "overpayment refused",
    !paymentGuards.amountMatches({ totalSen: 49800 }, 49801),
  );
  check(
    "zero payment refused",
    !paymentGuards.amountMatches({ totalSen: 49800 }, 0),
  );
  check(
    "negative payment refused",
    !paymentGuards.amountMatches({ totalSen: 49800 }, -49800),
  );
  check(
    "fractional payment refused",
    !paymentGuards.amountMatches({ totalSen: 49800 }, 49800.5),
  );

  check(
    "pending order may be paid",
    paymentGuards.statusAllowsPayment({ status: "pending-payment" }),
  );
  check("paid order cannot be paid again", !paymentGuards.statusAllowsPayment({ status: "paid" }));
  check("cancelled order cannot be paid", !paymentGuards.statusAllowsPayment({ status: "cancelled" }));
  check("expired order cannot be paid", !paymentGuards.statusAllowsPayment({ status: "expired" }));

  /* --------------------------- Provider honesty ------------------------- */

  resetPaymentProvider();
  check("payments are not live by default", paymentsAreLive() === false);

  const provider = new UnconfiguredPaymentProvider();
  check("unconfigured provider reports itself unconfigured", provider.isConfigured() === false);
  check("unconfigured provider offers no methods", provider.methods.length === 0);

  let sessionRefused = false;
  try {
    await provider.createSession({
      orderReference: "ELV-AAAAAA",
      amountSen: 49800,
      method: "fpx",
      customerEmail: "aisyah@example.com",
    });
  } catch {
    sessionRefused = true;
  }
  check("unconfigured provider refuses to create a session", sessionRefused);

  {
    const callback = await provider.verifyCallback({ rawBody: "{}", signature: null });
    check("unconfigured provider refuses to verify a callback", callback.ok === false);
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
