/**
 * Product specification strip tests.
 *
 * The strip's job is to answer "what is this, and will it do what I need" before
 * a customer has to scroll. That makes two failure modes worth guarding:
 *
 * 1. **It must never invent or dress up a figure.** Every value comes from the
 *    catalogue, and a row whose value is still "Being measured" is dropped
 *    rather than shown as a feature. The pages for products with missing data
 *    say so once, plainly, instead.
 * 2. **It must never imply a strength rating** on pet products. No manufacturer
 *    test report exists, so a chip reading "pull capacity" would be a promise the
 *    shop cannot support.
 */
import {
  specChips,
  isPendingValue,
  hasConfirmedSpecs,
  pendingSpecCount,
} from "@/lib/spec-summary";
import { products } from "@/content/products";
import { catalogueContentDebt, validateCatalogue } from "@/lib/validate-catalogue";
import { locales } from "@/i18n/config";
import type { Product } from "@/content/types";

let pass = 0;
let fail = 0;
const check = (name: string, cond: boolean | (() => boolean), extra = "") => {
  if (typeof cond === "function" ? cond() : cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.error(`  FAIL  ${name}${extra ? ` — ${extra}` : ""}`);
  }
};

console.log("\nproduct specification strip");

const published = products.filter((product) => product.status === "published");

/* ------------------------- 1. Pending detection ------------------------- */

check("the catalogue's own hedge is recognised as pending", () =>
  isPendingValue("Being measured — ask us and we will send the figures"));

check("the Malay hedge is recognised", () => isPendingValue("Sedang diukur — tanya kami"));

check("the Chinese hedge is recognised", () => isPendingValue("正在测量中——联系我们"));

check("a real dimension is not mistaken for pending", () =>
  !isPendingValue("3.5 cm") && !isPendingValue("25 cm to 50 cm across three sizes"));

check("an empty string is not silently treated as a value", () => isPendingValue(""));

/* ------------------- 2. No pending value reaches the strip ------------------- */

for (const product of published) {
  for (const locale of locales) {
    check(`${product.id} (${locale}): no pending text in the strip`, () =>
      specChips(product, locale).every((chip) => !isPendingValue(chip.value)));
  }
}

/* ------------------------ 3. Grade always leads ------------------------ */

for (const product of published) {
  check(`${product.id}: the strip leads with the leather grade`, () => {
    const chips = specChips(product, "en");
    return chips.length > 0 && /^(leather|kulit|皮革)$/i.test(chips[0].label);
  });
}

check("a full-grain product says full grain, never just 'leather'", () => {
  const chip = specChips(products.find((p) => p.leatherType === "full-grain")!, "en")[0];
  return /full grain/i.test(chip.value);
});

check("a top-grain product says top grain", () => {
  const topGrain = products.find((p) => p.leatherType === "top-grain");
  if (!topGrain) return false;
  return /top grain/i.test(specChips(topGrain, "en")[0].value);
});

/* ------------------ 4. No duplicated or instructional rows ------------------ */

for (const product of published) {
  check(`${product.id}: no repeated label in the strip`, () => {
    const labels = specChips(product, "en").map((chip) => chip.label.toLowerCase());
    return new Set(labels).size === labels.length;
  });
}

check("the catalogue's own material row does not duplicate the grade chip", () =>
  published.every((product) =>
    specChips(product, "en").filter((chip) => /^(leather|material)$/i.test(chip.label)).length <= 1));

check("instruction rows are not printed as attributes", () =>
  published.every((product) =>
    specChips(product, "en").every((chip) => !/^how to measure$/i.test(chip.label))));

/* --------------------------- 5. Bounded size --------------------------- */

check("the strip never exceeds five rows", () =>
  published.every((product) => specChips(product, "en").length <= 5));

/* ------------------- 6. Fit information is prioritised ------------------- */

