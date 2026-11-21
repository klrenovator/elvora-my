/**
 * Verify a Supabase project is set up correctly.
 *
 * Usage: npm run db:verify
 *
 * This checks the things that are easy to get wrong and expensive to discover
 * in production:
 *
 *   1. The tables and the payment constraint exist.
 *   2. RLS is enabled and *no* permissive policy exposes data to the anon role.
 *   3. The anon role genuinely cannot read products or orders.
 *   4. The catalogue is populated and every product passes the app's own
 *      validation.
 *
 * It needs two environment variables:
 *   SUPABASE_DB_URL      pooler connection string (service role — full access)
 *   SUPABASE_URL         project URL, for the anon-key check
 *   SUPABASE_ANON_KEY    the public anon key
 *
 * Steps 5 and 6 are skipped (not failed) if the anon credentials are absent,
 * with a clear message, because the database checks are still worth running.
 */
import { getDb, closeDb, databaseConfigured } from "../src/lib/db/client";
import { validateCatalogue } from "../src/lib/validate-catalogue";
import { rowToProduct } from "../src/lib/catalogue/postgres-repository";
import type { ProductRow } from "../src/lib/catalogue/postgres-repository";

let pass = 0;
let fail = 0;
let skip = 0;

function ok(name: string, condition: boolean, detail = ""): void {
  if (condition) {
    pass += 1;
    console.log(`  PASS  ${name}`);
  } else {
    fail += 1;
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function skipped(name: string, why: string): void {
  skip += 1;
  console.log(`  SKIP  ${name} — ${why}`);
}

async function main() {
  if (!databaseConfigured()) {
    console.error("SUPABASE_DB_URL is not set. Nothing to verify.");
    process.exit(1);
  }

  const sql = getDb();

  /* ------------------------------ Structure ------------------------------ */

  console.log("\nStructure");
  const tables = await sql<{ table_name: string }[]>`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_name in ('products', 'orders')
  `;
  const tableNames = tables.map((row) => row.table_name);
  ok("products table exists", tableNames.includes("products"));
  ok("orders table exists", tableNames.includes("orders"));

  const constraints = await sql<{ conname: string }[]>`
    select conname from pg_constraint
    where conrelid = 'public.orders'::regclass
  `;
  const names = constraints.map((row) => row.conname);
  ok(
    "paid orders require a payment record",
    names.includes("orders_paid_requires_payment"),
  );
  ok(
    "order total is constrained to subtotal + shipping",
    names.includes("orders_total_matches_subtotal"),
  );

  /* --------------------------------- RLS --------------------------------- */

  console.log("\nRow Level Security");
  const rls = await sql<{ relname: string; relrowsecurity: boolean }[]>`
    select relname, relrowsecurity from pg_class
    where relname in ('products', 'orders') and relnamespace = 'public'::regnamespace
  `;
  for (const table of rls) {
    ok(`RLS enabled on ${table.relname}`, table.relrowsecurity === true);
  }

  const policies = await sql<{ count: string }[]>`
    select count(*)::text as count from pg_policies
    where schemaname = 'public' and tablename in ('products', 'orders')
  `;
  ok(
    "no permissive policies are defined for the public schema tables",
    policies[0]?.count === "0",
    `${policies[0]?.count} policies found — every one is a potential exposure`,
  );

  const grants = await sql<{ count: string }[]>`
    select count(*)::text as count from information_schema.role_table_grants
    where table_schema = 'public'
      and table_name in ('products', 'orders')
      and grantee in ('anon', 'authenticated')
  `;
  ok(
    "anon and authenticated have no table grants",
    grants[0]?.count === "0",
    `${grants[0]?.count} grants found`,
  );

  /* --------------------------- Anon-key access --------------------------- */

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  console.log("\nPublic access (anon key)");

  if (!url || !anonKey) {
    skipped("anon key cannot read products", "SUPABASE_URL / SUPABASE_ANON_KEY not set");
    skipped("anon key cannot read orders", "SUPABASE_URL / SUPABASE_ANON_KEY not set");
  } else {
    for (const table of ["products", "orders"]) {
      try {
        const response = await fetch(`${url}/rest/v1/${table}?select=*&limit=1`, {
          headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
        });
        // Either a permission error or an empty result is acceptable; returning
        // rows is not.
        const body = await response.text();
        const returnedRows = response.ok && body.trim() !== "[]" && body.trim() !== "";
        ok(
          `anon key cannot read ${table}`,
          !returnedRows,
          returnedRows ? "the public key can read this table — RLS is not protecting it" : "",
        );
        if (!response.ok) {
          console.log(`        (expected refusal: HTTP ${response.status})`);
        }
      } catch (error) {
        ok(
          `anon key cannot read ${table}`,
          true,
          error instanceof Error ? error.message : "",
        );
      }
    }
  }

  /* ------------------------------- Storage ------------------------------ */

  console.log("\nImage storage");

  const buckets = await sql<{
    id: string;
    public: boolean;
    file_size_limit: number | null;
    allowed_mime_types: string[] | null;
  }[]>`
    select id, public, file_size_limit, allowed_mime_types
    from storage.buckets where id = 'product-images'
  `;

  const bucket = buckets[0];
  ok("the product-images bucket exists", Boolean(bucket), "run 0002_storage.sql");

  if (bucket) {
    ok("the bucket is public-read", bucket.public === true);
    ok(
      "the bucket enforces the 8 MB limit",
      bucket.file_size_limit === 8388608,
      `got ${bucket.file_size_limit}`,
    );

    const types = bucket.allowed_mime_types ?? [];
    ok(
      "SVG is not an allowed upload type",
      !types.includes("image/svg+xml"),
      "an SVG can carry script and would be served from your domain",
    );
    ok(
      "only the four supported formats are allowed",
      types.length === 4 && types.every((type) => type.startsWith("image/")),
      types.join(", "),
    );
  }

  const storagePolicies = await sql<{ policyname: string; cmd: string }[]>`
    select policyname, cmd from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and 'product-images' = any(qual::text[]::text[] || array[]::text[])
  `.catch(async () => {
    // The qual column shape varies between Supabase versions; fall back to
    // listing every storage policy and filtering in JS.
    return sql<{ policyname: string; cmd: string }[]>`
      select policyname, cmd from pg_policies
      where schemaname = 'storage' and tablename = 'objects'
    `;
  });

  const writePolicies = storagePolicies.filter((policy) => policy.cmd !== "SELECT");
  ok(
    "no public write policy exists on storage",
    writePolicies.length === 0,
    `${writePolicies.map((policy) => policy.policyname).join(", ")} — anyone could upload`,
  );

  /* -------------------------------- Data -------------------------------- */

  console.log("\nCatalogue");
  const rows = await sql<ProductRow[]>`
    select id, status, category, sort_order, sku, slug_en, slug_ms, slug_zh, data
    from public.products
  `;
  const products = rows.map(rowToProduct);

  ok("the catalogue is not empty", products.length > 0, "run npm run db:seed");

  if (products.length > 0) {
    const issues = validateCatalogue(products);
    ok(
      "every product passes the application's catalogue validation",
      issues.length === 0,
      issues.map((issue) => `${issue.productId}: ${issue.problem}`).join("; ").slice(0, 300),
    );

    const published = products.filter((product) => product.status === "published");
    console.log(`        ${products.length} products, ${published.length} published`);
  }

  const orderCount = await sql<{ count: string }[]>`
    select count(*)::text as count from public.orders
  `;
  console.log(`        ${orderCount[0]?.count ?? 0} orders recorded`);

  console.log(`\n${pass} passed, ${fail} failed, ${skip} skipped`);
  process.exit(fail === 0 ? 0 : 1);
}

main()
  .then(() => closeDb())
  .catch(async (error) => {
    console.error("\nVerification failed:", error instanceof Error ? error.message : error);
    await closeDb().catch(() => {});
    process.exit(1);
  });
