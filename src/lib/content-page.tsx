import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Block, ContentPage } from "@/content/pages-core";
import { CategoryCard, categoryRoutes } from "@/components/category-cards";
import { categories } from "@/content/categories";
import { getDictionary } from "@/lib/dictionary";
import { pathFor } from "@/lib/routes";

/** Renders an editorial page body from typed blocks, in the active language. */
export function PageBlocks({ page, locale }: { page: ContentPage; locale: Locale }) {
  const blocks = page.blocks[locale];
  return (
    <div className="prose-leather max-w-[42rem]">
      {page.pending ? (
        <p className="mb-8 border-l-2 border-[color:var(--color-clay)] bg-[color:var(--color-cream)] px-4 py-3 text-[0.875rem] leading-relaxed text-[color:var(--color-ink-body)]">
          {page.pending[locale]}
        </p>
      ) : null}
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }): ReactNode {
  switch (block.type) {
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
