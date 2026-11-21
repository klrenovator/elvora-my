# Elvora.my — Build Progress

This file is the single source of truth for what has been built, what has been
verified, and what comes next. Update it at the end of every working session.

**Last updated:** Phase 2f completed (Cash on Delivery and contact channels).

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
| 2e | Online payment provider (FPX / cards / DuitNow) | ⬜ Deferred by the owner — COD for now, approval required |
| 3a | Supabase persistence: catalogue edits and orders stored permanently, RLS | ✅ Complete |
| 3 | Multilingual completion for commerce surfaces (cart, checkout, forms, admin) | ⬜ Blocked by Phase 2 |
| 4 | Nationwide location SEO: Malaysia geo database, location pages, internal linking | ⬜ Not started |
| 5 | Content marketing, AEO/GEO/LLMO assets, articles | ⬜ Deferred until Phase 2–4 |
| 2f | Cash on Delivery, payment/order status tracking, WhatsApp + email contact | ✅ Complete |
| 6 | Conversion and leads: WhatsApp, live chat, enquiry flows, analytics | 🔶 WhatsApp and email live; live chat and analytics not started |
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
## Phase 3a — Supabase persistence (completed)

Catalogue edits and orders now persist in Supabase Postgres, behind the
interfaces built in earlier phases. The choice of Supabase over Neon/Vercel
Postgres was the owner's, for the bundled Auth and Storage later.

**What this phase is not:** it does not touch authentication (the single-owner
password from Phase 2c still works) and it does not touch payments
(`features.payments` is still `false`). Both were explicit scope decisions.

### Schema (`supabase/migrations/0001_init.sql`)

- **`products`**: the full trilingual `Product` document in `jsonb`, with
  `status`, `category`, `sort_order` and the three slugs lifted into indexed
  columns for filtering and page lookup. Not fully normalised on purpose — the
  shape is deeply nested and translated, and exploding it would create a dozen
  joins per page for no query anyone makes.
- **`orders`**: customer and lines stored as immutable `jsonb` copies taken at
  ordering time, because an order records what was agreed, not what is true now.
- **Constraints that encode business rules in the database**, so a bug cannot
  bypass them:
  - `orders_paid_requires_payment` — a `paid` order must carry a payment
    record, and an unpaid order must not.
  - `orders_total_matches_subtotal` — `total = subtotal + shipping`.
  - status and locale confined to known values; unique slug per language.

### Security

RLS is enabled on both tables with **no policies and no grants** for `anon` or
`authenticated`. The application reaches Postgres only from the server (server
components and server actions) using a role that bypasses RLS, so the correct
policy for the public key is denial. This means customer names, phone numbers
and addresses are not readable with the public key, and `npm run db:verify`
proves it by actually calling the REST API with the anon key.

### Storefront reads the live catalogue

Seven modules previously imported `@/content/products` directly. Product pages,
category pages, the sitemap and the cart now read through
`src/lib/catalogue/storefront.ts`. Without this, a save in the admin would have
persisted and changed nothing the customer could see — the exact failure this
project has refused from the start.

- Product pages: `dynamicParams = true` and `revalidate = 60`, so a product
  created in the admin resolves without a redeploy and a price edit appears
  within a minute.
- Saving in the admin revalidates the affected product URLs, category pages,
  the storefront layout and the sitemap.
- The language switcher's slug translations are synced from the live catalogue,
  so an admin-created product translates across languages instead of falling
  back to the homepage.

### Two different failure policies, deliberately

| Surface | Database unreachable | Why |
| --- | --- | --- |
| Storefront | Serve the compiled seed, log a warning | A shop that stays up during a blip beats an error page |
| Checkout | **Refuse**, "nothing has been ordered or charged" | An order must never be priced from stale data |

The checkout path was changed during this phase: an unhandled database error
previously produced a 500. It now returns a sentence the customer can act on,
and a test asserts no order is written in that case.

### Verification