check("a belt shows its length range, not just its buckle", () => {
  const belt = products.find((p) => p.category === "mens-belts")!;
  return specChips(belt, "en").some((chip) => /length choices/i.test(chip.label));
});

check("a collar shows its neck range", () => {
  const collar = products.find((p) => p.category === "dog-collars")!;
  return specChips(collar, "en").some((chip) => /neck range/i.test(chip.label));
});

check("a leash shows its available lengths", () => {
  const leash = products.find((p) => p.category === "dog-leashes")!;
  return specChips(leash, "en").some((chip) => /available lengths/i.test(chip.label));
});

/* ------------------------ 7. No strength promises ------------------------ */

const banned = [
  "pull capacity",
  "pull rating",
  "tensile",
  "kg pull",
  "load rating",
  "escape-proof",
  "chew-proof",
  "waterproof",
  "unbreakable",
];

for (const locale of locales) {
  check(`no strength claim appears in any strip (${locale})`, () => {
    const text = published
      .flatMap((product) => specChips(product, locale))
      .map((chip) => `${chip.label} ${chip.value}`)
      .join(" ")
      .toLowerCase();
    return banned.every((term) => !text.includes(term));
  });
}

/* -------------------- 8. Every language is complete -------------------- */

for (const product of published) {
  check(`${product.id}: the strip is populated in all three languages`, () =>
    locales.every((locale) => specChips(product, locale).length >= 1));

  check(`${product.id}: chip counts match across languages`, () => {
    const counts = locales.map((locale) => specChips(product, locale).length);
    return counts.every((count) => count === counts[0]);
  });

  check(`${product.id}: no empty chip value in any language`, () =>
    locales.every((locale) => specChips(product, locale).every((chip) => chip.value.trim().length > 0)));
}

/* ---------------------- 9. Pending count is truthful ---------------------- */

check("the pending count matches the catalogue's own hedge", () => {
  const wallet = products.find((p) => p.id === "bifold-wallet-cognac")!;
  return pendingSpecCount(wallet, "en") >= 1;
});

check("a fully specified product reports no pending rows", () => {
  const belt = products.find((p) => p.id === "slim-belt-chocolate")!;
  return pendingSpecCount(belt, "en") === 0;
});

/* --------------------- 10. Content debt is visible --------------------- */

check("the catalogue validator still passes, so the deploy is not blocked", () =>
  validateCatalogue().length === 0);

check("content debt is reported separately from validation errors", () => {
  const debt = catalogueContentDebt();
  return debt.every((entry) => typeof entry.productId === "string" && entry.missing.length > 0);
});

check("a product with only a grade and a pending dimension is flagged as debt", () => {
  const debt = catalogueContentDebt();
  return debt.some((entry) => entry.productId === "bifold-wallet-cognac");
});

check("a fully specified product is not flagged as debt", () => {
  const debt = catalogueContentDebt();
  return !debt.some((entry) => entry.productId === "slim-belt-chocolate");
});

check("content debt only covers published products, never drafts", () => {
  const draft: Product = {
    ...products[0],
    id: "debt-test-draft",
    status: "draft",
    specifications: [],
  };
  return catalogueContentDebt([draft]).length === 0;
});

check("hasConfirmedSpecs is false for a product with nothing measured", () => {
  const bare: Product = { ...products[0], specifications: [], leatherType: "top-grain" };
  // Only the grade chip remains, so there is no strip worth rendering.
  return !hasConfirmedSpecs(bare, "en");
});

check("hasConfirmedSpecs is true for a fully specified product", () => {
  const belt = products.find((p) => p.id === "slim-belt-chocolate")!;
  return hasConfirmedSpecs(belt, "en");
});

/* ------------------------- 11. Debt must not grow ------------------------- */

check("no more than one published product is missing its measurements", () => {
  // Pinned so the debt is visible: if this rises, new thin pages were published.
  return catalogueContentDebt().length <= 1;
});

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
