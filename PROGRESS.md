# Elvora.my — Build Progress

This file is the single source of truth for what has been built, what has been
verified, and what comes next. Update it at the end of every working session.

**Last updated:** Phase 2c completed (admin product management).

---

## Current status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Foundation: architecture, design system, i18n, 7 categories, static pages, homepage, SEO infrastructure | ✅ Complete |
| 2 | E-commerce | 🔶 In progress |
| 2a | Product model, product pages, manual pricing engine, variant/availability display | ✅ Complete |
| 2b | Cart, checkout handoff, Malaysian address validation | ✅ Complete |
| 2c | Admin product management screen (add/edit/publish/pricing) | ✅ Complete (persistence decision pending) |
| 2d | Payment provider integration (FPX / cards / DuitNow), order records | ⬜ Next — blocked on owner's merchant account |
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

## Phase 2a — product model and manual pricing (completed)

### Data model (`src/content/types.ts`)
`Product` covers every field the brief requires: per-language slug, name, short
and long descriptions, leather type, images with alt text and a placeholder
flag, colour and size options, variants with per-combination stock, grouped
specifications, SKU, merchandising flags (featured / new arrival / bestseller),
per-language SEO title and description, product FAQs, related products, status
and display order.

**Price is a union, not a nullable number:**

```ts
type PriceState =
  | { kind: "on-request" }
  | { kind: "fixed"; amountSen: number; currency: "MYR"; compareAtSen?: number };
```

Modelling "no price" as an explicit state makes "unpriced" impossible to
confuse with `0`, `null` or a missing field.

### Pricing engine (`src/lib/pricing.ts`)
The only place a price string is ever produced, so the "never invent a price"
rule has exactly one implementation to audit.

- `resolvePrice()` → `on-request` or a formatted `RM` amount.
- Invalid data (`0`, negative, `NaN`, `Infinity`) falls back to **on-request**,
  never to a number.
- `compareAtSen` is honoured **only** when genuinely higher than the selling
  price. A lower or equal value is discarded, so a fake discount cannot be
  manufactured by bad data.
- `resolveAvailability()` reports `in-stock` / `partially-available` /
  `out-of-stock` / `unconfigured` from real per-variant stock.
- Unpriced items are never orderable, even when stock exists.

### Product pages
- Localized URLs: `/en/products/…`, `/ms/produk/…`, `/zh/chan-pin/…`, 21 pages
  pre-rendered. A wrong catalog segment (e.g. `/en/produk/…`) returns 404.
- Gallery, leather-grade badge, variant selector with per-size availability,
  grouped specifications, product FAQs, related products and same-category
  siblings.
- The language switcher resolves the **equivalent product slug**, verified in
  tests for all three directions.
- `offers` in Product structured data is emitted **only** when a real price
  exists; unpriced products get valid Product markup without an offer.

### Seed catalogue (7 products, one per category)
`src/content/products.ts` — every entry is `on-request` with zero stock. This is
deliberate: it proves the price-on-request path end to end before any real
price exists. Measurements the owner has not confirmed are marked
"being measured" rather than invented.

### Build-time guard (`src/lib/validate-catalogue.ts`)
`assertCatalogueValid()` runs during page generation and fails the build on:
non-approved categories, missing per-language slugs, non-positive fixed prices,
fake discounts, unknown colour/size references, invalid stock, missing images,
missing SKU, and cross-language slug collisions.

### Tests (30 assertions, `npm test`)
Three suites: pricing engine (21), catalogue validation (9), language switching
(8). Highlights: fake discounts rejected, corrupt values fall back to
on-request, unpriced items not orderable, slug translation correct in every
direction, unknown product yields no link.

**Bug found and fixed during testing:** `Intl.NumberFormat` with `narrowSymbol`
inserts a non-breaking space (U+00A0) in the Malay locale. It renders
identically but would break string comparison and any downstream export, so
`formatSen()` now normalises it to a regular space.

## Phase 2b — cart and checkout (completed)

### Cart (`src/lib/cart-store.ts`)
React-free so the commercial rules can be tested directly.

- **Unpriced products cannot enter the cart.** `addLine` re-checks the price and
  refuses with reason `not-priced`. There is nothing to charge, so allowing it
  would create an unpayable basket.
- **Price changes are surfaced, never silently applied.** Each line stores the
  price it was added at; `reconcile()` compares that snapshot with the live
  price and raises `price-changed`. The customer sees the new total and must
  explicitly accept it before checkout unlocks.
- **Tampering cannot lower a price.** `localStorage` is user-editable, so the
  stored snapshot is only ever used to *detect* change — totals always come from
  the live catalogue. Editing the stored price produces a visible notice, not a
  discount.
- **Quantities are clamped to real stock**, and a deleted or unpublished product
  is flagged `unavailable` and contributes nothing to the subtotal.
- `parseStoredCart()` validates every field: wrong types, negative quantities,
  absurd quantities and non-objects are dropped.
- The catalogue lookup is **injectable** (`reconcile(cart, lookup)`), which is
  what made the cart testable now and will let it read admin-edited data later.