| Check | Result |
| --- | --- |
| Product row ↔ document round trip (all 7) | ✅ lossless, JSON-identical |
| Lifted columns always match the document | ✅ |
| Document wins over a tampered lifted column | ✅ |
| Order row ↔ order round trip | ✅ lossless, timestamps preserved |
| Unknown order status never reads as paid | ✅ falls back to `pending-payment` |
| Migration enables RLS on both tables | ✅ asserted from the SQL file |
| Migration defines no permissive policy | ✅ asserted from the SQL file |
| Anon/authenticated grants revoked | ✅ |
| Payment and total constraints present | ✅ |
| Writes: `on conflict do nothing`, scoped updates | ✅ asserted from source |
| Price lookup is parameterised, never interpolated | ✅ |
| No database configured | ✅ site, products, cart, checkout all 200 |
| Database unreachable, storefront | ✅ seed served, requests 200 |
| Database unreachable, checkout | ✅ refused with a clear message, no order |
| `npm test` | ✅ 657 assertions across 14 suites |
| `npm run typecheck` / `lint` / `build` | ✅ clean, 87 pages |

**Not verifiable in this environment:** no Supabase project exists here, so the
SQL was not executed against a live server, and the repository classes were not
exercised against real Postgres. The mapping, constraints, security posture and
query shapes are covered by tests; `npm run db:verify` is the step that closes
the gap against the real project, and it is written to fail loudly.

---

## Phase 3b — product photo uploads (completed)

The upload path exists and every check is real. What it cannot do here is
connect to a bucket, because none exists in this environment.

### Rules (`src/lib/images/rules.ts`)

Pure functions, so they can be tested exhaustively without a bucket or browser:

| Rule | Value | Why |
| --- | --- | --- |
| Maximum size | 8 MB | A phone photo is 2–4 MB; 8 MB covers it without allowing a 2 GB file |
| Maximum per product | 6 | Enough for angles and detail, no endless gallery |
| Allowed types | JPEG, PNG, WebP, AVIF | All four render everywhere the shop is likely to appear |
| SVG | **Refused** | An SVG is a document that can carry JavaScript, served from this domain |
| Type check | **Magic bytes** | The browser's `type` and the filename are claims; only the bytes are evidence |
| Storage path | slug(product id) + random suffix + verified extension | The original filename never reaches storage, so a hostile one cannot influence the path |

`validateImageUpload` runs its checks in a fixed order — empty, size, declared
type, real bytes, mismatch — so the message the owner sees names the first real
problem rather than a symptom of it.

### Storage (`src/lib/images/storage.ts`)

An interface with one implementation, `SupabaseImageStorage`, calling the
Storage REST API directly. No new dependency. Writes use `x-upsert: false`, so
an upload can never silently overwrite another photo. Deletes treat a 404 as
success, because the desired end state — no file at that path — is already true.

