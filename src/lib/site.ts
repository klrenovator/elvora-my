import type { Locale } from "@/i18n/config";

/**
 * Public business configuration.
 *
 * Values left as `null` have NOT been supplied by the business owner and must
 * never be invented. Components must check `isConfigured` before rendering a
 * channel so the site never shows a dead phone number, placeholder email or
 * fake WhatsApp link. The admin settings screen is the single place these get
 * filled in.
 */

export const site = {
  /** Canonical production origin. Override with NEXT_PUBLIC_SITE_URL. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://elvora.my").replace(/\/$/, ""),
  /** Temporary wordmark until the owner supplies the final logo. */
  brandName: "Elvora",
  brandSuffix: ".my",
  currency: "MYR",
  currencySymbol: "RM",
  country: "MY",
  /** Markets served at launch. */
  markets: ["MY"] as const,
  /**
   * Manufacture origin, confirmed by the owner. Used in copy and structured
   * data; never displayed as a shipping origin for customer parcels.
   */
  manufactureCountry: "PK",
  /** Support hours are not yet confirmed, so no SLA is promised anywhere. */
  supportHours: null as string | null,
} as const;

export interface ContactChannel {
  /** Empty string means "not supplied yet". */
  value: string | null;
}

export const contact: {
  whatsapp: ContactChannel;
  phone: ContactChannel;
  email: ContactChannel;
  instagram: ContactChannel;
  facebook: ContactChannel;
  tiktok: ContactChannel;
} = {
  // All channels are intentionally empty until the owner provides them.
  whatsapp: { value: null },
  phone: { value: null },
  email: { value: null },
  instagram: { value: null },
  facebook: { value: null },
  tiktok: { value: null },
};

export function isConfigured(channel: ContactChannel): channel is { value: string } {
  return typeof channel.value === "string" && channel.value.trim().length > 0;
}

/** Normalise a Malaysian mobile number to wa.me format (no inventing numbers). */
export function whatsappLink(number: string, message?: string): string {
  const digits = number.replace(/[^\d]/g, "").replace(/^0/, "60");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const placeholderNotice: Record<Locale, string> = {
  en: "Placeholder product artwork. These illustrations are temporary and are not photographs of the finished products.",
  ms: "Imej produk sementara. Ilustrasi ini tidak kekal dan bukan gambar produk sebenar.",
  zh: "临时产品示意图。这些插图并非成品实拍照片，日后会替换为真实产品照片。",
};
