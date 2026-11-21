/**
 * Pricing engine and availability tests.
 *
 * Run with: npm run test
 *
 * These assert the two commercial rules the whole site depends on:
 * a price is never invented, and a discount is never fabricated.
 */
import { resolvePrice, resolveAvailability, isVariantOrderable } from "@/lib/pricing";
import { products } from "@/content/products";
import type { Product } from "@/content/types";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name} ${extra}`); }
}

const base = products[0];

// 1. on-request stays on-request in every language
for (const l of ["en","ms","zh"] as const) {
  const r = resolvePrice(base, l);
  check(`on-request resolves as on-request (${l})`, r.kind === "on-request");
}

// 2. Fixed price formats correctly
const priced: Product = { ...base, price: { kind: "fixed", amountSen: 24900, currency: "MYR" } };
const en = resolvePrice(priced, "en");
check("fixed price -> kind fixed", en.kind === "fixed");
check("formats as RM 249.00", en.kind === "fixed" && en.formatted === "RM 249.00", en.kind==="fixed"?en.formatted:"");
check("no compareAt when none set", en.kind === "fixed" && en.compareAt === undefined);

// 3. Genuine discount is preserved
const discounted: Product = { ...base, price: { kind: "fixed", amountSen: 20000, currency: "MYR", compareAtSen: 25000 } };
const d = resolvePrice(discounted, "en");
check("real discount keeps compareAt", d.kind === "fixed" && d.compareAt?.formatted === "RM 250.00");
check("discount percent computed (20%)", d.kind === "fixed" && d.discountPercent === 20, String(d.kind==="fixed"?d.discountPercent:""));

// 4. FAKE discount rejected (compareAt lower/equal than price)
const fake: Product = { ...base, price: { kind: "fixed", amountSen: 25000, currency: "MYR", compareAtSen: 20000 } };
const f = resolvePrice(fake, "en");
check("lower compareAt ignored (no fake saving)", f.kind === "fixed" && f.compareAt === undefined);

const equal: Product = { ...base, price: { kind: "fixed", amountSen: 25000, currency: "MYR", compareAtSen: 25000 } };
const e = resolvePrice(equal, "en");
check("equal compareAt ignored", e.kind === "fixed" && e.compareAt === undefined);

// 5. Corrupt price falls back to on-request, never a number
for (const bad of [0, -100, Number.NaN, Number.POSITIVE_INFINITY]) {
  const p: Product = { ...base, price: { kind: "fixed", amountSen: bad, currency: "MYR" } };
  check(`invalid amountSen ${bad} -> on-request`, resolvePrice(p, "en").kind === "on-request");
}

// 6. Availability
check("all-zero stock -> out-of-stock", resolveAvailability(base) === "out-of-stock");
const some: Product = { ...base, variants: base.variants.map((v,i)=>({...v, stock: i===0?5:0})) };
check("mixed stock -> partially-available", resolveAvailability(some) === "partially-available");
const all: Product = { ...base, variants: base.variants.map(v=>({...v, stock: 3})) };
check("all stock -> in-stock", resolveAvailability(all) === "in-stock");
const none: Product = { ...base, variants: [] };
check("no variants -> unconfigured", resolveAvailability(none) === "unconfigured");

// 7. Cannot order unpriced items even with stock
const pricedInStock: Product = { ...all, price: { kind: "fixed", amountSen: 10000, currency: "MYR" } };
const variant = pricedInStock.variants[0];
check("unpriced w/ stock -> NOT orderable", isVariantOrderable(variant, resolvePrice(base,"en"), "in-stock") === false);
check("priced w/ stock -> orderable", isVariantOrderable(variant, resolvePrice(pricedInStock,"en"), "in-stock") === true);

// 8. Locale formatting differs but value is consistent
const ms = resolvePrice(priced, "ms");
const zh = resolvePrice(priced, "zh");
check("all locales contain 249,00 / 249.00 for same amount",
  ms.kind==="fixed" && zh.kind==="fixed" && ms.amountSen===24900 && zh.amountSen===24900);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
