import type { Locale } from "@/i18n/config";
import type { CategoryId, LeatherType, Product, ProductStatus } from "@/content/types";
import { categories } from "@/content/categories";

/**
 * Admin product form: the editable shape, parsing, and validation.
 *
 * Two rules shape this file:
 *
 * 1. Price is entered as text and parsed explicitly. "On request" is a state
 *    the owner must *choose*; it is never the silent result of leaving a field
 *    blank, because an accidental blank would silently unpublish a price.
 * 2. Validation mirrors the build-time catalogue checks, so a mistake is caught
 *    in the form with a readable message rather than surfacing as a failed
 *    deploy hours later.
 */

export interface ProductFormValues {
  id: string;
  category: string;
  status: ProductStatus;
  leatherType: LeatherType | "";

  nameEn: string;
  nameMs: string;
  nameZh: string;

  slugEn: string;
  slugMs: string;
  slugZh: string;

  shortDescriptionEn: string;
  shortDescriptionMs: string;
  shortDescriptionZh: string;

  descriptionEn: string;
  descriptionMs: string;
  descriptionZh: string;

  /** "on-request" or "fixed" — an explicit choice, never inferred. */
  priceMode: "on-request" | "fixed";
  /** As typed, e.g. "249.00". Parsed to sen on save. */
  priceAmount: string;
  compareAtAmount: string;

  sku: string;
  stock: string;

  /** Whether at least one photo is attached. Read-only in this release: images
   *  are added through the media step, not by typing a path. */
  hasImage: boolean;

  featured: boolean;
  newArrival: boolean;
  bestseller: boolean;

  seoTitleEn: string;
  seoTitleMs: string;
  seoTitleZh: string;
  seoDescriptionEn: string;
  seoDescriptionMs: string;
  seoDescriptionZh: string;
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues | "states", string>>;

export const emptyProductForm: ProductFormValues = {
  id: "",
  category: "",
  status: "draft",
  leatherType: "",
  nameEn: "",
  nameMs: "",
  nameZh: "",
  slugEn: "",
  slugMs: "",
  slugZh: "",
  shortDescriptionEn: "",
  shortDescriptionMs: "",
  shortDescriptionZh: "",
  descriptionEn: "",
  descriptionMs: "",
  descriptionZh: "",
  priceMode: "on-request",
  priceAmount: "",
  compareAtAmount: "",
  sku: "",
  stock: "0",
  hasImage: false,
  featured: false,
  newArrival: false,
  bestseller: false,
  seoTitleEn: "",
  seoTitleMs: "",
  seoTitleZh: "",
  seoDescriptionEn: "",
  seoDescriptionMs: "",
  seoDescriptionZh: "",
};

const categoryIds = new Set(categories.map((category) => category.id));

/** Turn a title into a URL-safe slug. Latin script only; the owner can edit. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

/**
 * Parse a Ringgit amount typed by a human into integer sen.
 *
 * Accepts "249", "249.00", "249.9", "RM 249.00" and "1,249.00". Returns null
 * for anything it cannot read exactly — it never rounds or guesses, because a
 * silently altered price is worse than a rejected one.
 */
export function parseRinggitToSen(input: string): number | null {
  const cleaned = input.trim().replace(/^RM\s?/i, "").replace(/,/g, "");
  if (!cleaned) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;

  const [whole, fraction = ""] = cleaned.split(".");
  const sen = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(sen) || sen <= 0) return null;
  return sen;
}

/** Format sen back into a form field value. */
export function senToInput(sen: number): string {
  return (sen / 100).toFixed(2);
}

