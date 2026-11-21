# Malaysia Delivery and Courier Research

**Research date:** 2026-11-21 · Internal document · **Nothing here is activated**
Status: research only. No courier account exists, no rate was agreed, no rate is published on the site.

---

## 1. What the two comparable Malaysian brands actually do

### BONIA — verified from `bonia.com.my/pages/shipping-information`

| Item | Detail |
| --- | --- |
| West Malaysia | **FREE** — 0–2 kg, and free for each subsequent kg |
| East Malaysia (Sabah, Sarawak, Labuan) | **FREE** — 0–2 kg |
| Brunei | RM80 first 2 kg, then RM40/kg |
| International | RM360 first 2 kg, then RM120/kg |
| West metro | 2–4 working days |
| West non-metro | 2–5 working days |
| East metro | 3–5 working days |
| East non-metro | 3–6 working days |
| Same-day | Selected Klang Valley postcodes only, order before **13:00**, delivered by **18:00**, **RM35**, weekdays only (no weekends, no public holidays) |
| Dispatch days | Monday–Friday plus half-day Saturday |
| PO boxes | Not accepted |
| Redirect after dispatch | Not possible — address cannot be changed |
| Split shipments | Items may arrive separately (multi-warehouse) |
| Self-collect at office | Not offered (Click & Collect at stores is) |

**What this tells us.** Free nationwide shipping, Sabah and Sarawak included, is
the standard at the premium end of this market. BONIA can do it because its
average order value is high and it has physical stores absorbing overheads. It
also offers a paid same-day tier inside Klang Valley — a service, not a discount.

### Braun Büffel Malaysia — verified from `braunbuffel.com.my/policies/shipping-policy`

| Item | Detail |
| --- | --- |
| Standard | **Complimentary free delivery**, any purchase |
| Delivery estimate | 3–5 business days |
| Expedited | Klang Valley only, **flat RM50**, postcodes **40000–68100**, order before 15:00 |
| Courier | **GDEX Express** — named in the policy |
| Tracking | Code in the Shipment Confirmation email; allow up to 24 h |
| Multi-venue orders | Billed as separate shipments |
| Cancellation | **Not permitted once placed** |
| PO boxes | Not accepted |

**Two observations worth acting on.** First, naming the courier is cheap and
answers a common question — GDEX is stated plainly, so a customer knows exactly
what to expect. Second, the postcode list (40000–68100) is how a real operator
defines "Klang Valley" for a service tier: **by postcode range, not by city
name.** Our 34 delivery-area pages are built on postcode prefixes, so we are
structurally ready for exactly this kind of rule when the owner sets one.

### Leather Avenue

Shipping terms were **not reachable** — `information_id` 6, 7 and 8 all return
"Information Page Not Found". Recorded as a competitor weakness, not inferred.

---

## 2. Courier options in Malaysia

| Courier | Public rate information | Notable | Source |
| --- | --- | --- | --- |
| **Pos Malaysia** | **Public rate calculator** (postcode → postcode → weight, max 30 kg) | Claims 96% next-day performance vs 78% industry average, citing MCMC Courier Challenge 2022; publishes a fuel surcharge notice; nationwide outlet network incl. rural and East Malaysia | `pos.com.my/send/ratecalculator` — Verified |
| **J&T Express** | **Shipping price estimation tool** on the homepage; full rates not published as a table | Very large e-commerce volume; own claim centre and complaint centre | `jtexpress.my` — Observed |
| **Ninja Van** | Advertises "**Start Shipping from RM5**" as an entry price; full rate card behind sign-up | Ninja Biz app; Ninja Packs prepaid packaging; B2B and cold chain arms | `ninjavan.co/en-my` — Observed |
| **DHL eCommerce** | Not published publicly | International strength; used by cross-border sellers | Not disclosed |
| **GDEX** | Not published publicly | **The courier Braun Büffel Malaysia actually uses** | Verified via Braun Büffel policy |

**The honest position on rates.** Of the five, only Pos Malaysia publishes a
usable public calculator. J&T and Ninja Van publish entry-level marketing prices
and put the real rate card behind an account. **A per-parcel rate therefore cannot
be stated for our store without opening an account and getting a quote** — which
is exactly what the specification forbids doing in this phase.

**Therefore:** the site must continue to say that delivery cost is confirmed
before dispatch. It must not say "free", must not say "RM x flat", and must not
name a courier. Every one of those would be a fabricated term.

