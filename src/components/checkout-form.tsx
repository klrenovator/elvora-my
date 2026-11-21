"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { formatSen } from "@/lib/pricing";
import { malaysianStates } from "@/content/malaysia";
import {
  emptyAddress,
  hasErrors,
  isEastMalaysia,
  validateAddress,
  type AddressErrors,
  type AddressInput,
} from "@/lib/address";
import { features } from "@/lib/features";
import { useCart } from "@/components/cart-provider";
import type { ReconciledLine } from "@/lib/cart-store";
import { placeOrder, type CheckoutState } from "@/app/[locale]/checkout/actions";

/**
 * Guest checkout.
 *
 * The form submits to a server action which re-validates the address and
 * re-prices every line from the catalogue before recording an order. The total
 * shown here is compared against the server's figure, never used as the
 * authority — if they disagree the order is refused and the customer is sent
 * back to the cart.
 *
 * Payment is still not connected (see `features.payments`), so a recorded order
 * is `pending-payment`: a real, stored record of intent with a reference the
 * customer can quote. No payment is taken and the confirmation says so.
 */
export function CheckoutForm({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { reconciled, hydrated } = useCart();

  const [address, setAddress] = useState<AddressInput>(emptyAddress);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  function update(field: keyof AddressInput, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
    // Clear a field error as soon as the visitor edits that field.
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | undefined>();
  const [reference, setReference] = useState<string | undefined>();
  const [durable, setDurable] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Validate locally first: it saves a round trip and puts the message beside
    // the field. The server validates again, because this is only a courtesy.
    const found = validateAddress(address, locale);
    setErrors(found);
    if (hasErrors(found)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setServerError(undefined);

    const formData = new FormData();
    formData.set("locale", locale);
    for (const [key, value] of Object.entries(address)) formData.set(key, value);
    // Only orderable lines are submitted. Lines with issues are blocked from
    // checkout by the cart already; sending them would invite a server refusal.
    formData.set(
      "lines",
      reconciled.lines
        .filter((entry) => entry.orderable)
        .map((entry) => `${entry.line.productId}|${entry.line.variantId}|${entry.line.quantity}`)
        .join("\n"),
    );
    formData.set("subtotalSen", String(reconciled.subtotalSen));

    startTransition(async () => {
      const result: CheckoutState = await placeOrder({}, formData);
      if (result.ok && result.reference) {
        setReference(result.reference);
        setDurable(Boolean(result.durable));
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (result.fieldErrors) setErrors(result.fieldErrors as AddressErrors);
      setServerError(result.error ?? dict.checkout.orderFailed);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (!hydrated) {
    return (
      <p className="py-16 text-[0.9375rem] text-[color:var(--color-mist)]" aria-live="polite">
        {dict.common.loading}…
      </p>
    );
  }

  if (reconciled.lines.length === 0) {
    return (
      <div className="border-t border-[color:var(--color-line)] py-16">
        <p className="font-display text-[1.5rem] text-[color:var(--color-ink-strong)]">
          {dict.cart.empty}
        </p>
        <Link
          href={pathFor("home", locale)}
          className="mt-6 inline-flex h-12 items-center justify-center bg-[color:var(--color-espresso)] px-7 text-[0.75rem] tracking-[0.16em] uppercase text-[color:var(--color-ivory)]"
        >
          {dict.cart.continueShopping}
        </Link>
      </div>
    );
  }

  if (!reconciled.readyForCheckout) {
    return (
      <div className="border-t border-[color:var(--color-line)] py-16">
        <p className="font-display text-[1.5rem] text-[color:var(--color-ink-strong)]">
          {dict.cart.checkoutBlocked}
        </p>
        <Link
          href={pathFor("cart", locale)}
          className="mt-6 inline-flex h-12 items-center justify-center border border-[color:var(--color-line-strong)] px-7 text-[0.75rem] tracking-[0.16em] uppercase text-[color:var(--color-ink-strong)]"
        >
          {dict.checkout.backToCart}
        </Link>
      </div>
    );
  }

  const summaryText = buildSummary(address, locale, reconciled.lines, reconciled.subtotalSen);

  if (submitted) {
    return (
      <div className="max-w-[46rem]">
        <div className="border-l-2 border-[color:var(--color-cognac)] bg-[color:var(--color-cream)] px-5 py-4">
          <h2 className="font-display text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)]">
            {dict.checkout.successTitle}
          </h2>
          {reference ? (
            <p className="mt-3 text-[0.9375rem] text-[color:var(--color-ink-strong)]">
              {dict.checkout.orderReference}:{" "}
              <strong className="font-medium tracking-[0.06em]">{reference}</strong>
            </p>
          ) : null}
          <p className="mt-2 text-[0.875rem] leading-relaxed text-[color:var(--color-ink-body)]">
            {dict.checkout.successBody}
          </p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-[color:var(--color-cognac-deep)]">
            {dict.checkout.paymentPending}
          </p>
          {!durable ? (
            <p className="mt-2 text-[0.75rem] leading-relaxed text-[color:var(--color-mist)]">
              {dict.checkout.storageNotDurable}
            </p>
          ) : null}
        </div>

        <pre className="mt-6 max-h-96 overflow-auto whitespace-pre-wrap border border-[color:var(--color-line)] bg-white p-4 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-body)] thin-scroll">
          {summaryText}
        </pre>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(summaryText);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
            className="inline-flex h-12 items-center justify-center bg-[color:var(--color-espresso)] px-7 text-[0.75rem] tracking-[0.16em] uppercase text-[color:var(--color-ivory)]"
          >
            {copied ? dict.checkout.copied : dict.checkout.copySummary}
          </button>
          <Link
            href={pathFor("contact", locale)}
            className="inline-flex h-12 items-center justify-center border border-[color:var(--color-line-strong)] px-7 text-[0.75rem] tracking-[0.16em] uppercase text-[color:var(--color-ink-strong)]"
          >
            {dict.nav.contact}
          </Link>
          <Link
            href={pathFor("cart", locale)}
            className="inline-flex h-12 items-center justify-center px-7 text-[0.75rem] tracking-[0.16em] uppercase text-[color:var(--color-ink-muted)] underline decoration-[color:var(--color-line-strong)] underline-offset-4"
          >
            {dict.checkout.backToCart}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CheckoutFields
      locale={locale}
      address={address}
      errors={errors}
      onChange={update}
      onSubmit={handleSubmit}
      lines={reconciled.lines}
      subtotalSen={reconciled.subtotalSen}
      serverError={serverError}
      pending={pending}
    />
  );
}

/**
 * Presentational checkout form.
 *
 * Separated from the cart-aware container so the markup, field labels and
 * validation rendering can be verified without a browser or localStorage.
 */
export function CheckoutFields({
  locale,
  address,
  errors,
  onChange,
  onSubmit,
  lines,
  subtotalSen,
  serverError,
  pending,
}: {
  locale: Locale;
  address: AddressInput;
  errors: AddressErrors;
  onChange: (field: keyof AddressInput, value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  lines: ReconciledLine[];
  subtotalSen: number;
  /** Refusal from the server action, shown above the form. */
  serverError?: string;
  /** True while the server action is in flight. */
  pending?: boolean;
}) {
  const dict = getDictionary(locale);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        {serverError ? (
          <p
            role="alert"
            className="mb-4 border-l-2 border-[#a8442c] bg-white px-4 py-3 text-[0.8125rem] leading-relaxed text-[#a8442c]"
          >
            {serverError}
          </p>
        ) : null}

        <p className="border-l-2 border-[color:var(--color-cognac)] bg-[color:var(--color-cream)]/70 px-4 py-3 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-body)]">
          {dict.checkout.guestNote}
        </p>

        <h2 className="font-display mt-8 text-[1.375rem] leading-tight text-[color:var(--color-ink-strong)]">
          {dict.checkout.guestTitle}
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field
            id="fullName"
            label={dict.checkout.fullName}
            value={address.fullName}
            onChange={(value) => onChange("fullName", value)}
            error={errors.fullName}
            autoComplete="name"
            required
          />
          <Field
            id="phone"
            label={dict.checkout.phone}
            hint={dict.checkout.phoneHint}
            value={address.phone}
            onChange={(value) => onChange("phone", value)}
            error={errors.phone}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
          />
          <Field
            id="email"
            label={dict.checkout.email}
            hint={dict.checkout.emailHint}
            value={address.email}
            onChange={(value) => onChange("email", value)}
            error={errors.email}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            className="sm:col-span-2"
          />
          <Field
            id="addressLine1"
            label={dict.checkout.addressLine1}
            hint={dict.checkout.addressLine1Hint}
            value={address.addressLine1}
            onChange={(value) => onChange("addressLine1", value)}
            error={errors.addressLine1}
            autoComplete="address-line1"
            required
            className="sm:col-span-2"
          />
          <Field
            id="addressLine2"
            label={`${dict.checkout.addressLine2} (${dict.checkout.optional})`}
            value={address.addressLine2}
            onChange={(value) => onChange("addressLine2", value)}
            autoComplete="address-line2"
            className="sm:col-span-2"
          />
          <Field
            id="postcode"
            label={dict.checkout.postcode}
            value={address.postcode}
            onChange={(value) => onChange("postcode", value.replace(/[^\d]/g, "").slice(0, 5))}
            error={errors.postcode}
            inputMode="numeric"
            autoComplete="postal-code"
            required
          />
          <Field
            id="city"
            label={dict.checkout.city}
            value={address.city}
            onChange={(value) => onChange("city", value)}
            error={errors.city}
            autoComplete="address-level2"
            required
          />

          <div className="sm:col-span-2">
            <label
              htmlFor="stateCode"
              className="block text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]"
            >
              {dict.checkout.state}
              <span aria-hidden="true" className="ml-1 text-[color:var(--color-cognac)]">
                *
              </span>
            </label>
            <select
              id="stateCode"
              value={address.stateCode}
              onChange={(event) => onChange("stateCode", event.target.value)}
              aria-invalid={errors.stateCode ? true : undefined}
              aria-describedby={errors.stateCode ? "stateCode-error" : undefined}
              className={`mt-1.5 w-full border bg-white px-3 py-2.5 text-[0.9375rem] text-[color:var(--color-ink-strong)] ${
                errors.stateCode
                  ? "border-[#a8442c]"
                  : "border-[color:var(--color-line-strong)]"
              }`}
            >
              <option value="">{dict.checkout.chooseState}</option>
              {malaysianStates.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name[locale]}
                </option>
              ))}
            </select>
            {errors.stateCode ? (
              <p id="stateCode-error" className="mt-1.5 text-[0.75rem] text-[#a8442c]">
                {errors.stateCode}
              </p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="notes"
              className="block text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]"
            >
              {dict.checkout.notes}{" "}
              <span className="font-normal text-[color:var(--color-mist)]">
                ({dict.checkout.optional})
              </span>
            </label>
            <textarea
              id="notes"
              rows={2}
              value={address.notes}
              onChange={(event) => onChange("notes", event.target.value)}
              placeholder={dict.checkout.notesHint}
              className="mt-1.5 w-full border border-[color:var(--color-line-strong)] bg-white px-3 py-2.5 text-[0.9375rem] text-[color:var(--color-ink-strong)]"
            />
          </div>
        </div>

        {address.stateCode && isEastMalaysia(address.stateCode) ? (
          <p className="mt-5 border-l-2 border-[color:var(--color-clay)] bg-[color:var(--color-cream)]/60 px-4 py-3 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-body)]">
            {dict.checkout.eastMalaysiaNote}
          </p>
        ) : null}

        {/* Payment — stated honestly as not connected */}
        <h2 className="font-display mt-10 text-[1.375rem] leading-tight text-[color:var(--color-ink-strong)]">
          {dict.checkout.paymentTitle}
        </h2>
        <div className="mt-4 border border-dashed border-[color:var(--color-line-strong)] bg-white p-4">
          <p className="text-[0.875rem] font-medium text-[color:var(--color-ink-strong)]">
            {dict.checkout.paymentPending}
          </p>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            {dict.checkout.paymentPendingBody}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="lg:col-span-5">
        <div className="border border-[color:var(--color-line-strong)] bg-[color:var(--color-cream)]/60 p-6">
          <h2 className="tracking-eyebrow text-[0.5625rem] text-[color:var(--color-tan)]">
            {dict.checkout.summaryTitle}
          </h2>

          <ul className="mt-4 space-y-3">
            {lines.map((entry) => (
              <li
                key={entry.line.variantId}
                className="flex items-baseline justify-between gap-4 text-[0.8125rem]"
              >
                <span className="text-[color:var(--color-ink-body)]">
                  {entry.product?.name[locale]}{" "}
                  <span className="text-[color:var(--color-mist)]">× {entry.line.quantity}</span>
                </span>
                <span className="shrink-0 text-[color:var(--color-ink-strong)]">
                  {entry.lineTotalSen !== undefined
                    ? formatSen(entry.lineTotalSen, locale)
                    : dict.common.priceOnRequest}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-[color:var(--color-line)] pt-4">
            <span className="text-[0.875rem] text-[color:var(--color-ink-body)]">
              {dict.cart.subtotal}
            </span>
            <span className="font-display text-[1.5rem] leading-none text-[color:var(--color-ink-strong)]">
              {formatSen(subtotalSen, locale)}
            </span>
          </div>

          <p className="mt-3 text-[0.75rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            {dict.cart.shippingNote}
          </p>

          {features.payments ? null : (
            <p className="mt-4 text-[0.75rem] leading-relaxed text-[color:var(--color-cognac-deep)]">
              {dict.checkout.paymentPending}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-5 flex h-12 w-full items-center justify-center bg-[color:var(--color-espresso)] px-6 text-[0.75rem] font-medium tracking-[0.16em] uppercase text-[color:var(--color-ivory)] transition-colors hover:bg-[color:var(--color-cognac-deep)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? dict.checkout.placingOrder
              : features.payments
                ? dict.checkout.placeOrder
                : dict.checkout.orderEnquiry}
          </button>

          <p className="mt-4 text-[0.6875rem] leading-relaxed text-[color:var(--color-mist)]">
            {dict.checkout.consent}{" "}
            <Link href={pathFor("terms", locale)} className="underline underline-offset-2">
              {dict.footer.terms}
            </Link>
            {", "}
            <Link href={pathFor("privacy", locale)} className="underline underline-offset-2">
              {dict.footer.privacy}
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  autoComplete,
  required,
  className = "",
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  inputMode?: "tel" | "email" | "numeric" | "text";
  autoComplete?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-[color:var(--color-cognac)]">
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="mt-0.5 text-[0.6875rem] text-[color:var(--color-mist)]">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") ||
          undefined
        }
        className={`mt-1.5 w-full border bg-white px-3 py-2.5 text-[0.9375rem] text-[color:var(--color-ink-strong)] ${
          error ? "border-[#a8442c]" : "border-[color:var(--color-line-strong)]"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.75rem] text-[#a8442c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Plain-text order summary the customer can copy and send to us. */
function buildSummary(
  address: AddressInput,
  locale: Locale,
  lines: ReconciledLine[],
  subtotalSen: number,
): string {
  const state = malaysianStates.find((item) => item.code === address.stateCode);
  const rows: string[] = [];
  rows.push(`Elvora.my — ${locale.toUpperCase()} order enquiry`);
  rows.push("");
  for (const entry of lines) {
    rows.push(
      `${entry.product?.name[locale] ?? ""} × ${entry.line.quantity} — ${
        entry.lineTotalSen !== undefined ? formatSen(entry.lineTotalSen, locale) : "Price on request"
      }`,
    );
  }
  rows.push("");
  rows.push(`Subtotal: ${formatSen(subtotalSen, locale)}`);
  rows.push("Delivery: to be confirmed at checkout");
  rows.push("");
  rows.push(address.fullName);
  rows.push(address.phone);
  rows.push(address.email);
  rows.push(address.addressLine1);
  if (address.addressLine2) rows.push(address.addressLine2);
  rows.push(`${address.postcode} ${address.city}`);
  rows.push(state ? state.name[locale] : address.stateCode);
  if (address.notes) rows.push(`Notes: ${address.notes}`);
  return rows.join("\n");
}
