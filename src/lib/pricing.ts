import type { Locale } from "@/i18n/config";
import type { PriceState, Product, ProductVariant } from "@/content/types";

/**
 * Pricing and availability engine.
 *
 * Two non-negotiable business rules live here rather than in the UI:
 *
 * 1. A price exists only because an administrator entered it. There is no
 *    fallback, no default, no calculation from cost, and no "contact us" figure
 *    pretending to be a price. `resolvePrice` returns an explicit
 *    `on-request` state and the UI renders "Price on request" accordingly.
 * 2. A discount is never generated. `compareAtSen` is used only when an
 *    administrator typed it AND it is genuinely higher than the selling price.
 *    A bad pair is ignored rather than shown as a fake saving.
 */

export type ResolvedPrice =
  | { kind: "on-request" }
  | {
      kind: "fixed";
      /** Formatted for display, e.g. "RM 249.00". */
      formatted: string;
      /** Raw minor units, for cart maths and structured data. */
      amountSen: number;
      /** Present only for a genuine, administrator-entered promotion. */
      compareAt?: { formatted: string; amountSen: number };
      /** Whole-number percentage, shown only when a real compare-at exists. */
      discountPercent?: number;
    };

const formatterCache = new Map<string, Intl.NumberFormat>();

function formatterFor(locale: Locale): Intl.NumberFormat {
  const intlLocale = locale === "ms" ? "ms-MY" : locale === "zh" ? "zh-Hans-MY" : "en-MY";
  const cached = formatterCache.get(intlLocale);
  if (cached) return cached;
  const created = new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "MYR",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  formatterCache.set(intlLocale, created);
  return created;
}

/**
 * Format minor units as RM.
 *
 * `narrowSymbol` yields "RM" rather than "MYR", and ICU inserts a
 * non-breaking space (U+00A0) after the symbol in the Malay locale, which
 * renders identically but breaks string comparison in tests and in any
 * downstream export (invoices, CSV). Normalised to a regular space here so the
 * output is stable across locales and platforms.
 */
export function formatSen(amountSen: number, locale: Locale): string {
  return formatterFor(locale).format(amountSen / 100).replace(/\u00a0/g, " ");
}

/**
 * Resolve the display price for a product.
 *
 * `formatSen` is injected nowhere and computed nowhere else — this is the only
 * place a price string is produced, so the "never invent a price" guarantee has
 * exactly one implementation to audit.
 */
export function resolvePrice(product: Product, locale: Locale): ResolvedPrice {
  const price: PriceState = product.price;

  if (price.kind === "on-request") {
    return { kind: "on-request" };
  }

  const amountSen = price.amountSen;

  // Guard against corrupt or hand-edited data rather than showing nonsense.
  if (!Number.isFinite(amountSen) || amountSen <= 0) {
    return { kind: "on-request" };
  }

  const resolved: ResolvedPrice = {
    kind: "fixed",
    formatted: formatSen(amountSen, locale),
    amountSen,
  };

  const compareAtSen = price.compareAtSen;
  // A compare-at price is honoured only if it is a real, higher number.
  if (
    typeof compareAtSen === "number" &&
    Number.isFinite(compareAtSen) &&
    compareAtSen > amountSen
  ) {
    resolved.compareAt = {
      formatted: formatSen(compareAtSen, locale),
      amountSen: compareAtSen,
    };
    resolved.discountPercent = Math.round(((compareAtSen - amountSen) / compareAtSen) * 100);
  }

  return resolved;
}

/* ------------------------------- Availability ------------------------------ */

export type AvailabilityState =
  /** No size/colour combinations defined — the product is not yet orderable. */
  | "unconfigured"
  /** Every combination is at zero stock. */
  | "out-of-stock"
  /** At least one combination has stock, but not all of them. */
  | "partially-available"
  /** Every combination has stock. */
  | "in-stock";

export function resolveAvailability(product: Product): AvailabilityState {
  if (product.variants.length === 0) return "unconfigured";
  const inStock = product.variants.filter((variant) => variant.stock > 0).length;
  if (inStock === 0) return "out-of-stock";
  if (inStock === product.variants.length) return "in-stock";
  return "partially-available";
}

export interface AvailabilityCopy {
  label: string;
  /** Longer explanation shown beneath the label. */
  detail: string;
}

/**
 * Availability wording per language. Deliberately concrete — it reports the
 * stock an administrator entered and never promises dispatch or delivery.
 */
export function availabilityCopy(state: AvailabilityState, locale: Locale): AvailabilityCopy {
  const copy: Record<AvailabilityState, Record<Locale, AvailabilityCopy>> = {
    "in-stock": {
      en: { label: "In stock", detail: "Every option below is available to order." },
      ms: { label: "Ada stok", detail: "Semua pilihan di bawah tersedia untuk dipesan." },
      zh: { label: "现货", detail: "以下选项均有货可供订购。" },
    },
    "partially-available": {
      en: {
        label: "Some options in stock",
        detail: "Only the options marked as available can be ordered right now.",
      },
      ms: {
        label: "Sebahagian pilihan ada stok",
        detail: "Hanya pilihan yang ditanda tersedia boleh dipesan sekarang.",
      },
      zh: {
        label: "部分选项有货",
        detail: "目前只有标示为有货的选项可以下单。",
      },
    },
    "out-of-stock": {
      en: {
        label: "Currently unavailable",
        detail: "There is no stock recorded for this item. Message us for the next available date.",
      },
      ms: {
        label: "Tiada stok buat masa ini",
        detail: "Tiada stok direkodkan untuk barang ini. Hubungi kami untuk tarikh ketersediaan seterusnya.",
      },
      zh: {
        label: "目前缺货",
        detail: "这款产品目前没有库存纪录。请联络我们查询下次到货日期。",
      },
    },
    unconfigured: {
      en: {
        label: "Enquire for availability",
        detail: "Options for this item are still being confirmed. Message us and we will check.",
      },
      ms: {
        label: "Tanya ketersediaan",
        detail: "Pilihan untuk barang ini masih dalam pengesahan. Hubungi kami dan kami akan menyemaknya.",
      },
      zh: {
        label: "查询供应情况",
        detail: "这款产品的选项仍在确认中。请联系我们，我们会为你查询。",
      },
    },
  };

  return copy[state][locale];
}

/** Variant-level stock check used by the option selector. */
export function isVariantOrderable(
  variant: ProductVariant | undefined,
  price: ResolvedPrice,
  state: AvailabilityState,
): boolean {
  // An unpriced product cannot be ordered — checkout has nothing to charge.
  if (price.kind !== "fixed") return false;
  if (state === "unconfigured" || state === "out-of-stock") return false;
  return !!variant && variant.stock > 0;
}

/** Published products only. Draft items must never surface in the storefront. */
export function isVisible(product: Product): boolean {
  return product.status === "published";
}
