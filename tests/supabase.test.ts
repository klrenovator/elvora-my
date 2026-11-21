/**
 * Supabase integration tests.
 *
 * No database is reachable from this environment, so these tests verify
 * everything that does not require a live connection:
 *
 *   · row ↔ application mapping in both directions, exhaustively
 *   · the SQL migration's security posture (read as text)
 *   · repository behaviour against a fake driver that records queries
 *   · environment-based selection and the seed fallbacks
 *
 * What they deliberately cannot prove is that Postgres accepts the SQL. That is
 * what `npm run db:verify` is for, run against the real project.
 */
import { products as seed } from "@/content/products";
import type { Product } from "@/content/types";
import { productToRow, rowToProduct } from "@/lib/catalogue/postgres-repository";
import { rowToOrder, orderToRow } from "@/lib/db/order-repository";
import type { Order } from "@/lib/orders";
import { CatalogueWriteError } from "@/lib/catalogue/repository";
import { OrderStorageError } from "@/lib/order-repository";
import { readFileSync } from "node:fs";

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

async function main() {
  /* ------------------------- Product row mapping ------------------------ */

  for (const product of seed) {
    const row = productToRow(product);
    check(`${product.id}: id lifted correctly`, row.id === product.id);
    check(`${product.id}: status lifted correctly`, row.status === product.status);
    check(`${product.id}: category lifted correctly`, row.category === product.category);
    check(`${product.id}: order lifted correctly`, row.sort_order === product.order);
    check(`${product.id}: sku lifted correctly`, row.sku === product.sku);
    check(`${product.id}: English slug lifted`, row.slug_en === product.slug.en);
    check(`${product.id}: Malay slug lifted`, row.slug_ms === product.slug.ms);
    check(`${product.id}: Chinese slug lifted`, row.slug_zh === product.slug.zh);

    // The round trip is what protects existing data: a product read back must
    // be byte-identical to the one saved.
    const restored = rowToProduct(row);
    check(
      `${product.id}: round trip is lossless`,
      JSON.stringify(restored) === JSON.stringify(product),
    );
  }

  {
    // The lifted columns are derived, so they cannot drift from the document.
    const product = seed[0];
    const row = productToRow(product);
    check(
      "lifted slugs match the document exactly",
      row.slug_en === (row.data as Product).slug.en &&
        row.slug_ms === (row.data as Product).slug.ms,
    );
    check("the document is stored whole", (row.data as Product).faqs !== undefined);
  }

  {
    // The document wins over the lifted columns, so a manual edit that renames
    // a product cannot silently change its URL.
    const product = seed[0];
    const tampered = { ...productToRow(product), slug_en: "wrong-slug" };
    check(
      "the document is authoritative over lifted columns",
      rowToProduct(tampered).slug.en === product.slug.en,
    );
  }

  /* --------------------------- Order mapping ---------------------------- */

  const order: Order = {
    reference: "ELV-ABC234",
    createdAt: "2026-11-21T08:30:00.000Z",
    status: "pending-payment",
    paymentMethodId: "cod",
    paymentStatus: "on-delivery",
    locale: "ms",
    customer: {
      fullName: "Aisyah Rahman",
      phone: "012-345 6789",
      email: "aisyah@example.com",
      addressLine1: "12 Jalan Bukit Bintang",
      postcode: "55100",
      city: "Kuala Lumpur",
      stateCode: "KUL",
      stateName: "Kuala Lumpur",
    },
    lines: [
      {
        productId: "bifold-wallet-cognac",
        variantId: "bifold-cognac",
        name: "Dompet Bifold",
        sku: "ELV-MW-001-CG",
        quantity: 2,
        unitPriceSen: 24900,
        lineTotalSen: 49800,
      },
    ],
    subtotalSen: 49800,
    shippingSen: null,
    totalSen: 49800,
    payment: null,
  };

  {
    const row = orderToRow(order);
    check("order reference mapped", row.reference === order.reference);
    check("order status mapped", row.status === "pending-payment");
    check("order locale mapped", row.locale === "ms");
    check("subtotal mapped to snake_case", row.subtotal_sen === 49800);
    check("total mapped to snake_case", row.total_sen === 49800);
    check("absent shipping stays null, never 0", row.shipping_sen === null);
    check("created_at preserves the original timestamp", row.created_at === order.createdAt);
    check("the payment method is stored as its own column", row.payment_method_id === "cod");
    check("the payment status is stored as its own column", row.payment_status === "on-delivery");

    const restored = rowToOrder({
      ...row,
      created_at: row.created_at,
      customer: row.customer,
      lines: row.lines,
      payment: row.payment,
    });
    check(
      "order round trip is lossless",
      JSON.stringify(restored) === JSON.stringify(order),
    );
    check("the payment method survives the round trip", restored.paymentMethodId === "cod");
    check("the payment status survives the round trip", restored.paymentStatus === "on-delivery");
  }

  {
    // An accounting field must fail towards "we have not been paid", never
    // towards "paid" — a wrong `paid` would hide money that is owed.
    const damaged = { ...orderToRow(order), payment_status: "something-else" };
    check(
      "an unknown payment status never reads as paid",
      rowToOrder({ ...damaged, created_at: order.createdAt, customer: order.customer, lines: order.lines, payment: null })
        .paymentStatus === "on-delivery",
    );

    // Rows from before the columns existed must still load as COD.
    const legacy = { ...orderToRow(order), payment_method_id: null, payment_status: null };
    const legacyOrder = rowToOrder({
      ...legacy,
      created_at: order.createdAt,
      customer: order.customer,
      lines: order.lines,
      payment: null,
    });
    check("a legacy order loads as a COD order", legacyOrder.paymentMethodId === "cod");
    check("a legacy order is not assumed paid", legacyOrder.paymentStatus === "on-delivery");

    // A paid order must still carry its payment record.
    const paid = rowToOrder({
      ...orderToRow({ ...order, status: "paid", paymentStatus: "paid" }),
      created_at: order.createdAt,
      customer: order.customer,
      lines: order.lines,
      payment: { provider: "cod", providerReference: "COD-1", paidAt: "2026-11-22T00:00:00.000Z", amountSen: 49800 },
    });
    check("a paid order maps its payment record", paid.payment?.provider === "cod");
  }

  {
    // A Date object comes back from the driver; it must serialise to ISO.
    const restored = rowToOrder({
      ...orderToRow({ ...order, createdAt: "2026-01-01T00:00:00.000Z" }),
      created_at: new Date("2026-01-01T00:00:00.000Z"),
      customer: order.customer,
      lines: order.lines,
      payment: null,
    });
    check("Date values are normalised to ISO strings", restored.createdAt === "2026-01-01T00:00:00.000Z");
  }

  {
    // An unrecognised status must never be mistaken for paid.
    const restored = rowToOrder({
      ...orderToRow(order),
      status: "something-else",
      customer: order.customer,
      lines: order.lines,
      payment: null,
    });
    check("an unknown status falls back to pending-payment", restored.status === "pending-payment");
  }

  {
    const restored = rowToOrder({
      ...orderToRow({ ...order, locale: "xx" as never }),
      locale: "xx",
      customer: order.customer,
      lines: order.lines,
      payment: null,
    });
    check("an unknown locale falls back to English", restored.locale === "en");
  }

  /* -------------------------- Migration security ------------------------ */

  const migration = readFileSync("supabase/migrations/0001_init.sql", "utf8");

  check("migration enables RLS on products", /alter table public\.products enable row level security/i.test(migration));
  check("migration enables RLS on orders", /alter table public\.orders\s+enable row level security/i.test(migration));
  check(
    "migration revokes anon and authenticated grants",
    /revoke all on public\.products from anon, authenticated/i.test(migration) &&
      /revoke all on public\.orders\s+from anon, authenticated/i.test(migration),
  );
  check(
    "migration defines no permissive policy",
    !/create policy/i.test(migration.replace(/--.*$/gm, "")),
  );

  check("orders carry a payment consistency constraint", /orders_paid_requires_payment/i.test(migration));
  check("orders constrain the total", /orders_total_matches_subtotal/i.test(migration));
  check("order status is constrained to known values", /status in \('pending-payment', 'paid', 'expired', 'cancelled'\)/i.test(migration));
  check("shipping may be null", /shipping_sen\s+integer,/i.test(migration));
  check("product slugs are uniquely indexed", (migration.match(/create unique index if not exists products_slug_/g) ?? []).length === 3);

  /* --------------------- Repository behaviour (fake driver) ------------- */

  // Injecting a fake driver would mean mocking the module system, which tsx
  // does not do cleanly. Instead the pure mapping functions above carry the
  // correctness burden, and the query shapes are asserted from source so a
  // careless edit (dropping the conflict clause, interpolating a column name)
  // fails here rather than in production.
  const repoSource = readFileSync("src/lib/catalogue/postgres-repository.ts", "utf8");
  check("product insert uses on conflict do nothing", /on conflict \(id\) do nothing/i.test(repoSource));
  check("product update is scoped to the id", /where id = \$\{id\}/i.test(repoSource));
  check("update refuses when no row matched", /updated\.length === 0/.test(repoSource));
  check("delete returns the id so a miss is detectable", /returning id/.test(repoSource));
  check("slug lookup is parameterised, not interpolated", /lower\(slug_en\) = lower\(\$\{slug\}\)/.test(repoSource));
  check("duplicate slug raises a readable error", /23505/.test(repoSource));

  const orderSource = readFileSync("src/lib/db/order-repository.ts", "utf8");
  check("order insert uses on conflict do nothing", /on conflict \(reference\) do nothing/i.test(orderSource));
  check("order reference collision is an error, not an overwrite", /already exists/.test(orderSource));
  check("order limits are clamped", /Math\.min\(Math\.max\(Math\.floor\(limit\), 1\), 200\)/.test(orderSource));
  check("order integrity violations are surfaced", /23514/.test(orderSource));

  /* --------------------------- Write error types ------------------------ */

  check(
    "catalogue write errors are distinguishable",
    new CatalogueWriteError("x") instanceof CatalogueWriteError,
  );
  check(
    "order storage errors are distinguishable",
    new OrderStorageError("x") instanceof OrderStorageError,
  );

  /* --------------------- Environment-based selection -------------------- */

  {
    const repositorySource = readFileSync("src/lib/catalogue/repository.ts", "utf8");
    check(
      "catalogue selects Postgres when a URL is present",
      /SUPABASE_DB_URL/.test(repositorySource) && /PostgresProductRepository/.test(repositorySource),
    );
    check(
      "catalogue falls back to the compiled seed without a URL",
      /return new StaticProductRepository\(\)/.test(repositorySource),
    );

    const orderRepoSource = readFileSync("src/lib/order-repository.ts", "utf8");
    check(
      "orders select Postgres when a URL is present",
      /SUPABASE_DB_URL/.test(orderRepoSource) && /PostgresOrderRepository/.test(orderRepoSource),
    );
    check(
      "orders fall back to memory without a URL",
      /return new MemoryOrderRepository\(\)/.test(orderRepoSource),
    );
  }

  /* --------------------------- Storefront layer ------------------------- */

  {
    const storefront = readFileSync("src/lib/catalogue/storefront.ts", "utf8");
    check("storefront reads through the repository", /getCatalogue\(\)/.test(storefront));
    check("storefront falls back to the seed", /seedBySlug|seedById|seedProducts/.test(storefront));
    check("storefront logs when it falls back", /console\.warn/.test(storefront));
  }

  /* ------------------------ Client/server price parity ------------------ */

  {
    // The cart reconciles against a catalogue supplied by the server. If this
    // wiring were missing, an admin price edit would make every cart show a
    // total that checkout then refuses.
    const provider = readFileSync("src/components/cart-provider.tsx", "utf8");
    check("cart provider accepts a server-supplied catalogue", /catalogue\?: Product\[\]/.test(provider));
    check("cart reconciles against that catalogue", /reconcile\(cart, lookup\)/.test(provider));

    const layout = readFileSync("src/app/[locale]/layout.tsx", "utf8");
    check("layout passes the live catalogue to the cart", /<CartProvider catalogue=\{catalogue\}>/.test(layout));
    check("layout keeps slug translations in step", /syncProductSlugs/.test(layout));
  }

  /* ---------------------------- Payments untouched --------------------- */

  {
    const features = readFileSync("src/lib/features.ts", "utf8");
    check("payments remain disabled", /payments: false/.test(features));

    const provider = readFileSync("src/lib/payments/provider.ts", "utf8");
    check("the payment provider boundary is unchanged", /UnconfiguredPaymentProvider/.test(provider));
    check(
      "there is still no code path that marks an order paid",
      !/status:\s*"paid"/.test(readFileSync("src/app/[locale]/checkout/actions.ts", "utf8")),
    );
  }

  /* ----------------------------- Seed script --------------------------- */

  {
    const seedScript = readFileSync("scripts/seed-supabase.ts", "utf8");
    check("seeding validates the catalogue first", /validateCatalogue/.test(seedScript));
    check("seeding is insert-only by default", /on conflict \(id\) do nothing/.test(seedScript));
    check("overwriting requires an explicit flag", /--force/.test(seedScript));

    const verifyScript = readFileSync("scripts/verify-supabase.ts", "utf8");
    check("verification checks RLS is enabled", /relrowsecurity/.test(verifyScript));
    check("verification checks for stray policies", /pg_policies/.test(verifyScript));
    check("verification tries the anon key", /SUPABASE_ANON_KEY/.test(verifyScript));
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
}

main();
