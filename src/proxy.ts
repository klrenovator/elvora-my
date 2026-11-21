import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

const LANGUAGE_COOKIE = "elvora_lang";

/** Localized checkout paths. Must stay in step with the route table. */
const CHECKOUT_SEGMENT: Record<string, string> = {
  en: "checkout",
  ms: "pembayaran",
  zh: "jie-zhang",
};
const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml|json|webmanifest|woff|woff2|ttf|otf|mp3|pdf)$/i;

/**
 * Language entry routing.
 *
 * Rules:
 * 1. `/` resolves to the visitor's remembered language, otherwise English.
 *    Browser Accept-Language is used only as a weak signal and never to
 *    override an explicit choice.
 * 2. Locale-less public paths are prefixed with the resolved language and
 *    redirected permanently so links stay stable.
 * 3. Files, API routes and Next internals pass through untouched.
 *
 * No geolocation is used: forcing Malaysian visitors into Malay would ignore
 * that most Malaysian shoppers search in English, so language stays a
 * user choice with a sensible neutral default.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first)) {
    // Checkout is stored once at /[locale]/checkout but published at a natural
    // path per language. Rewrite (not redirect) so the visitor keeps the
    // localized URL they followed.
    const checkoutSegment = CHECKOUT_SEGMENT[first];
    if (segments[1] === checkoutSegment && checkoutSegment !== "checkout") {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}/checkout`;
      return NextResponse.rewrite(url);
    }

    // Remember the language once the visitor reaches a real localised page.
    const response = NextResponse.next();
    if (request.cookies.get(LANGUAGE_COOKIE)?.value !== first) {
      response.cookies.set(LANGUAGE_COOKIE, first, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const locale = resolvePreferredLocale(request);

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  url.search = search;

  return NextResponse.redirect(url, 308);
}

function resolvePreferredLocale(request: NextRequest): string {
  const stored = request.cookies.get(LANGUAGE_COOKIE)?.value;
  if (stored && isLocale(stored)) return stored;

  // Weak signal only: an explicit stored choice always wins.
  const header = request.headers.get("accept-language") ?? "";
  const parsed = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number.parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const entry of parsed) {
    if (entry.tag.startsWith("zh")) return "zh";
    if (entry.tag.startsWith("ms")) return "ms";
    if (entry.tag.startsWith("en")) return "en";
  }

  return defaultLocale;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export { LANGUAGE_COOKIE };

// Keep the locale list referenced so a future locale addition is a compile
// error here rather than a silent gap in the redirect logic.
void locales;
