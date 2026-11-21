import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { categories } from "@/content/categories";
import { faqPage } from "@/content/pages-policy";
import { CategoryCard, categoryRoutes } from "@/components/category-cards";
import { FaqAccordion } from "@/components/faq-accordion";
import { Container, Eyebrow, SectionHeading } from "@/components/ui";
import { buildMetadata, faqLd, itemListLd, serialiseJsonLd } from "@/lib/seo";
import { alternatePaths } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const titles: Record<Locale, string> = {
    en: "Genuine Leather Wallets, Belts & Handbags in Malaysia",
    ms: "Dompet, Tali Pinggang & Beg Tangan Kulit Asli di Malaysia",
    zh: "马来西亚真皮钱包、皮带与手提包",
  };
  const descriptions: Record<Locale, string> = {
    en: "Premium genuine leather wallets, belts, handbags and dog accessories in full grain and top grain leather. Manufactured in Pakistan, delivered across Malaysia.",
    ms: "Dompet, tali pinggang, beg tangan dan aksesori anjing kulit asli premium dalam gred full grain dan top grain. Dihasilkan di Pakistan, dihantar ke seluruh Malaysia.",
    zh: "全粒面与头层真皮的钱包、皮带、手提包与狗狗用品。巴基斯坦制造，配送全马。",
  };

  return buildMetadata({
    locale,
    path: alternatePaths("home")[locale],
    alternates: alternatePaths("home"),
    title: titles[locale],
    description: descriptions[locale],
    image: "/images/hero/hero-leather.jpg",
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const featuredFaqs = faqPage.faqs![locale].slice(0, 5);
  const collectionOrder = ["men", "women", "pets"] as const;

  return (
    <>
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="relative isolate overflow-hidden bg-[color:var(--color-espresso)]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-leather.jpg"
            alt={heroAlt[locale]}
            fill
            priority
            sizes="100vw"
            className="hero-art object-cover object-right opacity-[0.92]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-espresso)] via-[color:var(--color-espresso)]/80 to-[color:var(--color-espresso)]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-espresso)]/70 via-transparent to-transparent" />
        </div>

        <Container className="relative">
          <div className="flex min-h-[min(88vh,46rem)] flex-col justify-end pb-14 pt-24 sm:pb-20 lg:min-h-[42rem] lg:justify-center lg:py-28">
            <div className="max-w-xl">
              <p className="reveal tracking-eyebrow text-[color:var(--color-sand)]/85">
                {dict.home.heroEyebrow}
              </p>
              <h1 className="reveal reveal-delay-1 font-display mt-5 text-[2.6rem] leading-[1.04] tracking-[-0.02em] text-[color:var(--color-ivory)] sm:text-[3.6rem] lg:text-[4.1rem]">
                {dict.home.heroTitle}
              </h1>
              <p className="reveal reveal-delay-2 mt-6 max-w-lg text-[1rem] leading-[1.75] text-[color:var(--color-cream)]/85 sm:text-[1.0625rem]">
                {dict.home.heroBody}
              </p>
              <div className="reveal reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href={pathFor("mensWallets", locale)}
                  className="inline-flex h-12 items-center justify-center bg-[color:var(--color-cream)] px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-espresso)] transition-colors hover:bg-white"
                >
                  {dict.home.heroPrimary}
                </Link>
                <Link
                  href={pathFor("leatherGuide", locale)}
                  className="inline-flex h-12 items-center justify-center border border-[color:var(--color-ivory)]/35 px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)] transition-colors hover:border-[color:var(--color-ivory)]/80 hover:bg-[color:var(--color-ivory)]/5"
                >
                  {dict.home.heroSecondary}
                </Link>
              </div>
              <p className="reveal reveal-delay-3 mt-7 text-[0.75rem] leading-relaxed text-[color:var(--color-linen)]/70">
                {dict.home.heroNote}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* --------------------------- Collections --------------------------- */}
      <section aria-labelledby="collections-heading" className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              id="collections-heading"
              eyebrow={dict.home.collectionsEyebrow}
              title={dict.home.collectionsTitle}
            />
            <p className="max-w-sm text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-muted)]">
              {dict.home.collectionsBody}
            </p>
          </div>

          <div className="mt-12 grid gap-10 border-t border-[color:var(--color-line)] pt-10 lg:grid-cols-3 lg:gap-12">
            {collectionOrder.map((collection) => (
              <div key={collection}>
                <h3 className="font-display text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)]">
                  {dict.collections[collection]}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-[color:var(--color-ink-muted)]">
                  {dict.collections[`${collection}Blurb` as const]}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {categories
                    .filter((category) => category.collection === collection)
                    .map((category) => (
                      <li key={category.id}>
                        <Link
                          href={pathFor(categoryRoutes[category.id], locale)}
                          className="group inline-flex items-baseline gap-2 text-[0.9375rem] text-[color:var(--color-ink-body)] transition-colors hover:text-[color:var(--color-cognac)]"
                        >
                          <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-[color:var(--color-cognac)]/40">
                            {category.name[locale]}
                          </span>
                          <span aria-hidden="true" className="text-[0.75rem] text-[color:var(--color-clay)]">
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------ Category showcase ------------------------ */}
      <section aria-labelledby="showcase-heading" className="border-y border-[color:var(--color-line)] bg-[color:var(--color-surface-sunken)] py-20 sm:py-24">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <h2
              id="showcase-heading"
              className="font-display max-w-lg text-[1.85rem] leading-[1.15] text-[color:var(--color-ink-strong)] sm:text-[2.4rem]"
            >
              {showcaseHeading[locale]}
            </h2>
            <p className="hidden max-w-xs text-[0.875rem] leading-relaxed text-[color:var(--color-ink-muted)] sm:block">
              {dict.footer.placeholderDisclosure}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={index === 0 ? "col-span-2 lg:col-span-2" : undefined}
              >
                <CategoryCard
                  category={category}
                  locale={locale}
                  priority={index === 0}
                  sizes={
                    index === 0
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                      : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                  }
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* --------------------------- Leather grades -------------------------- */}
      <section aria-labelledby="leather-heading" className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <SectionHeading
                id="leather-heading"
                eyebrow={dict.home.leatherEyebrow}
                title={dict.home.leatherTitle}
                body={dict.home.leatherBody}
              />
              <Link
                href={pathFor("leatherGuide", locale)}
                className="mt-6 inline-flex items-center gap-2 border-b border-[color:var(--color-line-strong)] pb-1 text-[0.8125rem] tracking-[0.1em] uppercase text-[color:var(--color-ink-strong)] transition-colors hover:border-[color:var(--color-cognac)] hover:text-[color:var(--color-cognac)]"
              >
                {dict.home.leatherLink}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
              {(
                [
                  { title: dict.home.fullGrainTitle, body: dict.home.fullGrainBody, image: "/images/leather/full-grain.jpg", tag: "01" },
                  { title: dict.home.topGrainTitle, body: dict.home.topGrainBody, image: "/images/leather/top-grain.jpg", tag: "02" },
                ] as const
              ).map((grade) => (
                <article key={grade.title} className="hairline-frame flex flex-col bg-[color:var(--color-surface-raised)]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--color-cream)]">
                    <Image
                      src={grade.image}
                      alt={`${grade.title} — ${dict.a11y.placeholderImage}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 bg-[color:var(--color-espresso)]/55 px-2 py-1 text-[0.5625rem] tracking-[0.16em] uppercase text-[color:var(--color-ivory)]">
                      {grade.tag}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)]">
                      {grade.title}
                    </h3>
                    <p className="mt-2.5 text-[0.875rem] leading-relaxed text-[color:var(--color-ink-body)]">
                      {grade.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------ Promise ----------------------------- */}
      <section aria-labelledby="promise-heading" className="bg-[color:var(--color-espresso)] py-20 text-[color:var(--color-cream)] sm:py-24">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2
              id="promise-heading"
              className="font-display max-w-md text-[1.85rem] leading-[1.15] text-[color:var(--color-ivory)] sm:text-[2.35rem]"
            >
              {dict.home.trustTitle}
            </h2>
            <p className="max-w-sm text-[0.8125rem] leading-relaxed text-[color:var(--color-linen)]/60">
              {dict.footer.madeIn}
            </p>
          </div>

          <dl className="mt-12 grid gap-x-8 gap-y-10 border-t border-[color:var(--color-ivory)]/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {dict.home.trustItems.map((item, index) => (
              <div key={item.title}>
                <dt className="flex items-baseline gap-3">
                  <span className="tracking-eyebrow text-[0.5rem] text-[color:var(--color-clay)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.9375rem] font-medium text-[color:var(--color-ivory)]">
                    {item.title}
                  </span>
                </dt>
                <dd className="mt-3 pl-8 text-[0.8125rem] leading-relaxed text-[color:var(--color-linen)]/70">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* -------------------------- Buying guidance ------------------------- */}
      <section aria-labelledby="size-heading" className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            id="size-heading"
            eyebrow={dict.home.sizeEyebrow}
            title={dict.home.sizeTitle}
            body={dict.home.sizeBody}
          />

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {measureGuides[locale].map((guide) => (
              <article key={guide.title} className="border-t border-[color:var(--color-line-strong)] pt-5">
                <h3 className="text-[0.9375rem] font-medium text-[color:var(--color-ink-strong)]">
                  {guide.title}
                </h3>
                <p className="mt-2.5 text-[0.875rem] leading-relaxed text-[color:var(--color-ink-body)]">
                  {guide.body}
                </p>
                <Link
                  href={pathFor(guide.route, locale)}
                  className="mt-4 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.12em] uppercase text-[color:var(--color-cognac)] transition-colors hover:text-[color:var(--color-cognac-deep)]"
                >
                  {dict.common.readMore}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------- FAQ -------------------------------- */}
      <section aria-labelledby="faq-heading" className="border-t border-[color:var(--color-line)] py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>{dict.home.faqEyebrow}</Eyebrow>
              <h2
                id="faq-heading"
                className="font-display mt-4 text-[1.85rem] leading-[1.15] text-[color:var(--color-ink-strong)] sm:text-[2.35rem]"
              >
                {dict.home.faqTitle}
              </h2>
              <Link
                href={pathFor("faq", locale)}
                className="mt-6 inline-flex items-center gap-2 text-[0.75rem] tracking-[0.12em] uppercase text-[color:var(--color-cognac)]"
              >
                {dict.nav.faq}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="lg:col-span-8">
              <FaqAccordion items={featuredFaqs} />
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------- CTA -------------------------------- */}
      <section className="pb-4 pt-4">
        <Container>
          <div className="grid items-center gap-8 border border-[color:var(--color-line-strong)] bg-[color:var(--color-cream)] px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-16">
            <div>
              <h2 className="font-display text-[1.85rem] leading-[1.12] text-[color:var(--color-ink-strong)] sm:text-[2.35rem]">
                {dict.home.ctaTitle}
              </h2>
              <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-body)]">
                {dict.home.ctaBody}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href={pathFor("contact", locale)}
                className="inline-flex h-12 items-center justify-center bg-[color:var(--color-espresso)] px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)] transition-colors hover:bg-[color:var(--color-cognac-deep)]"
              >
                {dict.home.ctaButton}
              </Link>
              <Link
                href={pathFor("shipping", locale)}
                className="inline-flex h-12 items-center justify-center border border-[color:var(--color-line-strong)] px-7 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ink-strong)] transition-colors hover:border-[color:var(--color-cognac)]"
              >
                {deliveryLabel[locale]}
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serialiseJsonLd([
            faqLd(featuredFaqs),
            itemListLd(
              categories.map((category) => ({
                name: category.name[locale],
                path: pathFor(categoryRoutes[category.id], locale),
              })),
            ),
          ].map((entry) => ({ ...entry, "@context": "https://schema.org" }))),
        }}
      />
    </>
  );
}

const heroAlt: Record<Locale, string> = {
  en: "Workbench with cognac full grain leather, an awl and waxed thread — placeholder workshop illustration",
  ms: "Meja kerja dengan kulit full grain cognac, awl dan benang berlilin — ilustrasi bengkel sementara",
  zh: "工作台上摆放干邑色全粒面皮革、锥子与蜡线——临时工坊示意图",
};

const showcaseHeading: Record<Locale, string> = {
  en: "Seven categories. Nothing else.",
  ms: "Tujuh kategori. Tiada yang lain.",
  zh: "七个分类，就这么多。",
};

const deliveryLabel: Record<Locale, string> = {
  en: "Delivery in Malaysia",
  ms: "Penghantaran di Malaysia",
  zh: "马来西亚配送",
};

const measureGuides: Record<
  Locale,
  { title: string; body: string; route: "mensBelts" | "dogCollars" | "ladiesHandbags" }[]
> = {
  en: [
    {
      title: "Belts",
      body: "Measure an existing belt from the buckle fold to the hole you use most. Order that length, not your trouser size — the two rarely match.",
      route: "mensBelts",
    },
    {
      title: "Dog collars",
      body: "Measure snugly around the base of the neck where the collar sits, then check the range. Two fingers should still fit under a closed collar.",
      route: "dogCollars",
    },
    {
      title: "Handbags",
      body: "Measure the widest item you carry, add two centimetres, and compare that with the interior width stated on the product page.",
      route: "ladiesHandbags",
    },
  ],
  ms: [
    {
      title: "Tali pinggang",
      body: "Ukur tali pinggang sedia ada dari lipatan buckle hingga lubang yang paling kerap digunakan. Pesan panjang itu, bukan saiz seluar — kedua-duanya jarang sama.",
      route: "mensBelts",
    },
    {
      title: "Kolar anjing",
      body: "Ukur dengan kemas di pangkal leher tempat kolar duduk, kemudian semak julatnya. Dua jari masih perlu muat di bawah kolar yang dikancing.",
      route: "dogCollars",
    },
    {
      title: "Beg tangan",
      body: "Ukur barang paling lebar yang anda bawa, tambah dua sentimeter, dan bandingkan dengan lebar dalam yang dinyatakan pada halaman produk.",
      route: "ladiesHandbags",
    },
  ],
  zh: [
    {
      title: "皮带",
      body: "量一条现有皮带，从扣头折返处量到你最常用的孔。订这个长度，而不是裤子的尺码——两者通常并不相同。",
      route: "mensBelts",
    },
    {
      title: "狗项圈",
      body: "贴着项圈自然佩戴的颈部位置量一圈，再对照尺寸范围。扣好之后，底下仍应能塞进两根手指。",
      route: "dogCollars",
    },
    {
      title: "手提包",
      body: "量一量你携带的最宽物件，加两公分，再对照产品页标明的内部宽度。",
      route: "ladiesHandbags",
    },
  ],
};
