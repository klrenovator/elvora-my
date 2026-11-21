/**
 * Catalogue repository tests.
 *
 * The admin UI must never report a save that did not happen. These tests pin
 * that behaviour, and prove the repository interface is genuinely swappable so
 * moving from compiled-in content to a database is a one-file change.
 */
import {
  CatalogueWriteError,
  StaticProductRepository,
  catalogueIsWritable,
  getCatalogue,
  resetCatalogue,
  setCatalogue,
  type ProductRepository,
} from "@/lib/catalogue/repository";
import { products as seed } from "@/content/products";
import type { Product } from "@/content/types";

let pass = 0;
let fail = 0;
const check = (name: string, cond: boolean, extra = "") => {
  if (cond) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name} ${extra}`);
  }
};

async function throws(operation: () => Promise<unknown>): Promise<boolean> {
  try {
    await operation();
    return false;
  } catch (error) {
    return error instanceof CatalogueWriteError;
  }
}

async function main() {
  const staticRepo = new StaticProductRepository();

  /* --------------------------- Reads work -------------------------------- */

  const all = await staticRepo.all();
  check("all() returns the seed catalogue", all.length === seed.length);
  check(
    "all() is sorted by display order",
    all.every((product, index) => index === 0 || all[index - 1].order <= product.order),
  );

  const published = await staticRepo.published();
  check(
    "published() excludes drafts",
    published.every((product) => product.status === "published"),
  );
  check("every seed product is currently price-on-request", published.length > 0);

  const first = seed[0];
  check("byId finds a product", (await staticRepo.byId(first.id))?.id === first.id);
  check("byId returns undefined for an unknown id", (await staticRepo.byId("nope")) === undefined);
  check(
    "bySlug finds the English slug",
    (await staticRepo.bySlug("en", first.slug.en))?.id === first.id,
  );
  check(
    "bySlug finds the Chinese slug",
    (await staticRepo.bySlug("zh", first.slug.zh))?.id === first.id,
  );
  check(
    "bySlug does not match the wrong language",
    (await staticRepo.bySlug("ms", first.slug.en)) === undefined,
  );

  /* ------------------------ Writes are refused ---------------------------- */

  check("create() refuses instead of pretending", await throws(() => staticRepo.create(seed[0])));
  check("update() refuses instead of pretending", await throws(() => staticRepo.update(first.id, first)));
  check("remove() refuses instead of pretending", await throws(() => staticRepo.remove(first.id)));

  {
    let message = "";
    try {
      await staticRepo.update(first.id, first);
    } catch (error) {
      message = error instanceof Error ? error.message : "";
    }
    check("refusal explains why", message.toLowerCase().includes("compiled into the build"));
    check("refusal does not claim success", !message.toLowerCase().includes("saved"));
  }

  /* --------------------- Replaceability / swap path ----------------------- */

  resetCatalogue();
  check("default repository is the static one", (await catalogueIsWritable()) === false);

  // Stand-in for the future Postgres repository: same interface, real writes.
  const memory = new Map(seed.map((product) => [product.id, product]));
  const writable: ProductRepository = {
    async all() {
      return [...memory.values()];
    },
    async published() {
      return [...memory.values()].filter((product) => product.status === "published");
    },
    async byId(id) {
      return memory.get(id);
    },
    async bySlug(locale, slug) {
      return [...memory.values()].find((product) => product.slug[locale] === slug);
    },
    async create(product: Product) {
      memory.set(product.id, product);
      return product;
    },
    async update(id, product) {
      memory.set(id, product);
      return product;
    },
    async remove(id) {
      memory.delete(id);
    },
  };

  setCatalogue(writable);
  check("swapped repository is reported writable", (await catalogueIsWritable()) === true);
  check("swapped repository is the active one", getCatalogue() === writable);

  const created: Product = {
    ...first,
    id: "test-created",
    slug: { en: "test-created", ms: "test-created", zh: "test-created" },
  };
  await getCatalogue().create(created);
  check("created product is readable back", (await getCatalogue().byId("test-created"))?.id === "test-created");

  await getCatalogue().update("test-created", { ...created, status: "draft" });
  check("updated product reflects the change", (await getCatalogue().byId("test-created"))?.status === "draft");

  await getCatalogue().remove("test-created");
  check("removed product is gone", (await getCatalogue().byId("test-created")) === undefined);

  resetCatalogue();
  check("reset restores the static repository", (await catalogueIsWritable()) === false);
  check("reset does not leak the test product", (await getCatalogue().byId("test-created")) === undefined);

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
