# elvora.my

Premium multilingual genuine leather storefront for the Malaysian market.
Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4.

Three languages, three URL trees, one catalogue: English (`/en`), Bahasa Melayu
(`/ms`) and Simplified Chinese (`/zh`).

## Getting started

Use Node.js 22.18+ in the 22.x series, or 24.11+.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. The root redirects to your remembered language,
falling back to English.

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # 1115 assertions across 19 suites
npm run verify      # typecheck + lint + tests + build, in one command
npm run build       # production build, all routes pre-rendered
```

## Project structure

```
src/
  app/
    [locale]/
      checkout/actions.ts   records an order after re-pricing it server-side
      layout.tsx            <html lang>, header, footer, Organization + WebSite JSON-LD
      page.tsx              homepage (hero, collections, grades, trust, FAQ, CTA)
      [slug]/page.tsx       categories + editorial pages (statically generated)
      [slug]/[product]/     product pages, catalog segment localized per language
    admin/                owner-only product and order management (outside locales)
    sitemap.ts              multilingual sitemap with hreflang alternates
    robots.ts               robots.txt
    llms.txt/route.ts       plain-text summary for AI assistants
    not-found.tsx           trilingual 404
  components/               header, footer, language switcher, cards, FAQ, UI primitives
  content/
    categories.ts           the seven categories, written in all three languages
    pages-core.ts           About, leather guide, care, contact
    pages-policy.ts         Shipping, returns, FAQ, privacy, terms
  i18n/config.ts            locales, hreflang values, labels
  lib/
    routes.ts               localized URL table + language-switch resolver
    dictionary.ts           interface strings (chrome only)
    page-resolver.ts        slug → page resolution, slug-collision guard
    seo.ts                  metadata, canonical, hreflang, JSON-LD builders
    pricing.ts              price resolution, formatting and availability (single source)
    validate-catalogue.ts   build-time guard against bad product data
    features.ts             flags for capabilities not yet implemented
    site.ts                 brand config and contact channels (nulls = not supplied)
    orders.ts               order records, references, request validation
    order-pricing.ts        server-side re-pricing (the authority on totals)
    order-repository.ts     order persistence boundary (memory today)
    payments/provider.ts    payment provider boundary + payment guards
    admin/                  auth, session cookies, product form rules
    catalogue/repository.ts the persistence boundary (static today, database-ready)
  components/admin/         product editor
  proxy.ts                  language entry routing, `/` → locale (admin excluded)
