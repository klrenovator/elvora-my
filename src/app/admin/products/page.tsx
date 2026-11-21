import Link from "next/link";
import { redirect } from "next/navigation";
import { isOwner } from "@/lib/admin/session";
import { adminConfigState } from "@/lib/admin/auth";
import { catalogueIsWritable, getCatalogue } from "@/lib/catalogue/repository";
import { resolvePrice } from "@/lib/pricing";
import { setProductStatus } from "@/app/admin/actions";
import type { Product } from "@/content/types";

export const dynamic = "force-dynamic";

/**
 * Product list.
 *
 * Shows the catalogue exactly as the storefront would interpret it — including
 * which items are price-on-request — so the owner can spot a missing price
 * without opening each product.
 */
export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    status?: string;
    price?: string;
    saved?: string;
  }>;
}) {
  if (!(await isOwner())) redirect("/admin/login");

  const config = adminConfigState();
  const catalogue = getCatalogue();
  const all = await catalogue.all();
  const params = await searchParams;

  const filtered = all.filter((product) => {
    if (params.category && product.category !== params.category) return false;
    if (params.status && product.status !== params.status) return false;
    if (params.price === "on-request" && product.price.kind !== "on-request") return false;
    if (params.price === "fixed" && product.price.kind !== "fixed") return false;
    return true;
  });

  const writable = await catalogueIsWritable();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="tracking-eyebrow text-[color:var(--color-tan)]">Admin</p>
          <h1 className="font-display mt-2 text-[2rem] leading-tight text-[color:var(--color-ink-strong)]">
            Products
          </h1>
          <p className="mt-1 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
            {all.length} products · {all.filter((p) => p.status === "published").length} published ·{" "}
            {all.filter((p) => p.price.kind === "on-request").length} price on request
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center bg-[color:var(--color-espresso)] px-5 text-[0.75rem] tracking-[0.14em] uppercase text-[color:var(--color-ivory)]"
          >
            New product
          </Link>
          <form action="/admin/logout" method="get">
            <button
              type="submit"
              className="inline-flex h-10 items-center border border-[color:var(--color-line-strong)] px-5 text-[0.75rem] tracking-[0.14em] uppercase text-[color:var(--color-ink-strong)]"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      {params.saved ? (
        <p
          role="status"
          className="mt-6 border-l-2 border-[#5d7a4e] bg-white px-4 py-3 text-[0.8125rem] text-[color:var(--color-ink-body)]"
        >
          Product saved.
        </p>
      ) : null}

      {/* Storage state is stated plainly rather than implied. */}
      {writable ? (
        <p className="mt-6 border-l-2 border-[#5d7a4e] bg-white px-4 py-3 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-body)]">
          A database repository is active. Edits are saved immediately.
        </p>
      ) : (
        <div className="mt-6 border-l-2 border-[color:var(--color-clay)] bg-white px-4 py-3">
          <p className="text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
            Read-only: this catalogue is compiled into the build.
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            You can review products, prices and publishing state here, and the form
            validates every field. Saving is disabled because there is no database
            connected yet — nothing would be persisted, so the form refuses rather
            than reporting a save that did not happen. See{" "}
            <code className="rounded bg-[color:var(--color-cream)] px-1 py-0.5">
              src/lib/catalogue/repository.ts
            </code>{" "}
            for the interface to implement.
          </p>
        </div>
      )}

      {!config.ready ? (
        <div className="mt-4 border-l-2 border-[#a8442c] bg-white px-4 py-3">
          <p className="text-[0.8125rem] font-medium text-[#a8442c]">
            Admin configuration incomplete
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            Missing: {config.missing.join(", ")}
          </p>
        </div>
      ) : null}

      {/* Filters */}
      <nav aria-label="Filter products" className="mt-8 flex flex-wrap gap-2">
        <FilterLink
          label="All"
          href="/admin/products"
          active={!params.category && !params.status && !params.price}
        />
        <FilterLink
          label="Published"
          href="/admin/products?status=published"
          active={params.status === "published"}
        />
        <FilterLink label="Drafts" href="/admin/products?status=draft" active={params.status === "draft"} />
        <FilterLink
          label="Price on request"
          href="/admin/products?price=on-request"
          active={params.price === "on-request"}
        />
        <FilterLink
          label="Priced"
          href="/admin/products?price=fixed"
          active={params.price === "fixed"}
        />
      </nav>

      <div className="mt-6 overflow-x-auto border border-[color:var(--color-line)] bg-white">
        <table className="w-full min-w-[52rem] text-left text-[0.8125rem]">
          <thead className="border-b border-[color:var(--color-line)] bg-[color:var(--color-surface-sunken)]">
            <tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Leather</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const price = resolvePrice(product, "en");
              const stock = product.variants.reduce((total, variant) => total + variant.stock, 0);
              return (
                <tr key={product.id} className="border-b border-[color:var(--color-line)] last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium text-[color:var(--color-ink-strong)] hover:text-[color:var(--color-cognac)]"
                    >
                      {product.name.en}
                    </Link>
                    <p className="mt-0.5 text-[0.6875rem] text-[color:var(--color-mist)]">
                      {product.sku}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-ink-body)]">{product.category}</td>
                  <td className="px-4 py-3 text-[color:var(--color-ink-body)]">
                    {product.leatherType === "full-grain" ? "Full grain" : "Top grain"}
                  </td>
                  <td className="px-4 py-3">
                    {price.kind === "on-request" ? (
                      <span className="italic text-[color:var(--color-mist)]">On request</span>
                    ) : (
                      price.formatted
                    )}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-ink-body)]">{stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[0.625rem] tracking-[0.08em] uppercase ${
                        product.status === "published"
                          ? "bg-[#e8f0e4] text-[#41593a]"
                          : "bg-[color:var(--color-cream)] text-[color:var(--color-stone)]"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusToggle product={product} disabled={!writable} />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[color:var(--color-mist)]">
                  {params.category || params.status || params.price
                    ? "No products match this filter."
                    : "No products yet."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-[0.75rem] leading-relaxed text-[color:var(--color-mist)]">
        Publishing is refused for any product that fails the catalogue rules (missing
        translations, missing leather grade, a fake discount, or no SKU), so an
        incomplete item cannot reach the storefront.
      </p>
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[color:var(--color-stone)]">
      {children}
    </th>
  );
}

function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex h-8 items-center border px-3 text-[0.75rem] ${
        active
          ? "border-[color:var(--color-espresso)] text-[color:var(--color-ink-strong)]"
          : "border-[color:var(--color-line-strong)] text-[color:var(--color-ink-muted)]"
      }`}
    >
      {label}
    </Link>
  );
}

function StatusToggle({ product, disabled }: { product: Product; disabled: boolean }) {
  const next = product.status === "published" ? "draft" : "published";
  return (
    <form action={setProductStatus}>
      <input type="hidden" name="id" value={product.id} />
      <input type="hidden" name="status" value={next} />
      <button
        type="submit"
        disabled={disabled}
        className="text-[0.75rem] text-[color:var(--color-cognac)] underline decoration-[color:var(--color-line-strong)] underline-offset-4 disabled:cursor-not-allowed disabled:text-[color:var(--color-mist)] disabled:no-underline"
      >
        {product.status === "published" ? "Unpublish" : "Publish"}
      </button>
    </form>
  );
}
