import type { Order, OrderCustomer, OrderLine, OrderPayment, OrderStatus } from "@/lib/orders";
import type { Locale } from "@/i18n/config";
import { getDb } from "@/lib/db/client";
import { OrderStorageError, type OrderRepository } from "@/lib/order-repository";

/**
 * Supabase-backed order repository.
 *
 * Orders are the one thing in this system that must never be lost, so this file
 * is deliberately conservative:
 *
 * 1. **Immutable lines.** Customer details and lines are stored as `jsonb`
 *    copies taken at the moment of ordering. An order is a historical record of
 *    what was agreed, not a live view of the catalogue.
 * 2. **Ordering is never overwritten.** `create` uses `on conflict do nothing`
 *    and treats "nothing inserted" as a reference collision rather than
 *    silently replacing an existing order.
 * 3. **Payment is constrained in the database**, not only here: a `paid` order
 *    must carry a payment record, and an unpaid one must not. See
 *    `orders_paid_requires_payment` in the migration.
 */

export interface OrderRow {
  reference: string;
  status: string;
  locale: string;
  customer: unknown;
  lines: unknown;
  subtotal_sen: number;
  shipping_sen: number | null;
  total_sen: number;
  payment: unknown;
  created_at: string | Date;
}

const ORDER_STATUSES: OrderStatus[] = ["pending-payment", "paid", "expired", "cancelled"];

function toStatus(value: string): OrderStatus {
  // An unrecognised status is a data problem, not something to guess at. Treat
  // it as pending-payment so the order is never mistaken for paid.
  return ORDER_STATUSES.includes(value as OrderStatus) ? (value as OrderStatus) : "pending-payment";
}

function toLocale(value: string): Locale {
  return value === "ms" || value === "zh" ? value : "en";
}

function toIso(value: string | Date): string {
  return value instanceof Date ? value.toISOString() : value;
}

/** Turn a row into the application's `Order` shape. */
export function rowToOrder(row: OrderRow): Order {
  return {
    reference: row.reference,
    createdAt: toIso(row.created_at),
    status: toStatus(row.status),
    locale: toLocale(row.locale),
    customer: row.customer as OrderCustomer,
    lines: row.lines as OrderLine[],
    subtotalSen: row.subtotal_sen,
    shippingSen: row.shipping_sen,
    totalSen: row.total_sen,
    payment: (row.payment as OrderPayment | null) ?? null,
  };
}

/**
 * Flatten an `Order` into the columns the table stores.
 *
 * `createdAt` is passed through so a replayed or imported order keeps its
 * original timestamp instead of silently becoming "now".
 */
export function orderToRow(order: Order) {
  return {
    reference: order.reference,
    status: order.status,
    locale: order.locale,
    customer: order.customer,
    lines: order.lines,
    subtotal_sen: order.subtotalSen,
    shipping_sen: order.shippingSen,
    total_sen: order.totalSen,
    payment: order.payment,
    created_at: order.createdAt,
  };
}

/** Widen to a plain record for the driver's dynamic-insert helper. */
function recordOf(row: ReturnType<typeof orderToRow>): Record<string, unknown> {
  return { ...row };
}

const ORDER_COLUMNS = [
  "reference",
  "status",
  "locale",
  "customer",
  "lines",
  "subtotal_sen",
  "shipping_sen",
  "total_sen",
  "payment",
  "created_at",
];

export class PostgresOrderRepository implements OrderRepository {
  /** Orders here survive a restart, unlike the in-memory default. */
  readonly durable = true;

  async create(order: Order): Promise<Order> {
    const sql = getDb();
    try {
      const inserted = await sql<OrderRow[]>`
        insert into public.orders ${sql(recordOf(orderToRow(order)), ...ORDER_COLUMNS)}
        on conflict (reference) do nothing
        returning reference, status, locale, customer, lines, subtotal_sen, shipping_sen, total_sen, payment, created_at
      `;
      if (inserted.length === 0) {
        // Deliberately an error: overwriting would destroy a real order.
        throw new OrderStorageError(`Order ${order.reference} already exists.`);
      }
      return rowToOrder(inserted[0]);
    } catch (error) {
      throw asStorageError(error, "record");
    }
  }

  async byReference(reference: string): Promise<Order | undefined> {
    const sql = getDb();
    const rows = await sql<OrderRow[]>`
      select reference, status, locale, customer, lines, subtotal_sen, shipping_sen, total_sen, payment, created_at
      from public.orders
      where reference = ${reference}
      limit 1
    `;
    return rows[0] ? rowToOrder(rows[0]) : undefined;
  }

  async update(reference: string, order: Order): Promise<Order> {
    const sql = getDb();
    const row = orderToRow({ ...order, reference });
    try {
      const updated = await sql<OrderRow[]>`
        update public.orders set ${sql(recordOf(row), ...ORDER_COLUMNS)}
        where reference = ${reference}
        returning reference, status, locale, customer, lines, subtotal_sen, shipping_sen, total_sen, payment, created_at
      `;
      if (updated.length === 0) {
        throw new OrderStorageError(`Order ${reference} does not exist.`);
      }
      return rowToOrder(updated[0]);
    } catch (error) {
      throw asStorageError(error, "update");
    }
  }

  async recent(limit = 50): Promise<Order[]> {
    const sql = getDb();
    // Clamp the limit so a caller cannot ask for the whole table.
    const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 200);
    const rows = await sql<OrderRow[]>`
      select reference, status, locale, customer, lines, subtotal_sen, shipping_sen, total_sen, payment, created_at
      from public.orders
      order by created_at desc
      limit ${safeLimit}
    `;
    return rows.map(rowToOrder);
  }
}

function asStorageError(error: unknown, action: string): Error {
  if (error instanceof OrderStorageError) return error;

  const code = (error as { code?: string })?.code;
  if (code === "23514") {
    // The payment constraint or the total constraint rejected the write. This
    // is the database refusing to record an impossible order, which is exactly
    // what it is there for.
    return new OrderStorageError(
      "The order was rejected by a database integrity rule, so nothing was recorded.",
    );
  }

  const message = error instanceof Error ? error.message : "unknown error";
  return new OrderStorageError(`The order could not be ${action}ed: ${message}`);
}