scripts/hash-password.ts    generates ADMIN_PASSWORD_HASH + ADMIN_SESSION_SECRET
public/images/              temporary AI illustrations (see below)
```

## Cart and checkout

| Language | Cart | Checkout |
| --- | --- | --- |
| English | `/en/cart` | `/en/checkout` |
| Malay | `/ms/troli` | `/ms/pembayaran` |
| Chinese | `/zh/gou-wu-che` | `/zh/jie-zhang` |

Both are `noindex` and excluded from the sitemap — they carry no standalone
search value and would otherwise compete with category pages.

### How the cart enforces the pricing rules

`src/lib/cart-store.ts` holds the logic and is free of React so it can be tested
directly:

- An unpriced product **cannot** be added — there is nothing to charge.
- Each line stores the price it was added at. `reconcile()` compares that
  snapshot with the live price and raises `price-changed`, which the customer
  must explicitly accept before checkout unlocks. Prices are never silently
  updated.
- Totals always come from the live catalogue, so editing `localStorage` (which
  users can do) produces a visible notice rather than a discount.
- Quantities are clamped to real stock; delisted products are flagged and
  contribute nothing to the subtotal.

### Orders and payment status

Checkout **records a real order**: it validates the address on the server,
re-prices every line from the catalogue, and stores the result with a reference
the customer can quote. The confirmation screen shows that reference.

**Payment is Cash on Delivery.** The customer pays the courier in cash when the
order arrives, so nothing is taken at checkout. An order is recorded as
`status: pending-payment` with `paymentStatus: on-delivery` — the honest reading:
the order is real, the money has not arrived yet.

| Field | Meaning |
| --- | --- |
| `status` | The order's own lifecycle: `pending-payment` → `paid`, or `cancelled` / `expired` |
| `paymentStatus` | Whether money arrived: `on-delivery`, `unpaid`, `paid`, `not-required` |
| `paymentMethodId` | How the customer pays. `cod` today |

Two fields rather than one because they answer different questions. "Delivered
but the customer had no cash" and "cancelled before dispatch" are both an order
that is not `paid`, but one is money owed to you and the other is nothing. An
owner reconciling a cash-up needs to tell those apart.

### Fulfilling an order

`/admin/orders` is the list — who, where, how much. Opening a reference gives the
**packing view** at `/admin/orders/[reference]`:

- the **full delivery address**: both street lines, postcode, city, state, and
  any delivery notes the customer wrote
- every line with its **variant id and SKU**, because two variants of one
  product share a name and a packer cannot pick between them from a name
- the payment state in words that say whether money is still owed
- **Mark paid** / **Cancel**, and nothing at all once the order is settled

Delivery cost shows as *"Quoted before dispatch"* rather than RM 0.00, because
the shop has never published a shipping rate and zero would claim delivery is
free. The page reads only what the order recorded — nothing is recomputed from
the current catalogue, so a price edited later cannot rewrite what the customer
agreed to.

**Settling is deliberate.** An order becomes `paid` only when the owner presses
**Mark paid**, once the cash is actually in hand. The amount
recorded is the order's own total, read from the stored order — never a figure
typed into a form, which is what stops a RM 498 order being settled for RM 1. An
order with no price cannot be settled, because there is no amount to record and
writing zero would claim nothing is owed.

A paid order cannot be cancelled. Money changed hands, and erasing that record
would misstate the takings; a refund is a separate, real event.

**The client's total is never trusted.** The browser sends what it thinks the
order costs; the server re-prices from the catalogue and *refuses* if the two
disagree. Silently correcting it would mean charging a figure the customer
never saw, so the customer is sent back to review their cart instead.

Orders are stored in server memory (`MemoryOrderRepository`) — real, but lost on
restart, and both the confirmation screen and `/admin/orders` say so. Swapping in
a database is one file, the same as the catalogue.

### Adding online payment later

Not started, and it will not start without the owner's explicit approval and a
merchant account. The structure is ready for it, which is the point of doing the
work now:

1. Add a method to `paymentMethods` in `src/lib/payments/methods.ts`, with
   `requiresOnlinePayment: true`. Checkout renders whatever is in that list, so
   the form does not change.
2. Add its id to the `orders_payment_method_known` check in a new migration, in
   the same migration that implements it, so the database and the code cannot
   disagree.
3. Implement `PaymentProvider` against the provider's sandbox, then flip
   `features.payments` in `src/lib/features.ts` **in the same commit that the
   sandbox test passes** — never before.

`features.payments` refers only to gateways. It is `false` today and the shop is
still paid — in cash, on delivery.

Two rules are already encoded and tested in `paymentGuards`:

1. A paid amount must match the order total **exactly**. Partial payments,
   overpayments and currency mix-ups are refused and reconciled by hand.
2. Only a `pending-payment` order may become paid. A duplicate or conflicting
   callback must not double-charge or revive a cancelled order.

Even after a gateway exists, an order may only become paid through a verified
callback or the owner's explicit cash-received action. There is no path that
infers payment from a status field.

## Internal research documents

The repository root holds the competitor and market research that informs the
content. These are **internal**: competitor names never appear in customer-facing
copy, and none of the prices, rates or terms in them are used as our own.

| File | Purpose |
| --- | --- |
| `COMPETITOR_DEEP_RESEARCH_AND_WEBSITE_IMPROVEMENT.md` | The research specification and its findings |
| `COMPETITOR_COMPARISON_MATRIX.md` | 16 competitor sites, side by side, evidence-labelled |
| `LEATHER_MATERIALS_AND_PRICING_RESEARCH.md` | Leather grades, tanning, observed price bands |
| `PET_LEATHER_PRODUCTS_RESEARCH.md` | Pet leather brands, sizing standards, safety limits |
| `MALAYSIA_DELIVERY_AND_COURIER_RESEARCH.md` | Malaysian couriers and COD operations |
| `MALAYSIA_PAYMENT_AND_MERCHANT_RESEARCH.md` | Verified gateway fees and a recommendation |
| `WEBSITE_IMPROVEMENT_ROADMAP.md` | Prioritised improvements, with owner decisions flagged |

Evidence labels used throughout: **Verified** (stated on a page fetched),
**Observed** (visible but unconfirmed), **Not disclosed** (no public source) and
**Needs verification** (requires company confirmation).

## Product specification strip

Every product page opens with a compact specification strip under the short
description: leather grade first, then capacity, fit ranges, dimensions and
hardware, capped at five rows.

Values are read from the catalogue and nothing else. A row the catalogue still
hedges as "Being measured" is dropped from the strip rather than dressed up as a
feature, and the page says so once beneath it. Duplicate material rows and
instructional rows ("How to measure") are filtered out so a real dimension gets
the slot.

`catalogueContentDebt()` reports published products whose strip would collapse to
the grade alone. It is deliberately **not** a build error — blocking a deploy
until the owner measures a wallet would stop every unrelated fix — but it is
reported and pinned by a test so it cannot quietly grow. One product is currently
on that list: the cognac bifold wallet.

`tests/spec-summary.test.ts` (82 assertions) enforces no pending text in any
strip, grade-first ordering, matching chip counts across the three languages, and
that no strength claim can reach any strip.

## Returns and refunds

`/en/returns`, `/ms/pemulangan`, `/zh/tui-huan` — **30 calendar days from the date
the order is received**, covering four cases: the wrong product was sent, the
product arrived damaged, the product is defective or faulty, or the product does
not match its description.

It is **not a change-of-mind policy**, and the page says so in a callout rather
than burying it: an incorrectly ordered belt length or collar size is excluded.
The request must carry an order number, a stated reason, photographs or video and
the product details; approval precedes inspection, which precedes refund or
replacement. Return delivery is on us where the fault is ours.

An explicit clause preserves statutory rights under the Consumer Protection Act
1999 and the Consumer Protection (Electronic Trade Transactions) Regulations
2012, and states that the 30 days neither replaces nor shortens them.

`tests/returns.test.ts` (67 assertions) requires all eleven sections and the four
reasons in all three languages, and fails the build on rights-limiting language
("no refunds", "all sales final"), change-of-mind promises ("no questions asked",
"any reason"), and any courier name, shipping rate or contact detail.

## Warranty

`/en/warranty`, `/ms/jaminan`, `/zh/bao-xiu` — 12 months on workmanship and
hardware, counted from delivery. Repair first, replacement where repair is not
possible. The customer pays return postage to us; we pay it back to them.
Excluded: normal wear and patina, water and heat damage, misuse, alteration,
chewing, and any load or pull rating.

The same terms appear as a summary above the buy controls on every product page,
because a COD customer cannot inspect the goods before paying and after-sales
support is part of what they are buying.

Terms live in `src/content/warranty.ts` as one source, read by the policy page,
the product page and the tests alike. `tests/warranty.test.ts` (43 assertions)
checks that no page invents a different duration, that the exclusions still name
normal wear and water damage, that no "lifetime" or "waterproof" promise appears,
and that a 31 January start adds twelve months without overflowing into March.

## Dog collar sizing guide

`/en/dog-collar-sizing`, `/ms/panduan-saiz-kolar-anjing` and
`/zh/gou-bo-quan-chi-cun-zhi-nan`.

A measurement guide with the neck ranges of the collars we actually sell,
expressed in centimetres and inches, plus the method for measuring a neck, the
two-finger fit check, and an explicit statement that we publish no load or pull
capacity for any collar, because we have no manufacturer test report to support
one.

**The table is derived from the catalogue at build time**, not typed by hand. An
earlier version carried generic neck bands that did not match the S/M/L ranges on
the product pages; that is exactly the kind of disagreement that causes wrong
orders, so `tests/dog-sizing.test.ts` (62 assertions) now fails the build if the
guide and the catalogue ever drift, including whether a collar-and-leash set uses
the same ranges as the collar inside it. The rest of the suite checks the
arithmetic, the ban on unsupported safety claims, and the localised routing.

## Location and delivery pages

Every area the shop names has a page, in all three languages:

| Language | URL |
| --- | --- |
| English | `/en/delivery/kuala-lumpur` |
| Bahasa Melayu | `/ms/penghantaran-kawasan/kuala-lumpur` |
| Chinese | `/zh/pei-song-di-qu/kuala-lumpur` |

The area slug is shared across languages — a place name is not translated — and
the index at `/en/delivery` lists every area grouped by state.

### Why these pages are not thin content

The easy mistake with location pages is generating hundreds from a postcode
dump. That produces near-duplicate doorway pages that rank for nothing and read
as spam. This build deliberately does the opposite:

- **34 named towns and cities**, each with a real state, a real postcode range
  and a properly translated name — not every mukim in the country.
- Each page states **its own** area, state and postcode, so no two titles or
  descriptions are identical. A test asserts this.
- The **commercial** copy is identical everywhere, because the arrangement
  genuinely is: order, confirm on WhatsApp, delivery cost quoted before
  dispatch, cash on arrival.

### What the pages refuse to claim

There is no delivery time, fee, courier name or coverage promise anywhere in
this copy, because the owner has published none of those. Each page carries a
**"What we do not promise"** block saying so explicitly, and a test fails the
build if a phrase like "free delivery", "next day", a flat rate or a courier
brand ever appears.

East Malaysia pages (Sabah, Sarawak, Labuan) additionally explain that delivery
is slower and costlier across the South China Sea — without inventing a figure.

Structured data is a `Service` with `areaServed`, **not** a `LocalBusiness`.
Claiming premises in 34 cities would be false structured data.

### Adding an area

Append to `src/content/delivery-areas.ts`. The pages, sitemap, internal links and
language switching all derive from that list, so a new town appears everywhere at
once — no other file changes.

## Product pages

Localized URLs, one per product per language:

| Language | Pattern | Example |
| --- | --- | --- |
| English | `/en/products/<slug>` | `/en/products/cognac-full-grain-bifold-wallet` |
| Malay | `/ms/produk/<slug>` | `/ms/produk/dompet-bifold-full-grain-cognac` |
| Chinese | `/zh/chan-pin/<slug>` | `/zh/chan-pin/gan-yi-zong-quan-li-mian-dui-zhe-qian-bao` |

All 21 product pages are pre-rendered at build time. A mismatched catalog
segment (for example `/en/produk/…`) returns 404 rather than rendering the
product under a duplicate URL.

### How pricing works

`src/lib/pricing.ts` is the only place a price string is ever produced.

```ts
type PriceState =
  | { kind: "on-request" }
  | { kind: "fixed"; amountSen: number; currency: "MYR"; compareAtSen?: number };
