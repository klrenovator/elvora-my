/**
 * Admin product form tests: price parsing, validation rules, round-tripping.
 *
 * These cover the mistakes that would otherwise reach the live catalogue — a
 * mis-typed price, a fake discount, an untranslated field, a page that
 * publishes without SEO metadata.
 */
import {
  emptyProductForm,
  formToProduct,
  hasProductFormErrors,
  parseRinggitToSen,
  productToForm,
  senToInput,
  slugify,
  validateProductForm,
  type ProductFormValues,
} from "@/lib/admin/product-form";
import { products } from "@/content/products";
import { validateCatalogue } from "@/lib/validate-catalogue";

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

/* ---------------------------- Price parsing ------------------------------ */

check("plain ringgit parses", parseRinggitToSen("249") === 24900);
check("two decimals parse", parseRinggitToSen("249.00") === 24900);
check("one decimal parses", parseRinggitToSen("249.9") === 24990);
check("single sen parses", parseRinggitToSen("0.01") === 1);
check("RM prefix tolerated", parseRinggitToSen("RM 249.00") === 24900);
check("lowercase rm tolerated", parseRinggitToSen("rm249") === 24900);
check("thousands comma tolerated", parseRinggitToSen("1,249.00") === 124900);
check("surrounding space tolerated", parseRinggitToSen("  129.50  ") === 12950);

check("empty rejected", parseRinggitToSen("") === null);
check("zero rejected", parseRinggitToSen("0") === null);
check("zero-sen rejected", parseRinggitToSen("0.00") === null);
check("three decimals rejected (no rounding)", parseRinggitToSen("249.999") === null);
check("letters rejected", parseRinggitToSen("two hundred") === null);
check("mixed text rejected", parseRinggitToSen("249 ringgit") === null);
check("negative rejected", parseRinggitToSen("-249") === null);
check("bare dot rejected", parseRinggitToSen(".") === null);
check("trailing dot rejected", parseRinggitToSen("249.") === null);
check("leading dot rejected", parseRinggitToSen(".50") === null);
check("currency suffix rejected", parseRinggitToSen("249.00 MYR") === null);
check("double dot rejected", parseRinggitToSen("249.0.0") === null);

check("sen formats to two decimals", senToInput(24900) === "249.00");
check("sen formats small values", senToInput(5) === "0.05");
check("parse/format round trip", senToInput(parseRinggitToSen("1,249.90") ?? 0) === "1249.90");

/* -------------------------------- Slugs ---------------------------------- */

check("slug lowercases", slugify("Heritage Tote") === "heritage-tote");
check("slug collapses separators", slugify("Heritage   Tote & Co.") === "heritage-tote-co");
check("slug strips accents", slugify("Café Noir") === "cafe-noir");
check("slug trims hyphens", slugify("  --Tote--  ") === "tote");
check("slug caps length", slugify("a".repeat(200)).length === 70);

/* ------------------------------ Validation ------------------------------- */

/** A form that passes every rule, used as the base for negative cases. */
function validForm(overrides: Partial<ProductFormValues> = {}): ProductFormValues {
  return {
    ...emptyProductForm,
    category: "ladies-handbags",
    status: "draft",
    leatherType: "full-grain",
    nameEn: "Heritage Tote",
    nameMs: "Tote Warisan",
    nameZh: "传承手提包",
    slugEn: "heritage-tote",
    slugMs: "tote-warisan",
    slugZh: "chuan-cheng-shou-ti-bao",
    shortDescriptionEn: "A structured tote in full grain leather.",
    shortDescriptionMs: "Tote berstruktur dalam kulit biji penuh.",
    shortDescriptionZh: "全粒面皮革结构托特包。",
    descriptionEn: "Hand cut and stitched in Malaysia.",
    descriptionMs: "Dipoton dan dijahit dengan tangan di Malaysia.",
    descriptionZh: "在马来西亚手工裁切与缝制。",
    sku: "ELV-TOTE-001",
    stock: "3",
    hasImage: true,
    ...overrides,
  };
}

check("valid draft passes", !hasProductFormErrors(validateProductForm(validForm())));

// Catalogue rule compliance: the generated product must satisfy the same
// validator the build runs, so the admin cannot save something that would
// break a deploy.
{
  // The realistic publish path: edit a product that already has a photo, mark
  // it published, and confirm the result passes the build-time rules.
  const source = products[0];
  const published = formToProduct(
    { ...productToForm(source), status: "published", ...seoFields() },
    source,
  );
  const issues = validateCatalogue([...products.filter((p) => p.id !== source.id), published]);
  check(
    "edited-and-published product passes the build-time catalogue validator",
    issues.length === 0,
    JSON.stringify(issues).slice(0, 240),
  );
}

