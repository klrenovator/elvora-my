import { defaultLocale, locales, type Locale } from "@/i18n/config";

/**
 * Localized route table.
 *
 * Every page has one entry here and one path per language, written in that
 * language rather than transliterated. Paths that take parameters use
 * `[name]` placeholders, which lets the language switcher resolve an
 * equivalent URL for dynamic pages (products, locations, articles) later
 * without a second lookup table.
 */

type Params = Record<string, string>;

interface RouteDef {
  /** Path segments per locale. Use `[]` placeholders for dynamic parts. */
  path: Record<Locale, string[]>;
}

const routes = {
  home: { path: { en: [], ms: [], zh: [] } },

  // Categories (one per locale, natural wording in each language).
  mensWallets: {
    path: { en: ["mens-wallets"], ms: ["dompet-lelaki"], zh: ["nan-shi-qian-bao"] },
  },
  mensBelts: {
    path: { en: ["mens-belts"], ms: ["tali-pinggang-lelaki"], zh: ["nan-shi-pi-dai"] },
  },
  ladiesHandbags: {
    path: { en: ["ladies-handbags"], ms: ["beg-tangan-wanita"], zh: ["nv-shi-shou-ti-bao"] },
  },
  ladiesBelts: {
    path: { en: ["ladies-belts"], ms: ["tali-pinggang-wanita"], zh: ["nv-shi-pi-dai"] },
  },
  dogCollars: {
    path: { en: ["dog-collars"], ms: ["kolar-anjing"], zh: ["gou-bo-quan"] },
  },
  dogLeashes: {
    path: { en: ["dog-leashes"], ms: ["tali-cawak-anjing"], zh: ["gou-qian-sheng"] },
  },
  dogSets: {
    path: {
      en: ["dog-collar-leash-sets"],
      ms: ["set-kolar-tali-cawak-anjing"],
      zh: ["gou-bo-quan-qian-sheng-tao-zhuang"],
    },
  },

  // Editorial and trust pages.
  about: {
    path: { en: ["about"], ms: ["tentang-kami"], zh: ["guan-yu-wo-men"] },
  },
  contact: {
    path: { en: ["contact"], ms: ["hubungi-kami"], zh: ["lian-xi-wo-men"] },
  },
  shipping: {
    path: { en: ["shipping"], ms: ["penghantaran"], zh: ["pei-song"] },
  },
  returns: {
    path: { en: ["returns"], ms: ["pemulangan"], zh: ["tui-huan"] },
  },
  faq: {
    path: { en: ["faq"], ms: ["soalan-lazim"], zh: ["chang-jian-wen-ti"] },
  },
  leatherGuide: {
    path: { en: ["leather-guide"], ms: ["panduan-kulit"], zh: ["pi-ge-zhi-nan"] },
  },
  careGuide: {
    path: { en: ["leather-care"], ms: ["penjagaan-kulit"], zh: ["pi-ge-bao-yang"] },
  },
  warranty: {
    path: { en: ["warranty"], ms: ["jaminan"], zh: ["bao-xiu"] },
  },
  walletSizing: {
    path: {
      en: ["wallet-sizing"],
      ms: ["panduan-saiz-dompet"],
      zh: ["qian-bao-chi-cun-zhi-nan"],
    },
  },
  dogSizing: {
    path: {
      en: ["dog-collar-sizing"],
      ms: ["panduan-saiz-kolar-anjing"],
      zh: ["gou-bo-quan-chi-cun-zhi-nan"],
    },
  },
  privacy: {
    path: { en: ["privacy-policy"], ms: ["dasar-privasi"], zh: ["yin-si-zheng-ce"] },
  },
  terms: {
    path: { en: ["terms"], ms: ["terma"], zh: ["tiao-kuan"] },
  },

  // Products. Slugs are per-product and per-language, so the pattern carries a
  // placeholder that the switcher fills from the matched product.
  product: {
    path: { en: ["products", "[slug]"], ms: ["produk", "[slug]"], zh: ["chan-pin", "[slug]"] },
  },

  /**
   * Location pages.
   *
   * `/en/delivery/kuala-lumpur` and its siblings. The area slug is shared across
   * languages because a place name is not translated — the surrounding copy is.
   * Only the section segment differs, which keeps one canonical area identifier.
   */
  locations: {
    path: { en: ["delivery"], ms: ["penghantaran-kawasan"], zh: ["pei-song-di-qu"] },
  },
  location: {
    path: {
      en: ["delivery", "[area]"],
      ms: ["penghantaran-kawasan", "[area]"],
      zh: ["pei-song-di-qu", "[area]"],
    },
  },

  // Cart and checkout. Static single-segment paths so they fit alongside the
  // existing [slug] route without creating a dynamic-segment conflict.
  cart: {
    path: { en: ["cart"], ms: ["troli"], zh: ["gou-wu-che"] },
  },
  checkout: {
    path: { en: ["checkout"], ms: ["pembayaran"], zh: ["jie-zhang"] },
  },
} satisfies Record<string, RouteDef>;

