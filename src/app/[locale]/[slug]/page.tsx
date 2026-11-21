import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { categories } from "@/content/categories";
import {
  allLocalisedSlugs,
  contentPages,
  pageRouteKeys,
  resolveSlug,
} from "@/lib/page-resolver";
import { Breadcrumbs, CategoryCard, categoryRoutes } from "@/components/category-cards";
import { FaqAccordion } from "@/components/faq-accordion";
import { Container, Eyebrow, Rule } from "@/components/ui";
import { PageBlocks, RelatedCategories } from "@/lib/content-page";
import {
  absoluteUrl,
  breadcrumbLd,
  buildMetadata,
  collectionPageLd,
  faqLd,
  serialiseJsonLd,
} from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return allLocalisedSlugs().map(({ locale, slug }) => ({ locale, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const resolved = resolveSlug(locale, slug);
  if (!resolved) return {};

  if (resolved.kind === "category") {
    const { category } = resolved;
    const alternates = Object.fromEntries(
      locales.map((code) => [code, pathFor(categoryRoutes[category.id], code)]),
    ) as Record<Locale, string>;

    return buildMetadata({
      locale,
      path: alternates[locale],
      alternates,
      title: category.metaTitle[locale],
      description: category.metaDescription[locale],
      image: category.image,
    });
  }

  const { key, page } = resolved;
  const routeKey = pageRouteKeys[key] as Parameters<typeof pathFor>[0];
  const alternates = Object.fromEntries(
    locales.map((code) => [code, pathFor(routeKey, code)]),
  ) as Record<Locale, string>;

  return buildMetadata({
    locale,
    path: alternates[locale],
    alternates,
    title: page.metaTitle[locale],
    description: page.metaDescription[locale],
  });
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const resolved = resolveSlug(locale, slug);
  if (!resolved) notFound();

  if (resolved.kind === "category") {
    return <CategoryView locale={locale} categoryId={resolved.category.id} />;
  }
  return <ContentView locale={locale} pageKey={resolved.key} />;
}

/* ------------------------------- Category ------------------------------- */

function CategoryView({
  locale,
  categoryId,
}: {
  locale: Locale;
  categoryId: (typeof categories)[number]["id"];
}) {
  const dict = getDictionary(locale);
  const category = categories.find((item) => item.id === categoryId)!;
  const faqs = category.faqs[locale];
  const others = categories.filter((item) => item.id !== category.id).slice(0, 4);
  const path = pathFor(categoryRoutes[category.id], locale);

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: dict.category.breadcrumbHome, href: pathFor("home", locale) },
            { label: dict.collections[category.collection], href: pathFor("home", locale) },
            { label: category.name[locale] },
          ]}
        />
      </Container>

      <section className="pb-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6 lg:pt-6">
              <Eyebrow>{dict.collections[category.collection]}</Eyebrow>
              <h1 className="font-display mt-4 text-[2.2rem] leading-[1.06] tracking-[-0.02em] text-[color:var(--color-ink-strong)] sm:text-[3rem]">
                {category.name[locale]}
              </h1>
              <p className="mt-5 max-w-lg text-[1.0625rem] leading-[1.7] text-[color:var(--color-ink-body)]">
                {category.tagline[locale]}
              </p>

              <div className="prose-leather mt-7 max-w-lg">
                {category.intro[locale].map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={pathFor("contact", locale)}
                  className="inline-flex h-12 items-center justify-center bg-[color:var(--color-espresso)] px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)] transition-colors hover:bg-[color:var(--color-cognac-deep)]"
                >
                  {dict.category.whatsappCta}
                </Link>
                <Link
                  href={pathFor("shipping", locale)}
                  className="inline-flex h-12 items-center justify-center border border-[color:var(--color-line-strong)] px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ink-strong)] transition-colors hover:border-[color:var(--color-cognac)]"
                >
                  {shippingLabel[locale]}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-cream)] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src={category.image}
                  alt={category.imageAlt[locale]}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute bottom-3 left-3 border border-[color:var(--color-ivory)]/35 bg-[color:var(--color-espresso)]/40 px-2 py-1 text-[0.5625rem] tracking-[0.14em] uppercase text-[color:var(--color-ivory)] backdrop-blur-sm">
                  {dict.category.placeholderNote}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-[color:var(--color-line)] bg-[color:var(--color-surface-sunken)] py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <h2 className="font-display text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)] sm:text-[1.75rem]">
                {dict.category.guidanceTitle}
              </h2>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-[color:var(--color-ink-muted)]">
                {guidanceIntro[locale]}
              </p>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
              {category.guidance[locale].map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="tracking-eyebrow mt-1 shrink-0 text-[0.5rem] text-[color:var(--color-tan)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-body)]">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="font-display text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)] sm:text-[1.75rem]">
                {dict.category.faqTitle}
              </h2>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-[color:var(--color-ink-muted)]">
                {answersLabel[locale]}
              </p>
              <Link
                href={pathFor("contact", locale)}
                className="mt-5 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.12em] uppercase text-[color:var(--color-cognac)]"
              >
                {dict.nav.contact}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="lg:col-span-8">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-[color:var(--color-line)] pt-14">
        <Container>
          <h2 className="tracking-eyebrow mb-8 text-[0.5625rem] text-[color:var(--color-tan)]">
            {dict.category.relatedTitle}
          </h2>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item) => (
              <CategoryCard
                key={item.id}
                category={item}
                locale={locale}
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            ))}
          </div>
          <Rule className="mt-14" />
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd([
            {
              ...collectionPageLd({
                name: category.name[locale],
                description: category.metaDescription[locale],
                path,
                locale,
              }),
              "@context": "https://schema.org",
            },
            {
              ...breadcrumbLd([
                { name: dict.category.breadcrumbHome, path: pathFor("home", locale) },
                { name: category.name[locale], path },
              ]),
              "@context": "https://schema.org",
            },
            faqLd(faqs),
          ].map((entry) => ({ ...entry, "@context": "https://schema.org" }))),
        }}
      />
    </>
  );
}

