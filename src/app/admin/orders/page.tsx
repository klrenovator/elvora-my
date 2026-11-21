import { redirect } from "next/navigation";
import Link from "next/link";
import { isOwner } from "@/lib/admin/session";
import { getOrderRepository, ordersAreDurable } from "@/lib/order-repository";
import { formatSen } from "@/lib/pricing";

export const dynamic = "force-dynamic";

/**
 * Order list.
 *
 * An order record nobody can read is not much of a record, so this is where a
 * placed order shows up. It is deliberately read-only: status changes belong to
 * a verified payment callback, not to a button, and there is no provider yet.
 */
export default async function AdminOrdersPage() {
  if (!(await isOwner())) redirect("/admin/login");

  const repository = getOrderRepository();
  const orders = await repository.recent(100);
  const durable = ordersAreDurable(repository);

  const pending = orders.filter((order) => order.status === "pending-payment");

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <p className="tracking-eyebrow text-[color:var(--color-tan)]">Admin</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-[2rem] leading-tight text-[color:var(--color-ink-strong)]">
          Orders
        </h1>
        <Link
          href="/admin/products"
          className="text-[0.75rem] text-[color:var(--color-cognac)] underline underline-offset-4"
        >
          Products
        </Link>
      </div>
      <p className="mt-1 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
        {orders.length} recorded · {pending.length} awaiting payment
      </p>

      {!durable ? (
        <div className="mt-6 border-l-2 border-[color:var(--color-clay)] bg-white px-4 py-3">
          <p className="text-[0.8125rem] font-medium text-[color:var(--color-ink-strong)]">
            Orders are held in memory and are lost when the server restarts.
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
            This list is real, but not permanent. A database-backed order
            repository is the fix; until then, ask customers to send the
            confirmation summary so there is a copy outside this server.
          </p>
        </div>
      ) : null}

      <div className="mt-6 border-l-2 border-[color:var(--color-line-strong)] bg-white px-4 py-3">
        <p className="text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
          No payment provider is connected, so no order here has been paid. An
          order can only become <strong className="font-medium">paid</strong>{" "}
          through a verified provider callback, which is why none of these rows
          offers a way to mark one paid by hand.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto border border-[color:var(--color-line)] bg-white">
        <table className="w-full min-w-[48rem] text-left text-[0.8125rem]">
          <thead className="border-b border-[color:var(--color-line)] bg-[color:var(--color-surface-sunken)]">
            <tr>
              <Th>Reference</Th>
              <Th>Placed</Th>
              <Th>Customer</Th>
              <Th>Destination</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.reference} className="border-b border-[color:var(--color-line)] last:border-0 align-top">
                <td className="px-4 py-3 font-medium tracking-[0.04em] text-[color:var(--color-ink-strong)]">
                  {order.reference}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-[color:var(--color-ink-body)]">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[color:var(--color-ink-strong)]">{order.customer.fullName}</span>
                  <p className="mt-0.5 text-[0.6875rem] text-[color:var(--color-mist)]">
                    {order.customer.phone} · {order.customer.email}
                  </p>
                </td>
                <td className="px-4 py-3 text-[color:var(--color-ink-body)]">
                  {order.customer.city}, {order.customer.stateName}
                  <p className="mt-0.5 text-[0.6875rem] text-[color:var(--color-mist)]">
                    {order.customer.postcode}
                  </p>
                </td>
                <td className="px-4 py-3 text-[color:var(--color-ink-body)]">
                  {order.lines.reduce((total, line) => total + line.quantity, 0)}
                  <p className="mt-0.5 text-[0.6875rem] text-[color:var(--color-mist)]">
                    {order.lines.length} {order.lines.length === 1 ? "line" : "lines"}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-[color:var(--color-ink-strong)]">
                  {formatSen(order.totalSen, order.locale)}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block bg-[color:var(--color-cream)] px-2 py-0.5 text-[0.625rem] tracking-[0.08em] uppercase text-[color:var(--color-stone)]">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[color:var(--color-mist)]">
                  No orders yet. Orders placed through checkout appear here.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-[color:var(--color-stone)]">
      {children}
    </th>
  );
}

/** Fixed, unambiguous date format — the owner reads this, not a locale. */
function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(
    date.getUTCHours(),
  )}:${pad(date.getUTCMinutes())} UTC`;
}
