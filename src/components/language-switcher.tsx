"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { locales, localeName, localeShort, type Locale } from "@/i18n/config";
import { switchPath } from "@/lib/routes";
import { productSlugResolver } from "@/lib/slug-map";
import { getDictionary } from "@/lib/dictionary";

/**
 * Language selector.
 *
 * Renders real <a> links to the equivalent page in each language, so the
 * switcher works without JavaScript and search engines can follow it. It never
 * sends a visitor to the homepage when an equivalent page exists; if no
 * equivalent is registered, the link is disabled rather than broken.
 */
export function LanguageSwitcher({
  locale,
  tone = "dark",
  variant = "compact",
}: {
  locale: Locale;
  tone?: "dark" | "light";
  variant?: "compact" | "full";
}) {
  const pathname = usePathname() || `/${locale}`;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dict = getDictionary(locale);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const options = locales.map((code) => ({
    code,
    label: localeName[code],
    short: localeShort[code],
    href: code === locale ? pathname : switchPath(pathname, code, productSlugResolver),
    current: code === locale,
  }));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${dict.common.changeLanguage}: ${localeName[locale]}`}
        className={`inline-flex h-9 items-center gap-2 border px-2.5 text-[0.6875rem] font-medium tracking-[0.14em] transition-colors ${
          tone === "light"
            ? "border-[color:var(--color-ivory)]/25 text-[color:var(--color-ivory)] hover:border-[color:var(--color-ivory)]/60"
            : "border-[color:var(--color-line-strong)] text-[color:var(--color-ink-body)] hover:border-[color:var(--color-cognac)]"
        }`}
      >
        <GlobeIcon />
        <span>{localeShort[locale]}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 10 6"
          className={`h-[5px] w-[9px] transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {open ? (
        <div
          className={`absolute right-0 z-50 mt-2 w-56 border bg-[color:var(--color-surface)] p-1.5 shadow-[0_18px_40px_-24px_rgba(20,16,13,0.5)] ${
            tone === "light"
              ? "border-[color:var(--color-ivory)]/20"
              : "border-[color:var(--color-line-strong)]"
          }`}
          role="group"
          aria-label={dict.common.changeLanguage}
        >
          <p className="tracking-eyebrow px-2.5 pb-1.5 pt-1 text-[0.5rem] text-[color:var(--color-mist)]">
            {dict.common.language}
          </p>
          <ul>
            {options.map((option) => (
              <li key={option.code}>
                {option.href ? (
                  <Link
                    href={option.href}
                    hrefLang={option.code === "zh" ? "zh-Hans-MY" : `${option.code}-MY`}
                    aria-current={option.current ? "true" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex items-baseline justify-between gap-3 px-2.5 py-2 text-sm transition-colors hover:bg-[color:var(--color-cream)] ${
                      option.current
                        ? "font-medium text-[color:var(--color-cognac)]"
                        : "text-[color:var(--color-ink-body)]"
                    }`}
                  >
                    <span>{option.label}</span>
                    {option.current ? (
                      <span className="tracking-eyebrow text-[0.5rem] text-[color:var(--color-tan)]">
                        ✓
                      </span>
                    ) : null}
                  </Link>
                ) : (
                  <span className="block px-2.5 py-2 text-sm text-[color:var(--color-mist)]">
                    {option.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
          {variant === "full" ? null : null}
        </div>
      ) : null}
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.1">
      <circle cx="8" cy="8" r="6.2" />
      <path d="M1.8 8h12.4M8 1.8c1.9 1.7 2.9 3.9 2.9 6.2s-1 4.5-2.9 6.2C6.1 12.5 5.1 10.3 5.1 8s1-4.5 2.9-6.2z" />
    </svg>
  );
}