```

- `on-request` → the UI renders "Price on request" in the visitor's language and
  **no `Offer` is emitted** in structured data.
- `fixed` → formats as `RM` for the visitor's locale. `amountSen` is an integer
  to avoid floating-point drift.
- `compareAtSen` is honoured only when genuinely higher than the selling price,
  so a fake discount cannot be produced by bad data.
- Invalid values (`0`, negative, `NaN`, `Infinity`) fall back to on-request.

To set a real price, edit the product in `src/content/products.ts`:

```ts
price: { kind: "fixed", amountSen: 24900, currency: "MYR" }, // RM 249.00
```

`npm test` and `npm run build` both fail if the catalogue is inconsistent.

## Business rules encoded in the code

These are enforced in structure, not just documented:

- **Exactly seven categories.** The taxonomy is a closed union type; adding a
  category is a deliberate code change, not a content edit.
- **Two leather grades only.** `full-grain` and `top-grain`, and a product's
  grade must be set explicitly before it is published.
- **Prices are never generated.** The product model treats price as
  administrator-entered data. A product without a price renders
  "Price on Request" in all three languages and emits no `Offer` schema.
- **No invented business details.** WhatsApp, phone, email and social handles
  live in `src/lib/site.ts` as `null`. The UI checks `isConfigured()` and shows
  a "being finalised" notice rather than a dead link or a fabricated number.
- **No fake local presence.** Location pages (Phase 4) must state that this is
  an online store serving the area, never a branch.
- **No delivery guarantees.** Shipping copy explains how charges are calculated
  at checkout and explicitly declines to promise transit times.

## Contact channels

The shop's two inquiry routes are **WhatsApp** and **email**, and they are shown
wherever a customer might hesitate:

| Where | What |
| --- | --- |
| Product pages | Buttons under the buy controls, with the product name prefilled into the WhatsApp message |
| Contact page | Both channels, above the prose |
| Category pages | The main call to action links straight to WhatsApp |
| Header | A WhatsApp button on desktop; both channels in the mobile drawer |
| Footer | Both, whenever they are configured |

Both values come from the environment, so publishing them is a config change
rather than a code change:

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=012-345 6789   # or +60 12-345 6789
NEXT_PUBLIC_CONTACT_EMAIL=hello@elvora.my
```

