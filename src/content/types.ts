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
