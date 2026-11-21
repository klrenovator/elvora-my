# Malaysia Payment and Merchant Research

**Research date:** 2026-11-21 · Internal document · **Nothing here is activated**
Current site behaviour: **Cash on Delivery only.** `features.payments` stays `false` until the owner explicitly approves otherwise.

---

## 1. What the Malaysian market actually offers

**Verified** from BONIA's live storefront payment logos: **Mastercard, Visa, FPX,
Atome, Touch 'n Go eWallet, GrabPay, Boost.**

**Verified** from Billplz's own pricing page: FPX, Visa/Mastercard, DuitNow
Transfer, DuitNow QR, Touch 'n Go, Boost, GrabPay, and Atome instalments.

The pattern is unmistakable: **a Malaysian store that offers only cards is
leaving money on the table.** FPX — direct online banking — is the default for a
large share of local e-commerce, and e-wallets (Touch 'n Go above all) matter for
younger buyers. Cash on delivery remains common for first-time buyers who do not
yet trust a store.

---

## 2. Verified fee comparison

**All figures below are from the providers' own published pages, read on
2026-11-21.** Where a figure could not be read from the provider directly, the row
says so instead of borrowing a number from a blog.

| Provider | FPX (B2C) | Card (local) | E-wallets | Setup / annual | Settlement | Source |
| --- | --- | --- | --- | --- | --- | --- |
| **Billplz — Basic** | **RM1.25** flat | **1.8%** | 1.5% (separate application) | **Free** annual | Next business day (FPX) | **Verified** — `main.billplz.com/pricing` |
| **Billplz — Standard** | **RM0.75** flat | **1.5%** | 1.5% | **RM999/yr** | Next business day | **Verified** — same page |
| **Billplz — B2B FPX** | RM3.00 (Basic) / RM2.00 (Standard) | — | — | — | — | **Verified** |
| **Billplz — non-MYR card** | — | 3.8% (Basic) / 3.5% (Std) | — | — | T+2 | **Verified** |
| **Billplz — Atome** | — | — | 6%, 3-month instalments | Separate application | Wed & Fri | **Verified** |
| **toyyibPay — Standard** | **RM1.00** (B2C) | **1.5%** local, 3.5% foreign | DuitNow QR 1% or RM1 | RM100 onboarding + RM100/yr | 1–4 business days (FPX) | **Needs verification** — pricing page failed to fetch; figures from secondary sources only |
| **toyyibPay — Santai** | **RM0.00** B2C FPX (non-profits only) | — | — | RM100 + RM100/yr | ~10 business days | **Needs verification** — same |
| **senangPay** | ~RM1.00 or 1.5%, whichever higher | ~RM0.65 or 2.5% | ~RM0.65 or 1.5% | Starter ~RM199/yr | Not confirmed | **Needs verification** — pricing page failed to fetch; secondary sources disagree with each other (I saw both a 2015 RM1.50 FPX figure and a 2026 "RM1 or 1.5%" figure) |
| **iPay88** (now NTT DATA / ADAPTIS) | Not published | Not published | Not published | Not published | Not published | **Not disclosed** — site presents the product, no public rate card |
| **Stripe Malaysia** | **3% + RM1.00** | **3% + RM1.00** domestic; +1% international; +2% FX | Alipay 2.9% + RM1; GrabPay 3% | **None** | Standard schedule | **Verified** — `stripe.com/en-my/pricing` |

### Reading the table honestly

- **Billplz is the only provider whose complete rate card I could verify from the
  source.** That matters more than it sounds: a fee comparison built on blog
  posts is a comparison of other people's guesses.
- **senangPay's public numbers conflict.** One source quoted RM1.50 FPX from a
  2015 support article; another quoted "RM1 or 1.5%, whichever is higher" from a
  July 2026 page. Neither is the provider's current page, which would not load.
  **I will not present a number I could not read at the source.** It is marked
  Needs verification and must be confirmed directly before it influences a
  decision.
- **iPay88 no longer presents itself as iPay88 on its Malaysian site** — it
  redirects to NTT DATA Payment Services' "ADAPTIS e-Commerce" product. It
  publishes no public pricing, which is normal for enterprise acquirers: you
  negotiate. Its customer list (AirAsia, Watsons, Manulife, SSM) shows where it
  sits — larger merchants with underwriting.
- **Stripe is the most expensive per transaction and the easiest to start.**
  3% + RM1.00 on a RM200 order is RM7.00, versus RM1.25 flat for FPX on Billplz
  Basic. On a RM200 basket, FPX via Billplz costs **1/5.6th** as much as Stripe's
  card rate. Stripe's value is international cards and developer experience, not
  local cost.

### The crossover, which is the number that actually decides this

A flat FPX fee and a percentage card fee cross over. On **Billplz Basic**:

- FPX RM1.25 beats card 1.8% above a basket of **RM69.44** (1.8% of 69.44 ≈ 1.25).
- Below RM69.44, the card rate is *cheaper* than FPX.

For our likely basket — a wallet, a belt, a collar-and-lead set — most orders sit
above RM69, so **FPX is the cheaper rail for our typical order**, and it is also
the one Malaysian customers expect. The card rail matters for buyers without
online banking.

---

## 3. Recommendation

**For the phase in which online payment is eventually approved**, in order:

1. **Billplz Basic** as the first gateway. Reasons: verified RM1.25 FPX, free
   annual plan, next-business-day FPX payout, all-in-one dashboard, 30+ plugins
   and a documented API. No fixed cost means no downside to starting small. Move
   to Standard (RM999/yr, RM0.75 FPX) only once volume exceeds roughly 167 FPX
   transactions a month, which is the break-even on the annual fee.
2. **Add e-wallets** once volume justifies the separate application — Touch 'n Go
   first, given its ubiquity in Malaysia.
3. **Consider Stripe only** if international card sales become material. Not
   before: at 3% + RM1.00 it is a poor deal for domestic orders.
4. **Do not pursue iPay88/NTT DATA** at this stage. Enterprise acquirers want
   volume and underwriting; a new store with COD-only history is not an obvious
   fit, and no public pricing exists to plan against.
5. **Do not treat BNPL (Atome at 6%)** as a conversion lever. Six percent is a
   large slice of margin on a RM300 order, and it invites a customer segment that
   is not our priority.

**None of this is to be implemented now.** It is a recommendation for the owner's
decision in a later phase, and it changes nothing about the current build.

---

## 4. Why our architecture is already ready

This was a design decision made earlier in the project, and the research confirms
it was the right one:

- Orders are created in `pending-payment` with method `on-delivery`.
- Settling sets status `paid` and records `{ providerReference: "CASH-<ref>" }`.
- `features.payments` is a **flag**, defaulting off, that gates payment UI.
- The order model has a `providerReference` field precisely so a gateway
  reference can sit in the same place a cash reference sits today.

So adding Billplz later means: a checkout step, a webhook handler that calls the
same "settle" path, and flipping the flag. **No schema migration, no rewrite of
the order flow, no change to the admin.** That is what "allow online payments
later without rebuilding" was supposed to mean, and on inspection it holds.

---

## 5. What would have to be true before switching on payments

Documented so nobody assumes the gateway fee is the whole cost:

| Requirement | Status |
| --- | --- |
| Registered business (SSM) for merchant onboarding | **Unknown — owner must confirm** |
| Malaysian bank account in the business name | **Unknown — owner must confirm** |
| Business website with published contact details (most gateways require it) | **Blocked** — WhatsApp and email are deliberately unset |
| Refund / returns policy published | Exists as a page; window is owner's decision |
| Privacy policy and PDPA statement | Exists |
| Terms of service | Exists |
| Sandbox testing before go-live | Not started |
| Someone to reconcile payouts against orders | Owner, manually, via the admin |

**The blocker that is easy to miss:** every Malaysian gateway requires a
reachable business contact on the website as part of onboarding. Our contact
details are intentionally blank placeholders because the owner has not supplied
them. **Payment onboarding therefore cannot begin until contact details exist** —
which makes that a prerequisite of Phase D, not a detail of it.

---

## 6. Legal and tax notes — flagged, not resolved

Offered as questions for the owner's accountant, not as advice:

- **SST** treatment of goods sold online.
- Whether the business is a sole proprietorship or Sdn Bhd, which changes gateway
  onboarding requirements and personal liability.
- **PDPA 2010** obligations for storing customer names, phone numbers and
  addresses — relevant because COD orders are address-heavy.
- Consumer protection rules on refunds and on displaying prices inclusive of tax.

None of these block the current build. All of them block a payment integration.
