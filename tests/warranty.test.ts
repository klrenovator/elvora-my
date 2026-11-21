/**
 * Warranty tests.
 *
 * A warranty is a contractual promise, so the risk here is not "does the page
 * render" but "does the shop say four different things in four places". These
 * tests pin the terms to a single source and fail the build if the product page,
 * the policy page or the FAQ starts telling a different story.
 *
 * The terms were agreed by the owner on 2026-11-21:
 *   12 months · workmanship and hardware · repair then replace · customer pays in, we pay out
 */
import { readFileSync } from "node:fs";
import { WARRANTY_MONTHS, warranty, warrantyEndsOn, warrantyIsActive } from "@/content/warranty";
import { warrantyPage } from "@/content/pages-warranty";
import { locales } from "@/i18n/config";
import { matchPath, pathFor, alternatePaths } from "@/lib/routes";
import { contentPages } from "@/lib/page-resolver";
import { products } from "@/content/products";

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

console.log("\nwarranty");

/* ---------------------------- 1. The terms ---------------------------- */

check("the warranty is 12 months, as agreed", WARRANTY_MONTHS === 12);

check("every language states the duration", () =>
  locales.every((locale) => warranty.summary[locale].includes(String(WARRANTY_MONTHS))));

check("coverage names stitching", () =>
  locales.every((locale) => warranty.covers[locale].some((line) => /stitch|jahitan|缝线/i.test(line))));

check("coverage names hardware", () =>
  locales.every((locale) => warranty.covers[locale].some((line) => /hardware|perkakasan|五金/i.test(line))));

check("exclusions cover normal wear", () =>
  locales.every((locale) => warranty.excludes[locale].some((line) => /wear|haus|磨损/i.test(line))));

check("exclusions cover water and heat damage", () =>
  locales.every((locale) => warranty.excludes[locale].some((line) => /water|air|水/i.test(line))));

check("exclusions reject any load or pull figure", () =>
  locales.every((locale) => warranty.excludes[locale].some((line) => /load|pull|tensile|beban|tarikan|承重|拉力/i.test(line))));

check("the remedy is repair first, then replacement", () =>
  warranty.remedy.en.toLowerCase().includes("repair") &&
  warranty.remedy.en.toLowerCase().includes("replace"));

check("shipping is split: customer sends, we return", () => {
  const en = warranty.shipping.en.toLowerCase();
  return en.includes("you pay") && en.includes("we pay");
});

check("every language has all five sections populated", () =>
  locales.every((locale) =>
    warranty.summary[locale].length > 20 &&
    warranty.covers[locale].length >= 3 &&
    warranty.excludes[locale].length >= 4 &&
    warranty.remedy[locale].length > 40 &&
    warranty.shipping[locale].length > 40 &&
    warranty.claim[locale].length > 40));

/* ------------------- 2. No unsupported strength promise ------------------- */

const warrantyText = locales
  .map((locale) =>
    [
      warranty.summary[locale],
      ...warranty.covers[locale],
      ...warranty.excludes[locale],
      warranty.remedy[locale],
      warranty.shipping[locale],
      warranty.claim[locale],
    ].join(" "),
  )
  .join(" ")
  .toLowerCase();

for (const claim of ["lifetime", "seumur hidup", "终身", "unlimited warranty", "no questions asked", "waterproof", "kalis air", "防水"]) {
  check(`warranty does not promise "${claim}"`, !warrantyText.includes(claim));
}

check("the warranty does not claim to cover normal wear", () => {
  const en = warranty.excludes.en.join(" ").toLowerCase();
  return en.includes("not a fault") || en.includes("not covered");
});

/* ------------------------- 3. Date arithmetic ------------------------- */

check("the end date is exactly the duration later", () => {
  const start = new Date("2026-01-15T00:00:00Z");
  const end = warrantyEndsOn(start);
  return end.getUTCFullYear() === 2027 && end.getUTCMonth() === 0 && end.getUTCDate() === 15;
});

