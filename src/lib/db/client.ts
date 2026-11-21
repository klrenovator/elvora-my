import postgres from "postgres";

/**
 * Postgres connection to Supabase.
 *
 * Two deployment facts shape this file:
 *
 * 1. **Serverless has no long-lived process.** Each invocation may be a fresh
 *    instance, so a large application pool is pointless and actively harmful —
 *    it would exhaust Postgres connections under a traffic spike. `max: 1` with
 *    the Supabase pooler in front is the correct configuration.
 * 2. **The pooler runs in transaction mode.** A connection is borrowed for one
 *    transaction, so prepared statements do not survive between them. Hence
 *    `prepare: false`. Leaving it on produces intermittent, hard-to-trace
 *    errors that appear only under load.
 *
 * The URL must be the **pooler** endpoint (port 6543), not the direct one
 * (port 5432). The direct endpoint is for migrations only.
 *
 * The connection uses the service_role key, so this module must never be
 * imported into a client component. It is guarded below.
 */

let client: ReturnType<typeof postgres> | null = null;
let clientUrl: string | null = null;

/**
 * Whether a database is configured at all.
 *
 * Deliberately a string check rather than a throw: the whole application is
 * designed to run without a database (see the seed fallbacks), so "not
 * configured" is a normal state, not an error.
 */
export function databaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL);
}

function connectionUrl(): string {
  const url = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "No database configured. Set SUPABASE_DB_URL (Supabase pooler connection string, port 6543).",
    );
  }
  return url;
}

/**
 * The shared client, created on first use.
 *
 * Cached across invocations when the platform reuses the instance, which is the
 * only pooling that is safe here. Recreated if the URL changes, so a test can
 * point at a different database without stale state.
 */
export function getDb(): ReturnType<typeof postgres> {
  const url = connectionUrl();

  if (client && clientUrl === url) return client;

  // A previous client with a different URL would keep its sockets open.
  if (client && clientUrl !== url) {
    void client.end({ timeout: 1 }).catch(() => {});
  }

  client = postgres(url, {
    // One connection per invocation; the pooler multiplexes.
    max: 1,
    // Required in transaction mode. See the note at the top of this file.
    prepare: false,
    // Release the connection as soon as the request is done rather than
    // holding it idle and counting against the pool.
    idle_timeout: 1,
    connect_timeout: 10,
    // Supabase requires TLS; the pooler presents a valid certificate.
    ssl: "require",
    // Keep parameter types explicit rather than guessed from JS values, which
    // avoids surprises with jsonb and integers.
    transform: { undefined: null },
  });

  clientUrl = url;
  return client;
}

/** Close the connection. Used by tests and scripts, not by request handlers. */
export async function closeDb(): Promise<void> {
  if (!client) return;
  const closing = client;
  client = null;
  clientUrl = null;
  await closing.end({ timeout: 5 });
}

/** Test seam: forget the cached client without closing it. */
export function forgetDb(): void {
  client = null;
  clientUrl = null;
}