Unset, the site says the details are being finalised and renders **no** link —
never a placeholder number or a button that goes nowhere. A local number and an
international one both normalise to the same `wa.me` link.

> On Vercel, `NEXT_PUBLIC_*` values are baked in at build time. Setting them in
> the dashboard requires a redeploy before they appear.

## Replacing the temporary images

All placeholder artwork is disclosed to visitors as an illustration, on the
image itself, in the footer and in the FAQ.

Swap files in place — no code change needed:

| Path | Content |
| --- | --- |
| `public/images/categories/mens-wallets.jpg` | Men's wallets |
| `public/images/categories/mens-belts.jpg` | Men's belts |
| `public/images/categories/ladies-handbags.jpg` | Ladies' handbags |
| `public/images/categories/ladies-belts.jpg` | Ladies' belts |
| `public/images/categories/dog-collars.jpg` | Dog collars |
| `public/images/categories/dog-leashes.jpg` | Dog leashes |
| `public/images/categories/dog-collar-leash-sets.jpg` | Collar & leash sets |
| `public/images/hero/hero-leather.jpg` | Homepage hero, also the current OG image |
| `public/images/leather/full-grain.jpg` | Full grain macro |
| `public/images/leather/top-grain.jpg` | Top grain macro |

Keep the aspect ratios (4:5 for categories, 3:2 for the hero, 16:10 for the
macros). When original photography lands, remove the placeholder badges —
search for `placeholderNote` and `placeholderDisclosure`.

