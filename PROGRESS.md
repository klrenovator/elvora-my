# Elvora.my — Build Progress

This file is the single source of truth for what has been built, what has been
verified, and what comes next. Update it at the end of every working session.

**Last updated:** Phase 2d completed (orders, server-side pricing, payment boundary).

---

## Current status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Foundation: architecture, design system, i18n, 7 categories, static pages, homepage, SEO infrastructure | ✅ Complete |
| 2 | E-commerce | 🔶 In progress |
| 2a | Product model, product pages, manual pricing engine, variant/availability display | ✅ Complete |
| 2b | Cart, checkout handoff, Malaysian address validation | ✅ Complete |
| 2c | Admin product management screen (add/edit/publish/pricing) | ✅ Complete (persistence decision pending) |
| 2d | Order records, server-side re-pricing, payment-provider boundary | ✅ Complete |
| 2e | Payment provider implementation (FPX / cards / DuitNow) | ⬜ Blocked on owner's merchant account |
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
## Phase 2d — orders, server-side pricing and the payment boundary (completed)

Payment itself is still blocked on a merchant account, so this phase built the
three parts that are not: real order records, pricing that the browser cannot
tamper with, and a provider boundary the eventual integration drops into.

### Server-side pricing is the authority (`src/lib/order-pricing.ts`)

The cart in the browser is a convenience. Before an order is recorded, every
line is looked up again against the catalogue and priced from source.

- **The client's total is never trusted.** It is compared with the server's and
  a difference is a *refusal*, not an adjustment — silently correcting it would
  mean charging a figure the customer never saw. A hidden field claiming `1`
  sen produces "the order total has changed", not a discount.
- Every rule the cart enforces is re-checked here, because a client-side check
  that matters commercially is only a suggestion: product exists, is published,
  variant still exists, product still has a fixed price, stock covers the
  quantity.
- **One bad line fails the whole order.** Partial acceptance would charge for
  something the customer did not fully agree to.
- Totals are integer sen throughout, so there is no floating-point drift to
  round away.

### Order records (`src/lib/orders.ts`, `src/lib/order-repository.ts`)

- An order **copies** names, SKUs and prices at the moment of ordering rather
  than referencing the product. A later price change must not rewrite history.
- References are `ELV-XXXXXX` from an alphabet with no `0/O` or `1/I`, so they
  can be read over the phone. Not a security token — it identifies an order, it
  does not authorise access to one.
- Shipping is stored as `null`, not `0`, because it is quoted after the order.
  A zero would be a false claim.
- Persistence sits behind the same kind of interface as the catalogue:
  `MemoryOrderRepository` is the default and carries `durable = false`. It is
  real but not permanent, and the confirmation screen and admin both say so.

### Payment boundary (`src/lib/payments/provider.ts`)

- `PaymentProvider` defines `createSession` / `verifyCallback`, and
  `UnconfiguredPaymentProvider` is the only implementation. Every method throws
  rather than returning a plausible stub — a stub returning a fake redirect URL
  is exactly the thing that reaches production and takes money it cannot
  account for.
- `paymentGuards` encodes the rules every future provider must satisfy: a paid
  amount must match the total **exactly** (no tolerance, no partial), and only a
  `pending-payment` order may become paid. Both are tested.
- There is **no code path that marks an order paid** except a verified
  callback. Nothing in the admin offers a manual "mark paid" button.

### Checkout (`src/app/[locale]/checkout/actions.ts`)

The order of operations is the design: validate the address on the server, check
the request shape, re-price from the catalogue, refuse a total disagreement,
then record the order as `pending-payment`. If storage fails, the customer is
told the order could not be recorded and that nothing was been charged — the
one failure mode that matters is reporting success for an order nobody stored.

The confirmation screen shows the reference, states plainly that payment is not
live, and warns when the record is not durable.

### Owner visibility (`/admin/orders`)

An order nobody can read is not much of a record. The owner sees every placed
order with reference, date, customer, destination, item count, total and status.
Read-only by design: status changes belong to a provider callback, not a button.

### Verification

