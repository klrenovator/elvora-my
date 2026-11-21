import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav" | "main";
}) {
  return (
    <Tag className={`mx-auto w-full max-w-[80rem] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </Tag>
  );
}

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`tracking-eyebrow text-[color:var(--color-accent)] ${className}`}>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "start",
  id,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "start" | "center";
  id?: string;
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl"
      }
    >
      {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
      <h2
        id={id}
        className="font-display text-[1.85rem] leading-[1.15] text-[color:var(--color-ink-strong)] sm:text-[2.4rem] lg:text-[2.75rem]"
      >
        {title}
      </h2>
      {body ? <p className="lede mt-5">{body}</p> : null}
    </div>
  );
}

export function Rule({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`rule ${className}`} />;
}
