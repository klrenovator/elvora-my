"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/content/types";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { availabilityCopy, resolveAvailability, type ResolvedPrice } from "@/lib/pricing";
import { useCart } from "@/components/cart-provider";

/**
 * Variant selector and purchase actions.
 *
 * Add to cart goes through the cart store, which refuses unpriced items. If the
 * store rejects the add, the button reflects the real reason rather than
 * showing a false success.
 */
export function ProductPurchase({
  product,
  locale,
  price,
}: {
  product: Product;
  locale: Locale;
  price: ResolvedPrice;
}) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const { add } = useCart();
  const availability = resolveAvailability(product);
  const copy = availabilityCopy(availability, locale);

  const [colourId, setColourId] = useState(product.colours[0]?.id ?? "");
  const [sizeId, setSizeId] = useState(product.sizes[0]?.id ?? "");
  const [feedback, setFeedback] = useState<"none" | "added" | "blocked">("none");

  const selectedVariant = useMemo(
    () =>
      product.variants.find(
        (variant) =>
          variant.colourId === colourId && (product.sizes.length === 0 || variant.sizeId === sizeId),
      ),
    [product, colourId, sizeId],
  );

  const orderable =
    price.kind === "fixed" && !!selectedVariant && selectedVariant.stock > 0;

  const sizesForColour = useMemo(
    () =>
      product.sizes.map((size) => {
        const variant = product.variants.find(
          (item) => item.colourId === colourId && item.sizeId === size.id,
        );
        return { size, available: !!variant && variant.stock > 0 };
      }),
    [product, colourId],
  );

  function handleAdd() {
    if (!selectedVariant) return;
    const result = add(product, selectedVariant.id, 1);
    setFeedback(result.ok ? "added" : "blocked");
    if (result.ok) router.refresh();
  }

  return (
    <div className="mt-8">
      {/* Price block */}
      {price.kind === "on-request" ? (
        <div className="border-l-2 border-[color:var(--color-cognac)] bg-[color:var(--color-cream)]/70 px-4 py-3">
          <p className="font-display text-[1.375rem] leading-none text-[color:var(--color-ink-strong)]">
            {dict.common.priceOnRequest}
          </p>
          <p className="mt-2 max-w-md text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            {dict.product.priceOnRequestBody}
          </p>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-[1.875rem] leading-none text-[color:var(--color-ink-strong)]">
              {price.formatted}
            </span>
            {price.compareAt ? (
              <>
                <span className="text-[0.9375rem] text-[color:var(--color-mist)] line-through">
                  {price.compareAt.formatted}
                </span>
                <span className="bg-[color:var(--color-cognac)] px-2 py-0.5 text-[0.625rem] tracking-[0.1em] uppercase text-[color:var(--color-onaccent)]">
                  −{price.discountPercent}%
                </span>
              </>
            ) : null}
          </div>
          <p className="mt-2 text-[0.75rem] text-[color:var(--color-mist)]">{dict.product.priceNote}</p>
        </div>
      )}

      {/* Availability */}
      <p className="mt-5 flex items-center gap-2 text-[0.8125rem]">
        <span
          aria-hidden="true"
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            availability === "in-stock"
              ? "bg-[#5d7a4e]"
              : availability === "partially-available"
                ? "bg-[color:var(--color-clay)]"
                : "bg-[color:var(--color-line-strong)]"
          }`}
        />
        <span className="font-medium text-[color:var(--color-ink-strong)]">{copy.label}</span>
      </p>
      <p className="mt-1.5 max-w-md text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
        {copy.detail}
      </p>

      {/* Colour */}
      {product.colours.length > 1 ? (
        <fieldset className="mt-7">
          <legend className="tracking-eyebrow text-[0.5625rem] text-[color:var(--color-tan)]">
            {dict.product.colour}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.colours.map((colour) => {
              const active = colour.id === colourId;
              return (
                <button
                  key={colour.id}
                  type="button"
                  onClick={() => {
                    setColourId(colour.id);
                    setFeedback("none");
                  }}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 border px-3 py-2 text-[0.8125rem] transition-colors ${
                    active
                      ? "border-[color:var(--color-espresso)] text-[color:var(--color-ink-strong)]"
                      : "border-[color:var(--color-line-strong)] text-[color:var(--color-ink-body)] hover:border-[color:var(--color-clay)]"
                  }`}
                >
                  {colour.swatch ? (
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 rounded-full border border-black/10"
                      style={{ backgroundColor: colour.swatch }}
                    />
                  ) : null}
                  {colour.name[locale]}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Size */}
      {product.sizes.length > 0 ? (
        <fieldset className="mt-6">
          <legend className="tracking-eyebrow text-[0.5625rem] text-[color:var(--color-tan)]">
            {dict.product.size}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizesForColour.map(({ size, available }) => {
              const active = size.id === sizeId;
              return (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => {
                    setSizeId(size.id);
                    setFeedback("none");
                  }}
                  aria-pressed={active}
                  className={`border px-3 py-2 text-left text-[0.8125rem] transition-colors ${
                    active
                      ? "border-[color:var(--color-espresso)] text-[color:var(--color-ink-strong)]"
                      : "border-[color:var(--color-line-strong)] text-[color:var(--color-ink-body)] hover:border-[color:var(--color-clay)]"
                  } ${available ? "" : "opacity-60"}`}
                >
                  <span className="block">{size.label}</span>
                  {size.note ? (
                    <span className="mt-0.5 block text-[0.6875rem] text-[color:var(--color-mist)]">
                      {size.note[locale]}
                    </span>
                  ) : null}
                  {available ? null : (
                    <span className="mt-0.5 block text-[0.6875rem] text-[color:var(--color-mist)]">
                      {availabilityCopy("out-of-stock", locale).label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {orderable ? (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex h-12 items-center justify-center bg-[color:var(--color-espresso)] px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)] transition-colors hover:bg-[color:var(--color-cognac-deep)]"
          >
            {dict.cart.addToCart}
          </button>
        ) : price.kind === "on-request" ? (
          <Link
            href={pathFor("contact", locale)}
            className="inline-flex h-12 items-center justify-center bg-[color:var(--color-espresso)] px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)] transition-colors hover:bg-[color:var(--color-cognac-deep)]"
          >
            {dict.product.requestQuote}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="inline-flex h-12 cursor-not-allowed items-center justify-center bg-[color:var(--color-espresso)]/40 px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)]"
          >
            {dict.product.unavailable}
          </button>
        )}

        <Link
          href={pathFor("contact", locale)}
          className="inline-flex h-12 items-center justify-center border border-[color:var(--color-line-strong)] px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ink-strong)] transition-colors hover:border-[color:var(--color-cognac)]"
        >
          {dict.common.notifyMe}
        </Link>
      </div>

      {/* Feedback: reflects what actually happened */}
      {feedback === "added" ? (
        <p role="status" className="mt-4 flex flex-wrap items-center gap-3 text-[0.8125rem] text-[color:var(--color-ink-body)]">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="text-[#5d7a4e]">
              ✓
            </span>
            {dict.cart.added}
          </span>
          <Link
            href={pathFor("cart", locale)}
            className="border-b border-[color:var(--color-line-strong)] pb-0.5 text-[color:var(--color-cognac)] hover:border-[color:var(--color-cognac)]"
          >
            {dict.cart.viewCart} →
          </Link>
        </p>
      ) : null}
      {feedback === "blocked" ? (
        <p role="status" className="mt-4 text-[0.8125rem] text-[color:var(--color-cognac-deep)]">
          {dict.cart.issueNowOnRequest}
        </p>
      ) : null}

      <p className="mt-4 text-[0.75rem] text-[color:var(--color-mist)]">
        {dict.product.sku}: {selectedVariant?.sku ?? product.sku}
      </p>
    </div>
  );
}