### Checkout (`src/lib/address.ts`, `src/components/checkout-form.tsx`)
- Guest checkout, no account required.
- Malaysian validation: phone (accepts `012-345 6789`, `+60 12 345 6789`,
  `60123456789`), 5-digit postcode, email, and a state from the official
  16-state/territory list including all three federal territories.
- East Malaysia (Sabah, Sarawak, Labuan) triggers an accurate note that rates are
  higher — without quoting a figure we cannot verify.
- **Payment is not connected and says so.** The button reads "Send this order as
  an enquiry", the form produces a copyable order summary, and nothing is
  submitted to a server. No payment is taken and no order is implied.
- The presentational layer (`CheckoutFields`) is separated from the cart-aware
  container so its markup and validation rendering can be rendered and verified
  without a browser.

### Localized URLs
`/en/cart` · `/ms/troli` · `/zh/gou-wu-che`
`/en/checkout` · `/ms/pembayaran` · `/zh/jie-zhang`

Cart and checkout are `noindex` and excluded from the sitemap, since they carry
no standalone search value and would compete with category pages.

## Verified in this session

| Check | Result |
| --- | --- |
| `npm run build` | ✅ 84 routes, all static |
| `npm test` | ✅ 145 assertions pass |
| Cart/checkout URLs in all 3 languages | ✅ 200, correct localized H1 |
| Cart + checkout noindex | ✅ `noindex, follow` |
| Cart/checkout absent from sitemap | ✅ verified |
| Unpriced product refused by cart | ✅ reason `not-priced` |
| Price change detected, not applied silently | ✅ total uses current price |
| Tampered localStorage cannot cut price | ✅ raises notice instead |
| East Malaysia note only for SBH/SWK/LBN | ✅ verified per state |
| Payment honesty notice in en/ms/zh | ✅ verified server-rendered |
| Product pages (all 3 languages) | ✅ 200, with correct localized slugs |
| Wrong catalog segment (`/en/produk/…`) | ✅ 404 |
| Unpriced product shows "Price on request" | ✅ in en, ms, zh |
| No currency string leaks on unpriced products | ✅ verified by grep |
| No `offers` schema without a real price | ✅ verified |
| Language switch across product pages | ✅ correct slug in all directions |
| Sitemap | ✅ 72 URLs incl. all products |
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

1. **Catalogue edits do not persist yet.** The content is compiled into the
   build and no database is connected, so the admin is read-only by design. The
   repository interface and the UI are finished; connecting a database is the
   remaining step (see "Open question").
2. **No payments or orders.** Phase 2d. Payment providers (FPX/cards/DuitNow)
   need owner-supplied merchant accounts. Nothing claims a payment path is live.
3. **Images cannot be uploaded from the admin.** A product photo can only be
   added in the repository, so publishing requires one to exist already. Upload
   needs a storage bucket and is deliberately not faked.
4. **The login rate limit is per instance and in memory.** It resets on
   redeploy and is not shared between serverless instances. Adequate for a
   single owner; documented rather than overbuilt.
5. **WhatsApp, phone and email are unset** in `src/lib/site.ts`. The UI detects
   this and renders a "being finalised" notice instead of a dead link. Nothing
   invented.
6. **Location pages not built.** The geo database and page architecture are
   Phase 4; building them before products exist would produce thin pages.
7. **OG image** currently reuses the hero photograph; a dedicated 1200×630
   branded banner is pending (image generation limit reached this turn).
8. **No analytics or consent banner yet.** Phase 6.
9. **No Vietnamese/other locales** — intentionally exactly three.

---

## Open question — catalogue persistence

The admin UI, validation and authorisation are complete and verified. What is
**not** decided is where saved products live. Two honest options:

| Option | What it means | Cost | Trade-off |
| --- | --- | --- | --- |
| **A. Keep compiled content** | Owner edits `src/content/products.ts`, commits, redeploys. The `/admin` screen stays a review-and-validate tool. | Free | Every price change is a deploy; no non-technical editing. |
| **B. Connect Vercel Postgres / Neon** | Implement `PostgresProductRepository`, set `DATABASE_URL`. The admin becomes a real CMS. | ~$0–20/month at this scale | A managed database to back up and maintain. |

Nothing further is blocked by this except the write path itself: the storefront,
cart and checkout read through the same interface, so either choice is a
one-file change. **Recommendation: option B**, because the whole point of the
Phase 2c screen is to let the owner change a price without a developer. This
needs the owner's decision on hosting cost.

---

## Next task

**Phase 2d — payment integration.** Blocked until the owner supplies a merchant
account (FPX / cards / DuitNow). Until then `/checkout` deliberately ends at an
honest "payment not yet live" state rather than a fake success page.

Work that can proceed without a merchant account:
1. Order records and an order-number scheme, so a paid order has somewhere to go.
2. Server-side re-pricing at checkout (never trust a client total).
3. A provider-agnostic payment interface, mirroring the repository pattern, so
   the provider is a single implementation once credentials exist.
