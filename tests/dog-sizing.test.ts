/**
 * Dog collar sizing guide tests.
 *
 * The sizing guide is the one piece of content in the shop that can cause a
 * physical problem if it is wrong — a collar bought to a bad measurement is
 * uncomfortable for the dog, and a load claim we cannot support is worse. These
 * tests therefore check three things:
 *
 * 1. **The arithmetic is right** — centimetre ranges must be ordered, contiguous,
 *    and convert to inches consistently, because the page shows both.
 * 2. **The recommendation is sensible** — a neck near a boundary resolves to one
 *    size, never to none, and never to two.
 * 3. **No unsupported safety claim appears** in any language, and the page is
 *    wired into routes, sitemap and footer.
 */
import { readFileSync } from "node:fs";
import {
  collarSizes,
  dogSizingPage,
  recommendSize,
  cmToInches,
  formatInches,
} from "@/content/pages-sizing";
import { locales } from "@/i18n/config";
import { matchPath, pathFor, alternatePaths } from "@/lib/routes";
import { contentPages, assertUniqueSlugs } from "@/lib/page-resolver";

let pass = 0;
let fail = 0;
// Accepts a value or a thunk, so multi-statement assertions can be written as
// a block without wrapping every call in parentheses.
const check = (name: string, cond: boolean | (() => boolean), extra = "") => {
  if (typeof cond === "function" ? cond() : cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.error(`  FAIL  ${name}${extra ? ` — ${extra}` : ""}`);
  }
};

console.log("\ndog collar sizing");

/* ------------------------- 1. Range coherence ------------------------- */

check("sizes are ordered by range", () => {
  for (let i = 1; i < collarSizes.length; i++) {
    const prev = collarSizes[i - 1];
    const row = collarSizes[i];
    if (row.minCm < prev.minCm) return false;
    if (row.maxCm <= prev.maxCm) return false;
  }
  return true;
});

check("every row has a positive range", () =>
  collarSizes.every((row) => row.minCm > 0 && row.maxCm > row.minCm));

check("consecutive ranges overlap, so there is no gap a neck can fall into", () => {
  for (let i = 1; i < collarSizes.length; i++) {
    if (collarSizes[i].minCm > collarSizes[i - 1].maxCm) return false;
  }
  return true;
});

check("no range exceeds 12 cm, which would make the guidance meaningless", () =>
  collarSizes.every((row) => row.maxCm - row.minCm <= 12));

check("strap widths are one of the three values the page explains", () =>
  collarSizes.every((row) => [15, 20, 25].includes(row.width)));

check("every size has a description in all three languages", () =>
  collarSizes.every((row) => locales.every((locale) => row.suits[locale].trim().length > 2)));

check("no two rows share the same width and range", () => {
  const keys = collarSizes.map((row) => `${row.width}-${row.minCm}-${row.maxCm}`);
  return new Set(keys).size === keys.length;
});

/* ------------------------- 2. Unit conversion ------------------------- */

check("1 inch converts to 2.54 cm", cmToInches(2.54) === 1);

check("20 cm is 7.9 inches", cmToInches(20) === 7.9);

// 25.4 cm is exactly 10 inches; the table must not print "10.0".
check("inches are formatted without a trailing .0", () =>
  formatInches(25.4) === "10");

check("inches are formatted to one decimal otherwise", () =>
  formatInches(30) === "11.8");

check("every table range converts to a plausible neck size", () =>
  collarSizes.every((row) => {
    const min = cmToInches(row.minCm);
    const max = cmToInches(row.maxCm);
    return min >= 6 && max <= 30;
  }));

/* ---------------------- 3. Recommendation behaviour ---------------------- */

check("a mid-range measurement resolves to exactly one size", () => {
  for (const row of collarSizes) {
    const mid = (row.minCm + row.maxCm) / 2;
    const picked = recommendSize(mid);
    if (!picked) return false;
    // The middle of a range must belong to that range.
    if (mid < picked.minCm || mid > picked.maxCm) return false;
  }
  return true;
});

check("a measurement near a boundary still resolves to a size", () => {
  for (const row of collarSizes) {
    for (const boundary of [row.minCm, row.maxCm]) {
      if (!recommendSize(boundary)) return false;
    }
  }
  return true;
});

check("a typical small dog neck resolves", () => {
  const picked = recommendSize(28);
  return picked !== null && 28 >= picked.minCm && 28 <= picked.maxCm;
});

check("a typical large dog neck resolves", () => {
  const picked = recommendSize(50);
  return picked !== null && 50 >= picked.minCm && 50 <= picked.maxCm;
});

check("nonsense input returns null rather than guessing", () => {
  return (
    recommendSize(0) === null &&
    recommendSize(-5) === null &&
    recommendSize(Number.NaN) === null
  );
});

check("a neck far outside any range returns null", () => {
  return recommendSize(120) === null && recommendSize(5) === null;
});

/* ----------------------- 4. No unsupported claims ----------------------- */

