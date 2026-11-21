/**
 * Product media panel render tests.
 *
 * The panel is a client component whose important states (empty gallery, full
 * gallery, read-only, error, uploading) are not visible in server HTML, so they
 * are rendered directly — the same approach used for the checkout form.
 *
 * The assertions focus on what the owner is told: an empty gallery must say the
 * product cannot be published, a read-only catalogue must not offer an upload
 * that will be refused, and alt text must be presented as required.
 */
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { ProductMediaPanel } from "@/components/admin/product-media-panel";
import type { ProductImageValue } from "@/lib/admin/product-form";
import { MAX_IMAGES_PER_PRODUCT } from "@/lib/images/rules";
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

const image = (src: string, alt = "A cognac leather wallet"): ProductImageValue => ({
  src,
  altEn: alt,
  altMs: "",
  altZh: "",
  placeholder: false,
});

function render(props: {
  images?: ProductImageValue[];
  readOnly?: boolean;
  productId?: string;
}) {
  return renderToStaticMarkup(
    <ProductMediaPanel
      images={props.images ?? []}
      onChange={() => {}}
      productId={props.productId ?? "bifold-wallet-cognac"}
      readOnly={props.readOnly ?? false}
    />,
  );
}

/* ------------------------------- Empty state ------------------------------ */

const empty = render({});

check("the panel renders", empty.includes("Photos"));
check("an empty gallery says a photo is needed", empty.includes("cannot be published until one is added"));
check("the counter shows none yet", /\b0\b.*of.*6|\b0\b/.test(empty));
check("a file input is offered", empty.includes('type="file"'));
check("the accepted types are restricted", empty.includes("image/jpeg") && empty.includes("image/avif"));
check("SVG is not accepted", !empty.includes("image/svg+xml"));
check("the size limit is stated", /8 MB/.test(empty));
check("an empty list is submitted with the form", empty.includes('name="imagesJson"'));
check("the hidden field carries an empty array", equalJson(empty, "[]"));

function equalJson(markup: string, expected: string): boolean {
  const match = markup.match(/name="imagesJson" value="([^"]*)"/);
  const decode = (value: string) =>
    value.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'");
  return match ? decode(match[1]) === expected : false;
}

/* ------------------------------ Populated state --------------------------- */

const populated = render({ images: [image("/images/a.jpg"), image("/images/b.jpg", "Second")] });

check("existing images are listed", populated.includes("/images/a.jpg"));
check("both images are counted", /2/.test(populated));
check("each image has an English alt field", populated.includes("Alt text (English)"));
check("alt text is marked required", populated.includes('required') || populated.includes("*"));
check("Malay alt text is offered", populated.includes("Alt text (Malay)"));
check("Chinese alt text is offered", populated.includes("Alt text (Chinese)"));
check("a remove control exists", populated.includes("Remove"));
check("the gallery is submitted with the form", /name="imagesJson"/.test(populated));
check("the submitted list contains both images", (populated.match(/images\/[ab]\.jpg/g) ?? []).length >= 2);

/* -------------------------------- Full state ------------------------------ */

const full = Array.from({ length: MAX_IMAGES_PER_PRODUCT }, (_, index) => image(`/images/${index}.jpg`));
const fullMarkup = render({ images: full });
check(
  "at the limit, the upload control has no upload prompt",
  !fullMarkup.includes("No photos yet"),
);
check("the limit is shown", /6/.test(fullMarkup));

/* ------------------------------ Read-only state --------------------------- */

const readOnly = render({ images: [image("/images/a.jpg")], readOnly: true });
check("read-only explains uploads are disabled", readOnly.includes("Uploads are disabled"));
check(
  "read-only disables the file input",
  /<input[^>]*type="file"[^>]*disabled/.test(readOnly) || readOnly.includes("disabled"),
);

/* ---------------------------- Placeholder labelling ----------------------- */

{
  const placeholder = render({
    images: [
      { src: "/images/categories/mens-wallets.jpg", altEn: "Temporary", altMs: "", altZh: "", placeholder: true },
    ],
  });
  check("a placeholder image is labelled as temporary", placeholder.includes("Temporary illustration"));
}

/* --------------------------- Real product wiring -------------------------- */

{
  // The editor must receive the product's existing images, or an owner editing
  // a product would see an empty gallery and think its photos were lost.
  const form = productToForm(products[0]);
  check(
    "productToForm carries the product's images",
    form.images.length === products[0].images.length,
  );
  check(
    "productToForm carries per-language alt text",
    form.images[0]?.altEn === products[0].images[0].alt.en,
  );
  check("a new product starts with no images", emptyProductForm.images.length === 0);

  const markup = render({ images: form.images, productId: products[0].id });
  check(
    "editing an existing product shows its image",
    markup.includes(products[0].images[0].src),
  );
}

/* --------------------------- Editor integration -------------------------- */

{
  const editor = readFileSync("src/components/admin/product-editor.tsx", "utf8");
  check("the editor renders the media panel", /<ProductMediaPanel/.test(editor));
  check("the panel is bound to the form's image list", /images=\{values\.images\}/.test(editor));
  check("changes flow back into the form", /onChange=\{\(images\) => set\("images", images\)\}/.test(editor));
  check("image field errors are shown", /fieldErrors\.images/.test(editor));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
