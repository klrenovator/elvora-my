import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Product } from "@/content/types";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { availabilityCopy, resolveAvailability, resolvePrice } from "@/lib/pricing";

/**
 * Product card used in listings and related-product rows.
 *
 * Price is resolved through the single pricing engine, so an unpriced product
 * shows "Price on request" here too rather than a blank or a zero.
 */
export function ProductCard({
  product,
  locale,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}: {
  product: Product;
  locale: Locale;
  sizes?: string;
  priority?: boolean;
}) {
  const dict = getDictionary(locale);
  const price = resolvePrice(product, locale);
  const availability = resolveAvailability(product);
  const image = product.images[0];
  const href = pathFor("product", locale, { slug: product.slug[locale] });

  return (
    <article className="group flex flex-col">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-cream)]">
          <Image
            src={image.src}
            alt={image.alt[locale]}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.035]"
          />
          {product.merchandising.newArrival ? (
            <span className="absolute left-3 top-3 bg-[color:var(--color-espresso)]/85 px-2 py-1 text-[0.5625rem] tracking-[0.14em] uppercase text-[color:var(--color-ivory)]">
              {newLabel[locale]}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <h3 className="font-display text-[1.1875rem] leading-snug text-[color:var(--color-ink-strong)]">
          <Link href={href} className="transition-colors hover:text-[color:var(--color-cognac)]">
            {product.name[locale]}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
          {product.shortDescription[locale]}
        </p>

        <p className="mt-3 text-[0.75rem] tracking-[0.06em] uppercase text-[color:var(--color-ink-muted)]">
          {dict.product.leatherType}:{" "}
          {product.leatherType === "full-grain" ? dict.product.fullGrain : dict.product.topGrain}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p
            className={
              price.kind === "on-request"
                ? "text-[0.8125rem] italic text-[color:var(--color-ink-muted)]"
                : "font-display text-[1.25rem] leading-none text-[color:var(--color-ink-strong)]"
            }
          >
            {price.kind === "on-request" ? dict.common.priceOnRequest : price.formatted}
          </p>
          {availability === "unconfigured" || availability === "out-of-stock" ? (
            <p className="text-right text-[0.6875rem] leading-tight text-[color:var(--color-mist)]">
              {availabilityCopy(availability, locale).label}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const newLabel: Record<Locale, string> = {
  en: "New",
  ms: "Baharu",
  zh: "新品",
};
