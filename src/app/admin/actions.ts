"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminConfigState,
  checkRateLimit,
  clearFailures,
  clientKeyFromHeaders,
  createSessionToken,
  recordFailure,
  verifyPassword,
} from "@/lib/admin/auth";
import { clearSessionCookie, requireOwner, setSessionCookie } from "@/lib/admin/session";
import {
  formToProduct,
  hasProductFormErrors,
  productToForm,
  validateProductForm,
  type ProductImageValue,
  type ProductFormValues,
} from "@/lib/admin/product-form";
import { CatalogueWriteError, getCatalogue } from "@/lib/catalogue/repository";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGES_PER_PRODUCT,
  MAX_IMAGE_BYTES,
  imageStoragePath,
  isOwnStorageUrl,
  validateImageUpload,
  type AllowedImageType,
} from "@/lib/images/rules";
import { ImageStorageError, getImageStorage, publicImageBase } from "@/lib/images/storage";

/**
 * Admin server actions.
 *
 * Every action that changes data calls `requireOwner()` first. Authorisation is
 * never inferred from the presence of a form field or a hidden input.
 */

export interface LoginState {
  error?: string;
  retryAfter?: number;
}

/**
 * Sign in.
 *
 * Order of checks matters: configuration, then rate limit, then password. That
 * way a misconfigured deployment reports its real problem instead of burning
 * the owner's attempts against an account that cannot authenticate anyway.
 */