### Uploading real product photos

Once Supabase Storage is configured (see
[docs/SUPABASE-SETUP.md](./docs/SUPABASE-SETUP.md), step 2b), each product's
editor has a **Photos** panel. Choose a file and it uploads immediately; save
the product to attach it.

What is enforced, by the server and not the browser:

- **8 MB maximum**, at most **6 photos** per product.
- **JPEG, PNG, WebP or AVIF**, decided by the file's actual header bytes. A file
  claiming to be a JPEG but containing something else is refused.
- **SVG is refused.** It can carry script and would be served from this domain.
- The stored filename is generated from the product plus a random suffix. The
  original filename is never used, so a hostile one cannot influence the path.
- English alt text is required before publishing, because it is what a
  screen-reader user and a visitor on a broken connection depend on.

If storage is **not** configured, uploads are refused with a message naming the
missing variables. Nothing claims to have saved. Removing a photo deletes the
stored object too, so files do not quietly accumulate in the bucket.

## Brand identity

The wordmark in `src/components/logo.tsx` is intentionally temporary and
typographic. To install the final logo, replace the markup inside that one
component and update the colour tokens in `src/app/globals.css` (`@theme`
block). No page-level markup references brand colours directly for anything
that would need to change.

## Database (Supabase)

Catalogue edits and customer orders are stored in Supabase Postgres when
`SUPABASE_DB_URL` is set. Setup: [docs/SUPABASE-SETUP.md](./docs/SUPABASE-SETUP.md).

```bash
npm run db:seed     # copy the compiled 7 products into the database (insert-only)
npm run db:verify   # check RLS, constraints, and that the public key is denied
```

