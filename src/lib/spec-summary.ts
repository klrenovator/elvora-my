import type { Locale } from "@/i18n/config";
import type { Product } from "@/content/types";
import { getDictionary } from "@/lib/dictionary";

/**
 * The at-a-glance specification strip on a product page.
 *
 * Why it exists: the competitor audit found Bellroy's product cards state what an
 * object *holds* — "5–12+ cards, flat bills, coins" — before anything about how it
 * feels. That answers the buyer's actual question. Our own pages carried the same
 * facts in a specification table far below the description, where a customer
 * scrolling on a phone never reaches them.
 *
 * Two rules govern what appears here, and both matter more than the layout:
 *
 * 1. **Only real values.** Every row is read from the catalogue. Where the maker
 *    has not confirmed a figure the value literally says so ("Being measured"),
 *    which is honest but useless as a headline — so `isPending` detects those and
 *    the row is dropped from the strip rather than presented as a feature.
 * 2. **Never a strength or load claim.** Pet products in particular must not
 *    suggest a pull rating; that is enforced in the tests.
 */

/** Phrases our own catalogue uses to mean "we do not have this figure yet". */
const PENDING_MARKERS = [
  "being measured",
  "sedang diukur",
  "正在测量",
  "measuring in progress",
  "to be confirmed",
  "akan disahkan",
  "待确认",
];

export function isPendingValue(value: string): boolean {
  // An empty value is not a fact, so it must never reach the strip as one.
  if (!value.trim()) return true;
  const normalised = value.toLowerCase();
  return PENDING_MARKERS.some((marker) => normalised.includes(marker));
}

export interface SpecChip {
  label: string;
  value: string;
}

/**
 * Rows are chosen by what a buyer needs to decide, in that order, not by the
 * order they happen to sit in the catalogue's specification groups.
 */
const PRIORITY: { match: RegExp; key: string }[] = [
  // Capacity first — the Bellroy lesson.
  { match: /^(capacity|interior dimensions|what fits)$/i, key: "capacity" },
  // Fit: sizes and ranges.
  { match: /^(neck range|length choices|available lengths|sizes?)$/i, key: "fit" },
  // Then the physical facts.
  { match: /^(dimensions|length|width|strap width|height|depth)$/i, key: "dimension" },
  // Then construction.
  { match: /^(hardware|buckle|clip|clasp|stitching|lining|edge finish)$/i, key: "hardware" },
];

export function specChips(product: Product, locale: Locale): SpecChip[] {
  const dict = getDictionary(locale);
  const chips: SpecChip[] = [];

  // Leather grade always leads: it is the one thing every competitor hides.
  chips.push({
    label: dict.product.leatherType,
    value:
      product.leatherType === "full-grain" ? dict.product.fullGrain : dict.product.topGrain,
  });

  const candidates: { key: string; label: string; value: string }[] = [];

  /**
   * Rows the catalogue repeats that are already represented by the grade chip.
   * Without this the strip renders "Leather: Full grain" twice, once from the
   * grade and again from the catalogue's own material row — which reads as a bug.
   */
  const alreadyShown = /^(leather|kulit|皮革|material|bahan|材质|made in|dibuat di|产地)$/i;

  /**
   * Instruction rows, not attributes. "How to measure" and "what is included"
   * belong in the description and the specification table, where there is room
   * to explain them — as a chip they take a slot from a real dimension.
   */
  const instructional = /^(how to measure|cara mengukur|测量方式|care|penjagaan|保养)$/i;

  for (const group of product.specifications) {
    for (const item of group.items) {
      const label = item.label[locale];
      const value = item.value[locale];
      if (isPendingValue(value)) continue;
      if (alreadyShown.test(label.trim())) continue;
      if (instructional.test(label.trim())) continue;

      const priority = PRIORITY.findIndex((entry) => entry.match.test(label));
      // Anything that is not a recognised decision-making row still appears, but
      // after the prioritised ones, so nothing confirmed is silently hidden.
      candidates.push({ key: priority === -1 ? "zz" : String(priority), label, value });
    }
  }

  // Stable sort: priority bucket first, catalogue order within a bucket.
  candidates.sort((a, b) => a.key.localeCompare(b.key));

  // Cap the strip at four rows plus the grade. A wall of chips is not a summary.
  for (const candidate of candidates.slice(0, 4)) {
    chips.push({ label: candidate.label, value: candidate.value });
  }

  return chips;
}

/** True when the product has at least one confirmed headline attribute. */
export function hasConfirmedSpecs(product: Product, locale: Locale): boolean {
  return specChips(product, locale).length > 1;
}

/** Rows that exist but are still pending, so the page can say so once. */
export function pendingSpecCount(product: Product, locale: Locale): number {
  return product.specifications.reduce(
    (count, group) =>
      count + group.items.filter((item) => isPendingValue(item.value[locale])).length,
    0,
  );
}