/* ------------------------------- Content -------------------------------- */

function ContentView({
  locale,
  pageKey,
}: {
  locale: Locale;
  pageKey: keyof typeof pageRouteKeys;
}) {
  const dict = getDictionary(locale);
  const routeKey = pageRouteKeys[pageKey] as Parameters<typeof pathFor>[0];
  const page = contentPages[pageKey];
  const faqs = page.faqs?.[locale];

  const relatedIds: Record<string, string[]> = {
    "leather-guide": ["mens-wallets", "mens-belts", "ladies-handbags", "dog-collars"],
    "care-guide": ["mens-wallets", "ladies-handbags", "dog-leashes", "ladies-belts"],
    faq: ["mens-wallets", "ladies-handbags", "dog-collars", "dog-collar-leash-sets"],
    shipping: ["mens-wallets", "mens-belts", "ladies-handbags", "dog-leashes"],
    returns: ["mens-wallets", "ladies-belts", "dog-collars", "dog-leashes"],
    about: ["mens-wallets", "ladies-handbags", "mens-belts", "dog-collar-leash-sets"],
    contact: ["mens-wallets", "ladies-handbags", "dog-collars", "dog-collar-leash-sets"],
  };

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: dict.category.breadcrumbHome, href: pathFor("home", locale) },
            { label: page.title[locale] },
          ]}
        />
      </Container>

      <section className="pb-16">
        <Container>
          <div className="max-w-[42rem]">
            <h1 className="font-display text-[2.2rem] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-ink-strong)] sm:text-[2.9rem]">
              {page.title[locale]}
            </h1>
          </div>
          <div className="mt-8">
            <PageBlocks page={page} locale={locale} />
          </div>

          {faqs ? (
            <div className="mt-14 max-w-[52rem]">
              <FaqAccordion items={faqs} heading={dict.category.faqTitle} />
            </div>
          ) : null}

          <RelatedCategories
            locale={locale}
            ids={relatedIds[pageKey] ?? []}
            heading={dict.category.relatedTitle}
          />
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd({
            ...breadcrumbLd([
              { name: dict.category.breadcrumbHome, path: pathFor("home", locale) },
              { name: page.title[locale], path: pathFor(routeKey, locale) },
            ]),
            "@context": "https://schema.org",
            url: absoluteUrl(pathFor(routeKey, locale)),
          }),
        }}
      />
      {faqs ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serialiseJsonLd({ ...faqLd(faqs), "@context": "https://schema.org" }),
          }}
        />
      ) : null}
    </>
  );
}

const shippingLabel: Record<Locale, string> = {
  en: "Delivery information",
  ms: "Maklumat penghantaran",
  zh: "配送资讯",
};

const guidanceIntro: Record<Locale, string> = {
  en: "Practical points worth knowing before you decide. None of them are sales claims.",
  ms: "Perkara praktikal yang wajar diketahui sebelum anda membuat keputusan. Tiada satu pun dakwaan jualan.",
  zh: "下单前值得知道的实用要点，都不是销售话术。",
};

const answersLabel: Record<Locale, string> = {
  en: "Answered by the team that sets the specifications.",
  ms: "Dijawab oleh pasukan yang menetapkan spesifikasi.",
  zh: "由制定规格的团队亲自回答。",
};
