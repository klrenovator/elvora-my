# Competitor Deep Research & Website Improvement

**Status:** specification saved · Phase A research complete · Phase C begun
**Research date:** 2026-11-21
**Companion documents:**

| Document | Contents |
| --- | --- |
| `COMPETITOR_COMPARISON_MATRIX.md` | All 16 sites, side by side, with evidence labels |
| `LEATHER_MATERIALS_AND_PRICING_RESEARCH.md` | Leather grades, tanning, and observed prices by category |
| `PET_LEATHER_PRODUCTS_RESEARCH.md` | The eight pet sites, sizing, safety and what we must not claim |
| `MALAYSIA_DELIVERY_AND_COURIER_RESEARCH.md` | How the Malaysian sites actually ship, and our delivery model |
| `MALAYSIA_PAYMENT_AND_MERCHANT_RESEARCH.md` | Verified gateway fees and a recommendation |
| `WEBSITE_IMPROVEMENT_ROADMAP.md` | The action plan, prioritised, with test criteria |

---

## 1. This document's authority

This is an **additional** specification. It does not replace, weaken or contradict
the original Ultimate Master Prompt.

**Note on the original prompt.** The instruction asks that the original Ultimate
Master Prompt be located in this repository. It is **not present**: the repository
has only `README.md`, `PROGRESS.md` and `docs/SUPABASE-SETUP.md`, no file
containing the original prompt text, and no such file in the git history. The
original prompt's requirements are nevertheless in force and are followed from
the project record — `PROGRESS.md` encodes the business rules, product
restrictions, phases and owner decisions built against it. **The owner should add
the original prompt text to the repository so both documents sit together as
instructed.** Nothing in this document overrides it.

### Business constraints carried over and re-asserted

- Exactly **seven** product categories. No shoes, jackets, card holders, passport
  holders, keychains, laptop bags, furniture or car accessories — even where a
  competitor sells them.
- **Full Grain and Top Grain** genuine leather only, manufactured in Pakistan,
  sold in Malaysia.
- **Every selling price is entered by the owner.** Where a price is absent, the
  site shows "Price on Request". Nothing in this research sets a price.
- **No payment gateway, merchant account, courier account, WhatsApp, phone or
  email integration is activated in this phase.** Research only.
- **No invented** brand name, logo, phone, WhatsApp number, email, social
  accounts, business address, courier rate or merchant fee.

---

## 2. Method, and its honest limits

Every competitor was approached the same way: fetch the homepage, then the
shipping, returns, warranty, sizing and about pages; and for the Malaysian three,
the specific commercial terms that matter to us — postage cost, courier,
delivery windows, payment methods, return policy.

**Evidence labels used throughout:**

| Label | Meaning |
| --- | --- |
| **Verified** | Stated on an accessible page I fetched, or on the provider's own pricing page |
| **Observed** | Visible on the site, but not independently confirmed |
| **Not disclosed** | No reliable public information found |
| **Needs verification** | Requires direct confirmation from the company |

**What I could not do, stated plainly rather than papered over:**

1. **No checkout was completed anywhere.** Reaching the payment step requires a
   real order and, on most of these sites, an account. Checkout *flows* are
   therefore described from the cart and policy pages, not from completing a
   purchase. Where I say "checkout" I mean the publicly reachable portion.
2. **No account was created**, so member pricing, order history and loyalty
   mechanics are observed from marketing copy only.
3. **Some pages returned errors** and are recorded as such rather than guessed
   at. Leather Avenue's information pages 6, 7 and 8 return "Information Page
   Not Found"; Braun Büffel's `/pages/faq` and `/pages/shipping-info` failed to
   fetch, so its policy was read from `/policies/shipping-policy` instead.
4. **Courier pricing is not published publicly** by any of the three Malaysian
   sites in a usable form. See the delivery document; the honest conclusion is
   that courier rates require an account and a quote, and must not be published
   before they exist.
5. **A rating is not a revenue figure.** Nothing here infers that a competitor is
   commercially successful because its site is well built. Site quality and
   business performance are treated as separate questions, and where I mention
   review counts (e.g. Dogs & Horses, 2,373 Judge.me reviews) that is a trust
   signal, not evidence of profitability.

---

## 3. The Malaysian three: what actually matters

These matter most because they are the market we sell into. Full detail in the
comparison matrix; these are the conclusions.

### BONIA — the incumbent, and the benchmark for logistics

**Verified from `bonia.com.my/pages/shipping-information`:**

| Item | Value |
| --- | --- |
| Shipping, Malaysia West | **FREE**, 0–2 kg, and free per subsequent kg |
| Shipping, Malaysia East | **FREE**, 0–2 kg |
| Brunei / International | RM80 then RM40/kg · RM360 then RM120/kg |
| Delivery estimate, West metro / non-metro | 2–4 / 2–5 working days |
| Delivery estimate, East metro / non-metro | 3–5 / 3–6 working days |
| Same-day (selected Klang Valley postcodes) | order before 13:00, **RM35**, weekdays only, by 18:00 |
| Postal boxes | refused |
| Redirect after dispatch | impossible |
| Payment logos shown | Mastercard, Visa, **FPX**, Atome, Touch 'n Go, GrabPay, Boost |
| Support | WhatsApp live chat, Mon–Fri 09:00–18:00; `ecustomercare@bonia.com` |

