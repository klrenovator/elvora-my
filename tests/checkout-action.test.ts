/**
 * Checkout server-action tests.
 *
 * This is the path that turns a browser into an order, so it is tested the way
 * an attacker would approach it: fully-formed valid submissions, and
 * deliberately wrong ones. Every field is attacker-controllable, including the
 * total, so the assertions below are mostly about what must be *refused*.
 */
import { placeOrder } from "@/app/[locale]/checkout/actions";
import { products } from "@/content/products";
import type { Product } from "@/content/types";
import { setCatalogue, resetCatalogue, type ProductRepository } from "@/lib/catalogue/repository";
import {
  getOrderRepository,
  resetOrderRepository,
  setOrderRepository,
  type OrderRepository,
} from "@/lib/order-repository";

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

/**
 * A priced catalogue, injected through the repository interface.
 *
 * The real seed catalogue is all price-on-request, and inventing prices for
 * real products would break the rule that a price exists only because an
 * administrator typed it. A synthetic catalogue keeps that rule intact.
 */
function pricedProduct(): Product {
  return {
    ...products[0],
    id: "test-wallet",
    status: "published",
    price: { kind: "fixed", amountSen: 24900, currency: "MYR" },
    variants: [{ id: "test-cognac", colourId: "cognac", stock: 5, sku: "TST-001-CG" }],
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
  formData.set("lines", "test-wallet|test-cognac|2");
  formData.set("subtotalSen", "49800");
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) formData.delete(key);
    else formData.set(key, value);
  }
  return formData;
}

