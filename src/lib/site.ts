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

/**
 * WhatsApp and email.
 *
 * Operators read these from the environment so the shop's real contact details
 * are never committed to the repository — and so publishing them is a config
 * change, not a code change. `null` when unset, which the components treat as
 * "not supplied yet" and never as an invitation to invent a link.
 *
 *   NEXT_PUBLIC_WHATSAPP_NUMBER=60123456789
 *   NEXT_PUBLIC_CONTACT_EMAIL=hello@elvora.my
 *
 * Public by design: both appear on public pages. They are contact details, not
 * credentials.
 */
function envChannel(value: string | undefined): ContactChannel {
  const trimmed = (value ?? "").trim();
  return { value: trimmed.length > 0 ? trimmed : null };
}

export const contact: {
  whatsapp: ContactChannel;
  phone: ContactChannel;
  email: ContactChannel;
  instagram: ContactChannel;
  facebook: ContactChannel;
  tiktok: ContactChannel;
} = {
  // WhatsApp and email come from the environment; the rest have no source yet
  // and stay null rather than being filled with a guess.
  whatsapp: envChannel(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  phone: { value: null },
  email: envChannel(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
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

/**
 * A WhatsApp link to the shop, or `null` when no number is configured.
 *
 * Returning null rather than a placeholder URL is what lets a component render
 * an honest "being finalised" notice instead of a button that goes nowhere. The
 * message is prefilled so the customer does not have to compose one — and so an
 * order enquiry arrives with the reference already in it.
 */
export function shopWhatsAppLink(message?: string): string | null {
  if (!isConfigured(contact.whatsapp)) return null;
  return whatsappLink(contact.whatsapp.value, message);
}

/** `mailto:` for the shop, or null when no address is configured. */
export function shopMailtoLink(subject?: string): string | null {
  if (!isConfigured(contact.email)) return null;
  const base = `mailto:${contact.email.value}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

export const placeholderNotice: Record<Locale, string> = {
  en: "Placeholder product artwork. These illustrations are temporary and are not photographs of the finished products.",
  ms: "Imej produk sementara. Ilustrasi ini tidak kekal dan bukan gambar produk sebenar.",
  zh: "临时产品示意图。这些插图并非成品实拍照片，日后会替换为真实产品照片。",
};
