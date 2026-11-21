# Elvora.my — Build Progress

This file is the single source of truth for what has been built, what has been
verified, and what comes next. Update it at the end of every working session.

**Last updated:** Phase 1 completed.

---

## Current status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Foundation: architecture, design system, i18n, 7 categories, static pages, homepage, SEO infrastructure | ✅ Complete |
| 2 | E-commerce: product model, product pages, manual pricing, cart, checkout, orders | ⬜ Not started |
| 3 | Multilingual completion for commerce surfaces (cart, checkout, forms, admin) | ⬜ Blocked by Phase 2 |
| 4 | Nationwide location SEO: Malaysia geo database, location pages, internal linking | ⬜ Not started |
| 5 | Content marketing, AEO/GEO/LLMO assets, articles | ⬜ Deferred until Phase 2–4 |
| 6 | Conversion and leads: WhatsApp, live chat, enquiry flows, analytics | ⬜ Partially — contact route exists, channels pending |
| 7 | Full QA, performance, launch | ⬜ Not started |

---

## Phase 1 — what was built

### Architecture
- **Next.js 16 App Router**, React 19, TypeScript strict, Tailwind CSS v4.
- **Locale-first routing**: every public page lives under `/[locale]/…`.
  - `/en/…` English · `/ms/…` Bahasa Melayu · `/zh/…` Simplified Chinese
- **Localized slugs per language**, not transliterated English:
  - `/en/mens-wallets` ↔ `/ms/dompet-lelaki` ↔ `/zh/nan-shi-qian-bao`
  - `/en/leather-guide` ↔ `/ms/panduan-kulit` ↔ `/zh/pi-ge-zhi-nan`
  - Full table in `src/lib/routes.ts`.
- **Language switcher resolves the equivalent page** using a route-pattern
  matcher (`matchPath` / `switchPath`), so switching language keeps the visitor
  on the same category or page instead of dumping them on the homepage. It
  degrades to a disabled label when no equivalent is registered — never a
  broken link. Links are real `<a>` elements, so it works without JS.
- **Language entry routing** in `src/proxy.ts`: `/` → remembered language
  (cookie) → weak `Accept-Language` hint → English. No geolocation, because
  most Malaysian shoppers search in English; language stays a user choice.
  Locale-less paths 308-redirect to the resolved locale.
- **`dynamicParams = false`** on the content route, so 47 category/page URLs are
  pre-rendered and unknown slugs return a real 404 rather than an on-demand page.

### Content
- **Seven categories, exactly** — no extra taxonomy:
  men's wallets, men's belts, ladies' handbags, ladies' belts, dog collars,
  dog leashes, dog collar & leash sets.
- Every category has, **independently written in all three languages**:
  positioning line, three-paragraph introduction, three FAQ pairs, four buying
  guidance points, meta title, meta description and image alt text.
- **Nine editorial/policy pages**, also fully trilingual: About, Leather guide
  (full grain vs top grain), Leather care, Contact, Shipping, Returns, FAQ,
  Privacy (PDPA), Terms.
- Content is written to describe only verifiable facts. No invented prices,
  stock, reviews, certifications, awards, delivery times or branches.

### Design
- Token-driven design system in `src/app/globals.css` (`@theme`): leather
  palette (ivory → cream → sand → tan → cognac → chocolate → espresso), a
  display serif (Cormorant Garamond) paired with a geometric sans (Jost),
  spacing and easing tokens.
- **Every colour, font and radius is a token**, and the temporary wordmark is a
  single component (`src/components/logo.tsx`) — the final brand identity can
  drop in without touching page markup.
- Chinese typography handled explicitly: a CJK font stack override for
  `lang^="zh"` on both body and display faces, so no tofu glyphs.
- Responsive from 320 px upward; sticky header, desktop mega-panel, mobile
  drawer, accessible FAQ accordion, breadcrumbs, skip link, reduced-motion
  support.

### SEO infrastructure
- **Self-referencing canonical** on every page.
- **Reciprocal hreflang** per page: `en-MY`, `ms-MY`, `zh-Hans-MY` plus
  `x-default` → English.