---

## 3. The structural facts that shape a future rate table

These are physical and geographic, verified from our own `malaysia.ts` and
`delivery-areas.ts`, not from any competitor:

1. **Malaysia has two distinct shipping problems separated by the South China
   Sea.** Peninsular Malaysia has road and rail continuity; Sabah and Sarawak do
   not. Any single flat rate for "Malaysia" quietly overcharges Peninsular
   customers or undercharges East Malaysian ones.
2. **East Malaysia costs more and takes longer**, and BONIA's own numbers confirm
   the industry view: 2–4 days West metro versus 3–6 days East non-metro.
3. **Klang Valley is dense and worth a premium tier.** Same-day and next-day
   services are only economic where stops are close together — which is why both
   competitors restrict their expedited tier to a postcode range.
4. **Weight, not distance, drives parcel cost** at low volumes. Leather wallets,
   belts and collars are light; handbags and sets are heavier and bulkier. A
   rate table keyed on weight bands (0–1 kg, 1–2 kg, 2 kg+) will match reality
   better than a flat national fee.
5. **Our 34 delivery areas already carry postcode ranges.** That means a future
   rate table can be expressed as "postcode prefix → zone → rate" without
   restructuring any page.

---

## 4. What a sane delivery policy looks like for us — proposed, not published

Offered as a starting point for the owner's decision. **None of this is live.**

**Recommended shape:**

- **Two zones minimum:** Peninsular Malaysia, and Sabah/Sarawak/Labuan. Three if
  the owner wants a Klang Valley tier.
- **Weight-banded**, because that is how couriers bill.
- **Flat fee per order, not per item**, so a matching collar-and-lead set does not
  penalise the buyer. This is a real conversion argument, not a guess.
- **Free above a threshold** only if the owner can cost it against a known rate;
  otherwise it is BONIA's move played with BONIA's balance sheet and our margins.
- **COD orders:** the parcel value collected on delivery. Any COD surcharge a
  courier charges must be recovered somewhere — the owner must decide whether it
  is absorbed, added to the shipping fee, or reflected in COD eligibility by zone.
  This is the single most under-estimated cost in a COD business.
- **East Malaysia:** never quietly exclude it. If a rate is uneconomic at small
  order values, say so plainly on the delivery page rather than refusing at
  checkout.

**What must be true before any of it goes live:**

1. A signed courier account with a written rate card.
2. A tested volumetric/weight assumption for our actual packaging.
3. A COD remittance schedule in writing (how often the courier pays us, and what
   happens to undelivered COD parcels).
4. Insurance or declared-value terms for a lost parcel.

Until 1–4 exist, the honest published statement is the current one.

---

## 5. COD — the operational reality

Since COD is our only payment method, delivery is not just logistics; it is
collection. The risks are worth writing down before they happen:

| Risk | Why it matters | Mitigation to discuss with a courier |
| --- | --- | --- |
| **Refused parcels** | A COD parcel nobody pays for costs a return leg | Return fee terms; who pays |
| **Remittance lag** | Cash collected sits with the courier for days | Payout frequency and statement format |
| **Partial collection** | Customer pays less than the order value | Policy in writing; courier behaviour |
| **Fake orders** | COD invites prank orders since nothing is paid upfront | Confirmation call/WhatsApp before dispatch — which we already do |
| **Cash handling** | Parcel value limits per shipment | Courier COD cap per parcel |
| **Undeliverable address** | Return to sender after 2–3 attempts | Attempt rules and return charges |

**The one control we already have** is a manual confirmation step on WhatsApp
before dispatch. For a COD store that is not a nicety — it is the primary fraud
control and the reason our order model confirms stock before dispatch.

---

## 6. Delivery-page copy standard

Derived from the above, and already enforced by our test suite's banned-phrase
scan (which rejects "free delivery", "next day", "same day", 1–3 day claims, flat
"RM n" figures and competitor courier names):

**Allowed:** what the process is, who confirms it, that cost is quoted before
dispatch, that East Malaysia takes longer, that PO boxes are not accepted, that
address changes after dispatch are difficult.

**Not allowed until verified:** any price, any named courier, any delivery-time
guarantee, any free-shipping claim.

That test exists precisely so a future edit cannot reintroduce an invented rate
by accident. It has already caught one near-miss.
