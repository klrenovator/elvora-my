/**
 * Seed the Supabase catalogue with the compiled products.
 *
 * Usage:
 *   npm run db:seed            # insert products that do not exist yet
 *   npm run db:seed -- --force # overwrite existing rows with the compiled data
 *
 * Why this exists: the database starts empty, and the storefront's 7 products
 * live in `src/content/products.ts`. Seeding copies them across verbatim — no
 * price, description or availability is invented here, and the script refuses to
 * run if the compiled catalogue fails validation.
 *
 * Default behaviour is insert-only, so running it twice cannot overwrite prices
 * the owner has since edited in the admin. `--force` is there for setting up a
 * fresh project deliberately.
 */
import { products } from "../src/content/products";
import { validateCatalogue } from "../src/lib/validate-catalogue";
import { productToRow } from "../src/lib/catalogue/postgres-repository";
import { getDb, closeDb, databaseConfigured } from "../src/lib/db/client";

async function main() {
  const force = process.argv.includes("--force");

  if (!databaseConfigured()) {
    console.error(
      "No database configured.\n" +
        "Set SUPABASE_DB_URL to your Supabase pooler connection string (port 6543),\n" +
        "then run this again. See README → Admin → Supabase setup.",
    );
    process.exit(1);
  }

  // Never seed a catalogue that would fail the build-time checks.
  const issues = validateCatalogue();
  if (issues.length > 0) {
    console.error("Refusing to seed: the compiled catalogue is invalid.");
    for (const issue of issues) console.error(`  ${issue.productId}: ${issue.problem}`);
    process.exit(1);
  }

  const sql = getDb();
  let inserted = 0;
  let skipped = 0;
  let replaced = 0;

  for (const product of products) {
    const row = productToRow(product);
    const columns = [
      "id",
      "status",
      "category",
      "sort_order",
      "sku",
      "slug_en",
      "slug_ms",
      "slug_zh",
      "data",
    ] as const;

    // Widen to a plain record for the driver's dynamic-insert helper.
    const record: Record<string, unknown> = { ...row };

    const result = force
      ? await sql`
          insert into public.products ${sql(record, ...columns)}
          on conflict (id) do update set
            status = excluded.status,
            category = excluded.category,
            sort_order = excluded.sort_order,
            sku = excluded.sku,
            slug_en = excluded.slug_en,
            slug_ms = excluded.slug_ms,
            slug_zh = excluded.slug_zh,
            data = excluded.data
          returning (xmax = 0) as was_insert
        `
      : await sql`
          insert into public.products ${sql(record, ...columns)}
          on conflict (id) do nothing
          returning id
        `;

    if (result.length === 0) {
      skipped += 1;
      console.log(`  skip   ${product.id} (already present — use --force to overwrite)`);
    } else if (force) {
      const wasInsert = (result[0] as { was_insert?: boolean }).was_insert;
      if (wasInsert) inserted += 1;
      else replaced += 1;
      console.log(`  ${wasInsert ? "insert" : "update"} ${product.id}`);
    } else {
      inserted += 1;
      console.log(`  insert ${product.id}`);
    }
  }

  console.log(
    `\nDone. ${inserted} inserted, ${replaced} replaced, ${skipped} left untouched.`,
  );
}

main()
  .then(() => closeDb())
  .catch(async (error) => {
    console.error("\nSeeding failed:", error instanceof Error ? error.message : error);
    await closeDb().catch(() => {});
    process.exit(1);
  });