const bodyText = locales
  .map((locale) =>
    dogSizingPage.blocks[locale]
      .map((block) => {
        if (block.type === "list") return block.items.join(" ");
        if (block.type === "sizes") return "";
        return block.text;
      })
      .join(" "),
  )
  .join(" ");

// Anything that reads as a load rating, a strength guarantee, or an
// escape-proof promise. None of the eight pet brands examined publishes test
// data for these, and we have no manufacturer report, so the page must not
// hint at one either.
const bannedClaims = [
  "escape-proof",
  "escape proof",
  "chew-proof",
  "chew proof",
  "bite-proof",
  "tensile",
  "pull rating",
  "pull capacity",
  "load rating",
  "kg pull",
  "tested to",
  "unbreakable",
  "indestructible",
  "waterproof",
  "anti-bacterial",
  "hypoallergenic",
  "lifetime guarantee",
  "guaranteed for life",
];

/**
 * A banned term may only appear inside a sentence that denies it — the page
 * deliberately says "we do not publish a load or pull capacity", and that
 * sentence is doing useful work. What must not appear is an affirmative use.
 * So each sentence containing a banned term is checked for a negation.
 */
const negationMarkers = [
  "not",
  " never ",
  "cannot",
  "can't",
  "no ",
  "tidak",
  "bukan",
  "tiada",
  "不",
  "没有",
  "无",
];

function offendingUse(text: string, term: string): string | null {
  const sentences = text.toLowerCase().split(/(?<=[.!?。！？])\s+/);
  for (const sentence of sentences) {
    if (!sentence.includes(term)) continue;
    const denied = negationMarkers.some((marker) => ` ${sentence} `.includes(marker));
    if (!denied) return sentence.trim().slice(0, 90);
  }
  return null;
}

for (const claim of bannedClaims) {
  const offending = offendingUse(bodyText, claim);
  check(`page makes no affirmative "${claim}" claim`, offending === null, offending ?? "");
}

check("the page says plainly that no load rating is published", () => {
  const en = dogSizingPage.blocks.en
    .map((block) => (block.type === "list" ? block.items.join(" ") : block.type === "sizes" ? "" : block.text))
    .join(" ")
    .toLowerCase();
  return en.includes("do not publish a load or pull capacity");
});

check("the page tells the reader to measure rather than guess by breed", () =>
  dogSizingPage.intro.en.toLowerCase().includes("not by breed"));

check("the page warns against tightening a collar to force a fit", () =>
  bodyText.toLowerCase().includes("never tighten a collar"));

check("the chart is explicitly flagged as needing confirmation against stock", () =>
  locales.every((locale) => dogSizingPage.confirmStock[locale].trim().length > 80));

check("stock confirmation names the real dependency, not a vague promise", () =>
  dogSizingPage.confirmStock.en.toLowerCase().includes("strap length"));

/* --------------------------- 5. Route wiring --------------------------- */

check("content page registry contains the sizing guide", () => {
  return contentPages["dog-sizing"] === (dogSizingPage as typeof contentPages["dog-sizing"]);
});

check("slugs are unique across every language", () => {
  assertUniqueSlugs();
  return true;
});

for (const locale of locales) {
  const path = pathFor("dogSizing", locale);
  check(`${locale}: path is localised, not transliterated`, path === `/${locale}/${dogSizingPage.slug[locale]}`);

  check(`${locale}: path round-trips through the matcher`, () => {
    const match = matchPath(path);
    return match?.key === "dogSizing" && match.locale === locale;
  });
}

check("hreflang alternates exist for all three languages", () => {
  const paths = alternatePaths("dogSizing");
  return locales.every((locale) => paths[locale].startsWith(`/${locale}/`));
});

check("sitemap registers the page", () => {
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
  return sitemap.includes('"dog-sizing"');
});

check("footer links to the guide on every page", () => {
  const footer = readFileSync("src/components/site-footer.tsx", "utf8");
  return footer.includes('"dogSizing"');
});

check("footer link has a label in all three languages", () => {
  const dict = readFileSync("src/lib/dictionary.ts", "utf8");
  const labels = dict.match(/sizing: "[^"]+"/g) ?? [];
  return labels.length === 3;
});

check("pet category pages can reach the guide", () => {
  const page = readFileSync("src/app/[locale]/[slug]/page.tsx", "utf8");
  return page.includes('"dog-sizing": ["dog-collars"');
});

/* ---------------------------- 6. Metadata ----------------------------- */

check("page title does not repeat the brand, which the layout appends", () =>
  locales.every((locale) => !/elvora/i.test(dogSizingPage.metaTitle[locale])));

check("meta descriptions are distinct per language", () => {
  const set = new Set(locales.map((locale) => dogSizingPage.metaDescription[locale]));
  return set.size === locales.length;
});

check("meta descriptions stay within a reasonable search snippet length", () =>
  locales.every((locale) => dogSizingPage.metaDescription[locale].length <= 320));

check("the table has column headings in every language", () =>
  locales.every((locale) => {
    const cols = dogSizingPage.columns[locale];
    return cols.width && cols.range && cols.inches && cols.suits;
  }));

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
