import type { Product } from "@/content/types";
import { products as seedProducts } from "@/content/products";

/**
 * Catalogue persistence boundary.
 *
 * The storefront and the admin both talk to this interface, never to a concrete
 * data source. That keeps the Phase 2c decision — file-based content vs. a
 * database — a one-file swap instead of a rewrite:
 *
 *   · `seedProducts` (current): content compiled into the build. Free to host,
 *     changes require a redeploy, and nothing can be edited at runtime.
 *   · A `PostgresProductRepository` (future): same interface, backed by
 *     Vercel Postgres / Neon, permitting edits without a redeploy at the cost of
 *     a managed database.
 *
 * Because every read is already routed through here, switching later touches
 * this module and the admin route handlers only.
 */

export interface ProductRepository {
  /** Every product, including drafts. For admin use. */
  all(): Promise<Product[]>;
  /** Published products only, in display order. For the storefront. */
  published(): Promise<Product[]>;
  byId(id: string): Promise<Product | undefined>;
  bySlug(locale: keyof Product["slug"], slug: string): Promise<Product | undefined>;
  create(product: Product): Promise<Product>;
  update(id: string, product: Product): Promise<Product>;
  remove(id: string): Promise<void>;
}

/**
 * Compile-time repository.
 *
 * Reads come from the seed catalogue. Writes are refused with a clear error
 * rather than silently pretending to save: with compiled-in content there is
 * nowhere to write, and a UI that says "saved" without saving would be worse
 * than one that says it cannot save yet.
 */
export class StaticProductRepository implements ProductRepository {
  constructor(private readonly source: Product[] = seedProducts) {}

  async all(): Promise<Product[]> {
    return [...this.source].sort((a, b) => a.order - b.order);
  }

  async published(): Promise<Product[]> {
    return this.source
      .filter((product) => product.status === "published")
      .sort((a, b) => a.order - b.order);
  }

  async byId(id: string): Promise<Product | undefined> {
    return this.source.find((product) => product.id === id);
  }

  async bySlug(locale: keyof Product["slug"], slug: string): Promise<Product | undefined> {
    return this.source.find(
      (product) => product.status === "published" && product.slug[locale] === slug,
    );
  }

  async create(product: Product): Promise<Product> {
    void product;
    throw new CatalogueWriteError(
      "This catalogue is compiled into the build, so products cannot be created at runtime. Configure a database repository to enable editing.",
    );
  }

  async update(id: string, product: Product): Promise<Product> {
    void id;
    void product;
    throw new CatalogueWriteError(
      "This catalogue is compiled into the build, so products cannot be edited at runtime. Configure a database repository to enable editing.",
    );
  }

  async remove(id: string): Promise<void> {
    void id;
    throw new CatalogueWriteError(
      "This catalogue is compiled into the build, so products cannot be deleted at runtime. Configure a database repository to enable editing.",
    );
  }
}

export class CatalogueWriteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogueWriteError";
  }
}

/**
 * The repository in use. Swapping the implementation here — or selecting it
 * from an environment variable — is the whole migration.
 */
let active: ProductRepository = new StaticProductRepository();

export function getCatalogue(): ProductRepository {
  return active;
}

/** Test seam: replace the repository for the duration of a test. */
export function setCatalogue(repository: ProductRepository): void {
  active = repository;
}

export function resetCatalogue(): void {
  active = new StaticProductRepository();
}

/**
 * True when the active repository can persist edits.
 *
 * The admin uses this to decide whether saving is offered at all, so a
 * read-only deployment disables the button instead of failing after the click.
 */
export async function catalogueIsWritable(): Promise<boolean> {
  return !(active instanceof StaticProductRepository);
}
