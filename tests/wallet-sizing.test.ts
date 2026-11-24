/**
 * Wallet sizing guide tests.
 *
 * This page exists because the shop will not publish a measurement nobody took.
 * That makes it unusually easy to break in a way that *looks* helpful: pasting a
 * plausible-looking wallet dimension into the copy would improve the page and
 * poison the catalogue. So the tests guard the boundary rather than the layout.
 *
 * Two things are asserted:
 *
 * 1. **The verified data is right.** Banknote dimensions are checked against the
 *    figures Bank Negara Malaysia publishes, and the derived clearance maths is
 *    checked against them rather than against a hard-coded total.
 * 2. **No unverified dimension is presented as ours.** The market benchmark must
 *    always be labelled as a benchmark, and the page must never claim to state
 *    our own wallet's size.
 */
import { readFileSync } from "node:fs";
import {
  malaysianBanknotes,
  tallestNoteMm,
  NOTE_CLEARANCE_MM,
  minimumPocketHeightMm,
  marketBenchmarkMm,
  walletSizingPage,
  banknoteColumns,
  substrateLabel,
} from "@/content/pages-wallet-sizing";
import { locales } from "@/i18n/config";
import { pathFor, matchPath, alternatePaths } from "@/lib/routes";
import { contentPages, assertUniqueSlugs } from "@/lib/page-resolver";

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

console.log("\nwallet sizing guide");

function bodyText(locale: (typeof locales)[number]): string {
  return walletSizingPage.blocks[locale]
    .map((block) => {
      if (block.type === "list") return block.items.join(" \n ");
      if (block.type === "table") return "";
      return block.text;
    })
    .join(" \n ");
}

/* --------------- 1. Banknote data matches Bank Negara Malaysia --------------- */

/** Verified from bnm.gov.my, "Distinctively Malaysia", checked 2026-11-21. */
const verified: Record<string, [number, number, string]> = {
  RM100: [150, 69, "paper"],
  RM50: [145, 69, "paper"],
  RM20: [145, 65, "paper"],
  RM10: [140, 65, "paper"],
  RM5: [135, 65, "polymer"],
  RM1: [120, 65, "polymer"],
};

check("all six denominations are present", () => malaysianBanknotes.length === 6);

for (const [denomination, [lengthMm, heightMm, substrate]] of Object.entries(verified)) {
  check(`${denomination} is ${lengthMm} × ${heightMm} mm, ${substrate}`, () => {
    const row = malaysianBanknotes.find((note) => note.denomination === denomination);
    return Boolean(
      row && row.lengthMm === lengthMm && row.heightMm === heightMm && row.substrate === substrate,
    );
  });
}

check("no dimension was invented for a denomination not in the source", () =>
  malaysianBanknotes.every((note) => Object.keys(verified).includes(note.denomination)));

check("the tallest note is derived, not hard-coded", () => {
  const actualMax = Math.max(...malaysianBanknotes.map((note) => note.heightMm));
  return tallestNoteMm === actualMax && tallestNoteMm === 69;
});

check("the minimum pocket height is note height plus clearance", () => {
  return minimumPocketHeightMm === tallestNoteMm + NOTE_CLEARANCE_MM;
});

check("the clearance is a sane allowance, not an arbitrary round number", () =>
  NOTE_CLEARANCE_MM >= 1 && NOTE_CLEARANCE_MM <= 8);

check("every note is wider than it is tall, as a real note is", () =>
  malaysianBanknotes.every((note) => note.lengthMm > note.heightMm));

/* ----------------- 2. The benchmark is labelled as a benchmark ----------------- */

check("the benchmark is a plausible slim-bifold size", () => {
  const { width, height, thickness } = marketBenchmarkMm;
  return width >= 80 && width <= 95 && height >= 105 && height <= 125 && thickness >= 8 && thickness <= 20;
});

check("the benchmark converts exactly from 3.4 × 4.6 × 0.5 inches", () => {
  // 25.4 mm per inch, rounded to the nearest millimetre.
  return (
    marketBenchmarkMm.width === Math.round(3.4 * 25.4) &&
    marketBenchmarkMm.height === Math.round(4.6 * 25.4) &&
    marketBenchmarkMm.thickness === Math.round(0.5 * 25.4)
  );
});

check("every language says the benchmark is not our measurement", () => {
  const markers: Record<string, RegExp> = {
    en: /not the measurement of our wallet/i,
    ms: /bukan ukuran dompet kami/i,
    zh: /并非我们钱包的实测尺寸/,
  };
  return locales.every((locale) => markers[locale].test(bodyText(locale)));
});

