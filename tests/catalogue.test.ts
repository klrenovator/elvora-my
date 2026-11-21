/**
 * Catalogue integrity tests.
 *
 * Run with: npm run test
 */
import { validateCatalogue } from "@/lib/validate-catalogue";
import { products } from "@/content/products";
import { categories } from "@/content/categories";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name} ${extra}`); }
}

// 1. The shipped catalogue is valid.
const issues = validateCatalogue();
check("shipped catalogue has no validation issues", issues.length === 0, JSON.stringify(issues));

// 2. Every product uses one of the seven approved categories.
const approved = new Set(categories.map((c) => c.id));
check("all products use an approved category", products.every((p) => approved.has(p.category)));
check("exactly seven categories exist", categories.length === 7, String(categories.length));

// 3. Only the two genuine leather grades appear.
check("only full grain / top grain used",
  products.every((p) => p.leatherType === "full-grain" || p.leatherType === "top-grain"));

// 4. Every seed product is unpriced (proves the price-on-request path).
check("every seed product is price-on-request",
  products.every((p) => p.price.kind === "on-request"));

// 5. Slugs exist in all three languages and are unique per language.
const slugs = new Set<string>();
let dupes = 0;
for (const p of products) for (const l of ["en","ms","zh"] as const) {
  if (!p.slug[l]) dupes++;
  if (slugs.has(`${l}:${p.slug[l]}`)) dupes++;
  slugs.add(`${l}:${p.slug[l]}`);
}
check("all product slugs present and unique", dupes === 0, String(dupes));

// 6. Validation detects a deliberately broken product.
const broken = [{ ...products[0], category: "shoes" as never }];
check("validation rejects a non-approved category", validateCatalogue(broken).length > 0);

const fakeDiscount = [{ ...products[0], price: { kind: "fixed" as const, amountSen: 20000, currency: "MYR" as const, compareAtSen: 10000 } }];
check("validation rejects a fake discount", validateCatalogue(fakeDiscount).length > 0);

const badStock = [{ ...products[0], variants: [{ id: "x", colourId: "nope", stock: 1 }] }];
check("validation rejects an unknown colour reference", validateCatalogue(badStock).length > 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
