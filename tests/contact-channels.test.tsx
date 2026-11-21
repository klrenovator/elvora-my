/**
 * WhatsApp and email contact rendering.
 *
 * These two channels are the shop's only inquiry route, so the assertions are
 * about visibility and honesty: the buttons appear when the details are
 * configured, they carry a prefilled message so the owner knows which product is
 * meant, and when nothing is configured the component says so rather than
 * rendering a link that goes nowhere.
 *
 * The environment is re-read per case by clearing the module cache, because
 * `contact` is resolved at import time.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";

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

/**
 * Import the component with a specific environment.
 *
 * `contact` reads `process.env` when its module is first evaluated, so each case
 * needs a fresh module registry. `tsx` keeps CJS modules cached by path, hence
 * deleting the cache entry rather than re-importing.
 */
async function renderWith(
  env: { whatsapp?: string; email?: string },
  props: { locale?: "en" | "ms" | "zh"; productName?: string; variant?: "default" | "inline" } = {},
): Promise<{ markup: string; site: typeof import("@/lib/site") }> {
  if (env.whatsapp === undefined) delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  else process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = env.whatsapp;
  if (env.email === undefined) delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  else process.env.NEXT_PUBLIC_CONTACT_EMAIL = env.email;

  for (const key of Object.keys(require.cache)) {
    if (key.includes("/src/lib/site") || key.includes("/src/components/contact-channels")) {
      delete require.cache[key];
    }
  }

  const { ContactChannels } = require("@/components/contact-channels") as typeof import("@/components/contact-channels");
  const site = require("@/lib/site") as typeof import("@/lib/site");

  const markup = renderToStaticMarkup(
    <ContactChannels
      locale={props.locale ?? "en"}
      productName={props.productName}
      variant={props.variant ?? "default"}
    />,
  );
  return { markup, site };
}