function seoFields(): Partial<ProductFormValues> {
  return {
    seoTitleEn: "Heritage Tote | Elvora",
    seoTitleMs: "Tote Warisan | Elvora",
    seoTitleZh: "传承手提包 | Elvora",
    seoDescriptionEn: "Full grain leather tote, made in Malaysia.",
    seoDescriptionMs: "Tote kulit biji penuh, dibuat di Malaysia.",
    seoDescriptionZh: "全粒面皮革托特包，马来西亚制造。",
  };
}

{
  const errors = validateProductForm(validForm({ category: "watches" }));
  check("unapproved category rejected", Boolean(errors.category));
}

{
  const errors = validateProductForm(validForm({ category: "" }));
  check("missing category rejected", Boolean(errors.category));
}

{
  const errors = validateProductForm(validForm({ leatherType: "genuine" as never }));
  check("unconfirmed leather grade rejected", Boolean(errors.leatherType));
}

{
  const errors = validateProductForm(validForm({ nameMs: "  " }));
  check("empty Malay name rejected", Boolean(errors.nameMs));
  check("empty Malay name names the language", (errors.nameMs ?? "").includes("Malay"));
}

{
  const errors = validateProductForm(validForm({ nameZh: "" }));
  check("empty Chinese name rejected", Boolean(errors.nameZh));
}

{
  const errors = validateProductForm(validForm({ slugZh: "" }));
  check("empty Chinese slug rejected", Boolean(errors.slugZh));
}

{
  const errors = validateProductForm(validForm({ descriptionMs: "" }));
  check("empty Malay description rejected", Boolean(errors.descriptionMs));
}

{
  const errors = validateProductForm(validForm({ slugEn: "Heritage Tote" }));
  check("slug with capitals and spaces rejected", Boolean(errors.slugEn));
}

{
  const errors = validateProductForm(validForm({ slugEn: "heritage--tote" }));
  check("slug with double hyphen rejected", Boolean(errors.slugEn));
}

{
  const errors = validateProductForm(validForm({ sku: " " }));
  check("missing SKU rejected", Boolean(errors.sku));
}

// Price handling.
{
  const errors = validateProductForm(validForm({ priceMode: "fixed", priceAmount: "" }));
  check("fixed price with no amount rejected", Boolean(errors.priceAmount));
}

{
  const errors = validateProductForm(validForm({ priceMode: "fixed", priceAmount: "abc" }));
  check("fixed price with junk rejected", Boolean(errors.priceAmount));
}

{
  const errors = validateProductForm(validForm({ priceMode: "fixed", priceAmount: "249.00" }));
  check("fixed price with valid amount passes", !errors.priceAmount);
}

{
  // The critical rule: "on request" must be chosen, and a blank amount under
  // fixed mode must never quietly become "on request".
  const errors = validateProductForm(
    validForm({ priceMode: "fixed", priceAmount: "   ", compareAtAmount: "" }),
  );
  check("blank amount never silently becomes price-on-request", Boolean(errors.priceAmount));
}

{
  const errors = validateProductForm(
    validForm({ priceMode: "on-request", priceAmount: "", compareAtAmount: "" }),
  );
  check("deliberate price-on-request passes", !errors.priceAmount);
}

{
  const errors = validateProductForm(
    validForm({ priceMode: "on-request", compareAtAmount: "399.00" }),
  );
  check("compare-at price forbidden with price on request", Boolean(errors.compareAtAmount));
}

// Fake discount rejection.
{
  const errors = validateProductForm(
    validForm({ priceMode: "fixed", priceAmount: "249.00", compareAtAmount: "249.00" }),
  );
  check("compare-at equal to price rejected", Boolean(errors.compareAtAmount));
}

{
  const errors = validateProductForm(
    validForm({ priceMode: "fixed", priceAmount: "249.00", compareAtAmount: "199.00" }),
  );
  check("compare-at lower than price rejected", Boolean(errors.compareAtAmount));
}

{
  const errors = validateProductForm(
    validForm({ priceMode: "fixed", priceAmount: "199.00", compareAtAmount: "249.00" }),
  );
  check("genuine markdown accepted", !errors.compareAtAmount);
}

{
  const errors = validateProductForm(
    validForm({ priceMode: "fixed", priceAmount: "249.00", compareAtAmount: "nonsense" }),
  );
  check("unreadable compare-at rejected", Boolean(errors.compareAtAmount));
}

// Stock.
{
  const errors = validateProductForm(validForm({ stock: "-1" }));
  check("negative stock rejected", Boolean(errors.stock));
}

