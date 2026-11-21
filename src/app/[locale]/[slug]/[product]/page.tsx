import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { categoryById } from "@/content/categories";
import {
  catalogueForStorefront,
  productForSlug,
  relatedFor,
} from "@/lib/catalogue/storefront";
import { assertCatalogueValid } from "@/lib/validate-catalogue";
import { Breadcrumbs, categoryRoutes } from "@/components/category-cards";
import { FaqAccordion } from "@/components/faq-accordion";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductCard } from "@/components/product-card";
import { Container, Rule } from "@/components/ui";
import {
  absoluteUrl,
  breadcrumbLd,
  buildMetadata,
  faqLd,
  productLd,
  serialiseJsonLd,
} from "@/lib/seo";
import { resolvePrice } from "@/lib/pricing";

/**
 * Products created in the admin must be reachable without a redeploy, so
 * unknown slugs are resolved on demand rather than 404-ing until the next
 * build. The price of that is a request-time read, which is cached below.
 */
export const dynamicParams = true;

/**
 * Serve a cached page that refreshes at most once a minute.
 *
 * A price edit appears within a minute without a redeploy, and normal traffic
 * is served from cache. Checkout never relies on this cache: it re-prices from
 * the same database and refuses on disagreement, so a page at most 60 seconds
 * stale can produce a "please review your cart", not a wrong charge.
 */
export const revalidate = 60;

/** Stated once here; must stay in step with the "product" route pattern. */
const catalogs: Record<Locale, string> = { en: "products", ms: "produk", zh: "chan-pin" };

export async function generateStaticParams() {
  // Fail the build rather than publish a catalogue with invented prices,
  // unknown categories or dangling variant references. With a database
  // configured this validates the compiled seed, which is the floor the
  // database is seeded from.
  assertCatalogueValid();
  const products = await catalogueForStorefront();
  return products.flatMap((product) =>
    locales.map((locale) => ({
      locale,
      slug: catalogs[locale],
      product: product.slug[locale],
    })),
  );
}