/** Build form values from an existing product, for the edit screen. */
export function productToForm(product: Product): ProductFormValues {
  const price = product.price;
  return {
    ...emptyProductForm,
    id: product.id,
    category: product.category,
    status: product.status,
    leatherType: product.leatherType,
    nameEn: product.name.en,
    nameMs: product.name.ms,
    nameZh: product.name.zh,
    slugEn: product.slug.en,
    slugMs: product.slug.ms,
    slugZh: product.slug.zh,
    shortDescriptionEn: product.shortDescription.en,
    shortDescriptionMs: product.shortDescription.ms,
    shortDescriptionZh: product.shortDescription.zh,
    descriptionEn: product.description.en.join("\n\n"),
    descriptionMs: product.description.ms.join("\n\n"),
    descriptionZh: product.description.zh.join("\n\n"),
    priceMode: price.kind === "fixed" ? "fixed" : "on-request",
    priceAmount:
      price.kind === "fixed" ? senToInput(price.amountSen) : "",
    compareAtAmount:
      price.kind === "fixed" && price.compareAtSen ? senToInput(price.compareAtSen) : "",
    sku: product.sku,
    stock: String(product.variants[0]?.stock ?? 0),
    hasImage: product.images.length > 0,
    featured: product.merchandising.featured,
    newArrival: product.merchandising.newArrival,
    bestseller: product.merchandising.bestseller,
    seoTitleEn: product.seo.title.en,
    seoTitleMs: product.seo.title.ms,
    seoTitleZh: product.seo.title.zh,
    seoDescriptionEn: product.seo.description.en,
    seoDescriptionMs: product.seo.description.ms,
    seoDescriptionZh: product.seo.description.zh,
  };
}

/**
 * Validate the form. Returns field-keyed messages so the UI can place each one
 * beside the input that caused it.
 */
export function validateProductForm(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (!categoryIds.has(values.category as CategoryId)) {
    errors.category = "Choose one of the seven approved categories.";
  }

  if (values.leatherType !== "full-grain" && values.leatherType !== "top-grain") {
    errors.leatherType = "Confirm the leather grade. Only full grain or top grain may be sold.";
  }

  // Names and slugs are required in every language, or that language's page
  // would be missing or would 404.
  const languageFields: [keyof ProductFormValues, string, string][] = [
    ["nameEn", "English", values.nameEn],
    ["nameMs", "Malay", values.nameMs],
    ["nameZh", "Chinese", values.nameZh],
    ["slugEn", "English", values.slugEn],
    ["slugMs", "Malay", values.slugMs],
    ["slugZh", "Chinese", values.slugZh],
    ["shortDescriptionEn", "English", values.shortDescriptionEn],
    ["shortDescriptionMs", "Malay", values.shortDescriptionMs],
    ["shortDescriptionZh", "Chinese", values.shortDescriptionZh],
    ["descriptionEn", "English", values.descriptionEn],
    ["descriptionMs", "Malay", values.descriptionMs],
    ["descriptionZh", "Chinese", values.descriptionZh],
  ];

  for (const [field, language, value] of languageFields) {
    if (!value.trim()) {
      const label = field.startsWith("slug")
        ? "URL slug"
        : field.startsWith("name")
          ? "Product name"
          : field.startsWith("shortDescription")
            ? "Short description"
            : "Description";
      errors[field] = `${label} is required in ${language}.`;
    }
  }

  for (const field of ["slugEn", "slugMs", "slugZh"] as const) {
    const value = values[field];
    if (value.trim() && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.trim())) {
      errors[field] = "Use lowercase letters, numbers and single hyphens only.";
    }
  }

  if (!values.sku.trim()) {
    errors.sku = "A SKU is required so orders can reference the item.";
  }

  // Price: "on request" is a deliberate state, "fixed" needs a readable amount.
  if (values.priceMode === "fixed") {
    const amount = parseRinggitToSen(values.priceAmount);
    if (amount === null) {
      errors.priceAmount = "Enter a price like 249 or 249.00. Whole Ringgit and sen only.";
    } else if (values.compareAtAmount.trim()) {
      const compareAt = parseRinggitToSen(values.compareAtAmount);
      if (compareAt === null) {
        errors.compareAtAmount = "Enter a valid original price, or leave it blank.";
      } else if (compareAt <= amount) {
        errors.compareAtAmount =
          "The original price must be higher than the selling price. No fake discounts.";
      }
    }
  } else if (values.compareAtAmount.trim()) {
    errors.compareAtAmount = "Clear the original price when the item is price on request.";
  }

  const stock = Number(values.stock);
  if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a whole number, 0 or more.";
  }

  // Published products must be complete enough to be useful to a customer.
  if (values.status === "published") {
    if (!values.hasImage) {
      errors.hasImage = "A product photo is required before publishing. Save as a draft until you have one.";
    }
    if (!values.seoTitleEn.trim()) errors.seoTitleEn = "Required before publishing.";
    if (!values.seoTitleMs.trim()) errors.seoTitleMs = "Required before publishing.";
    if (!values.seoTitleZh.trim()) errors.seoTitleZh = "Required before publishing.";
    if (!values.seoDescriptionEn.trim()) errors.seoDescriptionEn = "Required before publishing.";
    if (!values.seoDescriptionMs.trim()) errors.seoDescriptionMs = "Required before publishing.";
    if (!values.seoDescriptionZh.trim()) errors.seoDescriptionZh = "Required before publishing.";
  }

  return errors;
}