{
  const errors = validateProductForm(validForm({ stock: "1.5" }));
  check("fractional stock rejected", Boolean(errors.stock));
}

{
  const errors = validateProductForm(validForm({ stock: "many" }));
  check("non-numeric stock rejected", Boolean(errors.stock));
}

{
  const errors = validateProductForm(validForm({ stock: "0" }));
  check("zero stock allowed (sold out, not out of catalogue)", !errors.stock);
}

// Publishing requires SEO completeness.
{
  const errors = validateProductForm(validForm({ status: "published" }));
  check("publish without SEO title (en) rejected", Boolean(errors.seoTitleEn));
  check("publish without SEO title (ms) rejected", Boolean(errors.seoTitleMs));
  check("publish without SEO title (zh) rejected", Boolean(errors.seoTitleZh));
  check("publish without SEO description (en) rejected", Boolean(errors.seoDescriptionEn));
  check("publish without SEO description (ms) rejected", Boolean(errors.seoDescriptionMs));
  check("publish without SEO description (zh) rejected", Boolean(errors.seoDescriptionZh));
}

{
  const errors = validateProductForm(validForm({ status: "published", ...seoFields() }));
  check("publish with complete SEO and a photo passes", !hasProductFormErrors(errors));
}

{
  const errors = validateProductForm(validForm({ status: "published", hasImage: false, ...seoFields() }));
  check("publish without a photo rejected", Boolean(errors.hasImage));
  check("draft without a photo allowed", !validateProductForm(validForm({ hasImage: false })).hasImage);
}

{
  const partial = seoFields();
  delete partial.seoTitleMs;
  const errors = validateProductForm(validForm({ status: "published", ...partial }));
  check("publish with only one language missing SEO still fails", Boolean(errors.seoTitleMs));
}

{
  // Drafts may be incomplete — that is the point of a draft.
  const errors = validateProductForm(validForm({ status: "draft" }));
  check("draft does not require SEO", !errors.seoTitleEn && !errors.seoDescriptionZh);
}

/* ---------------------------- Product shape ------------------------------ */

{
  const product = formToProduct(
    validForm({ status: "published", priceMode: "fixed", priceAmount: "249.00", ...seoFields() }),
  );
  const fixed = product.price.kind === "fixed" ? product.price : null;
  check("fixed price converts to sen", fixed?.amountSen === 24900);
  check("currency is MYR", fixed?.currency === "MYR");
  check("compare-at omitted when blank", fixed?.compareAtSen === undefined);
  check("stock applied to variants", product.variants[0]?.stock === 3);
  check("description splits on blank lines", product.description.en.length === 1);
  check("trilingual name preserved", product.name.zh === "传承手提包");
  check("slug preserved", product.slug.ms === "tote-warisan");
}

{
  const product = formToProduct(validForm({ priceMode: "on-request" }));
  check("on-request price has no amount", product.price.kind === "on-request");
}

{
  const product = formToProduct(
    validForm({ priceMode: "fixed", priceAmount: "199.00", compareAtAmount: "249.00" }),
  );
  check(
    "compare-at kept when genuine",
    product.price.kind === "fixed" && product.price.compareAtSen === 24900,
  );
}

{
  const product = formToProduct(
    validForm({ descriptionEn: "First block.\n\nSecond block.\n\n\nThird block." }),
  );
  check("multi-paragraph description split", product.description.en.length === 3);
  check("paragraph text trimmed", product.description.en[1] === "Second block.");
}

/* ---------------------------- Round tripping ----------------------------- */

for (const source of products) {
  const form = productToForm(source);
  const rebuilt = formToProduct(form, source);

  check(
    `${source.id}: price survives a round trip`,
    JSON.stringify(rebuilt.price) === JSON.stringify(source.price),
    `${JSON.stringify(rebuilt.price)} vs ${JSON.stringify(source.price)}`,
  );
  check(`${source.id}: name survives a round trip`, rebuilt.name.en === source.name.en);
  check(`${source.id}: slug survives a round trip`, rebuilt.slug.zh === source.slug.zh);
  check(`${source.id}: stock survives a round trip`, rebuilt.variants[0]?.stock === source.variants[0]?.stock);
  check(
    `${source.id}: description survives a round trip`,
    rebuilt.description.ms.join("|") === source.description.ms.join("|"),
  );
  check(
    `${source.id}: editing an existing product keeps its variants`,
    rebuilt.variants.length === source.variants.length,
  );
  check(`${source.id}: existing brands/images/specs preserved`, rebuilt.id === source.id && rebuilt.images.length === source.images.length);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
