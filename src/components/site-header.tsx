"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { categories } from "@/content/categories";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";

const categoryRoutes = {
  "mens-wallets": "mensWallets",
  "mens-belts": "mensBelts",
  "ladies-handbags": "ladiesHandbags",
  "ladies-belts": "ladiesBelts",
  "dog-collars": "dogCollars",
  "dog-leashes": "dogLeashes",
  "dog-collar-leash-sets": "dogSets",
} as const;

const collectionOrder = ["men", "women", "pets"] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const pathname = usePathname() || `/${locale}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  // Close overlays on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setShopOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setShopOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-line)] bg-[color:var(--color-surface)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[var(--header-height)] w-full max-w-[80rem] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link
          href={pathFor("home", locale)}
          className="shrink-0"
          aria-label={`elvora.my — ${dict.brandTagline}`}
        >
          <Logo locale={locale} />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label={dict.nav.menu} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            <li
              className="relative"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button
                type="button"
                aria-expanded={shopOpen}
                onClick={() => setShopOpen((value) => !value)}
                className="inline-flex items-center gap-1.5 py-2 text-[0.8125rem] font-medium tracking-[0.1em] uppercase text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
              >
                {dict.nav.shop}
                <svg aria-hidden="true" viewBox="0 0 10 6" className="h-[5px] w-[9px]">
                  <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>

              {shopOpen ? (
                <div className="absolute left-1/2 top-full z-50 w-[42rem] -translate-x-1/2 border border-[color:var(--color-line-strong)] bg-[color:var(--color-surface)] p-6 shadow-[0_24px_60px_-30px_rgba(20,16,13,0.45)]">
                  <div className="grid grid-cols-3 gap-6">
                    {collectionOrder.map((collection) => (
                      <div key={collection}>
                        <p className="tracking-eyebrow mb-3 text-[0.5625rem] text-[color:var(--color-tan)]">
                          {dict.collections[collection]}
                        </p>
                        <ul className="space-y-2">
                          {categories
                            .filter((category) => category.collection === collection)
                            .map((category) => {
                              const route = pathFor(categoryRoutes[category.id], locale);
                              return (
                                <li key={category.id}>
                                  <Link
                                    href={route}
                                    className={`block text-[0.9375rem] leading-snug transition-colors hover:text-[color:var(--color-cognac)] ${
                                      isActive(route)
                                        ? "text-[color:var(--color-cognac)]"
                                        : "text-[color:var(--color-ink-body)]"
                                    }`}
                                  >
                                    {category.name[locale]}
                                  </Link>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 border-t border-[color:var(--color-line)] pt-4">
                    <Link
                      href={pathFor("leatherGuide", locale)}
                      className="text-[0.8125rem] text-[color:var(--color-stone)] underline decoration-[color:var(--color-line-strong)] underline-offset-4 transition-colors hover:text-[color:var(--color-cognac)]"
                    >
                      {dict.home.leatherLink}
                    </Link>
                  </div>
                </div>
              ) : null}
            </li>

            <li>
              <Link
                href={pathFor("leatherGuide", locale)}
                className="text-[0.8125rem] font-medium tracking-[0.1em] uppercase text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
              >
                {dict.nav.guide}
              </Link>
            </li>
            <li>
              <Link
                href={pathFor("about", locale)}
                className="text-[0.8125rem] font-medium tracking-[0.1em] uppercase text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
              >
                {dict.nav.about}
              </Link>
            </li>
            <li>
              <Link
                href={pathFor("contact", locale)}
                className="text-[0.8125rem] font-medium tracking-[0.1em] uppercase text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
              >
                {dict.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher locale={locale} />

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-label={dict.nav.openMenu}
            className="inline-flex h-9 w-9 items-center justify-center border border-[color:var(--color-line-strong)] text-[color:var(--color-ink-body)] transition-colors hover:border-[color:var(--color-cognac)] lg:hidden"
          >
            <svg aria-hidden="true" viewBox="0 0 18 12" className="h-3 w-4" stroke="currentColor" strokeWidth="1.3">
              <path d="M0 1h18M0 6h18M0 11h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-[color:var(--color-espresso)]/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={dict.nav.menu}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-[color:var(--color-surface)] thin-scroll"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-5 py-4">
              <Logo locale={locale} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={dict.nav.closeMenu}
                className="inline-flex h-9 w-9 items-center justify-center border border-[color:var(--color-line-strong)]"
              >
                <svg aria-hidden="true" viewBox="0 0 14 14" className="h-3 w-3" stroke="currentColor" strokeWidth="1.4">
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>

            <nav aria-label={dict.nav.menu} className="flex-1 px-5 py-6">
              {collectionOrder.map((collection) => (
                <div key={collection} className="mb-7">
                  <p className="tracking-eyebrow mb-3 text-[0.5625rem] text-[color:var(--color-tan)]">
                    {dict.collections[collection]}
                  </p>
                  <ul className="space-y-3">
                    {categories
                      .filter((category) => category.collection === collection)
                      .map((category) => (
                        <li key={category.id}>
                          <Link
                            href={pathFor(categoryRoutes[category.id], locale)}
                            className="flex items-baseline justify-between text-[1.0625rem] text-[color:var(--color-ink-strong)]"
                          >
                            {category.name[locale]}
                            <span aria-hidden="true" className="text-[color:var(--color-clay)]">
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}

              <div className="border-t border-[color:var(--color-line)] pt-5">
                <ul className="space-y-3 text-[0.9375rem]">
                  {(
                    [
                      ["leatherGuide", dict.nav.guide],
                      ["careGuide", dict.nav.care],
                      ["about", dict.nav.about],
                      ["faq", dict.nav.faq],
                      ["contact", dict.nav.contact],
                    ] as const
                  ).map(([key, label]) => (
                    <li key={key}>
                      <Link
                        href={pathFor(key, locale)}
                        className="text-[color:var(--color-ink-body)]"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="border-t border-[color:var(--color-line)] px-5 py-4">
              <LanguageSwitcher locale={locale} variant="full" />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
