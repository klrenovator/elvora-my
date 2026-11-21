/**
 * Cart logic tests.
 *
 * Run with: npm test
 *
 * Focus: the two commercial rules (no unpriced item in the cart, no silent
 * price change), stock clamping, and defence against tampered localStorage.
 */
import {
  acceptCurrentPrices,
  addLine,
  emptyCart,
  parseStoredCart,
  reconcile,
  removeLine,
  removeUnavailableLines,
  setQuantity,
} from "@/lib/cart-store";
import { products } from "@/content/products";
import type { Product } from "@/content/types";

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${extra}`);
  }
}

const base = products[0];
const variantId = base.variants[0].id;

/**
 * Fixture catalogue. Reconcile is given this lookup instead of the global seed
 * data, so we can price and stock a product for testing without editing the
 * shipped catalogue.
 */
let catalogue: Product[] = [];
const lookup = (id: string) => catalogue.find((product) => product.id === id);

/** A priced, stocked copy of a real product. */
function priced(stock = 5, amountSen = 24900): Product {
  return {
    ...base,
    price: { kind: "fixed", amountSen, currency: "MYR" },
    variants: base.variants.map((v) => ({ ...v, stock })),
  };
}

catalogue = [base];

/* ------------------------- Rule 1: no unpriced items ---------------------- */

const unpricedAdd = addLine(emptyCart, base, variantId, 1);
check("unpriced product cannot be added", unpricedAdd.ok === false);
check(
  "unpriced add is refused for the right reason",
  !unpricedAdd.ok && unpricedAdd.reason === "not-priced",
);

/* ------------------------------ Adding basics ----------------------------- */

const pricedProduct = priced(5);
const added = addLine(emptyCart, pricedProduct, variantId, 1);
check("priced + in-stock product can be added", added.ok === true);
const cart1 = added.ok ? added.cart : emptyCart;
check("cart has one line", cart1.lines.length === 1);
check("line records the price at time of adding", cart1.lines[0].addedPriceSen === 24900);

const addedAgain = addLine(cart1, pricedProduct, variantId, 2);
check("adding the same variant merges lines", addedAgain.ok && addedAgain.cart.lines.length === 1);
check(
  "merged quantity is correct",
  addedAgain.ok && addedAgain.cart.lines[0].quantity === 3,
  addedAgain.ok ? String(addedAgain.cart.lines[0].quantity) : "",
);

const overStock = addLine(emptyCart, priced(2), variantId, 10);
check(
  "quantity clamped to available stock",
  overStock.ok && overStock.cart.lines[0].quantity === 2,
  overStock.ok ? String(overStock.cart.lines[0].quantity) : "",
);

const outOfStock = addLine(emptyCart, priced(0), variantId, 1);
check("out-of-stock item cannot be added", !outOfStock.ok && outOfStock.reason === "out-of-stock");

const badVariant = addLine(emptyCart, pricedProduct, "no-such-variant", 1);
check("unknown variant rejected", !badVariant.ok && badVariant.reason === "variant-missing");

/* --------------------------- Quantities and removal ----------------------- */

const twoLines = addLine(cart1, pricedProduct, base.variants[1].id, 1);
const cart2 = twoLines.ok ? twoLines.cart : cart1;
check("second variant adds a second line", cart2.lines.length === 2);

const qtyZero = setQuantity(cart2, variantId, 0);
check("setting quantity to 0 removes the line", qtyZero.lines.length === 1);

const removed = removeLine(cart2, variantId);
check("removeLine drops only that line", removed.lines.length === 1);
check("removed line is the right one", removed.lines[0].variantId !== variantId);

/* ------------------------- Reconciling a valid cart ----------------------- */

// The cart was built against a priced fixture, so the catalogue must contain
// that same priced product when we reconcile.
catalogue = [pricedProduct];
const goodCart = added.ok ? added.cart : emptyCart;
const rec = reconcile(goodCart, lookup);
check("valid cart is ready for checkout", rec.readyForCheckout === true);
check("subtotal uses current price × quantity", rec.subtotalSen === 24900);
check("item count correct", rec.itemCount === 1);
check("no issues reported", rec.hasIssues === false);

/* ------------------- Rule 2: price change is surfaced --------------------- */

// Reprice the fixture catalogue *after* the item was added, which is exactly
// the real-world situation: the owner changes a price and a saved cart is opened.
const staleLine = goodCart;
catalogue = [priced(5, 29900)];
const staleRec = reconcile(staleLine, lookup);
check("price change detected", staleRec.lines[0].issues.includes("price-changed"));
check("price change makes cart not ready", staleRec.readyForCheckout === false);
check(
  "line total uses CURRENT price, not the stale one",
  staleRec.lines[0].lineTotalSen === 29900,
  String(staleRec.lines[0].lineTotalSen),
);
check(
  "previous price retained for display",
  staleRec.lines[0].previousPriceSen === 24900,
  String(staleRec.lines[0].previousPriceSen),
);

// Accepting prices clears the issue.
const accepted = acceptCurrentPrices(staleLine, lookup);
const acceptedRec = reconcile(accepted, lookup);
check("accepting new price clears the issue", acceptedRec.lines[0].issues.includes("price-changed") === false);
check("cart ready after accepting price", acceptedRec.readyForCheckout === true);
check(
  "stored price updated to current",
  accepted.lines[0].addedPriceSen === 29900,
  String(accepted.lines[0].addedPriceSen),
);

/* --------------------- Tampered storage cannot cut price ------------------ */

catalogue = [priced(5, 24900)];
const tampered = parseStoredCart({
  lines: [{ productId: base.id, variantId, quantity: 1, addedPriceSen: 1 }],
});
const tamperedRec = reconcile(tampered, lookup);
check(
  "tampered low price cannot lower the total",
  tamperedRec.lines[0].lineTotalSen === 24900,
  String(tamperedRec.lines[0].lineTotalSen),
);
check(
  "tampered low price raises a price-changed issue instead",
  tamperedRec.lines[0].issues.includes("price-changed"),
);

/* ------------------------ Tampered storage validation --------------------- */

check("non-object rejected", parseStoredCart("nope").lines.length === 0);
check("null rejected", parseStoredCart(null).lines.length === 0);
check("missing lines rejected", parseStoredCart({}).lines.length === 0);
check(
  "negative quantity rejected",
  parseStoredCart({ lines: [{ productId: "a", variantId: "b", quantity: -5, addedPriceSen: 100 }] })
    .lines.length === 0,
);
check(
  "absurd quantity rejected",
  parseStoredCart({ lines: [{ productId: "a", variantId: "b", quantity: 5000, addedPriceSen: 100 }] })
    .lines.length === 0,
);
check(
  "string quantity rejected",
  parseStoredCart({ lines: [{ productId: "a", variantId: "b", quantity: "3", addedPriceSen: 100 }] })
    .lines.length === 0,
);
check(
  "negative price rejected",
  parseStoredCart({ lines: [{ productId: "a", variantId: "b", quantity: 1, addedPriceSen: -100 }] })
    .lines.length === 0,
);
check(
  "valid line survives parsing",
  parseStoredCart({ lines: [{ productId: "a", variantId: "b", quantity: 2, addedPriceSen: 100 }] })
    .lines.length === 1,
);

/* ---------------------- Unavailable product in the cart ------------------- */

const unavailableCart = { lines: [{ productId: "deleted-product", variantId: "x", quantity: 1, addedPriceSen: 100 }] };
const unavailableRec = reconcile(unavailableCart, lookup);
check("deleted product flagged unavailable", unavailableRec.lines[0].issues.includes("unavailable"));
check("unavailable product cannot be checked out", unavailableRec.readyForCheckout === false);
check("unavailable product contributes no subtotal", unavailableRec.subtotalSen === 0);
check(
  "removeUnavailableLines clears it",
  removeUnavailableLines(unavailableCart, lookup).lines.length === 0,
);

/* --------------------------- Real seed catalogue -------------------------- */

check(
  "every seed product is refused by the cart (all unpriced)",
  products.every((p) => !addLine(emptyCart, p, p.variants[0].id, 1).ok),
);


console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