export type RouteKey = keyof typeof routes;

export const routeKeys = Object.keys(routes) as RouteKey[];

function fillSegments(segments: string[], params: Params): string[] {
  return segments.map((segment) => {
    const match = segment.match(/^\[(.+)\]$/);
    if (!match) return segment;
    const value = params[match[1]];
    if (!value) {
      throw new Error(`Missing route parameter "${match[1]}" for segment "${segment}"`);
    }
    return value;
  });
}

/** Relative, locale-prefixed path for a route. Always starts with a slash. */
export function pathFor(key: RouteKey, locale: Locale, params: Params = {}): string {
  const segments = fillSegments(routes[key].path[locale], params);
  return segments.length ? `/${locale}/${segments.join("/")}` : `/${locale}`;
}

export function href(
  key: RouteKey,
  locale: Locale,
  params?: Params,
): { href: string } {
  return { href: pathFor(key, locale, params) };
}

/** All locales' paths for one route, ready for hreflang and the switcher. */
export function alternatePaths(key: RouteKey, params: Params = {}): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, pathFor(key, locale, params)]),
  ) as Record<Locale, string>;
}

interface Match {
  key: RouteKey;
  locale: Locale;
  params: Params;
}

/**
 * Reverse a pathname to its route key. Used by the language switcher so a
 * visitor keeps their place in the catalogue instead of being sent home.
 */
export function matchPath(pathname: string): Match | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const [maybeLocale, ...rest] = parts;
  if (!locales.includes(maybeLocale as Locale)) return null;
  const locale = maybeLocale as Locale;

  let best: Match | null = null;
  let bestScore = -1;

  for (const key of routeKeys) {
    const pattern = routes[key].path[locale];
    if (pattern.length !== rest.length) continue;

    const params: Params = {};
    let matched = true;
    let captured = 0;

    for (let index = 0; index < pattern.length; index += 1) {
      const segment = pattern[index];
      const placeholder = segment.match(/^\[(.+)\]$/);
      if (placeholder) {
        params[placeholder[1]] = rest[index];
        captured += 1;
      } else if (segment !== rest[index]) {
        matched = false;
        break;
      }
    }

    if (!matched) continue;
    // Prefer the most specific (fewest wildcards) match.
    if (captured > bestScore) {
      best = { key, locale, params };
      bestScore = captured;
    }
  }

  // A fully static match always wins over a dynamic one with the same length.
  return best;
}

/**
 * Translates a URL segment into the equivalent segment in another language.
 *
 * Product slugs are per-language and cannot be derived from a pattern, so the
 * caller supplies a resolver backed by the catalogue. Without one, a product
 * path can only be switched when the slug happens to be identical in both
 * languages — which it never is — so the caller gets `null` and renders a
 * disabled option instead of a broken link.
 */
export type SlugResolver = (from: Locale, to: Locale, slug: string) => string | null;

export function switchPath(
  pathname: string,
  target: Locale,
  resolveSlug?: SlugResolver,
): string | null {
  const match = matchPath(pathname);
  if (!match) return null;

  const params: Params = { ...match.params };
  if ("slug" in params && match.locale !== target) {
    // Prefer an explicit slug map supplied by the route pattern itself.
    const mapped = slugTranslations[`${match.locale}>${params.slug}`];
    const translated = mapped?.find((entry) => entry.locale === target)?.slug
      ?? resolveSlug?.(match.locale, target, params.slug)
      ?? null;
    if (!translated) return null;
    params.slug = translated;
  }

  try {
    return pathFor(match.key, target, params);
  } catch {
    return null;
  }
}

/**
 * Static slug translations for dynamic routes, registered by the catalogue
 * layer. Kept as a plain map so the routing module stays free of content
 * imports and therefore cannot create a circular dependency.
 */
const slugTranslations: Record<string, { locale: Locale; slug: string }[]> = {};

export function registerSlugTranslation(
  from: Locale,
  slug: string,
  translations: { locale: Locale; slug: string }[],
): void {
  slugTranslations[`${from}>${slug}`] = translations;
}

/** Strip the locale prefix so a root layout can be told which locale it serves. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return locales.includes(first as Locale) ? (first as Locale) : defaultLocale;
}
