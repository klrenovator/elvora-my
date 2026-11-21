import Link from "next/link";
import "./globals.css";

/**
 * Global 404. It cannot know the visitor's language (it renders outside the
 * [locale] segment), so it shows all three languages rather than guessing.
 */
export default function NotFound() {
  return (
    <html lang="en-MY">
      <body>
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-6 py-20">
          <p className="tracking-eyebrow text-[color:var(--color-tan)]">404</p>
          <h1 className="font-display mt-4 text-4xl leading-tight text-[color:var(--color-ink-strong)] sm:text-5xl">
            This page has moved on.
          </h1>
          <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            The page you were looking for is not here. Everything we sell is one of seven
            categories, and you can reach all of them from the homepage.
          </p>
          <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-muted)]" lang="ms-MY">
            Halaman ini tidak ditemui. Semua produk kami tergolong dalam tujuh kategori dan boleh dicapai dari halaman utama.
          </p>
          <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-[color:var(--color-ink-muted)]" lang="zh-Hans-MY">
            找不到这个页面。我们只售卖七个分类的产品，都可以从首页进入。
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/en"
              className="inline-flex h-11 items-center border border-[color:var(--color-espresso)] bg-[color:var(--color-espresso)] px-6 text-[0.75rem] tracking-[0.14em] uppercase text-[color:var(--color-ivory)]"
            >
              Home
            </Link>
            <Link
              href="/ms"
              className="inline-flex h-11 items-center border border-[color:var(--color-line-strong)] px-6 text-[0.75rem] tracking-[0.14em] uppercase text-[color:var(--color-ink-strong)]"
            >
              Utama
            </Link>
            <Link
              href="/zh"
              className="inline-flex h-11 items-center border border-[color:var(--color-line-strong)] px-6 text-[0.75rem] tracking-[0.14em] uppercase text-[color:var(--color-ink-strong)]"
            >
              首页
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