export function hasProductFormErrors(errors: ProductFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Convert validated form values into a product record.
 *
 * Only call after `validateProductForm` passes. Variant stock is applied to
 * every existing variant, since the form edits stock at product level; per
 * variant stock editing is a later refinement.
 */
export function formToProduct(values: ProductFormValues, existing?: Product): Product {
  const price =
    values.priceMode === "fixed"
      ? {
          kind: "fixed" as const,
          amountSen: parseRinggitToSen(values.priceAmount)!,
          currency: "MYR" as const,
          compareAtSen: values.compareAtAmount.trim()
            ? (parseRinggitToSen(values.compareAtAmount) ?? undefined)
            : undefined,
        }
      : ({ kind: "on-request" } as const);

  const stock = Number(values.stock);
  const description = (text: string) =>
    text
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean);

  const base = existing ?? {
    id: values.id || slugify(values.slugEn),
    category: values.category as CategoryId,
    colours: [{ id: "default", name: { en: "As shown", ms: "Seperti ditunjukkan", zh: "如图所示" } }],
    sizes: [],
    variants: [],
    images: [],
    specifications: [],
    faqs: { en: [], ms: [], zh: [] },
    relatedProductIds: [],
    order: 100,
  };

  return {
    ...base,
    id: values.id || base.id,
    category: values.category as CategoryId,
    status: values.status,
    leatherType: values.leatherType as LeatherType,
    slug: {
      en: values.slugEn.trim(),
      ms: values.slugMs.trim(),
      zh: values.slugZh.trim(),
    },
    name: {
      en: values.nameEn.trim(),
      ms: values.nameMs.trim(),
      zh: values.nameZh.trim(),
    },
    shortDescription: {
      en: values.shortDescriptionEn.trim(),
      ms: values.shortDescriptionMs.trim(),
      zh: values.shortDescriptionZh.trim(),
    },
    description: {
      en: description(values.descriptionEn),
      ms: description(values.descriptionMs),
      zh: description(values.descriptionZh),
    },
    price,
    sku: values.sku.trim(),
    variants:
      base.variants.length > 0
        ? base.variants.map((variant) => ({ ...variant, stock }))
        : [
            {
              id: `${values.id || slugify(values.slugEn)}-default`,
              colourId: "default",
              stock,
              sku: values.sku.trim(),
            },
          ],
    merchandising: {
      featured: values.featured,
      newArrival: values.newArrival,
      bestseller: values.bestseller,
    },
    seo: {
      title: {
        en: values.seoTitleEn.trim(),
        ms: values.seoTitleMs.trim(),
        zh: values.seoTitleZh.trim(),
      },
      description: {
        en: values.seoDescriptionEn.trim(),
        ms: values.seoDescriptionMs.trim(),
        zh: values.seoDescriptionZh.trim(),
      },
    },
  };
}

/** Labels for the admin UI, in the owner's working language (English). */
export const adminLabels = {
  categories: categories.map((category) => ({
    id: category.id,
    label: category.name.en,
  })),
  leatherTypes: [
    { id: "full-grain", label: "Full grain" },
    { id: "top-grain", label: "Top grain" },
  ],
} as const;

export type AdminLocale = Locale;
