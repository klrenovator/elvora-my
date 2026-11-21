import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { pathFor } from "@/lib/routes";
import { absoluteUrl, breadcrumbLd, buildMetadata, serialiseJsonLd } from "@/lib/seo";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs } from "@/components/category-cards";
import {
  deliveryAreas,
  majorAreas,
  statesWithAreas,
} from "@/content/delivery-areas";
import { stateByCode } from "@/content/malaysia";
import { locationCopy } from "@/content/locations";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;

  const titles: Record<Locale, string> = {
    // No brand suffix: the layout's titleTemplate appends "| Elvora.my".
    en: "Delivery areas across Malaysia",
    ms: "Kawasan penghantaran di seluruh Malaysia",
    zh: "马来西亚各地配送地区",
  };
  const descriptions: Record<Locale, string> = {
    en: "Where Elvora delivers genuine leather goods in Malaysia. Cash on delivery, with stock and delivery cost confirmed on WhatsApp before dispatch.",
    ms: "Ke mana Elvora menghantar barangan kulit asli di Malaysia. Tunai semasa penghantaran, dengan stok dan kos penghantaran disahkan di WhatsApp sebelum dihantar.",
    zh: "Elvora 在马来西亚的配送范围。货到付款，发货前通过 WhatsApp 确认库存与运费。",
  };

  const alternates = Object.fromEntries(
    locales.map((code) => [code, pathFor("locations", code)]),
  ) as Record<Locale, string>;

  return buildMetadata({
    locale,
    path: alternates[locale],
    alternates,
    title: titles[locale],
    description: descriptions[locale],
  });
}

/**
 * Delivery areas index.
 *
 * Every area is reachable from here, and this page is reachable from the footer
 * on every other page. That is the internal linking that gives the location
 * pages any value at all — a page nothing links to is a page nobody reads.
 */
export default async function LocationsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const copy = locationCopy[locale];

  const heading: Record<Locale, string> = {
    en: "Delivery areas in Malaysia",
    ms: "Kawasan penghantaran di Malaysia",
    zh: "马来西亚配送地区",
  };
  const intro: Record<Locale, string> = {
    en: "Elvora delivers nationwide. Choose your area to see how ordering and cash-on-delivery works there. Delivery cost is always confirmed with you before dispatch.",
    ms: "Elvora menghantar ke seluruh negara. Pilih kawasan anda untuk melihat cara pesanan dan tunai semasa penghantaran berfungsi di sana. Kos penghantaran sentiasa disahkan dengan anda sebelum dihantar.",
    zh: "Elvora 全马配送。选择你的地区，了解当地的订购与货到付款流程。运费一律在发货前与你确认。",
  };

  // Group by state so the list reads as a map, not an alphabetical dump.
  const groups = statesWithAreas()
    .map((code) => ({
      code,
      state: stateByCode.get(code),
      areas: deliveryAreas
        .filter((area) => area.stateCode === code)
        .sort((a, b) => Number(b.major) - Number(a.major) || a.slug.localeCompare(b.slug)),
    }))
    .sort((a, b) => b.areas.length - a.areas.length || a.code.localeCompare(b.code));

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: copy.breadcrumbHome, href: pathFor("home", locale) },
            { label: copy.breadcrumbLocations },
          ]}
        />
      </Container>

      <section className="pb-16">
        <Container>
          <div className="max-w-[46rem]">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h1 className="font-display mt-4 text-[2.2rem] leading-[1.06] tracking-[-0.02em] text-[color:var(--color-ink-strong)] sm:text-[2.9rem]">
              {heading[locale]}
            </h1>
            <p className="mt-5 text-[1.0625rem] leading-[1.7] text-[color:var(--color-ink-body)]">
              {intro[locale]}
            </p>
          </div>

          {/* The largest centres first: most visitors will be here. */}
          <div className="mt-10">
            <h2 className="tracking-eyebrow text-[0.5625rem] text-[color:var(--color-tan)]">
              {locale === "ms" ? "Bandar utama" : locale === "zh" ? "主要城市" : "Major cities"}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {majorAreas().map((area) => (
                <li key={area.slug}>
                  <Link
                    href={pathFor("location", locale, { area: area.slug })}
                    className="inline-flex min-h-11 items-center border border-[color:var(--color-line-strong)] px-4 text-[0.875rem] text-[color:var(--color-ink-body)] transition-colors hover:border-[color:var(--color-cognac)] hover:text-[color:var(--color-cognac)]"
                  >
                    {area.name[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Everything, grouped by state. */}
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <section key={group.code}>
                <h2 className="font-display text-[1.125rem] leading-tight text-[color:var(--color-ink-strong)]">
                  {group.state?.name[locale] ?? group.code}
                </h2>
                <ul className="mt-2 space-y-1.5">
                  {group.areas.map((area) => (
                    <li key={area.slug}>
                      <Link
                        href={pathFor("location", locale, { area: area.slug })}
                        className="text-[0.9375rem] text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
                      >
                        {area.name[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd({
            ...breadcrumbLd([
              { name: copy.breadcrumbHome, path: pathFor("home", locale) },
              { name: copy.breadcrumbLocations, path: pathFor("locations", locale) },
            ]),
            "@context": "https://schema.org",
            url: absoluteUrl(pathFor("locations", locale)),
            // A plain ItemList: it tells a crawler what this page links to
            // without claiming anything about the areas themselves.
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: deliveryAreas.length,
              itemListElement: deliveryAreas.map((area, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: area.name[locale],
                url: absoluteUrl(pathFor("location", locale, { area: area.slug })),
              })),
            },
          }),
        }}
      />
    </>
  );
}
