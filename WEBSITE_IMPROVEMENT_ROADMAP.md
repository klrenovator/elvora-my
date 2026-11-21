# Website Improvement Roadmap

**Created:** 2026-11-21 · **Basis:** the competitor audit in this repository
**Status legend:** ✅ done · ⏳ owner decision needed · 🔜 next · ⛔ blocked

Nothing here restarts completed work. Each item builds on what the site already
does. Prices, rates, warranty terms and contact details are **never** set by an
implementation — only by the owner.

---

## Where the site stands before this roadmap

| Metric | Value |
| --- | --- |
| Pages | 192 |
| Test suites / assertions | 19 / 1,115 |
| Languages | English, Bahasa Melayu, 中文 |
| Categories | 7, exactly |
| Payment | Cash on delivery only, `features.payments` off |
| Delivery areas | 34 across 14 states, honest copy, no invented rates |

---

## Essential tier — do these first

### E1. Dog collar sizing guide ✅ **done this phase**

**Why:** of eight leather pet brands audited, exactly one publishes a real sizing
chart, and a wrong collar size is a returned order and a welfare issue.
**What shipped:** `/en/dog-collar-sizing`, `/ms/panduan-saiz-kolar-anjing`,
`/zh/gou-bo-quan-chi-cun-zhi-nan`. Measurement method, seven neck bands in cm and
inches with strap width, the two-finger fit check, a "what we cannot tell you"
section, and a stock-confirmation note. Linked from the footer and from all three
pet categories.
**Tested:** 58 new assertions — range coherence, inch/cm conversion, no
recommendation gap, banned safety claims (escape-proof, chew-proof, tensile, pull
rating, waterproof…), localised routing, sitemap and footer wiring.

**⚠ Owner action:** the neck bands are guidance for measuring. Each product's own
adjustment range must be confirmed against delivered stock and stated on the
product page before launch. The page already says this publicly.

---

### E7. Warranty policy ✅ **done this phase**

**Why:** the owner approved a workmanship warranty. The audit showed why it is
worth publishing: **neither BONIA nor Braun Büffel publishes any workmanship
warranty at all** — both offer only a 30-day return window and a faulty-item
channel. Bellroy offers 3 years on wallets, Mackenzie & George a lifetime
workmanship guarantee. Twelve months therefore sits clearly ahead of the two
Malaysian competitors while remaining a promise a small workshop can honour.

**Terms, as agreed:** 12 months · covers stitching and hardware failure ·
repair first, replacement where repair is not possible · customer pays the
inbound postage, we pay the return.

**What shipped:** `/en/warranty`, `/ms/jaminan`, `/zh/bao-xiu` — coverage,
exclusions, remedy, who pays delivery, how to claim, six FAQs, and a note that
the warranty sits on top of statutory consumer rights. The same terms now appear
as a summary above the buy controls on **every product page**, linked to the
policy.

**One source of truth:** the terms live in `src/content/warranty.ts`. The policy
page, the product page and the tests all read from it, so they cannot drift.
`tests/warranty.test.ts` (43 assertions) checks the duration appears in every
language, that exclusions still cover normal wear, water damage and any load
figure, that no "lifetime" or "waterproof" promise crept in, that the date
arithmetic survives a 31 January start, and that the product page does not
hard-code its own number.

**Deliberately excluded:** any load, pull or tensile rating. There is no
manufacturer test report, so there is nothing for a claim to be measured against.
The warranty FAQ says so in plain words.

⚠ **Owner action:** the returns policy still says the return window is "shown on
your order confirmation". If a fixed window is wanted (competitors use 14–30
days), it is a one-line change in `pages-policy.ts` — but it should match what
the order confirmation actually says.

### E2. Product page: lead with specification, not adjectives 🔜

**Why:** Bellroy's product cards state what the object **holds** — "5–12+ cards,
flat bills, coins". That answers the buyer's real question. Our pages have
dimensions but bury them under prose.
**Do:** on every product page, put a compact specification block directly under
the title and price: leather grade, dimensions, hardware, strap width, capacity
where applicable. Above the descriptive paragraphs, not below them.
**Cost:** no new data — the fields already exist.
**Test:** every published product renders a specification block with at least
leather grade and one dimension; no product renders an empty block.

### E3. Fit and dimension disclosure on belts 🔜

**Why:** the pet sizing gap has a sibling. A belt is bought by waist measurement
plus a length, and our belt pages say neither clearly. Braun Büffel at least
names the length.
**Do:** a short "how to choose your belt length" section — measure an existing
belt from the fold of the buckle to the hole you actually use, then choose the
nearest size; expect ±2 cm.
**Test:** belt categories render the guidance; no invented size chart.

### E4. Material honesty block on every leather product 🔜

**Why:** every competitor hides the grade behind "genuine leather". It is our only
structural advantage.
**Do:** a consistent, short block stating the grade (Full Grain / Top Grain),
whether the edge is burnished or painted, and the lining — where the maker can
document it. Where it cannot, **omit the line** rather than generalise.
**Test:** no product page claims a grade the catalogue record does not carry.

### E5. Contact channels live ⛔ **blocked on owner**

