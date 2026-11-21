/**
 * Product image tests.
 *
 * The upload endpoint is the only place in the application that accepts a file,
 * so these are written the way an attacker would probe it: lie about the type,
 * smuggle a script, exhaust the limit, influence the storage path.
 *
 * The rules are pure functions, which is why they can be tested this thoroughly
 * without a browser or a storage bucket.
 */
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGES_PER_PRODUCT,
  detectImageType,
  imageStoragePath,
  isOwnStorageUrl,
  validateImageUpload,
  withImage,
  withoutImage,
} from "@/lib/images/rules";
import {
  SupabaseImageStorage,
  IMAGE_BUCKET,
  getImageStorage,
  resetImageStorage,
  setImageStorage,
  storageConfig,
  publicImageBase,
  ImageStorageError,
} from "@/lib/images/storage";
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

/** Real file headers for each format. */
const HEADERS = {
  jpeg: new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]),
  png: new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]),
  webp: new Uint8Array([
    0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
  ]),
  avif: new Uint8Array([
    0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66,
  ]),
  // An SVG is text; it has no magic bytes. It is the format most likely to be
  // uploaded deliberately because it can carry a script.
  svg: new Uint8Array([0x3c, 0x73, 0x76, 0x67, 0x20, 0x78, 0x6d, 0x6c, 0x6e, 0x73, 0x3d, 0x22]),
  // A PHP file that a naive check would accept if it trusted the filename.
  php: new Uint8Array([0x3c, 0x3f, 0x70, 0x68, 0x70, 0x20, 0x65, 0x63, 0x68, 0x6f, 0x20]),
  // A zip archive (also the container for many "images" that are not images).
  zip: new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00, 0x08, 0x00]),
};

