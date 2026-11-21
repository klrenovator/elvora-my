import type { Locale } from "@/i18n/config";
import { contact, isConfigured, site, shopMailtoLink, shopWhatsAppLink } from "@/lib/site";

/**
 * WhatsApp and email contact options.
 *
 * These are the shop's two inquiry channels, so they are rendered as real,
 * tappable buttons rather than text links buried in a footer. On a phone the
 * WhatsApp button opens the app directly; the message is prefilled with the
 * product so the owner does not have to ask which one the customer means.
 *
 * When a channel is not configured it is omitted. The component never renders a
 * placeholder number or address, and never a button that goes nowhere — if
 * neither is set, it says so plainly instead.
 */

const copy = {
  en: {
    heading: "Questions about this product?",
    body: "Message us on WhatsApp or send an email. We reply in English, Bahasa Melayu or Chinese.",
    whatsapp: "Chat on WhatsApp",
    whatsappHint: "Fastest for stock, sizing and delivery questions",
    email: "Send an email",
    emailHint: "Good for detailed or bulk enquiries",
    unavailable: "Contact details are being finalised and will appear here shortly.",
    inquiryPrefix: "I would like to ask about",
  },
  ms: {
    heading: "Ada soalan tentang produk ini?",
    body: "Hubungi kami di WhatsApp atau hantar e-mel. Kami membalas dalam Bahasa Melayu, Bahasa Inggeris atau Cina.",
    whatsapp: "Sembang di WhatsApp",
    whatsappHint: "Paling pantas untuk soalan stok, saiz dan penghantaran",
    email: "Hantar e-mel",
    emailHint: "Sesuai untuk pertanyaan terperinci atau pukal",
    unavailable: "Butiran hubungan sedang dimuktunkan dan akan dipaparkan di sini tidak lama lagi.",
    inquiryPrefix: "Saya ingin bertanya tentang",
  },
  zh: {
    heading: "对这件产品有疑问？",
    body: "通过 WhatsApp 或电邮联系我们。我们可用中文、马来语或英语回覆。",
    whatsapp: "在 WhatsApp 上询问",
    whatsappHint: "询问库存、尺寸与配送最快的方式",
    email: "发送电邮",
    emailHint: "适合详细查询或批量采购",
    unavailable: "联系资料正在确认中，稍后将在此显示。",
    inquiryPrefix: "我想询问关于",
  },
} as const;

export function ContactChannels({
  locale,
  productName,
  variant = "default",
  heading,
}: {
  locale: Locale;
  /** Prefills the WhatsApp message so the owner knows which product is meant. */
  productName?: string;
  /** `default` is a bordered block; `inline` is a single row of buttons. */
  variant?: "default" | "inline";
  /** Overrides the default heading. */
  heading?: string;
}) {
  const text = copy[locale];

  const message = productName
    ? `${text.inquiryPrefix} ${productName} (${site.brandName}${site.brandSuffix}).`
    : undefined;

  const whatsappHref = shopWhatsAppLink(message);
  const mailtoHref = shopMailtoLink(
    productName ? `${text.inquiryPrefix} ${productName}` : undefined,
  );

  const hasAny = Boolean(whatsappHref || mailtoHref);

  const buttons = (
    <div className="flex flex-wrap gap-3">
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#1f7a4d] px-5 text-[0.75rem] font-medium tracking-[0.12em] uppercase text-white transition-colors hover:bg-[#186b42]"
        >
          <WhatsAppIcon />
          {text.whatsapp}
        </a>
      ) : null}

      {mailtoHref ? (
        <a
          href={mailtoHref}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-[color:var(--color-espresso)] px-5 text-[0.75rem] font-medium tracking-[0.12em] uppercase text-[color:var(--color-espresso)] transition-colors hover:bg-[color:var(--color-cream)]"
        >
          <MailIcon />
          {text.email}
        </a>
      ) : null}
    </div>
  );

  if (variant === "inline") {
    return hasAny ? buttons : null;
  }

  return (
    <div className="border border-[color:var(--color-line)] bg-white p-5">
      <h2 className="font-display text-[1.125rem] leading-tight text-[color:var(--color-ink-strong)]">
        {heading ?? text.heading}
      </h2>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
        {text.body}
      </p>

      {hasAny ? (
        <>
          <div className="mt-4">{buttons}</div>
          <dl className="mt-3 space-y-1 text-[0.75rem] text-[color:var(--color-mist)]">
            {whatsappHref ? (
              <div>
                <dt className="inline">{text.whatsapp}:</dt>{" "}
                <dd className="inline">{text.whatsappHint}</dd>
              </div>
            ) : null}
            {mailtoHref ? (
              <div>
                <dt className="inline">{text.email}:</dt>{" "}
                <dd className="inline">{text.emailHint}</dd>
              </div>
            ) : null}
          </dl>

          {/* The address is shown as text as well as a link, so it can be read
              out or copied on a device where mailto: is not configured. */}
          {isConfigured(contact.email) ? (
            <p className="mt-2 text-[0.75rem] text-[color:var(--color-ink-body)]">
              {contact.email.value}
            </p>
          ) : null}
        </>
      ) : (
        <p className="mt-3 border-l-2 border-[color:var(--color-line-strong)] pl-3 text-[0.8125rem] leading-relaxed text-[color:var(--color-mist)]">
          {text.unavailable}
        </p>
      )}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.45s1.06 2.84 1.2 3.04c.15.2 2.08 3.18 5.04 4.46.7.3 1.25.48 1.68.62.71.22 1.35.19 1.86.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.28-1.38a9.86 9.86 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}
