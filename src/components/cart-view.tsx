"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { formatSen } from "@/lib/pricing";
import type { CartIssue } from "@/lib/cart-store";
import { useCart } from "@/components/cart-provider";

/**
 * Cart contents.
 *
 * Every line is rendered from the reconciled view, so a stale price, a sold-out
 * option or a delisted product is visible to the customer *before* checkout
 * rather than failing later. Checkout is gated on `readyForCheckout`.
 */
export function CartView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { reconciled, hydrated, updateQuantity, remove, confirmPrices, dropUnavailable } = useCart();

  if (!hydrated) {
    return (
      <p className="py-16 text-[0.9375rem] text-[color:var(--color-mist)]" aria-live="polite">
        {dict.common.loading}…
      </p>
    );
  }

  if (reconciled.lines.length === 0) {
    return (
      <div className="border-t border-[color:var(--color-line)] py-16">
        <p className="font-display text-[1.5rem] text-[color:var(--color-ink-strong)]">
          {dict.cart.empty}
        </p>
        <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-muted)]">
          {dict.cart.emptyBody}
        </p>
        <Link
          href={pathFor("home", locale)}
          className="mt-7 inline-flex h-12 items-center justify-center bg-[color:var(--color-espresso)] px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)] transition-colors hover:bg-[color:var(--color-cognac-deep)]"
        >
          {dict.cart.continueShopping}
        </Link>
      </div>
    );
  }

  const priceChanged = reconciled.lines.some((entry) => entry.issues.includes("price-changed"));
  const hasUnavailable = reconciled.lines.some((entry) => !entry.orderable);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-8">
        <ul className="divide-y divide-[color:var(--color-line)] border-y border-[color:var(--color-line)]">
          {reconciled.lines.map((entry) => {
            const { line, product, variant, currentPrice, issues } = entry;
            const colour = product?.colours.find((item) => item.id === variant?.colourId);
            const size = product?.sizes.find((item) => item.id === variant?.sizeId);
            const image = product?.images[0];

            return (
              <li key={`${line.productId}-${line.variantId}`} className="flex gap-4 py-5 sm:gap-6">
                {image && product ? (
                  <Link
                    href={pathFor("product", locale, { slug: product.slug[locale] })}
                    className="relative block h-24 w-20 shrink-0 overflow-hidden bg-[color:var(--color-cream)] sm:h-28 sm:w-24"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt[locale]}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>
                ) : null}

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <div className="min-w-0">
                      <h3 className="font-display text-[1.0625rem] leading-snug text-[color:var(--color-ink-strong)]">
                        {product ? (
                          <Link
                            href={pathFor("product", locale, { slug: product.slug[locale] })}
                            className="hover:text-[color:var(--color-cognac)]"
                          >
                            {product.name[locale]}
                          </Link>
                        ) : (
                          line.productId
                        )}
                      </h3>
                      <p className="mt-1 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
                        {[colour?.name[locale], size?.label].filter(Boolean).join(" · ")}
                      </p>
                    </div>

                    <p className="font-display text-[1.0625rem] text-[color:var(--color-ink-strong)]">
                      {currentPrice?.kind === "fixed"
                        ? formatSen(currentPrice.amountSen, locale)
                        : dict.common.priceOnRequest}
                    </p>
                  </div>

                  {/* Issues are stated plainly, never hidden */}
                  {issues.length > 0 ? (
                    <div className="mt-2.5 border-l-2 border-[color:var(--color-clay)] bg-[color:var(--color-cream)]/60 px-3 py-2">
                      <ul className="space-y-1">
                        {issues.map((issue) => (
                          <li
                            key={issue}
                            className="text-[0.75rem] leading-relaxed text-[color:var(--color-ink-body)]"
                          >
                            {issueMessage(issue, dict, variant?.stock ?? 0)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-3">
                    <div className="inline-flex items-center border border-[color:var(--color-line-strong)]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.variantId, line.quantity - 1)}
                        aria-label={`${dict.cart.quantity} −`}
                        className="h-8 w-8 text-[color:var(--color-ink-body)] transition-colors hover:bg-[color:var(--color-cream)]"
                      >
                        −
                      </button>
                      <span
                        aria-live="polite"
                        className="min-w-8 text-center text-[0.8125rem] text-[color:var(--color-ink-strong)]"
                      >
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.variantId, line.quantity + 1)}
                        disabled={!!variant && line.quantity >= variant.stock}
                        aria-label={`${dict.cart.quantity} +`}
                        className="h-8 w-8 text-[color:var(--color-ink-body)] transition-colors hover:bg-[color:var(--color-cream)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(line.variantId)}
                      className="text-[0.75rem] text-[color:var(--color-mist)] underline decoration-[color:var(--color-line-strong)] underline-offset-4 transition-colors hover:text-[color:var(--color-cognac)]"
                    >
                      {dict.cart.remove}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap gap-4">
          <Link
            href={pathFor("home", locale)}
            className="text-[0.8125rem] text-[color:var(--color-ink-body)] underline decoration-[color:var(--color-line-strong)] underline-offset-4 hover:text-[color:var(--color-cognac)]"
          >
            {dict.cart.continueShopping}
          </Link>
          {hasUnavailable ? (
            <button
              type="button"
              onClick={dropUnavailable}
              className="text-[0.8125rem] text-[color:var(--color-ink-body)] underline decoration-[color:var(--color-line-strong)] underline-offset-4 hover:text-[color:var(--color-cognac)]"
            >
              {dict.cart.removeUnavailable}
            </button>
          ) : null}
        </div>
      </div>

      {/* Summary */}
      <div className="lg:col-span-4">
        <div className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-cream)]/60 p-6">
          <h2 className="tracking-eyebrow text-[0.5625rem] text-[color:var(--color-tan)]">
            {dict.cart.subtotal}
          </h2>

          <div className="mt-4 flex items-baseline justify-between gap-4">
            <span className="text-[0.875rem] text-[color:var(--color-ink-body)]">
              {reconciled.itemCount} {dict.cart.itemCount}
            </span>
            <span className="font-display text-[1.5rem] leading-none text-[color:var(--color-ink-strong)]">
              {formatSen(reconciled.subtotalSen, locale)}
            </span>
          </div>

          <p className="mt-3 text-[0.75rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            {dict.cart.shippingNote}
          </p>

          {priceChanged ? (
            <button
              type="button"
              onClick={confirmPrices}
              className="mt-5 w-full border border-[color:var(--color-cognac)] px-4 py-2.5 text-[0.75rem] tracking-[0.12em] uppercase text-[color:var(--color-cognac)] transition-colors hover:bg-[color:var(--color-cognac)] hover:text-[color:var(--color-onaccent)]"
            >
              {dict.cart.confirmNewPrice}
            </button>
          ) : null}

          {reconciled.readyForCheckout ? (
            <Link
              href={pathFor("checkout", locale)}
              className="mt-5 flex h-12 items-center justify-center bg-[color:var(--color-espresso)] px-6 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)] transition-colors hover:bg-[color:var(--color-cognac-deep)]"
            >
              {dict.cart.checkout}
            </Link>
          ) : (
            <>
              <span
                aria-disabled="true"
                className="mt-5 flex h-12 cursor-not-allowed items-center justify-center bg-[color:var(--color-espresso)]/35 px-6 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)]"
              >
                {dict.cart.checkout}
              </span>
              <p className="mt-3 text-[0.75rem] leading-relaxed text-[color:var(--color-cognac-deep)]">
                {dict.cart.checkoutBlocked}
              </p>
            </>
          )}

          <p className="mt-4 border-t border-[color:var(--color-line)] pt-4 text-[0.75rem] leading-relaxed text-[color:var(--color-mist)]">
            {dict.cart.priceNote}
          </p>
        </div>
      </div>
    </div>
  );
}

function issueMessage(
  issue: CartIssue,
  dict: ReturnType<typeof getDictionary>,
  stock: number,
): string {
  switch (issue) {
    case "unavailable":
      return dict.cart.issueUnavailable;
    case "variant-missing":
      return dict.cart.issueVariantMissing;
    case "out-of-stock":
      return dict.cart.issueOutOfStock;
    case "now-on-request":
      return dict.cart.issueNowOnRequest;
    case "price-changed":
      return dict.cart.issuePriceChanged;
    case "quantity-exceeds-stock":
      return stock > 0
        ? dict.cart.stockLimit.replace("{n}", String(stock))
        : dict.cart.issueOutOfStock;
    default:
      return "";
  }
}
