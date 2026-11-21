"use client";

import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { useCart } from "@/components/cart-provider";

/**
 * Header cart link with a live count.
 *
 * The count renders only after hydration, so the server-rendered HTML (which
 * cannot know the stored cart) does not flash "0" at a returning customer.
 */
export function CartIndicator({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { reconciled, hydrated } = useCart();
  const count = reconciled.itemCount;

  return (
    <Link
      href={pathFor("cart", locale)}
      aria-label={`${dict.cart.title}${hydrated && count > 0 ? ` (${count})` : ""}`}
      className="relative inline-flex h-9 w-9 items-center justify-center border border-[color:var(--color-line-strong)] text-[color:var(--color-ink-body)] transition-colors hover:border-[color:var(--color-cognac)]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 18 18"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M2.5 5.5h13l-1.2 9a1.5 1.5 0 0 1-1.5 1.3H5.2a1.5 1.5 0 0 1-1.5-1.3z" />
        <path d="M6.2 5.5V4a2.8 2.8 0 0 1 5.6 0v1.5" />
      </svg>
      {hydrated && count > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--color-cognac)] px-1 text-[0.5625rem] font-medium leading-none text-[color:var(--color-onaccent)]">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
