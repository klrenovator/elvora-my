import { redirect } from "next/navigation";
import Link from "next/link";
import { isOwner } from "@/lib/admin/session";
import { getOrderRepository, ordersAreDurable } from "@/lib/order-repository";
import { formatSen } from "@/lib/pricing";
import { cancelOrder, markOrderPaid } from "@/app/admin/actions";
import { paymentMethodById } from "@/lib/payments/methods";

export const dynamic = "force-dynamic";

/**
 * Order list.
 *
 * An order record nobody can read is not much of a record, so this is where a
 * placed order shows up.
 *
 * Cash on Delivery means the money arrives after dispatch, so the owner has to
 * be able to say "this one is settled". That is the only status change offered,
 * and it records the amount from the stored order rather than from the form.
 * There is still no way to mark an order paid without that deliberate action,
 * and no online gateway is involved.
 */
export default async function AdminOrdersPage() {
  if (!(await isOwner())) redirect("/admin/login");

  const repository = getOrderRepository();
  const orders = await repository.recent(100);
  const durable = ordersAreDurable(repository);

  const outstanding = orders.filter((order) => order.status === "pending-payment");
  const awaitingCash = orders.filter((order) => order.paymentStatus === "on-delivery");
  const settled = orders.filter((order) => order.paymentStatus === "paid");

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
        {orders.length} recorded · {outstanding.length} open · {awaitingCash.length} cash due on
        delivery · {settled.length} paid · open a reference to see the full delivery details
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
          Payment is <strong className="font-medium">cash on delivery</strong>. Money reaches you
          after the parcel does, so mark an order paid only once you actually have the cash —
          the amount recorded is the order total, not a figure you type. No online gateway is
          connected and none can be reached from this screen.
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
              <Th>Order</Th>
              <Th>Payment</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.reference} className="border-b border-[color:var(--color-line)] last:border-0 align-top">
                <td className="px-4 py-3 font-medium tracking-[0.04em]">
                  <Link
                    href={`/admin/orders/${encodeURIComponent(order.reference)}`}
                    className="text-[color:var(--color-ink-strong)] underline decoration-[color:var(--color-line-strong)] underline-offset-4 transition-colors hover:text-[color:var(--color-cognac)]"
                  >
                    {order.reference}
                  </Link>
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
                  <StatusPill value={order.status} />
                </td>
                <td className="px-4 py-3">
                  <StatusPill value={order.paymentStatus} />
                  <p className="mt-1 text-[0.6875rem] text-[color:var(--color-mist)]">
                    {paymentMethodById(order.paymentMethodId ?? "cod")?.label.en ?? "Cash on delivery"}
                  </p>
                  {order.payment ? (
                    <p className="mt-0.5 text-[0.6875rem] text-[color:var(--color-mist)]">
                      {formatSen(order.payment.amountSen, order.locale)} on {formatDate(order.payment.paidAt)}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <OrderActions
                    reference={order.reference}
                    status={order.status}
                    totalSen={order.totalSen}
                  />
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-[color:var(--color-mist)]">
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

/**
 * Status pill.
 *
 * `paid` and `not-required` are green because nothing is owed; everything else
 * is neutral. The colour is a prompt to look, not a claim of success.
 */
function StatusPill({ value }: { value: string }) {
  const settled = value === "paid" || value === "not-required";
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[0.625rem] tracking-[0.08em] uppercase ${
        settled
          ? "bg-[color:var(--color-cream)] text-[#41593a]"
          : "bg-[color:var(--color-cream)] text-[color:var(--color-stone)]"
      }`}
    >
      {value}
    </span>
  );
}

/**
 * The only status changes the owner can make.
 *
 * A form posting to a server action, not a link, so the action cannot be
 * triggered by a crawler or a prefetch. There is no control at all for an order
 * that is already settled or cancelled, because there is nothing left to do to
 * it.
 */
function OrderActions({
  reference,
  status,
  totalSen,
}: {
  reference: string;
  status: string;
  totalSen: number;
}) {
  if (status === "paid" || status === "cancelled") {
    return <span className="text-[0.6875rem] text-[color:var(--color-mist)]">—</span>;
  }

  // No price on the order means there is no amount to record as received.
  const settleable = totalSen > 0;

  return (
    <div className="flex flex-col gap-2">
      <form action={markOrderPaid}>
        <input type="hidden" name="reference" value={reference} />
        <button
          type="submit"
          disabled={!settleable}
          title={settleable ? undefined : "This order has no total, so there is no amount to record."}
          className="w-full border border-[color:var(--color-espresso)] px-3 py-1.5 text-[0.6875rem] tracking-[0.08em] uppercase text-[color:var(--color-espresso)] transition-colors hover:bg-[color:var(--color-cream)] disabled:cursor-not-allowed disabled:border-[color:var(--color-line-strong)] disabled:text-[color:var(--color-mist)]"
        >
          Mark paid
        </button>
      </form>
      <form action={cancelOrder}>
        <input type="hidden" name="reference" value={reference} />
        <button
          type="submit"
          className="w-full px-3 py-1 text-[0.6875rem] tracking-[0.08em] uppercase text-[color:var(--color-mist)] underline underline-offset-2 transition-colors hover:text-[#a8442c]"
        >
          Cancel
        </button>
      </form>
    </div>
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
