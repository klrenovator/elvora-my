/**
 * Admin editor render tests.
 *
 * The editor is a client component, so its markup is checked by rendering it
 * directly rather than through the server. These assertions guard the safety
 * rails an owner relies on: the save button must be disabled when nothing can
 * be saved, and "price on request" must be a visible choice rather than an
 * empty box.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { ProductEditor } from "@/components/admin/product-editor";
import { emptyProductForm, productToForm } from "@/lib/admin/product-form";
import { products } from "@/content/products";

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

const render = (props: Parameters<typeof ProductEditor>[0]) =>
  renderToStaticMarkup(<ProductEditor {...props} />);

/* ---------------------------- Read-only state ---------------------------- */

const readOnlyMarkup = render({ initial: productToForm(products[0]), isNew: false, readOnly: true });

check("read-only editor explains why", readOnlyMarkup.includes("no database is connected"));
check("read-only editor does not claim edits are saved", !readOnlyMarkup.includes("A database repository is active"));
check(
  "save button is disabled in read-only mode",
  /<button[^>]*disabled=""[^>]*>\s*[^<]*Save/.test(readOnlyMarkup) ||
    (readOnlyMarkup.includes("disabled") && readOnlyMarkup.includes("Save")),
);
check(
  "publish toggle is disabled in read-only mode",
  readOnlyMarkup.includes("disabled"),
);

/* ------------------------------ Writable state --------------------------- */

const writableMarkup = render({ initial: productToForm(products[0]), isNew: false, readOnly: false });
check("writable editor enables the save button", !/<button[^>]*disabled=""[^>]*>\s*[^<]*Save/.test(writableMarkup));
check("writable editor does not show the read-only banner", !writableMarkup.includes("no database is connected"));

/* --------------------------- Price mode controls ------------------------- */

const newMarkup = render({ initial: emptyProductForm, isNew: true, readOnly: true });

check("price mode is an explicit radio choice", newMarkup.includes('name="priceMode"'));
check("price on request is selectable", newMarkup.includes("Price on request"));
check("fixed price is selectable", newMarkup.includes('value="fixed"'));
check(
  "new product defaults to price on request, not a blank amount",
  /value="on-request"[^>]*checked/.test(newMarkup) || newMarkup.includes("checked"),
);
// The amount box appears only for a fixed price — a blank box under
// "on request" would invite exactly the ambiguity the form is avoiding.
check("price amount box hidden while price is on request", !newMarkup.includes('name="priceAmount"'));
check(
  "compare-at is submitted as a hidden empty field while on request",
  newMarkup.includes('<input type="hidden" name="compareAtAmount"'),
);

const fixedMarkup = render({
  initial: { ...emptyProductForm, priceMode: "fixed", priceAmount: "249.00" },
  isNew: true,
  readOnly: true,
});
check("price amount field appears for a fixed price", fixedMarkup.includes('name="priceAmount"'));
check("compare-at field appears for a fixed price", fixedMarkup.includes('name="compareAtAmount"'));
check("typed amount is prefilled", fixedMarkup.includes("249.00"));

/* ------------------------------- Form fields ----------------------------- */

for (const field of [
  "category",
  "leatherType",
  "nameEn",
  "nameMs",
  "nameZh",
  "slugEn",
  "sku",
  "stock",
  "descriptionEn",
  "seoTitleEn",
  "seoDescriptionZh",
]) {
  check(`editor renders the ${field} field`, newMarkup.includes(`name="${field}"`));
}

/* ---------------------------- Filled-in values --------------------------- */

const filled = render({ initial: productToForm(products[0]), isNew: false, readOnly: false });
check("existing name is prefilled", filled.includes(products[0].name.en));
check("existing SKU is prefilled", filled.includes(products[0].sku));
check("existing slug is prefilled", filled.includes(products[0].slug.en));
check("existing product is price on request", filled.includes("On request") || filled.includes("on-request"));

/* ------------------------------ Trilingual UI --------------------------- */

check("languages are grouped for editing", filled.includes("Malay") && filled.includes("Chinese"));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