Configuration requires **both** `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
The anon key is deliberately rejected: it has no write permission, so accepting
it would produce a confusing failure later instead of a clear refusal now.

### Failure behaviour

| Situation | What happens |
| --- | --- |
| Storage not configured | Upload refused, message names the missing variables |
| File empty / too large | Refused before the body is buffered |
| SVG, GIF, PDF, anything else | Refused, with the four accepted formats named |
| Bytes disagree with the declared type | Refused as a mismatch |
| Seven photos on one product | Refused, counted from the **stored** record, not the browser |
| Not logged in | Refused before any file is read |
| Existing repository photos | Unaffected — `/images/…` paths are not touched |

### What the form may and may not attach (`src/app/admin/actions.ts`)

The editor submits its image list so alt-text edits and removals survive a save.
An entry is accepted only if it was **already on that product** or points at an
object in **our own bucket**. A crafted request therefore cannot attach an
arbitrary URL, and a photo has to have been genuinely uploaded first.

### Rendering

`next.config.ts` derives `images.remotePatterns` from `SUPABASE_URL`, scoped to
`/storage/v1/object/public/**` and https only. Without it `next/image` refuses
the host and every uploaded photo renders broken — a failure that would only
appear after the owner had already uploaded something.

### Verification

| Check | Result |
| --- | --- |
| Magic bytes for all four formats | ✅ |
| Type/declared mismatch, SVG, PHP, ZIP | ✅ all refused |
| Empty file, over-limit, exactly-at-limit | ✅ |
| Path traversal via product id, suffix, absolute path | ✅ neutralised |
| Foreign host, lookalike host, data URL | ✅ refused |
| `next/image` pattern derivation and malformed URL | ✅ |
| Image cap and add/remove immutability | ✅ |
| Upload without configuration | ✅ refused, message names the variable |
| Media panel: empty, populated, full, read-only | ✅ |
| `tests/images.test.ts` | ✅ 85 assertions |
| `tests/admin-media.test.tsx` | ✅ 31 assertions |
| `npm test` | ✅ 773 assertions across 15 suites |
| `npm run verify` | ✅ clean, 87 pages |
| Storefront with no storage configured | ✅ pages 200, uploads refused |

**Not verifiable here:** no bucket exists, so no file was actually stored. Every
rule, refusal, path and render path is covered by tests; the first real upload
is the step that closes it, and `npm run db:verify` now checks the bucket's
existence, its public-read flag, its 8 MB limit and the absence of public write
policies.

---

## Phase 2f — Cash on Delivery and contact channels (completed)

The shop takes orders and is paid in cash at the door. No gateway is involved,
and none will be until the owner approves one.

### Payment is a method, not an absence

`src/lib/payments/methods.ts` is the registry. Cash on Delivery is an entry with
a label in three languages, a description, a settlement kind (`on-delivery`) and
`requiresOnlinePayment: false`.

This mattered more than it looked. The previous build said "payment is not
connected" everywhere, which described a missing gateway rather than a working
arrangement — and would have left the shop apologising for a payment method it
actually has. The copy now states the arrangement: you pay the courier when the
parcel arrives.

Adding an online method later is: append to the registry, allow the id in the
migration's check constraint, implement `PaymentProvider`, flip
`features.payments`. Checkout renders whatever the registry offers, so the form
does not change.

### Two status fields, deliberately

| Field | Values | Question it answers |
| --- | --- | --- |
| `status` | `pending-payment`, `paid`, `expired`, `cancelled` | Where is this order in its life? |
| `paymentStatus` | `on-delivery`, `unpaid`, `paid`, `not-required` | Have we been paid? |
| `paymentMethodId` | `cod` | How is the customer paying? |

One field would conflate "delivered but the customer had no cash" (money owed)
with "cancelled before dispatch" (nothing owed). Both are "not paid", with
opposite accounting consequences.

A newly placed COD order is `pending-payment` / `on-delivery`. **Not** `paid`:
nothing has arrived.

### Settling is a deliberate act (`src/lib/order-settlement.ts`)

Separated from the server action so the rules can be tested without a request
and audited in one function.

| Rule | Why |
| --- | --- |
| Only `pending-payment` can be settled | A duplicate cannot double-count the money or revive a cancelled order |
| The amount is the order's own total | A form-supplied amount would let a RM 498 order be settled in full for RM 1 |
| An order with no total cannot be settled | Writing 0 claims the customer owes nothing — worse than refusing |
| A paid order cannot be cancelled | Money changed hands; erasing it would misstate the takings |
| Cancelling sets `not-required` | The order is over and nothing is owed |

The database re-checks all of it: `orders_paid_status_agrees` refuses a row
whose `status` says paid while `payment_status` disagrees.

### Contact channels

WhatsApp and email, read from `NEXT_PUBLIC_WHATSAPP_NUMBER` and
`NEXT_PUBLIC_CONTACT_EMAIL`, so publishing them is config rather than code.

| Placement | Detail |
| --- | --- |
| Product pages | Under the buy controls, product name prefilled into the message |
| Contact page | Above the prose, as the page's main action |
| Category pages | Main CTA links straight to WhatsApp |
| Header | WhatsApp button on desktop; both in the mobile drawer |
| Footer | Both, when configured |

Unconfigured, no link is rendered at all — no placeholder number, no dead
button. The contact page's old "channels being finalised" notice is now gated on
whether a channel exists, so it cannot contradict working buttons.

### Verification

| Check | Result |
| --- | --- |
| A COD order is recorded with method and `on-delivery` | ✅ |
| An unknown or missing method falls back to COD, never stored | ✅ |
| Settling records the order total, not the form's figure | ✅ |
| Settling twice is refused and changes nothing | ✅ |
| An unpriced order cannot be settled | ✅ |
| A cancelled order cannot be marked paid | ✅ |
| A paid order cannot be cancelled | ✅ |
| No provider is live; sessions and callbacks refused | ✅ |
| No gateway SDK in the code, the dependencies or the env | ✅ asserted from source |
| Contact buttons render when configured, nothing when not | ✅ |
| Contact page notice disappears once a channel is set | ✅ |
| `tests/cod.test.ts` / `tests/contact-channels.test.tsx` | ✅ 93 + 53 assertions |
| `npm test` | ✅ 17 suites, 933 assertions, 0 failed |
| `npm run verify` | ✅ clean, 87 pages |
| Live build with channels configured | ✅ buttons on product, contact, category, header |

**Not verifiable here:** no Supabase project, so migration `0003_cod.sql` was
not run against a live server. `npm run db:verify` now checks the payment
columns, the values actually stored, and the presence of both payment
constraints.

---

## Known gaps and deliberate deferrals

1. **Persistence needs the owner to create the Supabase project.** The code,
   schema, RLS policies and seed/verify scripts are complete and tested, but no
   project exists yet, so the site still runs on the compiled catalogue. Steps
   are in `docs/SUPABASE-SETUP.md`.
2. **No online payment.** Cash on Delivery only, by the owner's decision. Orders
   are recorded with a payment method and a payment status, and the owner settles
   them as cash arrives. Phase 2e (FPX/cards/DuitNow) stays deferred until the
   owner approves a merchant account — the structure is ready, the integration is
   deliberately not started.
3. **Orders are durable only once Supabase is connected.** Without a database
   they live in server memory and are lost on restart, which the confirmation
   screen and admin both state. With `SUPABASE_DB_URL` set they persist.
4. **Photo uploads need a storage bucket.** The upload code, rules, panel and
   bucket SQL are complete and tested, but no bucket exists yet, so uploads are
   refused with a message naming the missing variables. Adding one takes two
   minutes: `docs/SUPABASE-SETUP.md` step 2b. Until then the seven products keep
   their repository photos and publishing still requires one to exist.
5. **The login rate limit is per instance and in memory.** It resets on
   redeploy and is not shared between serverless instances. Adequate for a
   single owner; documented rather than overbuilt.
6. **WhatsApp and email need configuring.** Both are wired end to end and appear
   the moment `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_CONTACT_EMAIL` are
   set; until then the UI renders no link rather than a placeholder. Phone,
   Instagram, Facebook and TikTok remain unset.
7. **Location pages not built.** The geo database and page architecture are
   Phase 4; building them before products exist would produce thin pages.
8. **OG image** currently reuses the hero photograph; a dedicated 1200×630
   branded banner is pending (image generation limit reached this turn).
9. **No analytics or consent banner yet.** Phase 6.
10. **No Vietnamese/other locales** — intentionally exactly three.

---

## Open question — hosting plan and backups

The persistence question is settled: Supabase, with RLS, behind the interfaces
from Phases 2c and 2d. Two operational decisions remain, and both are the
owner's because they involve spending money:

| Decision | Free | Pro ($25/month) |
| --- | --- | --- |
| Supabase plan | 500 MB, **pauses after 7 days idle**, **no backups** | 8 GB, never pauses, daily backups for 7 days |

Free is fine for building and testing. For a shop taking real orders, the
7-day pause and the absence of backups are both unacceptable, so **Pro is the
recommendation before launch**. Nothing in the code depends on the plan.

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

**Before launch:** create the Supabase project (`docs/SUPABASE-SETUP.md`), run
`npm run db:seed`, and confirm `npm run db:verify` passes. Then move to the Pro
plan so the database does not pause and backups exist.