- **Multilingual sitemap** (`/sitemap.xml`) — 30 URLs, each carrying the full
  alternate set.
- **robots.txt** with sitemap reference and disallow rules for future
  `/api/`, `/admin/`, `/checkout/`, `/cart/`, `/account/` paths.
- **Structured data**: Organization, WebSite, BreadcrumbList, CollectionPage,
  ItemList, FAQPage. Product/Offer schema deliberately **not** emitted yet —
  there are no products or prices, and inventing them would be worse than
  omitting them.
- **`/llms.txt`** describing the catalogue, the seven categories, pricing
  policy, languages and explicit "do not assume" guidance for AI assistants.
- Metadata helpers centralised in `src/lib/seo.ts`.

### Images
- 10 temporary AI-generated illustrations: 7 categories, 1 hero, 2 leather
  macro shots.
- **Placeholder status is disclosed in three places**: a badge on each image, a
  notice in the footer, and text in FAQ/About/Terms. Images are addressed by
  stable paths (`/images/categories/<id>.jpg`), so replacing an original
  photograph is a file swap with no code change.

---

## Verified in this session

| Check | Result |
| --- | --- |
| `npm run build` | ✅ 57 routes, all static |
| `npm run typecheck` | ✅ no errors |
| `npm run lint` | ✅ no errors |
| `/` → locale redirect | ✅ 308 → `/en` |
| All three home pages | ✅ 200 |
| Localized category URLs (`/ms/dompet-lelaki`, `/zh/nan-shi-qian-bao`) | ✅ 200 |
| Unknown slug | ✅ real 404 |
| Canonical tag | ✅ self-referencing, absolute |
| hreflang set | ✅ 4 alternates incl. `x-default` |
| `<html lang>` | ✅ `zh-Hans-MY` on Chinese pages |
| sitemap.xml | ✅ valid, alternates present |
| robots.txt, llms.txt | ✅ served |
| Exactly one `<h1>` per page | ✅ |
| Compiled CSS contains design tokens | ✅ verified |
| All 10 images resolve | ✅ |

**Not verifiable in this environment:** visual/pixel rendering. Headless
browser downloads are blocked in this sandbox, so layout was validated by
reading generated HTML and the compiled CSS rather than screenshots. This
should be eyeballed on a real device in the next session.

---

## Known gaps and deliberate deferrals

1. **No products yet.** The catalogue model, product pages, variations and
   manual pricing are Phase 2. This is the single biggest remaining block.
2. **No cart, checkout, payments or orders.** Phase 2. Payment providers
   (FPX/cards/DuitNow) need owner-supplied merchant accounts.
3. **WhatsApp, phone and email are unset** in `src/lib/site.ts`. The UI detects
   this and renders a "being finalised" notice instead of a dead link. Nothing
   invented.
4. **Location pages not built.** The geo database and page architecture are
   Phase 4; building them before products exist would produce thin pages.
5. **OG image** currently reuses the hero photograph; a dedicated 1200×630
   branded banner is pending (image generation limit reached this turn).
6. **No analytics or consent banner yet.** Phase 6.
7. **No Vietnamese/other locales** — intentionally exactly three.

---

## Next task

**Phase 2, step 1 — product data model and manual pricing engine.**

1. Define the `Product` type covering every field the master prompt requires:
   name, category, descriptions (long + short), images, leather type, colour and
   size options, specifications, SKU, stock, variations, status (draft/published),
   featured/new/bestseller flags, per-language SEO title, meta description,
   slug, image alt text, product FAQs, related products, **manual price** and
   optional discounted price.
2. Implement `priceOnRequest` behaviour: no price → "Price on Request" in all
   three languages, and no `Offer` in structured data.
3. Model six trilingual seed products (one per category plus a set) **with no
   prices entered**, proving the price-on-request path before any number is set
   by the owner.
4. Build the product page with localized URLs (`/en/products/…`,
   `/ms/produk/…`, `/zh/chan-pin/…`) and per-variant availability display.