**Without a database the site still works.** It serves the compiled catalogue
and keeps orders in memory, exactly as in earlier phases. That is a supported
state, not a broken one — a fresh clone and any preview deploy run this way.

### Two data sources, one rule

- **Storefront** reads the live catalogue and *falls back* to the compiled seed
  if the database is unreachable. A shop that stays up during a database blip is
  worth more than one that shows an error page.
- **Checkout** never falls back. It prices against the live catalogue and
  **refuses** if it cannot read it. An order must never be priced from stale
  data, and the customer is told nothing was charged.

Because the storefront cache is 60 seconds, a price edit can take up to a minute
to appear. If a customer's cart holds the old price, checkout refuses and asks
them to review — it never charges the wrong total.

### Security posture

Row Level Security is enabled on both tables with **no policies at all**. The
application connects only from the server with a role that bypasses RLS, so the
correct policy for the public key is "deny everything". Customer names, phone
numbers and addresses are not reachable with the anon key, and
`npm run db:verify` proves it rather than asserting it.

## Admin

The product-management screen lives at `/admin`, deliberately outside the
locale tree and excluded from robots.txt and the sitemap. It is a single-owner
tool: no accounts, no roles, no third-party sign-in.

### Setup

```bash
npm run admin:hash -- "a long password of your choosing"
```

That prints two values. Add them to your environment (locally in `.env.local`,
in production in your host's settings):

```bash
ADMIN_PASSWORD_HASH=scrypt$<salt>$<hash>
ADMIN_SESSION_SECRET=<random 32+ characters>
```

Only the hash is stored — the password itself exists nowhere. Re-run the helper
to change it; changing the session secret signs every session out.

With either value missing, the admin refuses every login and says which one is
missing. There is no default password and no fallback, by design.

### What it does today

`/admin/products` lists the catalogue with filters, and `/admin/products/[id]`
edits a product in all three languages with a separate SEO block. Authentication,
validation and the editing UI are complete and tested.

**Saving persists once Supabase is connected** (see "Database" above). Without
it the catalogue is compiled into the build, so the repository refuses writes
rather than reporting a save that did not happen, and the screen says so
plainly. Every read and write goes through a `ProductRepository` interface
(`src/lib/catalogue/repository.ts`), so the whole difference is one environment
variable.

### Security notes

- scrypt password hashing, constant-time comparison, per-install salt.
- Sessions are HMAC-signed tokens carrying only an expiry (8 hours), in an
  HttpOnly, SameSite=strict cookie that is Secure in production.
- Login is rate limited: five failures in fifteen minutes blocks that address
  for fifteen minutes. The counter is in memory, so it is per instance and
  resets on redeploy — adequate for a single owner, documented rather than
  overbuilt.
- Every admin page and server action checks the session; nothing is trusted
  from the client.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical origin used in metadata, sitemap and hreflang. Defaults to `https://elvora.my`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | For WhatsApp | Inquiry number. Local or international format. Unset means no WhatsApp button at all. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | For email | Inquiry address, shown as text and as a `mailto:` link. |
| `ADMIN_PASSWORD_HASH` | For admin | Password hash from `npm run admin:hash`. Without it the admin refuses all logins. |
| `ADMIN_SESSION_SECRET` | For admin | Signs session cookies. Must be 32+ characters. |
| `SUPABASE_DB_URL` | Optional | Supabase **pooler** connection string (port 6543). Enables persistent catalogue and orders. Without it the site runs on the compiled catalogue. |
| `SUPABASE_URL` | For photos | Project URL. Also used by `npm run db:verify` and to allowlist the image host. |
| `SUPABASE_ANON_KEY` | Optional | Public anon key, used only to prove public access is denied. |
| `SUPABASE_SERVICE_ROLE_KEY` | For photos | **Secret.** Server-only key that uploads to Storage. Bypasses database security — never expose it to a browser. |

Full setup, including creating the tables and verifying row-level security, is
in [docs/SUPABASE-SETUP.md](./docs/SUPABASE-SETUP.md).

The storefront needs none of these; only the admin area does.

## Progress

See [PROGRESS.md](./PROGRESS.md) for what is built, what is verified, and the
next task.
