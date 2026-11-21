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
npm test            # pricing, catalogue and language-switch assertions
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
  proxy.ts                  language entry routing, `/` → locale
public/images/              temporary AI illustrations (see below)
```

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

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used in metadata, sitemap and hreflang. Defaults to `https://elvora.my`. |

None are required for local development.

## Progress

See [PROGRESS.md](./PROGRESS.md) for what is built, what is verified, and the
next task.