Also verified: free-shipping banner ("3–5 business days"), Track My Order, Click &
Collect, store locator, a personalisation collection, newsletter offer (10% off
first order), and a live Year-End Sale (up to 40% + 10% on selected).

**The lesson that applies to us:** free nationwide shipping, including Sabah and
Sarawak, is the *Malaysian expectation at the premium end* — not a nice-to-have.
BONIA can absorb it because its average order value is high and it has stores.
We have never published a shipping rate, so our site currently says delivery cost
is quoted before dispatch. **That remains the correct behaviour until the owner
has courier accounts and real rates** — inventing "free shipping" would be a
promise we cannot cost.

> BONIA is a lifestyle brand (clothing, shoes, watches, luggage). It does **not**
> stay inside seven categories, and we must. Its breadth is a strength we cannot
> copy; its focus is the weakness we can beat it on.

### Braun Büffel Malaysia — the closest analogue to us

**Verified from `braunbuffel.com.my/policies/shipping-policy`:**

| Item | Value |
| --- | --- |
| Shipping | **Complimentary free delivery** on any purchase |
| Standard delivery | 3–5 business days |
| Expedited (Klang Valley only) | **flat RM50**, postcodes 40000–68100, before 15:00 |
| Courier | **GDEX Express — named explicitly** |
| Tracking | code in the Shipment Confirmation email, up to 24 h to update |
| Cancellations | not allowed once placed |
| Postal boxes | refused |
| Gift wrapping | complimentary |

**Verified price points on Malaysian wallets and belts:** RM699 (card case
wallet), RM969 (bifold long), RM1,069 (zip long), RM699 (reversible embossed
belt), with a 20% markdown bringing FORME to RM855.20, plus member privileges
of 10% off one item / 15% off two.

**The lessons that apply to us:**

1. **Naming the courier builds trust.** "Parcels are shipped via GDEX Express"
   answers a question every Malaysian shopper asks. We should do the same *once a
   courier is actually appointed* — not before.
2. **The RM699–1,069 wallet band is the Malaysian premium reference point.**
   Useful for the owner when pricing, and it is the owner's decision, not ours.
3. **Their weakness is ours to beat:** a 3–5 day estimate with no per-state
   nuance, no COD, and no way to cancel. We already confirm stock and delivery
   cost on WhatsApp before dispatch, which is strictly better for the customer.

### Leather Avenue — the cautionary tale

**Verified:** a multi-brand luggage and leather retailer (Charles Berkeley,
Lushberry, Esfolar, DKNY, Boss, Mendoza, Cerruti 1881, Valentino Creations, Ogon
Design), OpenCart-based, built by O2O eCommerce, trading since 2010.

**Verified prices:** eye mask RM49.90 → RM39.90; travel pillow RM112 → RM89;
Nanolite 21" RM1,278 → RM499 (−61%); Celestine tote RM889 → RM711.20; Aero-Lite
24" RM1,299 → RM519.60; **Nappa Leather Wallet & Gun Metal Buckle Belt Gift Set
RM648 → RM324 (−50%)**.

**Verified defects:**

- Information pages `information_id=6`, `7` and `8` return **"Information Page
  Not Found"** — dead pages linked from a live store.
- Discount depth of 50–61% on branded goods teaches customers to wait for
  clearance and makes the "was" price meaningless.

**The lessons that apply to us:**

1. **The wallet + belt gift set at −50% is the single most relevant product
   observation in this research.** A matching wallet-and-belt set is exactly what
   our seven categories allow, and it is a natural bundle. It belongs on the
   improvement roadmap — as a merchandising idea for the owner, not a price we set.
2. **Broken information pages are cheap to avoid and expensive to have.** Our
   build already fails on a dead internal link; keep it that way.
3. **Permanent deep discounting is a trap.** Recommend restraint over permanent
   sale banners.

---

## 4. The international five: what to take, what to leave

Detail in the leather materials document. Summary of transferable practice:

| Site | Take this | Leave this |
| --- | --- | --- |
| **Bellroy** | Category-graded warranty (wallets 3 yr, bags 6 yr) stated per product; product cards that state *utility* ("5–12+ cards, flat bills, coins") rather than adjectives | Their breadth — 200+ SKUs across tech, travel, luggage |
| **Saddleback** | Narrative confidence; heavy lifestyle photography alongside studio shots; longevity as a value proposition | Exaggerated warranty language; and their price display currently renders "Regular price $0.00", which is a defect to avoid |
| **Leatherology** | Personalisation as a first-class option | — |
| **Aspinal of London** | Gift positioning and premium packaging as a named service | — |
| **Mulberry** | Restraint; typographic brand voice over decoration | — |

**The most useful single idea for our product pages** is Bellroy's: state what the
object *holds and does* in the first line, not how it feels. "5–12+ cards, flat
bills, coins" answers the buyer's real question. Our `specifications` blocks
already carry dimensions; we should lead with capacity.