async function main() {
  /* --------------------------- Type detection --------------------------- */

  check("JPEG detected from bytes", detectImageType(HEADERS.jpeg) === "image/jpeg");
  check("PNG detected from bytes", detectImageType(HEADERS.png) === "image/png");
  check("WebP detected from bytes", detectImageType(HEADERS.webp) === "image/webp");
  check("AVIF detected from bytes", detectImageType(HEADERS.avif) === "image/avif");
  check("SVG not detected as an image", detectImageType(HEADERS.svg) === null);
  check("PHP not detected as an image", detectImageType(HEADERS.php) === null);
  check("ZIP not detected as an image", detectImageType(HEADERS.zip) === null);
  check("empty header detected as nothing", detectImageType(new Uint8Array([])) === null);

  {
    // A truncated header must not crash the detector.
    check("truncated header does not throw", detectImageType(new Uint8Array([0xff])) === null);
  }

  /* ---------------------------- Size limits ----------------------------- */

  check("the limit is 8 MB", MAX_IMAGE_BYTES === 8 * 1024 * 1024);

  check(
    "a zero-byte file is refused",
    validateImageUpload({ type: "image/jpeg", size: 0, header: HEADERS.jpeg }).rejection === "empty",
  );

  check(
    "a file one byte over the limit is refused",
    validateImageUpload({ type: "image/jpeg", size: MAX_IMAGE_BYTES + 1, header: HEADERS.jpeg })
      .rejection === "too-large",
  );

  check(
    "a file exactly at the limit is accepted",
    validateImageUpload({ type: "image/jpeg", size: MAX_IMAGE_BYTES, header: HEADERS.jpeg }).ok,
  );

  {
    const result = validateImageUpload({ type: "image/jpeg", size: MAX_IMAGE_BYTES + 1, header: HEADERS.jpeg });
    check("the size refusal tells the owner the limit", /8 MB/.test(result.message ?? ""));
  }

  /* ------------------------- Declared type checks ----------------------- */

  for (const type of ALLOWED_IMAGE_TYPES) {
    check(`${type} is an allowed type`, (ALLOWED_IMAGE_TYPES as readonly string[]).includes(type));
  }

  check(
    "SVG is not an allowed type",
    !(ALLOWED_IMAGE_TYPES as readonly string[]).includes("image/svg+xml"),
  );
  check(
    "GIF is not an allowed type",
    !(ALLOWED_IMAGE_TYPES as readonly string[]).includes("image/gif"),
  );
  check(
    "an SVG upload is refused",
    validateImageUpload({ type: "image/svg+xml", size: 1000, header: HEADERS.svg }).rejection ===
      "unsupported-type",
  );
  check(
    "a PDF upload is refused",
    validateImageUpload({ type: "application/pdf", size: 1000, header: HEADERS.php }).rejection ===
      "unsupported-type",
  );
  check(
    "an empty declared type is refused",
    validateImageUpload({ type: "", size: 1000, header: HEADERS.jpeg }).rejection ===
      "unsupported-type",
  );

  /* ----------------------- Content must match type ---------------------- */

  check(
    "a JPEG declared as PNG is refused",
    validateImageUpload({ type: "image/png", size: 1000, header: HEADERS.jpeg }).rejection ===
      "content-mismatch",
  );
  check(
    "a PNG declared as JPEG is refused",
    validateImageUpload({ type: "image/jpeg", size: 1000, header: HEADERS.png }).rejection ===
      "content-mismatch",
  );
  check(
    "a PHP file declared as JPEG is refused",
    validateImageUpload({ type: "image/jpeg", size: 1000, header: HEADERS.php }).rejection ===
      "content-mismatch",
  );
  check(
    "a ZIP declared as WebP is refused",
    validateImageUpload({ type: "image/webp", size: 1000, header: HEADERS.zip }).rejection ===
      "content-mismatch",
  );
  check(
    "a JPEG declared as JPEG is accepted",
    validateImageUpload({ type: "image/jpeg", size: 1000, header: HEADERS.jpeg }).ok,
  );
  check(
    "a PNG declared as PNG is accepted",
    validateImageUpload({ type: "image/png", size: 1000, header: HEADERS.png }).ok,
  );

  /* ----------------------------- Storage paths -------------------------- */

  check(
    "the path uses the slugified product id",
    imageStoragePath("bifold-wallet-cognac", "image/jpeg", "abc123").startsWith("bifold-wallet-cognac/"),
  );
  check(
    "the extension comes from the verified type",
    imageStoragePath("p", "image/png", "abc").endsWith(".png") &&
      imageStoragePath("p", "image/webp", "abc").endsWith(".webp"),
  );
  check(
    "path traversal in the product id is neutralised",
    !imageStoragePath("../../etc/passwd", "image/jpeg", "abc").includes(".."),
  );
  check(
    "an absolute path cannot be produced",
    !imageStoragePath("/etc/passwd", "image/jpeg", "abc").startsWith("/"),
  );
  check(
    "a script-like product id is reduced to safe characters",
    /^[a-z0-9-]+\/[a-z0-9]+\.jpeg$/.test(imageStoragePath("x<img src=y onerror=z>", "image/jpeg", "ab")),
  );
  check(
    "a hostile suffix cannot escape the directory",
    !imageStoragePath("p", "image/jpeg", "../../../etc/passwd").includes(".."),
  );
  check(
    "an empty product id falls back to a safe name",
    imageStoragePath("", "image/jpeg", "abc").startsWith("product/"),
  );
  {
    const long = imageStoragePath("a".repeat(500), "image/jpeg", "abc");
    check("an over-long id is truncated", long.length < 120);
  }

  /* ---------------------------- Image sources -------------------------- */

  const base = "https://project.supabase.co/storage/v1/object/public/product-images";

  check("a repository path is accepted", isOwnStorageUrl("/images/categories/x.jpg", base));
  check("an own-bucket URL is accepted", isOwnStorageUrl(`${base}/p/x.jpg`, base));
  check("another site is refused", !isOwnStorageUrl("https://evil.example/x.jpg", base));
  check("a lookalike host is refused", !isOwnStorageUrl("https://evil.example/product-images/x.jpg", base));
  check("a data URL is refused", !isOwnStorageUrl("data:image/svg+xml;base64,PHN2Zz4=", base));
  check("an empty source is refused", !isOwnStorageUrl("", base));
  check(
    "nothing is accepted when no bucket is configured",
    !isOwnStorageUrl("https://project.supabase.co/storage/v1/object/public/product-images/x.jpg", ""),
  );

  /* ---------------------------- Image lists ---------------------------- */

  const empty = { images: [] };
  const one = withImage(empty, {
    src: "/images/a.jpg",
    alt: { en: "A", ms: "A", zh: "A" },
    placeholder: false,
  });
  check("an image can be added", one.images.length === 1);
  check("adding does not mutate the original", empty.images.length === 0);

  {
    let many: { images: { src: string; alt: { en: string; ms: string; zh: string }; placeholder: boolean }[] } =
      empty;
    for (let i = 0; i < MAX_IMAGES_PER_PRODUCT + 3; i += 1) {
      many = withImage(many, {
        src: `/images/${i}.jpg`,
        alt: { en: `n${i}`, ms: `n${i}`, zh: `n${i}` },
        placeholder: false,
      });
    }
    check(`the ${MAX_IMAGES_PER_PRODUCT}-image cap is enforced`, many.images.length === MAX_IMAGES_PER_PRODUCT);
  }

  check("an image can be removed by src", withoutImage(one, "/images/a.jpg").images.length === 0);
  check("removing an unknown src is a no-op", withoutImage(one, "/images/zzz.jpg").images.length === 1);

  /* --------------------------- Storage config -------------------------- */

  {
    const savedUrl = process.env.SUPABASE_URL;
    const savedKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    check("storage is unconfigured without variables", storageConfig() === null);
    check("an unconfigured storage reports itself so", new SupabaseImageStorage().isConfigured() === false);
    check("no public base without configuration", publicImageBase() === "");

    process.env.SUPABASE_URL = "https://project.supabase.co";
    check("a URL alone is not enough", storageConfig() === null);

    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    const config = storageConfig();
    check("both variables configure storage", config !== null);
    check("the URL is normalised without a trailing slash", config?.url === "https://project.supabase.co");
    check("the public base points at the bucket", publicImageBase().endsWith(`/public/${IMAGE_BUCKET}`));

    {
      const storage = new SupabaseImageStorage();
      check("configured storage reports itself configured", storage.isConfigured());
      check("storage is durable", storage.isDurable());
    }

    if (savedUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = savedUrl;
    if (savedKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = savedKey;
  }

  /* ----------------------- Upload refusal without config ---------------- */

  {
    const savedUrl = process.env.SUPABASE_URL;
    const savedKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    let refused = false;
    let message = "";
    try {
      await new SupabaseImageStorage().upload("p/x.jpeg", new Uint8Array([1]), "image/jpeg");
    } catch (error) {
      refused = error instanceof ImageStorageError;
      message = error instanceof Error ? error.message : "";
    }
    check("upload without configuration is refused", refused);
    check("the refusal says what to set", /SUPABASE_URL/.test(message));
    check("the refusal does not claim success", !/uploaded|stored/i.test(message));

    if (savedUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = savedUrl;
    if (savedKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = savedKey;
  }

  /* ---------------------------- Storage seam --------------------------- */

  {
    resetImageStorage();
    check("the default storage is the Supabase one", getImageStorage() instanceof SupabaseImageStorage);

    let uploaded = 0;
    let removed = 0;
    setImageStorage({
      isConfigured: () => true,
      isDurable: () => true,
      async upload(path) {
        uploaded += 1;
        return { url: `https://x/${path}`, path };
      },
      async remove() {
        removed += 1;
      },
    });

    const result = await getImageStorage().upload("p/x.jpeg", new Uint8Array([1]), "image/jpeg");
    check("a swapped-in storage is used", uploaded === 1);
    check("the stored image returns a url and a path", Boolean(result.url && result.path));

    await getImageStorage().remove("p/x.jpeg");
    check("delete reaches the storage", removed === 1);

    resetImageStorage();
    check("reset restores the Supabase storage", getImageStorage() instanceof SupabaseImageStorage);
  }

  /* ----------------------- The action's own guards --------------------- */

  {
    // The action must verify before it writes, and must not accept a file the
    // rules reject. Asserted from source because the action needs a live
    // request context to invoke.
    const actions = readFileSync("src/app/admin/actions.ts", "utf8");
    check("uploads require the owner", /uploadProductImage[\s\S]{0,600}requireOwner\(\)/.test(actions));
    check(
      "the size is checked before the body is read",
      actions.indexOf("file.size > MAX_IMAGE_BYTES") < actions.indexOf("await file.arrayBuffer()"),
    );
    check("the size limit uses the shared constant", /file\.size > MAX_IMAGE_BYTES/.test(actions));
    check("an empty file is refused", /file\.size <= 0/.test(actions));
    check(
      "the stored photo count is used when the product exists",
      /getCatalogue\(\)\.byId\(productId\)/.test(actions),
    );
    check("the magic bytes are verified", /validateImageUpload\(\{/.test(actions));
    check("the storage path is generated, not taken from the filename", /imageStoragePath\(productId/.test(actions));
    check("the original filename is never used in the path", !/file\.name/.test(actions));
    check("an unconfigured storage is refused with guidance", /product-images/.test(actions));
    check(
      "submitted image sources are filtered against the stored record and own bucket",
      /allowed\.has\(image\.src\) \|\| isOwnStorageUrl\(image\.src, base\)/.test(actions),
    );
    check("alt text is length-capped", /slice\(0, 300\)/.test(actions));
    check("deleting an image requires the owner", /deleteProductImage[\s\S]{0,300}requireOwner\(\)/.test(actions));
    check(
      "only our own bucket objects are deleted from storage",
      /src\.startsWith\(`\$\{base\}\/`\)/.test(actions),
    );
  }

  {
    // Alt text is required to publish, because it is what a screen-reader user
    // and a broken-image visitor depend on.
    const form = readFileSync("src/lib/admin/product-form.ts", "utf8");
    check("publishing requires at least one image", /values\.images\.length === 0/.test(form));
    check("publishing requires English alt text", /altEn\.trim\(\)/.test(form));
  }

  {
    // Uploaded photos are served from Supabase, so next/image must allow it or
    // every upload renders broken.
    const config = readFileSync("next.config.ts", "utf8");
    check("remote image patterns are derived from SUPABASE_URL", /process\.env\.SUPABASE_URL/.test(config));
    check("only https hosts are allowed", /protocol !== "https:"/.test(config));
    check("the pattern is scoped to storage objects", /\/storage\/v1\/object\/public\/\*\*/.test(config));
    check("a malformed URL cannot become a wildcard", /catch \{/.test(config));
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