| Check | Result |
| --- | --- |
| Tampered client total (1 sen) | ✅ refused, no order stored |
| Inflated client total | ✅ refused |
| Missing client total | ✅ prices server-side at the real figure |
| Unpriced product cannot be ordered | ✅ `not-priced` |
| Unpublished product refused | ✅ |
| Quantity above stock refused | ✅ `insufficient-stock` |
| One bad line fails the whole order | ✅ |
| Blank name/phone/email/address/postcode/city/state | ✅ refused, field-level |
| Non-Malaysian state refused | ✅ |
| Storage failure | ✅ refuses, says nothing was charged |
| Stored order status | ✅ always `pending-payment`, never paid |
| Payment amount mismatch (partial/over/zero/fractional) | ✅ refused |
| Re-paying a paid order | ✅ refused |
| Unconfigured provider | ✅ refuses session creation and callbacks |
| `/admin/orders` unauthenticated | ✅ 307 → login |
| `/admin/orders` authenticated | ✅ 200, honest about in-memory storage |
| Checkout pages (en/ms/zh) | ✅ 200 |
| `npm test` | ✅ 536 assertions across 13 suites |
| `npm run typecheck` / `npm run lint` / `npm run build` | ✅ clean, 87 pages |

**Note on verification:** the server action is covered by 53 direct assertions
calling it with real `FormData`, and the checkout UI by a further 37 rendered
assertions. Driving the RSC wire format by hand over `curl` proved to be
framework-internal; the action was confirmed reachable and executing over HTTP,
but its logic is verified by calling it directly rather than through a
reconstructed payload.

---

## Known gaps and deliberate deferrals

1. **Catalogue edits do not persist yet.** The content is compiled into the
   build and no database is connected, so the admin is read-only by design. The
   repository interface and the UI are finished; connecting a database is the
   remaining step (see "Open question").
2. **No payments.** Phase 2e. Orders are recorded, re-priced and viewable, but
   no provider is connected (FPX/cards/DuitNow need an owner merchant account).
   Every order is `pending-payment` and nothing claims otherwise.
3. **Order records are not durable.** They live in server memory and are lost
   on restart. Real but temporary, stated in both the confirmation screen and
   the admin list. A database-backed repository is the fix (see "Open
   question").
4. **Images cannot be uploaded from the admin.** A product photo can only be
   added in the repository, so publishing requires one to exist already. Upload
   needs a storage bucket and is deliberately not faked.
5. **The login rate limit is per instance and in memory.** It resets on
   redeploy and is not shared between serverless instances. Adequate for a
   single owner; documented rather than overbuilt.
6. **WhatsApp, phone and email are unset** in `src/lib/site.ts`. The UI detects
   this and renders a "being finalised" notice instead of a dead link. Nothing
   invented.
7. **Location pages not built.** The geo database and page architecture are
   Phase 4; building them before products exist would produce thin pages.
8. **OG image** currently reuses the hero photograph; a dedicated 1200×630
   branded banner is pending (image generation limit reached this turn).
9. **No analytics or consent banner yet.** Phase 6.
10. **No Vietnamese/other locales** — intentionally exactly three.

---

## Open question — catalogue and order persistence

The admin UI, validation and authorisation are complete and verified, and orders
are recorded and re-priced correctly. What is **not** decided is **where that
data lives**. This now blocks two things at once: catalogue edits cannot persist,
and orders are lost when the server restarts. Two honest options:

| Option | What it means | Cost | Trade-off |
| --- | --- | --- | --- |
| **A. Keep compiled content** | Owner edits `src/content/products.ts`, commits, redeploys. The `/admin` screen stays a review-and-validate tool. | Free | Every price change is a deploy; no non-technical editing. |
| **B. Connect Vercel Postgres / Neon** | Implement `PostgresProductRepository` and `PostgresOrderRepository`, set `DATABASE_URL`. The admin becomes a real CMS and orders survive restarts. | ~$0–20/month at this scale | A managed database to back up and maintain. |

Nothing further is blocked by this except the write path itself: the storefront,
cart and checkout read through the same interface, so either choice is a
one-file change. **Recommendation: option B**, because the whole point of the
Phase 2c screen is to let the owner change a price without a developer. This
needs the owner's decision on hosting cost.

---

## Next task

**Phase 2e — payment provider integration.** Blocked until the owner supplies a
merchant account (FPX / cards / DuitNow) and sandbox credentials.

Everything around it is now in place, so the remaining work is bounded:

1. Implement `PaymentProvider` against the provider's sandbox: session creation,
   redirect, and a signature-verified callback.
2. Verify the callback against `paymentGuards` — exact amount, and only a
   `pending-payment` order may transition.
3. Flip `features.payments` in the same commit that the sandbox test passes,
   never before.

**One decision is still open and it now blocks two things** (see below): where
the catalogue and orders are stored. Until it is answered, the admin cannot
persist edits and orders are lost on restart.
