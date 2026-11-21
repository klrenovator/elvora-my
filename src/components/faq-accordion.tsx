"use client";

import { useId, useState } from "react";

/**
 * Accessible FAQ accordion. Uses native <details>-like behaviour but with a
 * controlled panel so answers are in the DOM from first paint — important for
 * crawlers and for AEO answer extraction, which must not depend on JS clicks.
 */
export function FaqAccordion({
  items,
  heading,
}: {
  items: { q: string; a: string }[];
  heading?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId().replace(/[:]/g, "");

  return (
    <div>
      {heading ? (
        <h2 className="font-display mb-6 text-[1.5rem] leading-tight text-[color:var(--color-ink-strong)] sm:text-[1.75rem]">
          {heading}
        </h2>
      ) : null}
      <dl className="divide-y divide-[color:var(--color-line)] border-y border-[color:var(--color-line)]">
        {items.map((item, index) => {
          const isOpen = open === index;
          const buttonId = `${baseId}-q-${index}`;
          const panelId = `${baseId}-a-${index}`;
          return (
            <div key={index} className="py-1">
              <dt>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-start justify-between gap-6 py-4 text-left"
                >
                  <span className="text-[0.9375rem] font-medium leading-snug text-[color:var(--color-ink-strong)] sm:text-base">
                    {item.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 shrink-0 text-[color:var(--color-tan)] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg viewBox="0 0 14 14" className="h-3 w-3" stroke="currentColor" strokeWidth="1.2">
                      <path d="M7 0v14M0 7h14" />
                    </svg>
                  </span>
                </button>
              </dt>
              <dd
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="pb-5 pr-8 text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-body)]"
              >
                {item.a}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