export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const config = adminConfigState();
  if (!config.ready) {
    return {
      error: `Admin access is not configured yet. Missing: ${config.missing.join(", ")}.`,
    };
  }

  const requestHeaders = await headers();
  const key = clientKeyFromHeaders(requestHeaders);
  const limit = checkRateLimit(key);
  if (!limit.allowed) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfter / 60)} minutes.`,
      retryAfter: limit.retryAfter,
    };
  }

  const password = String(formData.get("password") ?? "");
  const storedHash = process.env.ADMIN_PASSWORD_HASH ?? "";

  if (!password || !verifyPassword(password, storedHash)) {
    recordFailure(key);
    // Deliberately vague: do not reveal whether the password was empty, wrong,
    // or the hash malformed.
    return { error: "That password is not correct." };
  }

  clearFailures(key);
  const token = createSessionToken();
  if (!token) {
    return { error: "Session could not be created. Check ADMIN_SESSION_SECRET." };
  }

  await setSessionCookie(token);
  redirect("/admin/products");
}

export async function logout(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}

/**
 * Invalidate every storefront surface that shows product data.
 *
 * `revalidatePath("/", "layout")` covers the localized pages, but the product
 * URLs carry per-language slugs and category pages list products, so the
 * affected paths are invalidated explicitly rather than relying on a timeout.
 * Getting this wrong is the difference between "saved" and "saved but invisible"
 * — the precise failure this project has refused from the start.
 */
function revalidateStorefront(product?: { slug: Record<string, string> }): void {
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");

  // Every language's product URL, plus the category pages that list it.
  if (product) {
    for (const locale of ["en", "ms", "zh"] as const) {
      const catalog = locale === "en" ? "products" : locale === "ms" ? "produk" : "chan-pin";
      revalidatePath(`/${locale}/${catalog}/${product.slug[locale]}`);
    }
  }
  for (const locale of ["en", "ms", "zh"] as const) {
    revalidatePath(`/${locale}`, "layout");
  }
}

export interface SaveState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

/** Create or update a product from the admin form. */
export async function saveProduct(
  _previous: SaveState,
  formData: FormData,
): Promise<SaveState> {
  try {
    await requireOwner();
  } catch {
    return { error: "Not authorised." };
  }

  const values = formValuesFrom(formData);
  const catalogue = getCatalogue();
  const existing = values.id ? await catalogue.byId(values.id) : undefined;

  // Images must be reconciled against BOTH the stored record and our own
  // storage host.
  //
  // The editor submits the list it is showing, which is how alt-text edits and
  // removals survive the save. But a crafted request could put anything in that
  // list, so an entry is only accepted if it was *already* attached to this
  // product, or it points at an object in our own bucket. That means a photo
  // must have been uploaded through `uploadProductImage` first — the form
  // cannot be used to attach an arbitrary URL.
  const submitted = parseImages(formData.get("imagesJson"));
  const allowed = new Set((existing?.images ?? []).map((image) => image.src));
  const base = publicImageBase();

  values.images = submitted
    .filter((image) => allowed.has(image.src) || isOwnStorageUrl(image.src, base))
    .slice(0, MAX_IMAGES_PER_PRODUCT)
    .map((image) => ({
      ...image,
      // Alt text is user text that ends up in HTML attributes, so it is
      // length-capped here rather than trusted to be reasonable.
      altEn: image.altEn.trim().slice(0, 300),
      altMs: image.altMs.trim().slice(0, 300),
      altZh: image.altZh.trim().slice(0, 300),
    }));

  // A product that previously had images must not lose them to a malformed
  // or missing field — that would silently break a published page.
  if (values.images.length === 0 && (existing?.images.length ?? 0) > 0 && !formData.has("imagesJson")) {
    values.images = existing!.images.map((image) => ({
      src: image.src,
      altEn: image.alt.en,
      altMs: image.alt.ms,
      altZh: image.alt.zh,
      placeholder: image.placeholder,
    }));
  }

  const errors = validateProductForm(values);

  if (hasProductFormErrors(errors)) {
    return {
      error: "Please correct the highlighted fields before saving.",
      fieldErrors: errors as Record<string, string>,
    };
  }

  const product = formToProduct(values, existing);

  try {
    if (existing) {
      await catalogue.update(existing.id, product);
    } else {
      await catalogue.create(product);
    }
  } catch (error) {
    if (error instanceof CatalogueWriteError) {
      return { error: error.message };
    }
    return { error: "Could not save the product. Nothing was changed." };
  }

  revalidateStorefront(product);
  return { ok: true };
}

/** Publish or unpublish a product. */
export async function setProductStatus(formData: FormData): Promise<void> {
  await requireOwner();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (status !== "published" && status !== "draft") return;

  const catalogue = getCatalogue();
  const existing = await catalogue.byId(id);
  if (!existing) return;

  // Publishing a product that would fail the catalogue rules is refused here
  // as well as in the form, so a direct action call cannot bypass validation.
  if (status === "published") {
    const errors = validateProductForm(productToForm(existing));
    if (hasProductFormErrors(errors)) return;
  }

  await catalogue.update(id, { ...existing, status });
  revalidateStorefront(existing);
}


/* ------------------------------- Images ---------------------------------- */

export interface ImageUploadState {
  ok?: boolean;
  error?: string;
  /** The stored image, ready to append to the editor's list. */
  image?: {
    src: string;
    altEn: string;
    altMs: string;
    altZh: string;
    placeholder: boolean;
  };
}

/**
 * Upload a product image.
 *
 * This is the only endpoint in the application that accepts a file, so it is
 * deliberately narrow:
 *
 * 1. **Owner only.** `requireOwner()` runs before a single byte is read.
 * 2. **Size before content.** The declared size is checked before the body is
 *    buffered, so a huge upload cannot exhaust memory on its way to being
 *    rejected.
 * 3. **Content verified, not trusted.** The browser's `type` is only a claim;
 *    `validateImageUpload` checks the file's magic bytes and refuses a mismatch.
 *    SVG is excluded because it can carry script.
 * 4. **Filenames are not reused.** The storage path is built from the product
 *    id and a random suffix, so the original name cannot influence the path.
 * 5. **Nothing is saved to the product here.** The image is returned to the
 *    form; the owner saves the product in the usual way. That keeps one write
 *    path for catalogue changes and one place where validation runs.
 */
export async function uploadProductImage(
  _previous: ImageUploadState,
  formData: FormData,
): Promise<ImageUploadState> {
  try {
    await requireOwner();
  } catch {
    return { error: "Not authorised." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "Choose an image to upload." };
  }

  const productId = String(formData.get("productId") ?? "").trim() || "unassigned";

  // Count check before reading the file: a product with a full gallery should
  // be rejected immediately, not after a pointless upload. The count comes from
  // the stored record when one exists, so the browser cannot understate it and
  // squeeze in an extra photo; only an unsaved new product uses the client's
  // number, where there is nothing stored to check against yet.
  const existingImages =
    productId === "unassigned"
      ? Number(formData.get("imageCount") ?? "0")
      : ((await getCatalogue().byId(productId).catch(() => undefined))?.images.length ??
        Number(formData.get("imageCount") ?? "0"));

  if (Number.isFinite(existingImages) && existingImages >= MAX_IMAGES_PER_PRODUCT) {
    return {
      error: `A product can have at most ${MAX_IMAGES_PER_PRODUCT} images. Remove one first.`,
    };
  }

  if (file.size <= 0) {
    return { error: "That file is empty. Choose a different image." };
  }

  // Checked against the shared constant rather than a literal, so the limit
  // cannot drift from the validator below or from the bucket's own setting.
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Images must be under 8 MB. Compress the photo and try again." };
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  // The magic bytes live in the first 16 bytes; the validator only reads those.
  const validation = validateImageUpload({
    type: file.type,
    size: buffer.byteLength,
    header: buffer.subarray(0, 16),
  });
  if (!validation.ok) {
    return { error: validation.message };
  }

  const contentType = file.type as AllowedImageType;
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(contentType)) {
    return { error: "Unsupported image type." };
  }

  const storage = getImageStorage();
  if (!storage.isConfigured()) {
    return {
      error:
        "Image storage is not configured yet. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, and create a public bucket named product-images. See docs/SUPABASE-SETUP.md.",
    };
  }

  const path = imageStoragePath(productId, contentType, randomSuffix());

  try {
    const stored = await storage.upload(path, buffer, contentType);
    return {
      ok: true,
      image: {
        src: stored.url,
        // Sensible default; the owner edits it. Alt text is required to publish,
        // so leaving it blank is caught by the form rather than silently
        // shipping an image with no description.
        altEn: "",
        altMs: "",
        altZh: "",
        placeholder: false,
      },
    };
  } catch (error) {
    if (error instanceof ImageStorageError) return { error: error.message };
    console.error("[admin] image upload failed:", error);
    return { error: "The image could not be uploaded. Nothing was saved." };
  }
}

/**
 * Delete a stored image.
 *
 * Best-effort by design: if the object is already gone the product should still
 * be able to drop the reference, so a storage error does not trap the owner
 * with an undeletable image.
 */
export async function deleteProductImage(formData: FormData): Promise<void> {
  await requireOwner();

  const productId = String(formData.get("productId") ?? "");
  const src = String(formData.get("src") ?? "");
  if (!src) return;

  const storage = getImageStorage();
  const base = storage.isConfigured() ? publicImageBase() : "";

  // Only objects in our own bucket are removed. A repository path (/images/...)
  // belongs to the codebase and is never touched from a web request.
  if (base && src.startsWith(`${base}/`)) {
    const path = src.slice(base.length + 1);
    try {
      await storage.remove(path);
    } catch (error) {
      console.error("[admin] image delete failed:", error);
    }
  }

  // Drop the reference from the product regardless, then revalidate.
  const catalogue = getCatalogue();
  const existing = productId ? await catalogue.byId(productId) : undefined;
  if (!existing) return;

  const remaining = existing.images.filter((image) => image.src !== src);
  if (remaining.length === existing.images.length) return;

  try {
    await catalogue.update(existing.id, { ...existing, images: remaining });
  } catch (error) {
    if (error instanceof CatalogueWriteError) {
      console.error("[admin] could not drop image reference:", error.message);
    }
    return;
  }
  revalidateStorefront(existing);
}

/** A short random string for the storage filename. Never derived from user input. */
function randomSuffix(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(36).padStart(2, "0")).join("").slice(0, 10);
}

/**
 * Parse the submitted image list.
 *
 * Anything malformed is dropped rather than throwing: a bad entry should cost
 * the owner that image, not the whole save. The list is then filtered against
 * permitted sources by the caller.
 */
function parseImages(raw: FormDataEntryValue | null): ProductImageValue[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((entry): entry is Record<string, unknown> => typeof entry === "object" && entry !== null)
    .map((entry) => ({
      src: typeof entry.src === "string" ? entry.src.trim() : "",
      altEn: typeof entry.altEn === "string" ? entry.altEn : "",
      altMs: typeof entry.altMs === "string" ? entry.altMs : "",
      altZh: typeof entry.altZh === "string" ? entry.altZh : "",
      placeholder: entry.placeholder === true,
    }))
    .filter((entry) => entry.src.length > 0 && entry.src.length < 500);
}

function formValuesFrom(formData: FormData): ProductFormValues {
  const text = (key: string) => String(formData.get(key) ?? "");
  const flag = (key: string) => formData.get(key) === "on";
  return {
    id: text("id"),
    category: text("category"),
    status: text("status") === "published" ? "published" : "draft",
    leatherType: text("leatherType") as ProductFormValues["leatherType"],
    nameEn: text("nameEn"),
    nameMs: text("nameMs"),
    nameZh: text("nameZh"),
    slugEn: text("slugEn"),
    slugMs: text("slugMs"),
    slugZh: text("slugZh"),
    shortDescriptionEn: text("shortDescriptionEn"),
    shortDescriptionMs: text("shortDescriptionMs"),
    shortDescriptionZh: text("shortDescriptionZh"),
    descriptionEn: text("descriptionEn"),
    descriptionMs: text("descriptionMs"),
    descriptionZh: text("descriptionZh"),
    priceMode: text("priceMode") === "fixed" ? "fixed" : "on-request",
    priceAmount: text("priceAmount"),
    compareAtAmount: text("compareAtAmount"),
    sku: text("sku"),
    stock: text("stock"),
    // Replaced from the parsed, verified list above.
    images: [],
    featured: flag("featured"),
    newArrival: flag("newArrival"),
    bestseller: flag("bestseller"),
    seoTitleEn: text("seoTitleEn"),
    seoTitleMs: text("seoTitleMs"),
    seoTitleZh: text("seoTitleZh"),
    seoDescriptionEn: text("seoDescriptionEn"),
    seoDescriptionMs: text("seoDescriptionMs"),
    seoDescriptionZh: text("seoDescriptionZh"),
  };
}
