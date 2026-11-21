import { redirect } from "next/navigation";
import Link from "next/link";
import { isOwner } from "@/lib/admin/session";
import { emptyProductForm } from "@/lib/admin/product-form";
import { ProductEditor } from "@/components/admin/product-editor";
import { catalogueIsWritable } from "@/lib/catalogue/repository";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  if (!(await isOwner())) redirect("/admin/login");
  const writable = await catalogueIsWritable();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <nav className="flex items-center gap-2 text-[0.75rem] text-[color:var(--color-mist)]">
        <Link href="/admin/products" className="hover:text-[color:var(--color-cognac)]">
          Products
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[color:var(--color-ink-body)]">New</span>
      </nav>
      <h1 className="font-display mt-3 text-[2rem] leading-tight text-[color:var(--color-ink-strong)]">
        New product
      </h1>
      <p className="mt-1 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
        Start as a draft, then publish once every field is complete.
      </p>
      <ProductEditor initial={emptyProductForm} isNew readOnly={!writable} />
    </main>
  );
}