async function main() {
  /* ------------------------------ Both set ------------------------------ */

  {
    const { markup } = await renderWith({
      whatsapp: "012-345 6789",
      email: "hello@elvora.my",
    });

    check("the block renders a heading", /Questions about this product/.test(markup));
    check("a WhatsApp button is present", /wa\.me\/60123456789/.test(markup));
    check("the WhatsApp button is labelled", /Chat on WhatsApp/.test(markup));
    check("an email button is present", /mailto:hello@elvora\.my/.test(markup));
    check("the email button is labelled", /Send an email/.test(markup));
    check("the email address is also shown as text", /hello@elvora\.my/.test(markup));
    check("the WhatsApp link opens in a new tab", /target="_blank"/.test(markup));
    check("the WhatsApp link is safe", /rel="noopener noreferrer"/.test(markup));
    check("both buttons are at least 44px tall", (markup.match(/min-h-11/g) ?? []).length >= 2);
    check("no 'being finalised' notice is shown", !/being finalised/.test(markup));
  }

  /* --------------------------- Product prefill -------------------------- */

  {
    const { markup } = await renderWith(
      { whatsapp: "0123456789", email: "hello@elvora.my" },
      { productName: "Cognac Bifold Wallet" },
    );

    check("the product name reaches the WhatsApp message", /Cognac%20Bifold%20Wallet/.test(markup));
    check("the message is prefilled with the inquiry phrase", /text=I%20would%20like/.test(markup));
    check("the product name reaches the email subject", /subject=I%20would%20like/.test(markup));
  }

  /* ------------------------------ Only email ---------------------------- */

  {
    const { markup } = await renderWith({ email: "hello@elvora.my" });
    check("only the email button appears", /mailto:/.test(markup) && !/wa\.me/.test(markup));
    check("the WhatsApp hint is not shown", !/Fastest for stock/.test(markup));
  }

  /* ----------------------------- Only WhatsApp -------------------------- */

  {
    const { markup } = await renderWith({ whatsapp: "0123456789" });
    check("only the WhatsApp button appears", /wa\.me/.test(markup) && !/mailto:/.test(markup));
    check("the email hint is not shown", !/detailed or bulk/.test(markup));
  }

  /* ------------------------------ Neither set --------------------------- */

  {
    const { markup, site } = await renderWith({});
    check("no WhatsApp link is rendered", !/wa\.me/.test(markup));
    check("no email link is rendered", !/mailto:/.test(markup));
    check("no button is rendered at all", !/<a /.test(markup));
    check("an honest notice replaces them", /being finalised/.test(markup));
    check("the notice does not invent a number", !/\d{9,}/.test(markup));
    check("the helper returns null without a number", site.shopWhatsAppLink() === null);
    check("the helper returns null without an address", site.shopMailtoLink() === null);
  }

  /* ------------------------------- Inline ------------------------------- */

  {
    const { markup } = await renderWith(
      { whatsapp: "0123456789", email: "hello@elvora.my" },
      { variant: "inline" },
    );
    check("inline renders the buttons", /wa\.me/.test(markup) && /mailto:/.test(markup));
    check("inline omits the block heading", !/Questions about this product/.test(markup));
  }

  {
    // With nothing configured, inline renders nothing rather than an empty box
    // sitting under a product's buy button.
    const { markup } = await renderWith({}, { variant: "inline" });
    check("inline renders nothing when unconfigured", markup === "");
  }

  /* ------------------------------ Languages ----------------------------- */

  {
    const ms = await renderWith({ whatsapp: "0123456789", email: "a@b.my" }, { locale: "ms" });
    check("the Malay heading is used", /Ada soalan tentang produk ini/.test(ms.markup));
    check("the Malay button label is used", /Sembang di WhatsApp/.test(ms.markup));

    const zh = await renderWith({ whatsapp: "0123456789", email: "a@b.my" }, { locale: "zh" });
    check("the Chinese heading is used", /对这件产品有疑问/.test(zh.markup));
    check("the Chinese button label is used", /在 WhatsApp 上询问/.test(zh.markup));
  }

  /* --------------------------- Where it appears ------------------------- */

  {
    const product = readFileSync("src/app/[locale]/[slug]/[product]/page.tsx", "utf8");
    check("contact channels are on product pages", /<ContactChannels/.test(product));
    check("the product page passes the product name", /productName=\{product\.name\[locale\]\}/.test(product));
    const contactPage = readFileSync("src/app/[locale]/[slug]/page.tsx", "utf8");

    // The category CTA goes straight to WhatsApp, and falls back to the contact
    // page when no number is configured rather than linking nowhere.
    check(
      "the category CTA falls back to the contact page when WhatsApp is unset",
      /shopWhatsAppLink\(\) \?\? pathFor\("contact", locale\)/.test(contactPage),
    );
    check(
      "the contact page shows the channels first",
      /pageKey === "contact"[\s\S]{0,300}<ContactChannels/.test(contactPage),
    );

    const header = readFileSync("src/components/site-header.tsx", "utf8");
    check("the header carries a WhatsApp button", /headerWhatsApp/.test(header));
    check("the header hides it when unconfigured", /headerWhatsApp \? \(/.test(header));
    check("the mobile drawer carries both channels", /headerMailto/.test(header));

    const footer = readFileSync("src/components/site-footer.tsx", "utf8");
    check("the footer still shows the channels", /contact\.whatsapp/.test(footer) && /contact\.email/.test(footer));
  }

  {
    // The contact page's "channels being finalised" notice must not sit next to
    // working buttons: it is gated on whether a channel actually exists.
    const content = readFileSync("src/lib/content-page.tsx", "utf8");
    check("the pending notice is gated", /page\.pending && !channelsLive/.test(content));
    check("the gate checks both channels", /isConfigured\(contact\.whatsapp\) \|\| isConfigured\(contact\.email\)/.test(content));
  }

  /* ------------------------ Checkout payment section -------------------- */

  {
    const checkout = readFileSync("src/components/checkout-form.tsx", "utf8");
    check("checkout asks how the customer wants to pay", /paymentMethodLabel/.test(checkout));
    check("COD's own description is shown", /method\.description\[locale\]/.test(checkout));
    check("the method is a real radio choice", /type="radio"/.test(checkout) && /name="paymentMethod"/.test(checkout));
    check("the button says pay on delivery", /orderEnquiry/.test(checkout));
    check(
      "the old 'payment is not connected' wording is gone from checkout",
      !/paymentPendingBody/.test(checkout),
    );

    const savings = readFileSync("src/lib/dictionary.ts", "utf8");
    check(
      "no locale still says payment is disconnected",
      !/Payment is not connected yet/.test(savings) &&
        !/Pembayaran belum disambungkan/.test(savings) &&
        !/付款功能尚未接通/.test(savings),
    );
    check("the COD note exists in English", /pay the courier in cash/.test(savings));
    check("the COD note exists in Malay", /membayar secara tunai kepada kurier/.test(savings));
    check("the COD note exists in Chinese", /以现金支付给快递员/.test(savings));
  }

  /* ------------------------------ Admin view ---------------------------- */

  {
    const page = readFileSync("src/app/admin/orders/page.tsx", "utf8");
    check("the admin list offers 'mark paid'", /Mark paid/.test(page));
    check("the admin list offers cancel", /Cancel/.test(page));
    check("settling is a form post, not a link", /<form action=\{markOrderPaid\}/.test(page));
    check(
      "the admin copy says the amount is the order total",
      /the amount recorded is the order total/.test(page),
    );
    check("no control appears for a settled order", /status === "paid" \|\| status === "cancelled"/.test(page));
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
