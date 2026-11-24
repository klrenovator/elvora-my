/**
 * Returns policy tests.
 *
 * The returns policy is the page a customer reads when they are already
 * unhappy, and the page a regulator would read if a complaint escalated. Two
 * failures matter here, and neither is visual:
 *
 * 1. **It must not advertise itself as a change-of-mind policy.** The owner was
 *    explicit that the 30 days covers incorrect, damaged, defective or
 *    misdescribed goods only. A generous-sounding sentence added later could
 *    quietly turn it into something else.
 * 2. **It must not shrink statutory rights.** Any clause that reads as a
 *    limitation on Malaysian consumer law would be both unlawful and a
 *    reputational risk, so the tests require an explicit preservation clause.
 *
 * The suite also keeps the three languages in step: the same seven required
 * topics must exist in each, or a customer reading the Malay or Chinese page
 * gets a different policy from the English one.
 */
import { readFileSync } from "node:fs";
import { returnsPage } from "@/content/pages-policy";
import { warrantyPage } from "@/content/pages-warranty";
import { locales } from "@/i18n/config";
import { pathFor, matchPath, alternatePaths } from "@/lib/routes";

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

console.log("\nreturns policy");

/** Flattens a locale's blocks into one searchable string. */
function bodyText(locale: (typeof locales)[number]): string {
  return returnsPage.blocks[locale]
    .map((block) => {
      if (block.type === "list") return block.items.join(" \n ");
      if (block.type === "table") return "";
      return block.text;
    })
    .join(" \n ");
}

/** Headings only, so a required topic is checked as a section not a stray word. */
function headings(locale: (typeof locales)[number]): string {
  return returnsPage.blocks[locale]
    .filter((block) => block.type === "h")
    .map((block) => (block.type === "h" ? block.text : ""))
    .join(" | ");
}

const en = bodyText("en");
const enLower = en.toLowerCase();

/* ------------------------ 1. The window is 30 days ------------------------ */

check("the policy states 30 days", enLower.includes("30 calendar days"));

check("the window runs from delivery, not from ordering", () => {
  return enLower.includes("from the date you receive") && enLower.includes("not on the date the order was placed");
});

check("every language states 30 days", () =>
  locales.every((locale) => {
    const text = bodyText(locale);
    if (locale === "en") return /30 (calendar )?days|30 hari|30 个日历日/i.test(text);
    return /30/.test(text);
  }));

/* ------------------- 2. The four qualifying reasons exist ------------------- */

const reasons = [
  { key: "wrong product sent", pattern: /different product from the one you ordered/i },
  { key: "damaged in transit", pattern: /damaged in transit/i },
  { key: "defective or faulty", pattern: /defective or faulty/i },
  { key: "not as described", pattern: /not as described/i },
];

for (const reason of reasons) {
  check(`English lists the reason: ${reason.key}`, reason.pattern.test(en));
}

check("Malay lists all four reasons", () => {
  const text = bodyText("ms");
  return /berbeza daripada yang anda pesan/i.test(text) &&
    /rosak semasa penghantaran/i.test(text) &&
    /cacat atau tidak berfungsi/i.test(text) &&
    /tidak seperti yang diterangkan/i.test(text);
});

check("Chinese lists all four reasons", () => {
  const text = bodyText("zh");
  return /与订购的不同/i.test(text) &&
    /运输途中损坏/i.test(text) &&
    /有瑕疵或无法正常使用/i.test(text) &&
    /与描述不符/i.test(text);
});

/* ------------------ 3. The request requirements are stated ------------------ */

check("the customer must give a reason and say what is wrong", () => {
  return enLower.includes("explanation of the reason") && enLower.includes("what is wrong");
});

check("the customer must supply photos or video", () => {
  return /photographs or a short video/i.test(en);
});

check("the request must include the order number", () => {
  return /order number/i.test(en);
});

check("the request must include product details", () => {
  return /relevant product details/i.test(en);
});

/* ------------------- 4. The process is described in order ------------------- */

const topics = [
  { name: "approval", pattern: /how a return is approved/i },
  { name: "inspection", pattern: /inspection on arrival/i },
  { name: "refund", pattern: /refunds/i },
  { name: "replacement", pattern: /replacements and exchanges/i },
];

for (const topic of topics) {
  check(`a section covers ${topic.name}`, topic.pattern.test(headings("en")));
}

check("approval happens before the customer sends anything", () => {
  return /do not send anything before you have that confirmation/i.test(en);
});

check("the policy explains that an unapproved parcel may be refused", () => {
  return /may be refused/i.test(en);
});

check("the policy does not promise a refund before inspection", () => {
  // A refund must be conditional on inspection, never automatic on request.
  return /once the item has been inspected and the return approved/i.test(en);
});

/* --------------------- 5. Statutory rights are preserved --------------------- */

check("there is an explicit statutory rights section", () =>
  /your statutory rights/i.test(headings("en")));

check("the preservation clause names the Consumer Protection Act 1999", () =>
  en.includes("Consumer Protection Act 1999"));

check("the preservation clause names the e-commerce regulations", () =>
  en.includes("Electronic Trade Transactions"));

check("the clause says nothing here removes, reduces or limits a right", () => {
  return /nothing in this policy removes, reduces or limits/i.test(en);
});

