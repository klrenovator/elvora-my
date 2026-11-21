import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { locales, localeName } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { categories } from "@/content/categories";
import { contact, isConfigured, site } from "@/lib/site";
import { Logo } from "@/components/logo";

const categoryRoutes = {
  "mens-wallets": "mensWallets",
  "mens-belts": "mensBelts",
  "ladies-handbags": "ladiesHandbags",
  "ladies-belts": "ladiesBelts",
  "dog-collars": "dogCollars",
  "dog-leashes": "dogLeashes",
  "dog-collar-leash-sets": "dogSets",
} as const;

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-[color:var(--color-line)] bg-[color:var(--color-surface-sunken)]">
      <div className="mx-auto w-full max-w-[80rem] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Logo locale={locale} />
            <p className="lede mt-5 max-w-xs text-[0.9375rem]">
              {dict.home.collectionsBody.split(".")[0]}.
            </p>
            <p className="mt-4 text-[0.8125rem] text-[color:var(--color-mist)]">
              {dict.footer.madeIn}
            </p>
          </div>

          <nav aria-label={dict.footer.shopHeading} className="lg:col-span-3">
            <h2 className="tracking-eyebrow mb-4 text-[0.5625rem] text-[color:var(--color-tan)]">
              {dict.footer.shopHeading}
            </h2>
            <ul className="space-y-2.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={pathFor(categoryRoutes[category.id], locale)}
                    className="text-[0.9375rem] text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
                  >
                    {category.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={dict.footer.helpHeading} className="lg:col-span-2">
            <h2 className="tracking-eyebrow mb-4 text-[0.5625rem] text-[color:var(--color-tan)]">
              {dict.footer.helpHeading}
            </h2>
            <ul className="space-y-2.5">
              {(
                [
                  ["shipping", dict.footer.shipping],
                  ["locations", dict.footer.deliveryAreas],
                  ["dogSizing", dict.footer.sizing],
                  ["returns", dict.footer.returns],
                  ["faq", dict.nav.faq],
                  ["careGuide", dict.footer.care],
                  ["contact", dict.nav.contact],
                ] as const
              ).map(([key, label]) => (
                <li key={key}>
                  <Link
                    href={pathFor(key, locale)}
                    className="text-[0.9375rem] text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="tracking-eyebrow mb-4 text-[0.5625rem] text-[color:var(--color-tan)]">
              {dict.footer.contactHeading}
            </h2>
            {isConfigured(contact.email) || isConfigured(contact.whatsapp) ? (
              <ul className="space-y-2.5 text-[0.9375rem]">
                {isConfigured(contact.email) ? (
                  <li>
                    <a
                      href={`mailto:${contact.email.value}`}
                      className="text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
                    >
                      {contact.email.value}
                    </a>
                  </li>
                ) : null}
                {isConfigured(contact.whatsapp) ? (
                  <li>
                    <a
                      href={`https://wa.me/${contact.whatsapp.value.replace(/[^\d]/g, "").replace(/^0/, "60")}`}
                      className="text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      WhatsApp
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : (
              <p className="max-w-xs text-[0.875rem] leading-relaxed text-[color:var(--color-mist)]">
                {dict.footer.contactPending}
              </p>
            )}

            <h2 className="tracking-eyebrow mb-3 mt-7 text-[0.5625rem] text-[color:var(--color-tan)]">
              {dict.footer.languageHeading}
            </h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {locales.map((code) => (
                <li key={code}>
                  <Link
                    href={pathFor("home", code)}
                    hrefLang={code === "zh" ? "zh-Hans-MY" : `${code}-MY`}
                    className={`text-[0.875rem] transition-colors hover:text-[color:var(--color-cognac)] ${
                      code === locale
                        ? "text-[color:var(--color-cognac)]"
                        : "text-[color:var(--color-ink-body)]"
                    }`}
                  >
                    {localeName[code]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-none border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4">
          <p className="text-[0.75rem] leading-relaxed text-[color:var(--color-mist)]">
            {dict.footer.placeholderDisclosure}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-[color:var(--color-line)] pt-6 text-[0.75rem] text-[color:var(--color-mist)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.brandName}
            {site.brandSuffix}. {dict.footer.rights}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link href={pathFor("privacy", locale)} className="hover:text-[color:var(--color-cognac)]">
                {dict.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={pathFor("terms", locale)} className="hover:text-[color:var(--color-cognac)]">
                {dict.footer.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
