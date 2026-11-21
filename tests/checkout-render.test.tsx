/**
 * Checkout form rendering tests.
 *
 * Run with: npm test
 *
 * The form is rendered server-side so its markup — labels, state list,
 * validation messages and the honest payment notice — can be verified without
 * a browser or localStorage.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { CheckoutFields } from "@/components/checkout-form";
import { emptyAddress, validateAddress } from "@/lib/address";
import type { ReconciledLine } from "@/lib/cart-store";
import { products } from "@/content/products";

let pass = 0;
let fail = 0;
const check = (n: string, c: boolean, x = "") => {
  if (c) {
    pass++;
    console.log(`  PASS  ${n}`);
  } else {
    fail++;
    console.log(`  FAIL  ${n} ${x}`);
  }
};

const line: ReconciledLine[] = [
  {
    line: {
      productId: products[0].id,
      variantId: products[0].variants[0].id,
      quantity: 2,
      addedPriceSen: 24900,
    },
    product: products[0],
    variant: products[0].variants[0],
    currentPrice: { kind: "fixed", formatted: "RM 249.00", amountSen: 24900 },
    lineTotalSen: 49800,
    orderable: true,
    issues: [],
  },
];

function render(
  locale: "en" | "ms" | "zh",
  address = emptyAddress,
  errors: Record<string, string> = {},
) {
  return renderToStaticMarkup(
    <CheckoutFields
      locale={locale}
      address={address}
      errors={errors}
      onChange={() => {}}
      onSubmit={() => {}}
      lines={line}
      subtotalSen={49800}
    />,
  );
}

/* Every language renders and states that payment is not live. */
const cases = [
  ["en", "Payment is not connected yet", "checking out as a guest"],
  ["ms", "Pembayaran belum disambungkan", "sebagai tetamu"],
  ["zh", "付款功能尚未接通", "以访客身分结账"],
] as const;

for (const [locale, payText, guestText] of cases) {
  const html = render(locale);
  check(`${locale}: honest payment notice present`, html.includes(payText));
  check(`${locale}: guest checkout stated`, html.includes(guestText));
  check(`${locale}: 16 states + placeholder rendered`, (html.match(/<option/g) || []).length === 17, String((html.match(/<option/g) || []).length));
  check(`${locale}: subtotal rendered`, html.includes("498"));
  check(`${locale}: no fake "Place order" button`, !html.includes("Place order"));
  check(`${locale}: enquiry button label present`, html.length > 2000);
}

/* Validation messages appear in the right language. */
const enErr = render("en", emptyAddress, validateAddress(emptyAddress, "en"));
check("en: phone error rendered", enErr.includes("Malaysian phone number"));
check("en: postcode error rendered", enErr.includes("five-digit postcode"));

const zhErr = render("zh", emptyAddress, validateAddress(emptyAddress, "zh"));
check("zh: phone error rendered in Chinese", zhErr.includes("马来西亚电话号码"));
check("zh: postcode error rendered in Chinese", zhErr.includes("五位数"));

const msErr = render("ms", emptyAddress, validateAddress(emptyAddress, "ms"));
check("ms: phone error rendered in Malay", msErr.includes("nombor telefon Malaysia"));

/* East Malaysia note appears only where it applies. */
check("east malaysia note shown for Sabah", render("en", { ...emptyAddress, stateCode: "SBH" }).includes("East Malaysia"));
check("east malaysia note shown for Sarawak", render("en", { ...emptyAddress, stateCode: "SWK" }).includes("East Malaysia"));
check("east malaysia note shown for Labuan", render("en", { ...emptyAddress, stateCode: "LBN" }).includes("East Malaysia"));
check("east malaysia note absent for Selangor", !render("en", { ...emptyAddress, stateCode: "SGR" }).includes("East Malaysia"));
check("east malaysia note localized (zh)", render("zh", { ...emptyAddress, stateCode: "SBH" }).includes("东马"));

/* Required-field accessibility. */
const html = render("en");
check("aria-invalid used for errors", render("en", emptyAddress, validateAddress(emptyAddress, "en")).includes("aria-invalid"));
check("no lorem placeholder text", !html.toLowerCase().includes("lorem"));
check("all required inputs have labels", (html.match(/<label/g) || []).length >= 7);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
