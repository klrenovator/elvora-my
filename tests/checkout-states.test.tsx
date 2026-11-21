/**
 * Checkout submit and refusal states.
 *
 * The form's submit button and server-error banner are client-rendered, so they
 * are verified by rendering the presentational layer directly — the same
 * approach used for the rest of the checkout UI, since a headless browser is
 * not available in this environment.
 *
 * What matters here is that a refusal is *visible and specific*, in the
 * customer's language, and that the button cannot be double-submitted while a
 * request is in flight.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { CheckoutFields } from "@/components/checkout-form";
import { emptyAddress, type AddressInput } from "@/lib/address";
import { products } from "@/content/products";
import type { ReconciledLine } from "@/lib/cart-store";

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

function render(props: {
  locale?: "en" | "ms" | "zh";
  address?: AddressInput;
  errors?: Record<string, string>;
  serverError?: string;
  pending?: boolean;
}) {
  return renderToStaticMarkup(
    <CheckoutFields
      locale={props.locale ?? "en"}
      address={props.address ?? emptyAddress}
      errors={(props.errors ?? {}) as never}
      onChange={() => {}}
      onSubmit={() => {}}
      lines={line}
      subtotalSen={49800}
      serverError={props.serverError}
      pending={props.pending}
    />,
  );
}

/* ------------------------------ Default state ----------------------------- */

const idle = render({});
check("form renders", idle.includes("<form"));
check("no error banner when there is no error", !idle.includes('role="alert"'));
check("submit button is enabled when idle", !/disabled=""/.test(idle));
check(
  "the button offers to place a cash-on-delivery order",
  idle.includes("Place order — pay on delivery"),
);
check("no double-submit spinner when idle", !idle.includes("Recording order"));

/* ------------------------------- Pending state --------------------------- */

const pending = render({ pending: true });
check("pending button is disabled", /disabled=""/.test(pending));
check("pending button says it is recording", pending.includes("Recording order"));
check("pending state does not claim success", !pending.toLowerCase().includes("order received"));

/* ------------------------------ Refusal states --------------------------- */

{
  const markup = render({ serverError: "The order total has changed since this page loaded." });
  check("a server error is rendered", markup.includes("The order total has changed"));
  check("the error is announced to assistive tech", markup.includes('role="alert"'));
  check("the form is still shown so the customer can retry", markup.includes("<form"));
}

{
  const markup = render({ serverError: "Some items in your cart need attention." });
  check("a cart-problem refusal is shown verbatim", markup.includes("need attention"));
}

/* -------------------------------- Languages ------------------------------ */

const msError = render({
  locale: "ms",
  serverError: "Jumlah pesanan telah berubah sejak halaman ini dimuatkan.",
});
check("Malay error text is rendered", msError.includes("Jumlah pesanan telah berubah"));
check("Malay submit label is Malay", msError.includes("Buat pesanan — bayar semasa penghantaran"));

const zhError = render({
  locale: "zh",
  serverError: "订单总额已在此页面载入后改变。",
});
check("Chinese error text is rendered", zhError.includes("订单总额已在此页面载入后改变"));
check("Chinese submit label is Chinese", zhError.includes("提交订单——货到付款"));

const msPending = render({ locale: "ms", pending: true });
check("Malay pending label", msPending.includes("Merekod pesanan"));

const zhPending = render({ locale: "zh", pending: true });
check("Chinese pending label", zhPending.includes("正在记录订单"));

/* ------------------------------ Field errors ----------------------------- */

{
  const markup = render({ errors: { email: "Enter a valid email address." } });
  check("a field error is rendered beside its field", markup.includes("Enter a valid email address."));
}

{
  // A server field error must not wipe the rest of the form.
  const markup = render({
    errors: { postcode: "Enter a 5-digit Malaysian postcode." },
    serverError: "Please correct the highlighted delivery details.",
  });
  check("field and server errors can coexist", markup.includes("5-digit Malaysian postcode"));
  check("the server summary is also present", markup.includes("correct the highlighted"));
}

/* ------------------------- Honesty about payment ------------------------- */

// The old honesty assertion was that payment was not connected. COD makes that
// untrue: the shop is paid, on delivery. The assertion now is that checkout
// states the arrangement plainly and never claims money was taken online.
check(
  "checkout states that payment is due on delivery",
  idle.includes("You pay the courier in cash when your order arrives"),
);
check(
  "checkout does not claim a payment was taken",
  !/payment received|paid successfully|charg(ed|ing) your card/i.test(idle),
);


/* ------------------------- Form/action contract --------------------------- */

/**
 * The form and the server action must agree on field names.
 *
 * This is a real bug class: a renamed input silently arrives at the action as
 * an empty string, and the customer sees "a name is required" while staring at
 * a filled-in name box. Pinning the contract here means a rename fails a test
 * instead of failing a customer.
 */
const formMarkup = render({});

const expectedFields = [
  "fullName",
  "phone",
  "email",
  "addressLine1",
  "addressLine2",
  "postcode",
  "city",
  "stateCode",
  "notes",
];

/**
 * The submission is assembled explicitly in `handleSubmit` by iterating
 * `Object.entries(address)`, so the real contract is that every field the
 * action reads is a key of the address object — not that the DOM happens to
 * carry a `name` attribute. Selects and textareas are controlled, so they have
 * no `name` at all and would fail a DOM-based assertion while working fine.
 */
for (const field of expectedFields) {
  check(
    `the address object carries a field the action reads: ${field}`,
    Object.prototype.hasOwnProperty.call(emptyAddress, field),
  );
}

// Text inputs also expose a name attribute, which is what a no-JS submit would
// use; the state select and notes textarea rely on the explicit FormData path.
for (const field of ["fullName", "phone", "email", "addressLine1", "postcode", "city"]) {
  check(
    `the form renders a named input for ${field}`,
    formMarkup.includes(`name="${field}"`),
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
