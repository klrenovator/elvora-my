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
  type ProductFormValues,
} from "@/lib/admin/product-form";
import { CatalogueWriteError, getCatalogue } from "@/lib/catalogue/repository";

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

  // Whether a photo exists is a property of the stored record, never of the
  // submitted form — otherwise a crafted request could claim an image and
  // publish a product that the build-time checks would reject.
  values.hasImage = (existing?.images.length ?? 0) > 0;

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
    hasImage: false,
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