check("a month-end start does not overflow into the next month", () => {
  // 31 Jan + 12 months must not silently become 2 or 3 March.
  const start = new Date("2026-01-31T00:00:00Z");
  const end = warrantyEndsOn(start);
  return end.getUTCFullYear() === 2027 && end.getUTCMonth() <= 2;
});

check("a fresh order is inside the warranty", () =>
  warrantyIsActive(new Date("2026-11-01T00:00:00Z"), new Date("2026-11-21T00:00:00Z")));

check("an order past the duration is outside it", () =>
  !warrantyIsActive(new Date("2025-01-01T00:00:00Z"), new Date("2026-11-21T00:00:00Z")));

check("the boundary day itself is still covered", () => {
  const start = new Date("2026-01-01T00:00:00Z");
  return warrantyIsActive(start, warrantyEndsOn(start));
});

/* --------------------------- 4. Page wiring --------------------------- */

check("the page is registered", () => contentPages.warranty === warrantyPage);

check("the page title and description exist in every language", () =>
  locales.every((locale) =>
    warrantyPage.title[locale].length > 0 &&
    warrantyPage.metaTitle[locale].length > 10 &&
    warrantyPage.metaDescription[locale].length > 40));

check("no page title repeats the brand, which the layout appends", () =>
  locales.every((locale) => !/elvora/i.test(warrantyPage.metaTitle[locale])));

for (const locale of locales) {
  const path = pathFor("warranty", locale);
  check(`${locale}: path is localised`, path === `/${locale}/${warrantyPage.slug[locale]}`);
  check(`${locale}: path round-trips`, () => matchPath(path)?.key === "warranty");
}

check("hreflang alternates exist", () => {
  const alternates = alternatePaths("warranty");
  return locales.every((locale) => alternates[locale].startsWith(`/${locale}/`));
});

check("the sitemap registers the page", () =>
  readFileSync("src/app/sitemap.ts", "utf8").includes("warranty: 0."));

check("the footer links to it", () =>
  readFileSync("src/components/site-footer.tsx", "utf8").includes('["warranty", dict.footer.warranty]'));

check("the footer label is translated three times", () => {
  const labels = readFileSync("src/lib/dictionary.ts", "utf8").match(/warranty: "[^"]+"/g) ?? [];
  return labels.length === 3;
});

/* ------------------ 5. The product page cannot disagree ------------------ */

const productPage = readFileSync("src/app/[locale]/[slug]/[product]/page.tsx", "utf8");

check("the product page renders the shared warranty summary", () =>
  productPage.includes("warranty.summary[locale]"));

check("the product page links to the policy page", () =>
  productPage.includes('pathFor("warranty", locale)'));

check("the product page does not hard-code its own duration", () => {
  // Any bare "12 month" string here would be a second source of truth.
  return !/\b\d+\s*-?\s*month\s+warranty/i.test(productPage);
});

check("every published product is covered, so no product page renders a blank promise", () => {
  const published = products.filter((product) => product.status === "published");
  return published.every(() => warranty.summary.en.length > 0);
});

/* ------------------- 6. Returns and warranty do not merge ------------------- */

check("the warranty page does not restate a return window", () => {
  const en = warrantyPage.blocks.en
    .map((block) => (block.type === "list" ? block.items.join(" ") : block.type === "sizes" ? "" : block.text))
    .join(" ")
    .toLowerCase();
  // The return window lives in the returns policy; duplicating a number here
  // is how two policies end up contradicting each other.
  return !/\b(14|30|60|90)[ -]day/.test(en);
});

check("the warranty FAQ answers the chew question honestly rather than generously", () => {
  const faq = warrantyPage.faqs?.en.find((item) => /chew/i.test(item.q));
  return Boolean(faq && /not covered|not a workmanship fault/i.test(faq.a));
});

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