function alternatesFor(slug: Record<Locale, string>): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, pathFor("product", locale, { slug: slug[locale] })]),
  ) as Record<Locale, string>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; product: string }>;
}): Promise<Metadata> {
  const { locale, slug, product: productSlug } = await params;
  if (!isLocale(locale)) return {};
  // The catalog segment is localized; a mismatched segment must 404 rather
  // than silently rendering the product under the wrong URL.
  if (slug !== catalogs[locale]) return {};

  const product = await productForSlug(locale, productSlug);
  if (!product) return {};

  return buildMetadata({
    locale,
    path: pathFor("product", locale, { slug: product.slug[locale] }),
    alternates: alternatesFor(product.slug),
    title: product.seo.title[locale],
    description: product.seo.description[locale],
    image: product.images[0]?.src,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; product: string }>;
}) {
  const { locale: raw, slug, product: productSlug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  if (slug !== catalogs[locale]) notFound();
  const product = await productForSlug(locale, productSlug);
  if (!product) notFound();

  const dict = getDictionary(locale);
  const price = resolvePrice(product, locale);
  const category = categoryById[product.category];
  const visible = await catalogueForStorefront();
  const related = await relatedFor(product, visible);
  const siblings = visible.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );
  const faqs = product.faqs[locale];
  const path = pathFor("product", locale, { slug: product.slug[locale] });
  const gallery = product.images;

  return (
    <>
      <Container className="pt-8">
        <Breadcrumbs
          items={[
            { label: dict.category.breadcrumbHome, href: pathFor("home", locale) },
            {
              label: category?.name[locale] ?? "",
              href: category ? pathFor(categoryRoutes[product.category], locale) : undefined,
            },
            { label: product.name[locale] },
          ]}
        />
      </Container>

      <section className="pb-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--color-cream)]">
                <Image
                  src={gallery[0].src}
                  alt={gallery[0].alt[locale]}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
                {gallery[0].placeholder ? (
                  <span className="absolute bottom-3 left-3 border border-[color:var(--color-ivory)]/35 bg-[color:var(--color-espresso)]/45 px-2 py-1 text-[0.5625rem] tracking-[0.14em] uppercase text-[color:var(--color-ivory)] backdrop-blur-sm">
                    {dict.category.placeholderNote}
                  </span>
                ) : null}
              </div>

              {gallery.length > 1 ? (
                <ul className="mt-3 grid grid-cols-4 gap-3">
                  {gallery.slice(1).map((image, index) => (
                    <li key={index} className="relative aspect-square overflow-hidden bg-[color:var(--color-cream)]">
                      <Image
                        src={image.src}
                        alt={image.alt[locale]}
                        fill
                        sizes="15vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              ) : null}

              {gallery[0].placeholder ? (
                <p className="mt-3 text-[0.75rem] leading-relaxed text-[color:var(--color-mist)]">
                  {dict.product.placeholderNotice}
                </p>
              ) : null}
            </div>

            {/* Buy panel */}
            <div className="lg:col-span-5">
              <Link
                href={category ? pathFor(categoryRoutes[product.category], locale) : pathFor("home", locale)}
                className="tracking-eyebrow text-[0.5625rem] text-[color:var(--color-tan)] transition-colors hover:text-[color:var(--color-cognac)]"
              >
                {category?.name[locale]}
              </Link>

              <h1 className="font-display mt-3 text-[1.9rem] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink-strong)] sm:text-[2.4rem]">
                {product.name[locale]}
              </h1>

              <p className="mt-4 max-w-md text-[0.9375rem] leading-[1.7] text-[color:var(--color-ink-body)]">
                {product.shortDescription[locale]}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[color:var(--color-line)] py-3 text-[0.75rem]">
                <span className="text-[color:var(--color-ink-muted)]">
                  {dict.product.leatherType}:{" "}
                  <span className="font-medium text-[color:var(--color-ink-strong)]">
                    {product.leatherType === "full-grain"
                      ? dict.product.fullGrain
                      : dict.product.topGrain}
                  </span>
                </span>
                <a
                  href={pathFor("leatherGuide", locale)}
                  className="text-[color:var(--color-cognac)] underline decoration-[color:var(--color-line-strong)] underline-offset-4"
                >
                  {dict.home.leatherLink}
                </a>
              </div>

              <ProductPurchase product={product} locale={locale} price={price} />
            </div>
          </div>
        </Container>
      </section>

      {/* Description + specifications */}
      <section className="border-y border-[color:var(--color-line)] bg-[color:var(--color-surface-sunken)] py-14">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-display text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)] sm:text-[1.75rem]">
                {dict.product.description}
              </h2>
              <div className="prose-leather mt-4 max-w-[40rem]">
                {product.description[locale].map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <h2 className="font-display text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)] sm:text-[1.75rem]">
                {dict.product.specifications}
              </h2>
              <dl className="mt-4 divide-y divide-[color:var(--color-line)] border-y border-[color:var(--color-line)]">
                {product.specifications.flatMap((group) =>
                  group.items.map((item, index) => (
                    <div key={`${group.group[locale]}-${index}`} className="grid grid-cols-5 gap-3 py-3">
                      <dt className="col-span-2 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
                        {item.label[locale]}
                      </dt>
                      <dd className="col-span-3 text-[0.8125rem] text-[color:var(--color-ink-body)]">
                        {item.value[locale]}
                      </dd>
                    </div>
                  )),
                )}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* Product FAQs */}
      <section className="py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="font-display text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)] sm:text-[1.75rem]">
                {dict.product.faqTitle}
              </h2>
              <Link
                href={pathFor("contact", locale)}
                className="mt-4 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.12em] uppercase text-[color:var(--color-cognac)]"
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

      {/* Related */}
      {related.length > 0 ? (
        <section className="border-t border-[color:var(--color-line)] pt-14">
          <Container>
            <h2 className="tracking-eyebrow mb-8 text-[0.5625rem] text-[color:var(--color-tan)]">
              {dict.product.relatedTitle}
            </h2>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  locale={locale}
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {siblings.length > 0 ? (
        <section className="pt-14">
          <Container>
            <h2 className="tracking-eyebrow mb-8 text-[0.5625rem] text-[color:var(--color-tan)]">
              {dict.product.inSameCategory}
            </h2>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {siblings.slice(0, 4).map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  locale={locale}
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ))}
            </div>
            <Rule className="mt-14" />
          </Container>
        </section>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd({
            ...productLd({
              name: product.name[locale],
              description: product.seo.description[locale],
              path,
              sku: product.sku,
              category: category?.name[locale] ?? "",
              images: product.images.map((image) => absoluteUrl(image.src)),
              leatherType:
                product.leatherType === "full-grain"
                  ? "Full grain genuine leather"
                  : "Top grain genuine leather",
              price,
              manufacturerCountry: "Pakistan",
            }),
            "@context": "https://schema.org",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd({
            ...breadcrumbLd([
              { name: dict.category.breadcrumbHome, path: pathFor("home", locale) },
              {
                name: category?.name[locale] ?? "",
                path: category ? pathFor(categoryRoutes[product.category], locale) : pathFor("home", locale),
              },
              { name: product.name[locale], path },
            ]),
            "@context": "https://schema.org",
          }),
        }}
      />
      {faqs.length > 0 ? (
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
