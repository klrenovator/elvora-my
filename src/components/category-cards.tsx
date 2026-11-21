import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Category } from "@/content/types";
import { pathFor, type RouteKey } from "@/lib/routes";
import { getDictionary } from "@/lib/dictionary";

const categoryRoutes = {
  "mens-wallets": "mensWallets",
  "mens-belts": "mensBelts",
  "ladies-handbags": "ladiesHandbags",
  "ladies-belts": "ladiesBelts",
  "dog-collars": "dogCollars",
  "dog-leashes": "dogLeashes",
  "dog-collar-leash-sets": "dogSets",
} as const satisfies Record<Category["id"], RouteKey>;

export function CategoryCard({
  category,
  locale,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  category: Category;
  locale: Locale;
  priority?: boolean;
  sizes?: string;
}) {
  const dict = getDictionary(locale);
  const href = pathFor(categoryRoutes[category.id], locale);

  return (
    <article className="group relative flex flex-col">
      <Link href={href} className="block focus-visible:outline-offset-4">
        <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-cream)]">
          <Image
            src={category.image}
            alt={category.imageAlt[locale]}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.035]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--color-espresso)]/45 via-transparent to-transparent opacity-70" />
          <span className="absolute bottom-3 left-3 border border-[color:var(--color-ivory)]/35 bg-[color:var(--color-espresso)]/35 px-2 py-1 text-[0.5625rem] tracking-[0.14em] uppercase text-[color:var(--color-ivory)] backdrop-blur-sm">
            {dict.category.placeholderNote}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 pt-4">
          <h3 className="font-display text-[1.375rem] leading-tight text-[color:var(--color-ink-strong)] transition-colors group-hover:text-[color:var(--color-cognac)]">
            {category.name[locale]}
          </h3>
          <p className="text-[0.875rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            {category.tagline[locale]}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function CategoryRow({
  index,
  category,
  locale,
  reverse = false,
}: {
  index: number;
  category: Category;
  locale: Locale;
  reverse?: boolean;
}) {
  const dict = getDictionary(locale);
  const href = pathFor(categoryRoutes[category.id], locale);

  return (
    <article className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
      <div className={`md:col-span-6 ${reverse ? "md:order-2" : ""}`}>
        <Link href={href} className="block">
          <div className="relative aspect-[5/4] overflow-hidden bg-[color:var(--color-cream)]">
            <Image
              src={category.image}
              alt={category.imageAlt[locale]}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Link>
      </div>
      <div className={`md:col-span-6 ${reverse ? "md:order-1" : ""}`}>
        <p className="tracking-eyebrow mb-3 text-[0.5625rem] text-[color:var(--color-tan)]">
          {String(index).padStart(2, "0")}
        </p>
        <h3 className="font-display text-[1.75rem] leading-tight text-[color:var(--color-ink-strong)] sm:text-[2rem]">
          <Link href={href} className="hover:text-[color:var(--color-cognac)]">
            {category.name[locale]}
          </Link>
        </h3>
        <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-body)]">
          {category.intro[locale][0]}
        </p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 border-b border-[color:var(--color-line-strong)] pb-1 text-[0.8125rem] tracking-[0.1em] uppercase text-[color:var(--color-ink-strong)] transition-colors hover:border-[color:var(--color-cognac)] hover:text-[color:var(--color-cognac)]"
        >
          {dict.common.viewCategory}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}): ReactNode {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] text-[color:var(--color-mist)]">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="transition-colors hover:text-[color:var(--color-cognac)]">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-[color:var(--color-ink-body)]" : undefined}>
                  {item.label}
                </span>
              )}
              {!last ? (
                <span aria-hidden="true" className="text-[color:var(--color-linen)]">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { categoryRoutes };