async function main() {
  setCatalogue(repository);
  resetOrderRepository();

  /* ------------------------------ Happy path ---------------------------- */

  {
    const result = await placeOrder({}, submission());
    check("a valid order is accepted", result.ok === true, result.error ?? "");
    check("a reference is returned", typeof result.reference === "string" && result.reference.startsWith("ELV-"));
    check("the server total is returned", result.subtotalSen === 49800);
    check("the order is reported as non-durable", result.durable === false);

    const stored = await getOrderRepository().byReference(result.reference!);
    check("the order was actually stored", stored !== undefined);
    check("stored order is pending payment, never paid", stored?.status === "pending-payment");
    check("stored order has no payment record", stored?.payment === null);
    check("stored order copies the line price", stored?.lines[0].unitPriceSen === 24900);
    check("stored order copies the quantity", stored?.lines[0].quantity === 2);
    check("stored order total matches the subtotal", stored?.totalSen === 49800);
    check("shipping is absent, not zero", stored?.shippingSen === null);
    check("customer email is stored lowercased", stored?.customer.email === "aisyah@example.com");
    check("state is stored with a readable name", stored?.customer.stateName === "Kuala Lumpur");
    check("order records the ordering language", stored?.locale === "en");
  }

  {
    const before = (await getOrderRepository().recent()).length;
    const first = await placeOrder({}, submission());
    const second = await placeOrder({}, submission());
    check("each order gets a distinct reference", first.reference !== second.reference);
    check("both orders are stored", (await getOrderRepository().recent()).length === before + 2);
  }

  /* ------------------------ Client total is untrusted ------------------- */

  {
    // The attack this whole design exists to stop: claim to owe 1 sen.
    const result = await placeOrder({}, submission({ subtotalSen: "1" }));
    check("a tampered client total is refused", result.ok !== true);
    check("refusal explains the total changed", (result.error ?? "").toLowerCase().includes("total"));
    check("no order was stored for a tampered total", (result as { reference?: string }).reference === undefined);
  }

  {
    const result = await placeOrder({}, submission({ subtotalSen: "99999999" }));
    check("an inflated client total is refused", result.ok !== true);
  }

  {
    // Omitting the total entirely must not bypass the check into a free order.
    const result = await placeOrder({}, submission({ subtotalSen: undefined }));
    check("a missing client total still prices server-side", result.ok === true);
    check("a missing client total charges the server figure", result.subtotalSen === 49800);
  }

  /* ------------------------- Shape and validation ----------------------- */

  {
    const result = await placeOrder({}, submission({ locale: "fr" }));
    check("an unsupported locale is refused", result.ok !== true);
  }

  {
    const result = await placeOrder({}, submission({ lines: "" }));
    check("an order with no lines is refused", result.ok !== true);
  }

  {
    const result = await placeOrder({}, submission({ lines: "garbage" }));
    check("a malformed line list is refused", result.ok !== true);
  }

  {
    const result = await placeOrder({}, submission({ lines: "ghost|x|1" }));
    check("an unknown product is refused", result.ok !== true);
    check("the refusal names the problematic line", (result.problems ?? []).length > 0);
  }

  {
    const result = await placeOrder({}, submission({ lines: "test-wallet|test-cognac|99" }));
    check("a quantity above the cap is refused", result.ok !== true);
  }

  {
    const result = await placeOrder({}, submission({ lines: "test-wallet|test-cognac|9" }));
    check("a quantity above stock is refused", result.ok !== true);
    check(
      "stock refusal is specific",
      (result.problems ?? []).some((problem) => problem.kind === "insufficient-stock"),
    );
  }

  for (const field of ["fullName", "phone", "email", "addressLine1", "postcode", "city", "stateCode"]) {
    const result = await placeOrder({}, submission({ [field]: "   " }));
    check(`a blank ${field} is refused`, result.ok !== true);
    check(`the refusal for ${field} is field-level`, Boolean(result.fieldErrors?.[field]));
  }

  {
    const result = await placeOrder({}, submission({ postcode: "123" }));
    check("a 3-digit postcode is refused", result.ok !== true);
  }

  {
    const result = await placeOrder({}, submission({ phone: "12345" }));
    check("a nonsense phone number is refused", result.ok !== true);
  }

  {
    const result = await placeOrder({}, submission({ stateCode: "TEXAS" }));
    check("a non-Malaysian state is refused", result.ok !== true);
  }

  /* ------------------------- Unpriced catalogue ------------------------- */

  {
    // The real seed catalogue: everything is price-on-request, so checkout must
    // refuse rather than invent a figure.
    resetCatalogue();
    const result = await placeOrder(
      {},
      submission({ lines: `${products[0].id}|${products[0].variants[0].id}|1`, subtotalSen: "0" }),
    );
    check("an unpriced real product cannot be ordered", result.ok !== true);
    check(
      "the refusal is 'not priced', not a generic failure",
      (result.problems ?? []).some((problem) => problem.kind === "not-priced"),
    );
  }

  /* --------------------------- Store refusals --------------------------- */

  {
    // A storage failure must surface as a refusal. Reporting "order placed" for
    // an order that was never written would be the worst failure mode here:
    // the customer believes they have a record and nobody has one.
    setCatalogue(repository);
    const failingStore: OrderRepository = {
      async create() {
        throw new Error("storage unavailable");
      },
      async byReference() {
        return undefined;
      },
      async update(_reference, order) {
        return order;
      },
      async recent() {
        return [];
      },
    };
    setOrderRepository(failingStore);
    const result = await placeOrder({}, submission());
    check("a storage failure does not report success", result.ok !== true);
    check(
      "a storage failure says nothing was charged",
      (result.error ?? "").toLowerCase().includes("charged"),
    );
  }

  {
    // A reference collision is retried once, then refused — never overwritten.
    setCatalogue(repository);
    let attempts = 0;
    const collidingStore: OrderRepository = {
      async create(order) {
        attempts += 1;
        if (attempts === 1) throw new Error("not our error type");
        return order;
      },
      async byReference() {
        return undefined;
      },
      async update(_reference, order) {
        return order;
      },
      async recent() {
        return [];
      },
    };
    setOrderRepository(collidingStore);
    const result = await placeOrder({}, submission());
    // An unrecognised storage error is refused immediately rather than retried,
    // because retrying an unknown failure can duplicate a real write.
    check("an unknown storage error is refused, not retried", result.ok !== true);
    check("only one write was attempted", attempts === 1);
  }

  resetCatalogue();
  resetOrderRepository();

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
