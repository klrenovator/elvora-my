import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isOwner } from "@/lib/admin/session";
import { productToForm } from "@/lib/admin/product-form";
import { ProductEditor } from "@/components/admin/product-editor";
import { catalogueIsWritable, getCatalogue } from "@/lib/catalogue/repository";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isOwner())) redirect("/admin/login");

  const { id } = await params;
  const catalogue = getCatalogue();
  const product = await catalogue.byId(id);
  if (!product) notFound();

  const writable = await catalogueIsWritable();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <nav className="flex items-center gap-2 text-[0.75rem] text-[color:var(--color-mist)]">
        <Link href="/admin/products" className="hover:text-[color:var(--color-cognac)]">
          Products
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[color:var(--color-ink-body)]">{product.name.en}</span>
      </nav>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-[2rem] leading-tight text-[color:var(--color-ink-strong)]">
          {product.name.en}
        </h1>
        <Link
          href={`/en/products/${product.slug.en}`}
          className="text-[0.75rem] text-[color:var(--color-cognac)] underline underline-offset-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on storefront ↗
        </Link>
      </div>
      <ProductEditor initial={productToForm(product)} isNew={false} readOnly={!writable} />
    </main>
  );
}