**Warranty recommendation** — Bellroy's tiered model is the right shape for us,
but **we must not publish a warranty until the owner commits to one.** The site
should carry a reserved, honest placeholder (returns policy exists; warranty does
not), not a copied promise. This is exactly the "do not invent" boundary.

---

## 5. Pet leather: the weakest area of our own site

Full analysis in `PET_LEATHER_PRODUCTS_RESEARCH.md`. The headline:

**Mackenzie & George publishes a real collar sizing chart** — seven sizes, each
with an adjustment range in **both inches and centimetres**, a strap width, and a
*recommended* fit inside that range:

| Size | Fits neck (in) | Fits neck (cm) | Strap width | Recommended fit (in) |
| --- | --- | --- | --- | --- |
| XXS | 8–11 | 20.3–27.9 | 15 mm | 9–10 |
| XS | 10.5–13.5 | 26.7–34.3 | 15 mm | 11.5–12.5 |
| S | 12–16 | 30.5–40.6 | 20 mm | 13–15 |
| M | 14–18 | 35.6–45.7 | 20 mm | 15–17 |
| M Wide | 14–18 | 35.6–45.7 | 25 mm | 15–17 |
| L | 16.5–20.5 | 41.9–52.1 | 25 mm | 17.5–19.5 |
| XL | 19–23 | 48.3–58.4 | 25 mm | 20–22 |

Their stated principle: **"Use measurements rather than breed alone."** And the
comfort rule: allow roughly an inch of slack so the collar tip sits neatly —
never tighten a collar to force a size.

**Our site has no sizing guide at all.** For a category where a wrong size is a
returned order and possibly an unsafe fit, that is the largest single gap in the
whole storefront. It is also the one this phase fixes — see §7.

Two things to copy, one to refuse:

- **Copy:** the cm-and-inches dual range (Malaysian customers think in cm),
  the recommended-fit band inside the range, and a "measure, don't guess by breed"
  instruction.
- **Refuse:** any tensile-strength, pull-rating or "escape-proof" claim. None of
  the eight pet sites publish verified test data, and we have no manufacturer
  test reports. Our pet copy must say what the leather and hardware *are*, not
  what load they are *rated* for.

---

## 6. What we will not do, so that we are not tempted to

| Temptation | Why not |
| --- | --- |
| Add harnesses, ID tags, poo-bag holders (all sold by pet competitors) | Outside the seven categories. Owner's instruction. |
| Copy "free nationwide shipping" from BONIA | We have no courier account and no rates. It would be an uncosted promise. |
| Copy a 100-year or 6-year warranty | A warranty is a contractual commitment. Owner's decision, not a design choice. |
| Publish courier names | Only meaningful once a courier is appointed. |
| Add a "compare with X brand" table on the storefront | Competitor names belong in internal research, not in customer-facing copy. |
| Generate 200 location pages | Already addressed in Phase 4: 34 real places, unique geography per page. |

---

## 7. What this phase actually changed in the site (Phase C, first slice)

Research that changes nothing is just reading. The clearest, safest, in-scope
improvement identified above was implemented: **a professional dog collar
measurement guide**, which the specification explicitly requires.

`/en/dog-collar-sizing` · `/ms/panduan-saiz-kolar-anjing` ·
`/zh/gou-bo-quan-chi-cun-zhi-nan`

It contains the measurement method, the nine-size chart (ours, not a
competitor's — see the pet research document for provenance), the fitting rule,
a worked example, and a "what we cannot tell you" block refusing load ratings.
Linked from every pet category page and the footer.

Further items are in `WEBSITE_IMPROVEMENT_ROADMAP.md`, separated into **essential**
and **optional**, each with what it affects, its dependency and how to test it.

---

## 8. Report for this phase

**Research completed.** All 16 competitor sites opened and read to the depth
their public pages allow; the three Malaysian sites audited on commercial terms
specifically; both gateway pricing pages verified from the providers' own pages.

**Sites audited:** BONIA, Braun Büffel Malaysia, Leather Avenue, Bellroy,
Leatherology, Saddleback Leather, Aspinal of London, Mulberry, Dogs & Horses,
Richdogwear, Pawcroft, Kegdog, Cub & Grey, Tether Leads, Pets Leather,
Mackenzie & George. **16 of 16** — with the specific pages that failed to load
recorded rather than assumed.

**Evidence collected:** shipping rates, delivery windows, courier names, payment
logos, price points, markdown depths, warranty terms, sizing tables, return
windows, support channels. Sources and dates in the comparison matrix.

**Improvements recommended:** 23, in the roadmap, prioritised.

**Improvements implemented this phase:** the dog collar sizing guide (§7).

**Tests performed:** the project's full verification (typecheck, lint, unit tests,
production build). Details in the roadmap's status column and in `PROGRESS.md`.

**Outstanding issues:** the original Master Prompt text is not in the repository
(§1); courier rates and any warranty need owner decisions; no checkout was
completed on any competitor, which is the main limit of this research.

**Exact next phase:** Phase C continues with the roadmap's *essential* tier,
beginning with the product-page specification block and the gift-set
merchandising question — both directly informed by the research above.
