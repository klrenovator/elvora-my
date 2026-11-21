/**
 * Single source of truth for the site's language configuration.
 *
 * The storefront ships exactly three languages. Every public route exists once
 * per language with its own URL, so this file is the anchor for routing,
 * hreflang, sitemaps and the language switcher.
 */

export const locales = ["en", "ms", "zh"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * hreflang values. Malaysia is the only market, so each language is paired with
 * the MY region. Simplified Chinese is expressed with the script subtag so
 * search engines do not have to guess between Hans and Hant.
 */
export const hreflang: Record<Locale, string> = {
  en: "en-MY",
  ms: "ms-MY",
  zh: "zh-Hans-MY",
};

/** Human labels. Always written in the language itself (never translated). */
export const localeName: Record<Locale, string> = {
  en: "English",
  ms: "Bahasa Melayu",
  zh: "中文",
};

/** Short label for compact switchers. */
export const localeShort: Record<Locale, string> = {
  en: "EN",
  ms: "BM",
  zh: "中文",
};

/** Open Graph locale codes. */
export const ogLocale: Record<Locale, string> = {
  en: "en_MY",
  ms: "ms_MY",
  zh: "zh_MY",
};

/** BCP-47 tags for the <html lang> attribute. */
export const htmlLang: Record<Locale, string> = {
  en: "en-MY",
  ms: "ms-MY",
  zh: "zh-Hans-MY",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function assertLocale(value: string): Locale {
  if (!isLocale(value)) {
    throw new Error(`Unsupported locale: ${value}`);
  }
  return value;
}

/** Locale used for number/date formatting. */
export function intlLocale(locale: Locale): string {
  switch (locale) {
    case "ms":
      return "ms-MY";
    case "zh":
      return "zh-Hans-MY";
    default:
      return "en-MY";
  }
}
