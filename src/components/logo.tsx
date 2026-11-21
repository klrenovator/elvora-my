import { site } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";

/**
 * Temporary text wordmark.
 *
 * Deliberately typographic and dependency-free: when the owner supplies the
 * final logo, swap the <span> block for an <Image> here and nothing else in the
 * site needs to change. Colours come from design tokens.
 */
export function Logo({
  locale,
  tone = "dark",
  className = "",
}: {
  locale: Locale;
  tone?: "dark" | "light";
  className?: string;
}) {
  const dict = getDictionary(locale);
  const ink = tone === "light" ? "text-[color:var(--color-ivory)]" : "text-[color:var(--color-espresso)]";
  const suffix =
    tone === "light" ? "text-[color:var(--color-linen)]" : "text-[color:var(--color-tan)]";

  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span
        className={`font-display text-[1.6rem] leading-none tracking-[-0.02em] ${ink} sm:text-[1.75rem]`}
      >
        {site.brandName}
        <span className={suffix}>{site.brandSuffix}</span>
      </span>
      <span
        className={`tracking-eyebrow mt-1.5 hidden text-[0.5rem] sm:block ${
          tone === "light" ? "text-[color:var(--color-linen)]/75" : "text-[color:var(--color-mist)]"
        }`}
      >
        {dict.brandTagline}
      </span>
      <span className="sr-only">
        {" "}
        — {site.brandName}
      </span>
    </span>
  );
}
