import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Block, ContentPage } from "@/content/pages-core";
import { CategoryCard, categoryRoutes } from "@/components/category-cards";
import { categories } from "@/content/categories";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";
import { contact, isConfigured } from "@/lib/site";
import { collarSizes, dogSizingPage, formatInches } from "@/content/pages-sizing";
import { banknoteColumns, malaysianBanknotes, substrateLabel } from "@/content/pages-wallet-sizing";

/** Renders an editorial page body from typed blocks, in the active language. */
export function PageBlocks({ page, locale }: { page: ContentPage; locale: Locale }) {
  const blocks = page.blocks[locale];

  // A "channels being finalised" notice is only true while no channel exists.
  // Showing it next to working WhatsApp and email buttons would contradict the
  // page, so it disappears the moment either is configured.
  const channelsLive = isConfigured(contact.whatsapp) || isConfigured(contact.email);

  return (
    <div className="prose-leather max-w-[42rem]">
      {page.pending && !channelsLive ? (
        <p className="mb-8 border-l-2 border-[color:var(--color-clay)] bg-[color:var(--color-cream)] px-4 py-3 text-[0.875rem] leading-relaxed text-[color:var(--color-ink-body)]">
          {page.pending[locale]}
        </p>
      ) : null}
      {/* The size table carries its own caption for screen readers, because the
          heading above it is prose and the table would otherwise be announced
          as an unlabelled grid. */}
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} locale={locale} />
      ))}
    </div>
  );
}

function BlockView({ block, locale }: { block: Block; locale: Locale }): ReactNode {
  switch (block.type) {
    case "table":
      return block.table === "banknotes" ? (
        <BanknoteTable locale={locale} />
      ) : (
        <CollarSizeTable locale={locale} />
      );
    case "h":
      return <h2 className="font-display first:mt-0">{block.text}</h2>;
    case "p":
      return <p>{block.text}</p>;
    case "list":
      return (
        <ul className="my-5 space-y-2.5 pl-0">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-3 text-[0.9375rem] leading-relaxed">
              <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-[color:var(--color-clay)]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <p className="my-8 border-l-2 border-[color:var(--color-cognac)]/50 bg-[color:var(--color-cream)]/60 px-4 py-4 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-body)]">
          {block.text}
        </p>
      );
    default:
      return null;
  }
}

function CollarSizeTable({ locale }: { locale: Locale }) {
      const copy = dogSizingPage;
      const cols = copy.columns[locale];
      return (
        <figure className="my-8">
          <figcaption className="mb-3 text-[0.8125rem] tracking-[0.12em] uppercase text-[color:var(--color-ink-muted)]">
            {copy.tableHeading[locale]}
          </figcaption>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-[0.875rem]">
              <thead>
                <tr className="border-b border-[color:var(--color-line-strong)]">
                  <th scope="col" className="py-2.5 pr-4 font-medium text-[color:var(--color-ink-strong)]">
                    {cols.size}
                  </th>
                  <th scope="col" className="py-2.5 pr-4 font-medium text-[color:var(--color-ink-strong)]">
                    {cols.range}
                  </th>
                  <th scope="col" className="py-2.5 pr-4 font-medium text-[color:var(--color-ink-strong)]">
                    {cols.inches}
                  </th>
                  <th scope="col" className="py-2.5 font-medium text-[color:var(--color-ink-strong)]">
                    {cols.suits}
                  </th>
                </tr>
              </thead>
              <tbody>
                {collarSizes.map((row) => (
                  <tr
                    key={`${row.width}-${row.minCm}`}
                    className="border-b border-[color:var(--color-line)] last:border-0"
                  >
                    <td className="py-2.5 pr-4 font-medium uppercase text-[color:var(--color-ink-strong)]">
                      {row.sizeId}
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums text-[color:var(--color-ink-body)]">
                      {row.minCm}–{row.maxCm} cm
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums text-[color:var(--color-ink-muted)]">
                      {formatInches(row.minCm)}–{formatInches(row.maxCm)} in
                    </td>
                    <td className="py-2.5 text-[color:var(--color-ink-body)]">{row.suits[locale]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            {copy.confirmStock[locale]}
          </p>
        </figure>
      );
}

/**
 * Malaysian banknote dimensions, verified from Bank Negara Malaysia.
 *
 * The table is deliberately a reference table, not a product specification: the
 * page's whole argument is that a wallet's own dimensions must be measured on the
 * piece, and this table is what the buyer measures *against*.
 */
function BanknoteTable({ locale }: { locale: Locale }) {
  const cols = banknoteColumns[locale];
  const substrate = substrateLabel[locale];
  return (
    <figure className="my-8">
      <figcaption className="mb-3 text-[0.8125rem] tracking-[0.12em] uppercase text-[color:var(--color-ink-muted)]">
        Bank Negara Malaysia
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[26rem] border-collapse text-left text-[0.875rem]">
          <thead>
            <tr className="border-b border-[color:var(--color-line-strong)]">
              <th scope="col" className="py-2.5 pr-4 font-medium text-[color:var(--color-ink-strong)]">
                {cols.denomination}
              </th>
              <th scope="col" className="py-2.5 pr-4 font-medium text-[color:var(--color-ink-strong)]">
                {cols.size}
              </th>
              <th scope="col" className="py-2.5 font-medium text-[color:var(--color-ink-strong)]">
                {cols.substrate}
              </th>
            </tr>
          </thead>
          <tbody>
            {malaysianBanknotes.map((note) => (
              <tr key={note.denomination} className="border-b border-[color:var(--color-line)] last:border-0">
                <td className="py-2.5 pr-4 font-medium text-[color:var(--color-ink-strong)]">
                  {note.denomination}
                </td>
                <td className="py-2.5 pr-4 tabular-nums text-[color:var(--color-ink-body)]">
                  {note.lengthMm} × {note.heightMm} mm
                </td>
                <td className="py-2.5 text-[color:var(--color-ink-body)]">
                  {substrate[note.substrate] ?? note.substrate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/**
 * Contextual category links under an editorial page. Keeps policy and guide
 * pages connected to the catalogue instead of leaving them as dead ends.
 */
export function RelatedCategories({
  locale,
  ids,
  heading,
}: {
  locale: Locale;
  ids: string[];
  heading?: string;
}) {
  const dict = getDictionary(locale);
  const selected = categories.filter((category) => ids.includes(category.id));
  if (selected.length === 0) return null;

  return (
    <section aria-labelledby="related-categories" className="mt-16 border-t border-[color:var(--color-line)] pt-10">
      <h2
        id="related-categories"
        className="tracking-eyebrow mb-6 text-[0.5625rem] text-[color:var(--color-tan)]"
      >
        {heading ?? dict.category.relatedTitle}
      </h2>
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {selected.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            locale={locale}
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ))}
      </div>
      <p className="mt-8 text-[0.8125rem] text-[color:var(--color-mist)]">
        <a
          href={pathFor("leatherGuide", locale)}
          className="underline decoration-[color:var(--color-line-strong)] underline-offset-4 hover:text-[color:var(--color-cognac)]"
        >
          {dict.home.leatherLink}
        </a>
      </p>
    </section>
  );
}

export { categoryRoutes };