check("every language says a benchmark is what it is", () => {
  const markers: Record<string, RegExp> = {
    en: /market benchmark/i,
    ms: /penanda aras pasaran/i,
    zh: /市场参考/,
  };
  return locales.every((locale) => markers[locale].test(bodyText(locale)));
});

/* ---------- 3. The page never claims to state our wallet's dimensions ---------- */

check("the page says our own figures will be published once measured", () => {
  return /once they have been measured|setelah ia diukur|测量完成后/.test(
    locales.map((locale) => bodyText(locale)).join(" "),
  );
});

check("the page refuses to publish a number it has not taken", () => {
  return /do not publish a number we have not taken|tidak menerbitkan angka yang tidak kami ukur|未经我们亲自测量的数字/.test(
    locales.map((locale) => bodyText(locale)).join(" "),
  );
});

check("no language presents a bare wallet dimension as fact", () => {
  // A dimension stated as ours would appear as "our wallet is N mm". None may.
  const patterns = [
    /our wallet (is|measures) \d/i,
    /dompet kami (ialah|berukuran) \d/i,
    /我们的钱包(是|尺寸为) *\d/,
  ];
  return locales.every((locale) => patterns.every((pattern) => !pattern.test(bodyText(locale))));
});

check("no speculative hedge reaches the page", () => {
  // "approximately", "probably", "roughly our" — hedging a dimension is how an
  // invented number gets published with a disclaimer attached.
  const banned = [
    /our wallet is approximately/i,
    /dompet kami kira-kira/i,
    /我们的钱包约为/,
  ];
  return locales.every((locale) => banned.every((pattern) => !pattern.test(bodyText(locale))));
});

/* --------------------- 4. Card capacity is honest --------------------- */

check("the page explains that the seam fails before the leather", () => {
  return /seams fail long before the leather|lama sebelum kulitnya|缝线会比皮革更早失效/i.test(
    locales.map((locale) => bodyText(locale)).join(" "),
  );
});

check("the page says over-packing is wear, not a warranty matter", () => {
  return /not something the warranty covers|tidak dilindungi jaminan|不在质保范围内/.test(
    locales.map((locale) => bodyText(locale)).join(" "),
  );
});

/* --------------------------- 5. No strength claims --------------------------- */

for (const claim of ["tensile", "pull capacity", "load rating", "unbreakable", "waterproof"]) {
  check(`no "${claim}" claim`, () =>
    locales.every((locale) => !bodyText(locale).toLowerCase().includes(claim)));
}

/* ------------------------------ 6. Wiring ------------------------------ */

check("the page is registered", () => contentPages["wallet-sizing"] === walletSizingPage);

check("slugs remain unique across languages", () => {
  assertUniqueSlugs();
  return true;
});

for (const locale of locales) {
  const path = pathFor("walletSizing", locale);
  check(`${locale}: path is localised`, path === `/${locale}/${walletSizingPage.slug[locale]}`);
  check(`${locale}: path round-trips`, () => matchPath(path)?.key === "walletSizing");
}

check("hreflang alternates exist", () => {
  const alternates = alternatePaths("walletSizing");
  return locales.every((locale) => alternates[locale].startsWith(`/${locale}/`));
});

check("the sitemap registers the page", () =>
  readFileSync("src/app/sitemap.ts", "utf8").includes('"wallet-sizing"'));

check("the footer links to it", () =>
  readFileSync("src/components/site-footer.tsx", "utf8").includes('"walletSizing"'));

check("the footer label is translated three times", () => {
  const labels = readFileSync("src/lib/dictionary.ts", "utf8").match(/walletSizing: "[^"]+"/g) ?? [];
  return labels.length === 3;
});

check("wallet categories can reach the guide", () =>
  readFileSync("src/app/[locale]/[slug]/page.tsx", "utf8").includes('"wallet-sizing": ["mens-wallets"'));

/* ---------------------------- 7. Metadata ---------------------------- */

check("the page title does not repeat the brand", () =>
  locales.every((locale) => !/elvora/i.test(walletSizingPage.metaTitle[locale])));

check("meta descriptions are distinct per language", () => {
  const set = new Set(locales.map((locale) => walletSizingPage.metaDescription[locale]));
  return set.size === locales.length;
});

check("the banknote table has column labels in every language", () =>
  locales.every((locale) => {
    const cols = banknoteColumns[locale];
    return cols.denomination && cols.size && cols.substrate;
  }));

check("both substrates are translated in every language", () =>
  locales.every((locale) => substrateLabel[locale].paper && substrateLabel[locale].polymer));

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
