import type { Product } from "@/content/types";
import { getDb } from "@/lib/db/client";
import {
  CatalogueWriteError,
  type ProductRepository,
} from "@/lib/catalogue/repository";

/**
 * Supabase-backed product repository.
 *
 * Storage shape: one row per product. The full `Product` document lives in a
 * `jsonb` column, with `status`, `category`, `sort_order` and the three slugs
 * lifted into real columns so the storefront can filter and look a page up in
 * one indexed query.
 *
 * Two rules are enforced here as well as in the database:
 *
 * 1. **The document is the source of truth.** Lifted columns are written from
 *    the document on every save, so they cannot drift out of step with it.
 * 2. **Writes refuse rather than half-succeed.** `update` on a missing id throws
 *    instead of silently inserting, because a save that reports success for a
 *    row that does not exist is the failure mode this whole architecture exists
 *    to prevent.
 */

export interface ProductRow {
  id: string;
  status: string;
  category: string;
  sort_order: number;
  sku: string;
  slug_en: string;
  slug_ms: string;
  slug_zh: string;
  data: unknown;
}

/** Turn a database row back into the application's `Product` shape. */
export function rowToProduct(row: ProductRow): Product {
  // The document is authoritative. The lifted columns exist for querying, so if
  // they ever disagree with the document the document wins — which keeps a bad
  // manual edit from renaming a product's URL.
  return row.data as Product;
}

/** Flatten a `Product` into the columns the table stores. */
export function productToRow(product: Product): ProductRow {
  return {
    id: product.id,
    status: product.status,
    category: product.category,
    sort_order: product.order,
    sku: product.sku,
    slug_en: product.slug.en,
    slug_ms: product.slug.ms,
    slug_zh: product.slug.zh,
    data: product,
  };
}

const COLUMNS = ["id", "status", "category", "sort_order", "sku", "slug_en", "slug_ms", "slug_zh", "data"];

/**
 * `postgres` requires a plain record for its dynamic-insert helper; the row
 * interface above exists for typing what comes *back*. This is a widening
 * cast in one direction only — no shape or value is changed.
 */
function recordOf(row: ProductRow): Record<string, unknown> {
  return { ...row };
}

export class PostgresProductRepository implements ProductRepository {
  async all(): Promise<Product[]> {
    const sql = getDb();
    const rows = await sql<ProductRow[]>`
      select id, status, category, sort_order, sku, slug_en, slug_ms, slug_zh, data
      from public.products
      order by sort_order asc, id asc
    `;
    return rows.map(rowToProduct);
  }

  async published(): Promise<Product[]> {
    const sql = getDb();
    const rows = await sql<ProductRow[]>`
      select id, status, category, sort_order, sku, slug_en, slug_ms, slug_zh, data
      from public.products
      where status = 'published'
      order by sort_order asc, id asc
    `;
    return rows.map(rowToProduct);
  }

  async byId(id: string): Promise<Product | undefined> {
    const sql = getDb();
    const rows = await sql<ProductRow[]>`
      select id, status, category, sort_order, sku, slug_en, slug_ms, slug_zh, data
      from public.products
      where id = ${id}
      limit 1
    `;
    return rows[0] ? rowToProduct(rows[0]) : undefined;
  }

  async bySlug(locale: keyof Product["slug"], slug: string): Promise<Product | undefined> {
    const sql = getDb();
    // Written as a parameterised OR rather than interpolating a column name.
    // The locale is already a fixed union, but keeping every value a bind
    // parameter means there is no identifier-interpolation pattern in the file
    // for anyone to copy and get wrong later.
    const rows = await sql<ProductRow[]>`
      select id, status, category, sort_order, sku, slug_en, slug_ms, slug_zh, data
      from public.products
      where status = 'published'
        and (
          (${locale} = 'en' and lower(slug_en) = lower(${slug}))
          or (${locale} = 'ms' and lower(slug_ms) = lower(${slug}))
          or (${locale} = 'zh' and lower(slug_zh) = lower(${slug}))
        )
      limit 1
    `;
    return rows[0] ? rowToProduct(rows[0]) : undefined;
  }

  async create(product: Product): Promise<Product> {
    const sql = getDb();
    const row = productToRow(product);
    try {
      const inserted = await sql<ProductRow[]>`
        insert into public.products ${sql(recordOf(row), ...COLUMNS)}
        on conflict (id) do nothing
        returning id, status, category, sort_order, sku, slug_en, slug_ms, slug_zh, data
      `;
      if (inserted.length === 0) {
        throw new CatalogueWriteError(`A product with id "${product.id}" already exists.`);
      }
      return rowToProduct(inserted[0]);
    } catch (error) {
      throw asWriteError(error, "create");
    }
  }

  async update(id: string, product: Product): Promise<Product> {
    const sql = getDb();
    const row = productToRow({ ...product, id });
    try {
      const updated = await sql<ProductRow[]>`
        update public.products set ${sql(recordOf(row), ...COLUMNS)}
        where id = ${id}
        returning id, status, category, sort_order, sku, slug_en, slug_ms, slug_zh, data
      `;
      // A save that matched no row must not report success.
      if (updated.length === 0) {
        throw new CatalogueWriteError(`No product with id "${id}" exists, so nothing was updated.`);
      }
      return rowToProduct(updated[0]);
    } catch (error) {
      throw asWriteError(error, "update");
    }
  }

  async remove(id: string): Promise<void> {
    const sql = getDb();
    try {
      const removed = await sql`delete from public.products where id = ${id} returning id`;
      if (removed.length === 0) {
        throw new CatalogueWriteError(`No product with id "${id}" exists, so nothing was deleted.`);
      }
    } catch (error) {
      throw asWriteError(error, "remove");
    }
  }
}

/**
 * Normalise a driver error into a `CatalogueWriteError` with a readable
 * message, while letting our own errors through untouched.
 */
function asWriteError(error: unknown, action: string): Error {
  if (error instanceof CatalogueWriteError) return error;

  const code = (error as { code?: string })?.code;
  if (code === "23505") {
    // Unique violation — almost always a duplicate slug in one language.
    return new CatalogueWriteError(
      "Another product already uses one of these URLs. Slugs must be unique per language.",
    );
  }
  if (code === "23514") {
    return new CatalogueWriteError("The product failed a database validation rule and was not saved.");
  }

  const message = error instanceof Error ? error.message : "unknown error";
  return new CatalogueWriteError(`The product could not be ${action}d: ${message}`);
}