**Why:** WhatsApp and email are the only inquiry channels. They are also a
**prerequisite for gateway onboarding** — every Malaysian payment provider wants a
reachable business contact on the site.
**Do:** set `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_CONTACT_EMAIL`. Nothing
else changes; the components already fall back honestly.
**Note:** `NEXT_PUBLIC_*` is inlined at build time — a rebuild is required. This
has bitten before.

### E6. Order tracking clarity ⏳

**Why:** BONIA has "Track My Order" and Braun Büffel puts a tracking code in the
confirmation email. Our model deliberately has no fulfilment-stage tracking —
payment tracking only, by design.
**Do:** make that explicit on the order confirmation and the FAQ: what the
customer will receive, when, and that delivery details are handled on WhatsApp.
Being clear about the absence of tracking is better than an empty tracker.

---

## Optional tier — only if the owner wants them

| # | Item | Value | Risk / note |
| --- | --- | --- | --- |
| O1 | **Wallet + belt gift set** | Leather Avenue's single most relevant product: a Nappa wallet and gun-metal buckle belt set at RM648 → RM324. Sets are natural for us and match our categories. | Merchandising only. **Owner sets the price.** No bundling UI that fabricates a discount. |
| O2 | Collar + lead set merchandising | Already a category. Cross-link from the single-item pages so a buyer sees the set. | Pure linking. Cheap. |
| O3 | Belt width guide | 30 mm versus 35 mm is a real decision for a buyer. | Descriptive only; no strength claims. |
| O4 | Leather grade explainer on category pages | Reinforces E4 at the browsing stage. | Duplicate content risk — write per category or skip. |
| O5 | Care page per material | Verb-tan versus chrome behaves differently in Malaysian humidity. | Only if the maker documents the tanning method. Otherwise omit. |
| O6 | "How to measure" diagram | One illustration would beat paragraphs. | Needs original artwork. **Do not copy a competitor's diagram.** |
| O7 | Gift messaging field | Aspinal and Leatherology both lead with gifting. | Checkout change; affects order schema. Defer past Phase 4. |
| O8 | Warranty statement | ✅ **Done — see E7.** | — |
| O9 | Returns window statement | Mackenzie & George offer 90 days free. | **Owner decision.** |
| O10 | Review collection | Dogs & Horses shows 2,373 reviews. | Needs a provider and moderation. Not worth it before sales exist. |

---

## Explicitly rejected

| Idea | Why rejected |
| --- | --- |
| Free nationwide shipping banner | We have no courier account. Copying BONIA's promise would be uncosted. |
| Naming a courier | Only meaningful once one is appointed. |
| Permanent sale countdown timer | Leather Avenue's −61% pattern destroys price credibility. |
| Adding harnesses, ID tags, poo-bag holders, shoes, card holders | Outside the seven categories. |
| "Compare us with BONIA" storefront table | Competitor names belong in internal research only. |
| Generated pages for every Malaysian town | Phase 4 deliberately stopped at 34 real places with unique geography. |
| A load/strength rating on pet products | No manufacturer test report exists. |

---

## Phase D prerequisites — recorded, not started

The specification reserves payment gateways, couriers, COD configuration, final
shipping rules, WhatsApp, phone, email and live chat for a later phase. So that
phase can start cleanly, these are the things that must exist first:

1. **Contact details on the site** (E5) — required by every gateway.
2. **Registered business entity** — owner to confirm status; SSM registration is
   typically required for merchant onboarding.
3. **Business bank account** in the same name.
4. **A courier account with a written rate card**, including COD remittance terms.
5. **A returns window and a warranty decision** (O8, O9), since both must be
   published before a gateway will approve a merchant.

Recommended gateway when approved: **Billplz Basic** — RM1.25 flat FPX, free
annual plan, next-business-day FPX payout. See
`MALAYSIA_PAYMENT_AND_MERCHANT_RESEARCH.md` §3 for the reasoning and the
RM69.44 crossover point.

---

## Suggested order of work

1. ✅ Sizing guide (E1) — done, now derived from the catalogue.
2. ✅ Warranty (E7) — done.
3. **E2 specification block** — highest value per hour, no new data.
4. **E4 material honesty block** — our only real differentiator.
5. **E3 belt guidance** — closes the second sizing gap.
6. **E6 order tracking clarity** — small, removes a support question.
7. E5 when the owner supplies contact details.
8. Optional tier as the owner chooses.
9. Phase D only after its prerequisites are met.

---

## Success measures

Not traffic — traffic is a lagging and noisy signal for a store with no orders.

| Measure | Target |
| --- | --- |
| Products with a complete specification block | 100% of published |
| Products claiming a grade not in the catalogue record | 0 — test-enforced |
| Sizing or fit guidance published for every sized category | 3 of 3 (collars ✅, belts 🔜, bags n/a) |
| Warranty published, and identical on the policy page and every product page | ✅ test-enforced |
| Invented prices, rates, couriers or contact details on the site | 0 — test-enforced |
| Languages with complete, non-machine-translated copy | 3 of 3 |
| Dead internal links | 0 — build fails |
