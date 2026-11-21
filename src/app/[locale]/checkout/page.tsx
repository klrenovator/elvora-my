import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { Container } from "@/components/ui";
import { CheckoutForm } from "@/components/checkout-form";
import { buildMetadata } from "@/lib/seo";

/**
 * Checkout lives at a fixed localized path (/en/checkout, /ms/pembayaran,
 * /zh/jie-zhang). The folder is "checkout" for all three languages and the
 * proxy rewrites the localized segment here, so the URL vocabulary stays
 * natural in every language without duplicating the route.
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const titles: Record<Locale, string> = {
    en: "Checkout",
    ms: "Pembayaran",
    zh: "结账",
  };
  const descriptions: Record<Locale, string> = {
    en: "Enter your Malaysian delivery details to complete your genuine leather order.",
    ms: "Masukkan butiran penghantaran Malaysia anda untuk melengkapkan pesanan kulit asli anda.",
    zh: "填写马来西亚收货资料，完成你的真皮订单。",
  };

  const alternates = Object.fromEntries(
    locales.map((code) => [code, pathFor("checkout", code)]),
  ) as Record<Locale, string>;

  return buildMetadata({
    locale,
    path: alternates[locale],
    alternates,
    title: titles[locale],
    description: descriptions[locale],
    noindex: true,
  });
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-[2.2rem] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-ink-strong)] sm:text-[2.6rem]">
          {dict.checkout.title}
        </h1>
      </div>
      <div className="mt-10">
        <CheckoutForm locale={locale} />
      </div>
    </Container>
  );
}
