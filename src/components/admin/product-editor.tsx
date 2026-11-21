"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProduct, type SaveState } from "@/app/admin/actions";
import {
  adminLabels,
  slugify,
  type ProductFormValues,
} from "@/lib/admin/product-form";

/**
 * Product editor.
 *
 * The price section is the part that matters most: "Price on request" is an
 * explicit radio choice, not the accidental result of an empty box. Switching
 * to a fixed price reveals the amount field and the optional original price,
 * and the form refuses to save a fake discount.
 */
export function ProductEditor({
  initial,
  isNew,
  readOnly,
}: {
  initial: ProductFormValues;
  isNew: boolean;
  readOnly: boolean;
}) {
  const initialState: SaveState = {};
  const [state, formAction, pending] = useActionState(saveProduct, initialState);
  const [values, setValues] = useState<ProductFormValues>(initial);

  const fieldErrors = state.fieldErrors ?? {};
  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  /** Fill empty slugs from the English name, without overwriting typed ones. */
  function autofillSlug() {
    if (!values.slugEn) set("slugEn", slugify(values.nameEn));
  }

  return (
    <form action={formAction} className="mt-8 grid gap-10 lg:grid-cols-12">
      <input type="hidden" name="id" value={values.id} />

      <div className="space-y-10 lg:col-span-8">
        {/* ------------------------------ Basics ----------------------------- */}
        <Section title="Basics">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              name="category"
              label="Category"
              value={values.category}
              onChange={(value) => set("category", value)}
              error={fieldErrors.category}
              options={[
                { value: "", label: "Choose a category" },
                ...adminLabels.categories.map((category) => ({
                  value: category.id,
                  label: category.label,
                })),
              ]}
              hint="Only the seven approved categories can be used."
            />
            <Select
              name="leatherType"
              label="Leather grade"
              value={values.leatherType}
              onChange={(value) => set("leatherType", value as ProductFormValues["leatherType"])}
              error={fieldErrors.leatherType}
              options={[
                { value: "", label: "Confirm the grade" },
                ...adminLabels.leatherTypes.map((leather) => ({
                  value: leather.id,
                  label: leather.label,
                })),
              ]}
              hint="Must be confirmed from the manufacturer's specification."
            />
            <Text
              name="sku"
              label="SKU"
              value={values.sku}
              onChange={(value) => set("sku", value)}
              error={fieldErrors.sku}
            />
            <Text
              name="stock"
              label="Stock"
              value={values.stock}
              onChange={(value) => set("stock", value)}
              error={fieldErrors.stock}
              inputMode="numeric"
              hint="Applied to every variant of this product."
            />
          </div>

          <fieldset className="mt-5">
            <legend className="text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
              Status
            </legend>
            <div className="mt-2 flex gap-2">
              {(["draft", "published"] as const).map((status) => (
                <label
                  key={status}
                  className={`inline-flex cursor-pointer items-center gap-2 border px-3 py-2 text-[0.8125rem] ${
                    values.status === status
                      ? "border-[color:var(--color-espresso)] text-[color:var(--color-ink-strong)]"
                      : "border-[color:var(--color-line-strong)] text-[color:var(--color-ink-muted)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={values.status === status}
                    onChange={() => set("status", status)}
                  />
                  {status === "draft" ? "Draft (hidden)" : "Published (live)"}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
              Merchandising
            </legend>
            <div className="mt-2 flex flex-wrap gap-4">
              {(
                [
                  ["featured", "Featured", values.featured],
                  ["newArrival", "New arrival", values.newArrival],
                  ["bestseller", "Bestseller", values.bestseller],
                ] as const
              ).map(([key, label, checked]) => (
                <label key={key} className="inline-flex items-center gap-2 text-[0.8125rem]">
                  <input
                    type="checkbox"
                    name={key}
                    checked={checked}
                    onChange={(event) => set(key, event.target.checked)}
                  />
                  {label}
                </label>
              ))}
            </div>
            <p className="mt-2 text-[0.6875rem] text-[color:var(--color-mist)]">
              Only mark bestseller or new arrival when it is genuinely true — these
              labels appear on the storefront.
            </p>
          </fieldset>
        </Section>

        {/* ------------------------------- Price ----------------------------- */}
        <Section title="Price">
          <p className="mb-4 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            Every price is entered by you. Nothing here is calculated or estimated. If
            a product has no price yet, choose <strong>Price on request</strong>.
          </p>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["on-request", "Price on request"],
                ["fixed", "Set a price"],
              ] as const
            ).map(([mode, label]) => (
              <label
                key={mode}
                className={`inline-flex cursor-pointer items-center gap-2 border px-3 py-2 text-[0.8125rem] ${
                  values.priceMode === mode
                    ? "border-[color:var(--color-espresso)] text-[color:var(--color-ink-strong)]"
                    : "border-[color:var(--color-line-strong)] text-[color:var(--color-ink-muted)]"
                }`}
              >
                <input
                  type="radio"
                  name="priceMode"
                  value={mode}
                  checked={values.priceMode === mode}
                  onChange={() => set("priceMode", mode)}
                />
                {label}
              </label>
            ))}
          </div>

          {values.priceMode === "fixed" ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Text
                name="priceAmount"
                label="Selling price (RM)"
                value={values.priceAmount}
                onChange={(value) => set("priceAmount", value)}
                error={fieldErrors.priceAmount}
                inputMode="numeric"
                placeholder="249.00"
                hint="Whole Ringgit and sen only, e.g. 249 or 249.90."
              />
              <Text
                name="compareAtAmount"
                label="Original price (optional)"
                value={values.compareAtAmount}
                onChange={(value) => set("compareAtAmount", value)}
                error={fieldErrors.compareAtAmount}
                inputMode="numeric"
                placeholder="Leave blank if not on offer"
                hint="Only for a genuine reduction. Must be higher than the selling price."
              />
            </div>
          ) : (
            <input type="hidden" name="compareAtAmount" value="" />
          )}
        </Section>

        {/* --------------------------- Translations -------------------------- */}
        <Section title="Content in all three languages">
          <p className="mb-4 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            All three languages are required, because every product has a page at
            /en/, /ms/ and /zh/. Write each one naturally rather than translating
            word for word.
          </p>

          {(
            [
              ["en", "English", "/en/products/"],
              ["ms", "Bahasa Melayu", "/ms/produk/"],
              ["zh", "Chinese", "/zh/chan-pin/"],
            ] as const
          ).map(([lang, label, prefix]) => {
            const nameKey = `name${cap(lang)}` as keyof ProductFormValues;
            const slugKey = `slug${cap(lang)}` as keyof ProductFormValues;
            const shortKey = `shortDescription${cap(lang)}` as keyof ProductFormValues;
            const descKey = `description${cap(lang)}` as keyof ProductFormValues;
            return (
              <details key={lang} className="mb-3 border border-[color:var(--color-line)]" open={lang === "en"}>
                <summary className="cursor-pointer bg-[color:var(--color-surface-sunken)] px-3 py-2 text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
                  {label}
                  {!values[nameKey] ? (
                    <span className="ml-2 text-[0.6875rem] font-normal text-[#a8442c]">
                      incomplete
                    </span>
                  ) : null}
                </summary>
                <div className="space-y-4 p-3">
                  <Text
                    name={nameKey}
                    label="Product name"
                    value={String(values[nameKey])}
                    onChange={(value) => {
                      set(nameKey, value as ProductFormValues[typeof nameKey]);
                      if (lang === "en" && !values.slugEn) {
                        set("slugEn", slugify(value));
                      }
                    }}
                    error={fieldErrors[nameKey]}
                  />
                  <Text
                    name={slugKey}
                    label="URL slug"
                    value={String(values[slugKey])}
                    onChange={(value) => set(slugKey, value as ProductFormValues[typeof slugKey])}
                    error={fieldErrors[slugKey]}
                    hint={`${prefix}${values[slugKey] || "your-slug"}`}
                  />
                  <Text
                    name={shortKey}
                    label="Short description"
                    value={String(values[shortKey])}
                    onChange={(value) => set(shortKey, value as ProductFormValues[typeof shortKey])}
                    error={fieldErrors[shortKey]}
                    hint="One or two sentences, shown on cards and in listings."
                  />
                  <Textarea
                    name={descKey}
                    label="Full description"
                    value={String(values[descKey])}
                    onChange={(value) => set(descKey, value as ProductFormValues[typeof descKey])}
                    error={fieldErrors[descKey]}
                    hint="Separate paragraphs with a blank line."
                    rows={6}
                  />
                </div>
              </details>
            );
          })}

          <button
            type="button"
            onClick={autofillSlug}
            className="mt-2 text-[0.75rem] text-[color:var(--color-cognac)] underline underline-offset-4"
          >
            Generate English slug from the name
          </button>
        </Section>

        {/* -------------------------------- SEO ------------------------------ */}
        <Section title="Search metadata">
          <p className="mb-4 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            Required before publishing. Keep titles under about 60 characters and
            descriptions under about 155, written for a person rather than a crawler.
          </p>
          {(
            [
              ["en", "English"],
              ["ms", "Bahasa Melayu"],
              ["zh", "Chinese"],
            ] as const
          ).map(([lang, label]) => {
            const titleKey = `seoTitle${cap(lang)}` as keyof ProductFormValues;
            const descKey = `seoDescription${cap(lang)}` as keyof ProductFormValues;
            return (
              <div key={lang} className="mb-5">
                <p className="mb-2 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-[color:var(--color-stone)]">
                  {label}
                </p>
                <Text
                  name={titleKey}
                  label="SEO title"
                  value={String(values[titleKey])}
                  onChange={(value) => set(titleKey, value as ProductFormValues[typeof titleKey])}
                  error={fieldErrors[titleKey]}
                />
                <Textarea
                  name={descKey}
                  label="Meta description"
                  value={String(values[descKey])}
                  onChange={(value) => set(descKey, value as ProductFormValues[typeof descKey])}
                  error={fieldErrors[descKey]}
                  rows={2}
                />
              </div>
            );
          })}
        </Section>
      </div>

      {/* ------------------------------ Sidebar ------------------------------ */}
      <aside className="lg:col-span-4">
        <div className="sticky top-6 border border-[color:var(--color-line-strong)] bg-white p-5">
          <p className="tracking-eyebrow text-[0.5625rem] text-[color:var(--color-tan)]">
            {isNew ? "New product" : "Editing"}
          </p>
          <p className="mt-2 text-[0.9375rem] font-medium text-[color:var(--color-ink-strong)]">
            {values.nameEn || "Untitled product"}
          </p>

          {state.error ? (
            <p
              role="alert"
              className="mt-4 border-l-2 border-[#a8442c] bg-[color:var(--color-surface-sunken)] px-3 py-2 text-[0.75rem] leading-relaxed text-[#a8442c]"
            >
              {state.error}
            </p>
          ) : null}
          {state.ok ? (
            <p
              role="status"
              className="mt-4 border-l-2 border-[#5d7a4e] bg-[color:var(--color-surface-sunken)] px-3 py-2 text-[0.75rem] leading-relaxed text-[#41593a]"
            >
              Saved.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending || readOnly}
            className="mt-4 flex h-11 w-full items-center justify-center bg-[color:var(--color-espresso)] px-5 text-[0.75rem] tracking-[0.14em] uppercase text-[color:var(--color-ivory)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save product"}
          </button>

          {readOnly ? (
            <p className="mt-3 text-[0.6875rem] leading-relaxed text-[color:var(--color-mist)]">
              Read-only: no database is connected, so saving is disabled. The form
              validates everything so you can check the data before wiring storage.
            </p>
          ) : null}

          <Link
            href="/admin/products"
            className="mt-3 block text-center text-[0.75rem] text-[color:var(--color-ink-muted)] underline underline-offset-4"
          >
            Back to products
          </Link>

          {Object.keys(fieldErrors).length > 0 ? (
            <p className="mt-4 text-[0.6875rem] text-[#a8442c]">
              {Object.keys(fieldErrors).length} field
              {Object.keys(fieldErrors).length === 1 ? "" : "s"} need attention.
            </p>
          ) : null}
        </div>
      </aside>
    </form>
  );
}

function cap(locale: string): string {
  return locale.charAt(0).toUpperCase() + locale.slice(1);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-[color:var(--color-line)] bg-white p-5">
      <h2 className="font-display mb-4 text-[1.25rem] leading-tight text-[color:var(--color-ink-strong)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Text({
  name,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  inputMode,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  inputMode?: "numeric" | "text";
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
        {label}
      </label>
      {hint ? (
        <p id={`${name}-hint`} className="mt-0.5 text-[0.6875rem] text-[color:var(--color-mist)]">
          {hint}
        </p>
      ) : null}
      <input
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        className={`mt-1.5 w-full border bg-white px-3 py-2 text-[0.875rem] text-[color:var(--color-ink-strong)] ${
          error ? "border-[#a8442c]" : "border-[color:var(--color-line-strong)]"
        }`}
      />
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-[0.6875rem] text-[#a8442c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Textarea({
  name,
  label,
  value,
  onChange,
  error,
  hint,
  rows = 3,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
        {label}
      </label>
      {hint ? (
        <p id={`${name}-hint`} className="mt-0.5 text-[0.6875rem] text-[color:var(--color-mist)]">
          {hint}
        </p>
      ) : null}
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        className={`mt-1.5 w-full border bg-white px-3 py-2 text-[0.875rem] text-[color:var(--color-ink-strong)] ${
          error ? "border-[#a8442c]" : "border-[color:var(--color-line-strong)]"
        }`}
      />
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-[0.6875rem] text-[#a8442c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select({
  name,
  label,
  value,
  onChange,
  error,
  options,
  hint,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
        {label}
      </label>
      {hint ? (
        <p id={`${name}-hint`} className="mt-0.5 text-[0.6875rem] text-[color:var(--color-mist)]">
          {hint}
        </p>
      ) : null}
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        className={`mt-1.5 w-full border bg-white px-3 py-2 text-[0.875rem] text-[color:var(--color-ink-strong)] ${
          error ? "border-[#a8442c]" : "border-[var(--color-line-strong)]"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-[0.6875rem] text-[#a8442c]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
