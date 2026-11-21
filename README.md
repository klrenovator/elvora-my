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
npm test            # 364 assertions across 9 suites
npm run build       # production build, all routes pre-rendered
```

## Project structure

```
src/
  app/
    [locale]/
      layout.tsx            <html lang>, header, footer, Organization + WebSite JSON-LD
      page.tsx              homepage (hero, collections, grades, trust, FAQ, CTA)
      [slug]/page.tsx       categories + editorial pages (statically generated)
      [slug]/[product]/     product pages, catalog segment localized per language
    admin/                owner-only product management (outside the locale tree)
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

### Payment status

Payment is **not connected**. `features.payments` is `false`, so checkout
collects and validates the delivery address, then produces a copyable order
summary — it does not take payment or submit an order. The page says this
plainly rather than implying a completed purchase.

To go live, connect a Malaysian provider (FPX, cards, DuitNow), then flip
`features.payments` in `src/lib/features.ts` in the same commit.

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

## Brand identity

The wordmark in `src/components/logo.tsx` is intentionally temporary and
typographic. To install the final logo, replace the markup inside that one
component and update the colour tokens in `src/app/globals.css` (`@theme`
block). No page-level markup references brand colours directly for anything
that would need to change.

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

**Saves do not persist yet.** The catalogue is still compiled into the build, so
the repository refuses writes rather than reporting a save that did not happen,
and the screen says so plainly. Every read and write goes through a
`ProductRepository` interface (`src/lib/catalogue/repository.ts`), so connecting
a database is one file — see "Open question" in [PROGRESS.md](./PROGRESS.md).

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
| `ADMIN_PASSWORD_HASH` | For admin | Password hash from `npm run admin:hash`. Without it the admin refuses all logins. |
| `ADMIN_SESSION_SECRET` | For admin | Signs session cookies. Must be 32+ characters. |

The storefront needs none of these; only the admin area does.

## Progress

See [PROGRESS.md](./PROGRESS.md) for what is built, what is verified, and the
next task.
