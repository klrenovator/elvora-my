import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { pathFor } from "@/lib/routes";
import { absoluteUrl, breadcrumbLd, buildMetadata, serialiseJsonLd } from "@/lib/seo";
import { Container, Eyebrow } from "@/components/ui";
import { Breadcrumbs, categoryRoutes } from "@/components/category-cards";
import { ContactChannels } from "@/components/contact-channels";
import { areaBySlug, deliveryAreas, postcodeLabel, sameStateAreas } from "@/content/delivery-areas";
import { stateByCode } from "@/content/malaysia";
import { categories } from "@/content/categories";
import { locationCopy } from "@/content/locations";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    deliveryAreas.map((area) => ({ locale, area: area.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; area: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, area: rawArea } = await params;
  if (!isLocale(rawLocale)) return {};
  const area = areaBySlug.get(rawArea);
  if (!area) return {};
  const locale: Locale = rawLocale;
  const copy = locationCopy[locale];

  // Area slugs are identical across languages — a place name is not translated,
  // only the section segment around it — so alternates are a straight swap.
  const alternates = Object.fromEntries(
    locales.map((code) => [code, pathFor("location", code, { area: area.slug })]),
  ) as Record<Locale, string>;

  return buildMetadata({
    locale,
    path: alternates[locale],
    alternates,
    title: copy.metaTitle(area, locale),
    description: copy.metaDescription(area, locale),
  });
}

/**
 * One delivery area.
 *
 * What makes this page worth publishing, rather than a doorway page, is that
 * every paragraph is specific to the place: its name in the reader's language,
 * its state, its postcode prefix, whether it is in East Malaysia, and its
 * siblings in the same state. The commercial part is deliberately identical
 * everywhere, because the arrangement genuinely is identical everywhere — and
 * because inventing per-city delivery promises would be a lie.
 */
export default async function LocationPage({
  params,
}: {
  params: Promise<{ locale: string; area: string }>;
}) {
  const { locale: rawLocale, area: rawArea } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;

  const area = areaBySlug.get(rawArea);
  if (!area) notFound();

  const copy = locationCopy[locale];
  const state = stateByCode.get(area.stateCode);
  const siblings = sameStateAreas(area.slug);
  const otherAreas = deliveryAreas
    .filter((entry) => entry.stateCode !== area.stateCode && entry.major)
    .slice(0, 8);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: copy.breadcrumbHome, href: pathFor("home", locale) },
            { label: copy.breadcrumbLocations, href: pathFor("locations", locale) },
            { label: area.name[locale] },
          ]}
        />
      </Container>

      <section className="pb-14">
        <Container>
          <div className="max-w-[46rem]">
            <Eyebrow>{copy.eyebrow}</Eyebrow>
            <h1 className="font-display mt-4 text-[2.2rem] leading-[1.06] tracking-[-0.02em] text-[color:var(--color-ink-strong)] sm:text-[2.9rem]">
              {copy.heading(area, locale)}
            </h1>

            <div className="prose-leather mt-5 max-w-[42rem]">
              {copy.intro(area, locale).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* The one line of geo detail, pulled out where it is scannable. */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-[color:var(--color-line)] py-3 text-[0.8125rem]">
              <span className="text-[color:var(--color-ink-muted)]">
                {copy.postcodeTitle}:{" "}
                <span className="font-medium text-[color:var(--color-ink-strong)]">
                  {postcodeLabel(area)}
                </span>
              </span>
              <span className="text-[color:var(--color-ink-muted)]">
                {state?.name[locale] ?? area.stateCode}
              </span>
            </div>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-[color:var(--color-mist)]">
              {copy.postcodeNote(postcodeLabel(area))}
            </p>
          </div>
        </Container>
      </section>

      {/* How an order arrives — the honest version of a "delivery times" page. */}
      <section className="border-y border-[color:var(--color-line)] bg-[color:var(--color-surface-sunken)] py-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <h2 className="font-display text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)]">
                {copy.howTitle}
              </h2>
              <ol className="mt-4 space-y-3">
                {copy.how.map((step, index) => (
                  <li key={index} className="flex gap-3 text-[0.9375rem] leading-[1.7] text-[color:var(--color-ink-body)]">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border border-[color:var(--color-line-strong)] text-[0.6875rem] text-[color:var(--color-ink-muted)]">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-5">
              {/* Naming what is *not* promised is what stops this page from
                  implying a service level the shop has not committed to. */}
              <div className="border-l-2 border-[color:var(--color-clay)] bg-white px-4 py-3">
                <h2 className="text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
                  {copy.honestyTitle}
                </h2>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
                  {copy.honesty}
                </p>
              </div>

              {state?.eastMalaysia ? (
                <div className="mt-4 border-l-2 border-[color:var(--color-cognac)] bg-white px-4 py-3">
                  <h2 className="text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
                    {copy.eastMalaysiaTitle}
                  </h2>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
                    {copy.eastMalaysia}
                  </p>
                </div>
              ) : null}

              <div className="mt-4">
                <ContactChannels locale={locale} heading={copy.ctaTitle} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What is made for this area. */}
      <section className="py-12">
        <Container>
          <h2 className="font-display text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)]">
            {copy.productsTitle}
          </h2>
          <p className="mt-2 max-w-[46rem] text-[0.9375rem] leading-[1.7] text-[color:var(--color-ink-body)]">
            {copy.productsBody(area, locale)}
          </p>

          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={pathFor(categoryRoutes[category.id], locale)}
                  className="flex items-baseline justify-between border-b border-[color:var(--color-line)] pb-2 text-[0.9375rem] text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
                >
                  {category.name[locale]}
                  <span aria-hidden="true" className="text-[color:var(--color-clay)]">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Internal linking: siblings first (same state), then other regions. */}
      <section className="border-t border-[color:var(--color-line)] py-12">
        <Container>
          {siblings.length > 0 ? (
            <>
              <h2 className="font-display text-[1.25rem] leading-tight text-[color:var(--color-ink-strong)]">
                {copy.sameStateTitle}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {siblings.map((sibling) => (
                  <li key={sibling.slug}>
                    <Link
                      href={pathFor("location", locale, { area: sibling.slug })}
                      className="inline-flex min-h-11 items-center border border-[color:var(--color-line-strong)] px-4 text-[0.875rem] text-[color:var(--color-ink-body)] transition-colors hover:border-[color:var(--color-cognac)] hover:text-[color:var(--color-cognac)]"
                    >
                      {sibling.name[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <h2 className="font-display mt-8 text-[1.25rem] leading-tight text-[color:var(--color-ink-strong)]">
            {copy.otherRegionsTitle}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {otherAreas.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={pathFor("location", locale, { area: entry.slug })}
                  className="inline-flex min-h-11 items-center border border-[color:var(--color-line)] px-4 text-[0.875rem] text-[color:var(--color-ink-muted)] transition-colors hover:border-[color:var(--color-cognac)] hover:text-[color:var(--color-cognac)]"
                >
                  {entry.name[locale]}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={pathFor("locations", locale)}
                className="inline-flex min-h-11 items-center px-2 text-[0.875rem] text-[color:var(--color-cognac)] underline underline-offset-4"
              >
                {copy.breadcrumbLocations} →
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd({
            ...breadcrumbLd([
              { name: copy.breadcrumbHome, path: pathFor("home", locale) },
              { name: copy.breadcrumbLocations, path: pathFor("locations", locale) },
              { name: area.name[locale], path: pathFor("location", locale, { area: area.slug }) },
            ]),
            "@context": "https://schema.org",
            url: absoluteUrl(pathFor("location", locale, { area: area.slug })),
            /*
             * `areaServed` on a Service, not a LocalBusiness. The shop has no
             * premises in these cities — claiming a local presence would be
             * false structured data, the kind that earns a manual penalty.
             */
            mainEntity: {
              "@type": "Service",
              name: copy.heading(area, locale),
              areaServed: {
                "@type": "City",
                name: area.name[locale],
                containedInPlace: {
                  "@type": "AdministrativeArea",
                  name: state?.name[locale] ?? area.stateCode,
                },
              },
              provider: { "@type": "Organization", name: "Elvora", url: absoluteUrl(pathFor("home", locale)) },
            },
          }),
        }}
      />
    </>
  );
}
