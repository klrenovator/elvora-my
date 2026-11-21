import type { Locale } from "@/i18n/config";

/** The seven permitted product categories. Nothing else may be added. */
export type CategoryId =
  | "mens-wallets"
  | "mens-belts"
  | "ladies-handbags"
  | "ladies-belts"
  | "dog-collars"
  | "dog-leashes"
  | "dog-collar-leash-sets";

/** Collection grouping used for navigation only (not a product category). */
export type CollectionId = "men" | "women" | "pets";

/** Leather specifications the administrator may select for a product. */
export type LeatherType = "full-grain" | "top-grain";

export type Localized<T> = Record<Locale, T>;

/** Per-language URL slug. Every language gets a natural, readable slug. */
export type LocalizedSlug = Record<Locale, string>;

export interface Category {
  id: CategoryId;
  collection: CollectionId;
  /** Slug used inside each language's category path. */
  slug: LocalizedSlug;
  name: Localized<string>;
  /** One-line positioning statement shown on cards and in metadata. */
  tagline: Localized<string>;
  /** Search-intent aligned page title suffix (kept natural, not keyword stuffed). */
  metaTitle: Localized<string>;
  metaDescription: Localized<string>;
  /** Editorial introduction, two or three paragraphs per language. */
  intro: Localized<string[]>;
  /** Practical buying guidance. Three to five short points. */
  guidance: Localized<string[]>;
  /** Question and answer pairs rendered as an accessible accordion. */
  faqs: Localized<{ q: string; a: string }[]>;
  /** Placeholder artwork until original photography is supplied. */
  image: string;
  imageAlt: Localized<string>;
  /** Ordering for navigation and listings. */
  order: number;
}

export type PageKey =
  | "about"
  | "contact"
  | "shipping"
  | "returns"
  | "faq"
  | "leather-guide"
  | "care-guide"
  | "dog-sizing"
  | "privacy"
  | "terms";

export interface StaticPage {
  key: PageKey;
  slug: LocalizedSlug;
  title: Localized<string>;
  metaTitle: Localized<string>;
  metaDescription: Localized<string>;
  intro: Localized<string>;
}

/* -------------------------------------------------------------------------- */
/*                                 Products                                   */
/* -------------------------------------------------------------------------- */

/** Publication state. Only `published` products may be listed or indexed. */
export type ProductStatus = "draft" | "published";

export type CurrencyCode = "MYR";

/**
 * Price is deliberately a union rather than a nullable number.
 *
 * The business rule is that no price may ever be generated, estimated or
 * defaulted — it exists only because an administrator typed it. Modelling
 * "no price" as an explicit state (instead of `0` or `undefined`) makes it
 * impossible to publish a product that silently shows a made-up amount.
 */
export type PriceState =
  | { kind: "on-request" }
  | {
      kind: "fixed";
      /** Minor units (sen). Integer to avoid floating point drift. */
      amountSen: number;
      currency: CurrencyCode;
      /**
       * Optional administrator-entered promotional price. Only valid when
       * lower than `amountSen`. No discount is ever computed automatically.
       */
      compareAtSen?: number;
    };

export interface ColourOption {
  id: string;
  name: Localized<string>;
  /** Optional swatch colour for the UI. Never implies stock availability. */
  swatch?: string;
}

export interface SizeOption {
  id: string;
  /** Language-neutral measurement label, e.g. "85 cm" or "Neck 30–36 cm". */
  label: string;
  /** Optional explanatory note shown under the option. */
  note?: Localized<string>;
}

/**
 * A purchasable combination. Stock is tracked here so a size can sell out
 * without the whole product disappearing.
 */
export interface ProductVariant {
  id: string;
  colourId: string;
  sizeId?: string;
  /** Administrator-maintained stock count for this combination. */
  stock: number;
  sku?: string;
}

export interface SpecificationGroup {
  group: Localized<string>;
  items: { label: Localized<string>; value: Localized<string> }[];
}

export interface Product {
  id: string;
  category: CategoryId;
  status: ProductStatus;
  /** Per-language, human-readable URL slug. */
  slug: LocalizedSlug;
  name: Localized<string>;
  /** One or two sentences used on cards and in listings. */
  shortDescription: Localized<string>;
  /** Full description, rendered as paragraphs. */
  description: Localized<string[]>;
  /** Administrator-confirmed leather grade; never inferred or defaulted. */
  leatherType: LeatherType;
  price: PriceState;
  /** Base SKU. Variants may override it. */
  sku: string;
  colours: ColourOption[];
  sizes: SizeOption[];
  variants: ProductVariant[];
  specifications: SpecificationGroup[];
  images: {
    src: string;
    alt: Localized<string>;
    /** True while the image is a temporary illustration, not a photo. */
    placeholder: boolean;
  }[];
  merchandising: {
    featured: boolean;
    newArrival: boolean;
    bestseller: boolean;
  };
  seo: {
    title: Localized<string>;
    description: Localized<string>;
  };
  faqs: Localized<{ q: string; a: string }[]>;
  /** Product ids. Resolved defensively so a deleted product never breaks a page. */
  relatedProductIds: string[];
  /** Editorial ordering, ascending. */
  order: number;
}