check("the policy says the 30 days does not replace statutory remedies", () => {
  return /does not replace or shorten/i.test(en);
});

check("Malay preserves statutory rights and names the Act", () => {
  const text = bodyText("ms");
  return /Akta Perlindungan Pengguna 1999/.test(text) &&
    /tidak menggantikan atau memendekkannya/i.test(text);
});

check("Chinese preserves statutory rights and names the Act", () => {
  const text = bodyText("zh");
  return /1999 年消费者保护法/.test(text) &&
    /不会取代或缩短/.test(text);
});

/** Clauses that would cut statutory rights — none may appear in any language. */
const rightsLimitingPhrases = [
  "no refunds",
  "no returns",
  "all sales final",
  "sold as seen",
  "at our sole discretion and final",
  "waive your rights",
  "tiada bayaran balik",
  "segala jualan adalah muktamad",
  "tiada pemulangan",
  "概不退款",
  "一经售出",
  "恕不退换",
];

for (const phrase of rightsLimitingPhrases) {
  check(`no rights-limiting clause "${phrase}"`, () =>
    locales.every((locale) => !bodyText(locale).toLowerCase().includes(phrase)));
}

/* --------------- 6. It is NOT advertised as change of mind --------------- */

check("the page says outright that this is not a change-of-mind policy", () => {
  return /not a change-of-mind policy/i.test(en);
});

check("the change-of-mind exclusion appears in a callout, not a footnote", () => {
  const callouts = returnsPage.blocks.en.filter((block) => block.type === "callout");
  return callouts.some((block) => block.type === "callout" && /change-of-mind/i.test(block.text));
});

check("Malay states it is not a change-of-mind policy", () =>
  /bukan polisi pemulangan atas sebab bertukar fikiran/i.test(bodyText("ms")));

check("Chinese states it is not a change-of-mind policy", () =>
  /不是「改变主意」的退货政策/.test(bodyText("zh")));

check("incorrectly ordered belt length is excluded in the FAQ", () => {
  const faq = returnsPage.faqs?.en.find((item) => /wrong length/i.test(item.q));
  return Boolean(faq && /not under this policy|not a fault/i.test(faq.a));
});

/** Generous-sounding language that would contradict the defect-only scope. */
const changeOfMindPhrases = [
  "no questions asked",
  "any reason",
  "whatever the reason",
  "unconditional",
  "change of mind returns accepted",
  "free returns on everything",
  "tanpa sebarang syarat",
  "apa jua sebab",
  "无理由退货",
  "无条件退货",
  "任何理由",
];

for (const phrase of changeOfMindPhrases) {
  check(`no change-of-mind promise "${phrase}"`, () =>
    locales.every((locale) => !bodyText(locale).toLowerCase().includes(phrase)));
}

/* ---------------- 7. No invented detail, no Phase D leakage ---------------- */

check("the old 'window is shown on your order confirmation' hedge is gone", () => {
  // It is now a fixed 30 days; a hedge would contradict the stated figure.
  return locales.every((locale) => !/shown on your order confirmation/i.test(bodyText(locale)));
});

check("no courier is named, because none is appointed", () => {
  const banned = ["j&t", "pos laju", "ninja van", "dhl", "skynet", "city-link", "gdex", "flash express"];
  return locales.every((locale) => {
    const text = bodyText(locale).toLowerCase();
    return banned.every((courier) => !text.includes(courier));
  });
});

check("no shipping rate is stated", () => {
  return locales.every((locale) => !/\bRM\s?\d/.test(bodyText(locale)));
});

check("no contact detail is invented", () => {
  return locales.every((locale) => !/@|whatsapp|wa\.me|\+60/i.test(bodyText(locale)));
});

check("every language carries a FAQ set of equal length", () => {
  const counts = locales.map((locale) => returnsPage.faqs?.[locale].length ?? 0);
  return counts.every((count) => count === counts[0]) && counts[0] >= 5;
});

/* ------------------------------ 8. Wiring ------------------------------ */

for (const locale of locales) {
  const path = pathFor("returns", locale);
  check(`${locale}: the page path still round-trips`, () => matchPath(path)?.key === "returns");
}

check("hreflang alternates still resolve", () => {
  const alternates = alternatePaths("returns");
  return locales.every((locale) => alternates[locale] === pathFor("returns", locale));
});

check("the page title does not repeat the brand", () =>
  locales.every((locale) => !/elvora/i.test(returnsPage.metaTitle[locale])));

check("the warranty page defers to this page rather than restating a window", () => {
  // Two pages quoting different windows is the classic policy drift. Only the
  // rendered content counts — the source file's research comments legitimately
  // mention competitors' 30-day windows.
  const warrantyText = locales
    .map((locale) =>
      warrantyPage.blocks[locale]
        .map((block) => (block.type === "list" ? block.items.join(" ") : block.type === "table" ? "" : block.text))
        .concat((warrantyPage.faqs?.[locale] ?? []).map((item) => `${item.q} ${item.a}`))
        .join(" "),
    )
    .join(" ");
  return !/\b30[- ]day return\b/i.test(warrantyText);
});

check("no other content page still offers an exchange for a wrong size", () => {
  const categories = readFileSync("src/content/categories.ts", "utf8");
  return !/advise on an exchange under our returns policy/i.test(categories);
});

console.log(`\n  ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
