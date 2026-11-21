import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isOwner } from "@/lib/admin/session";
import { getOrderRepository } from "@/lib/order-repository";
import { formatSen } from "@/lib/pricing";
import { cancelOrder, markOrderPaid } from "@/app/admin/actions";
import {
  addressLines,
  lineDescription,
  orderStatusCopy,
  paymentMethodLabel,
  paymentStatusCopy,
  totalUnits,
} from "@/lib/order-detail";

export const dynamic = "force-dynamic";

/**
 * One order, in full.
 *
 * The list view shows who and how much. That is enough to know an order exists
 * and not enough to fulfil one: you cannot pack a parcel from a city and a
 * postcode, and you cannot pick a variant from a product name shared by two
 * SKUs. This page is the packing view.
 *
 * It shows only what the order actually recorded. Nothing is recomputed from
 * the current catalogue — a price or address edited later must not rewrite what
 * the customer actually agreed to.
 */
export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  if (!(await isOwner())) redirect("/admin/login");

  const { reference } = await params;

  // Orders are looked up by their human reference, which is case-insensitive in
  // spirit: an owner may type it from a WhatsApp message. Normalise before use.
  const normalised = decodeURIComponent(reference).trim().toUpperCase();
  const order = await getOrderRepository()
    .byReference(normalised)
    .catch(() => undefined);

  if (!order) notFound();

  const address = addressLines(order);
  const payment = paymentStatusCopy(order.paymentStatus);
  const units = totalUnits(order);
  const settled = order.status === "paid" || order.status === "cancelled";

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <Link
        href="/admin/orders"
        className="text-[0.75rem] tracking-[0.08em] uppercase text-[color:var(--color-cognac)] underline underline-offset-4"
      >
        ← All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="tracking-eyebrow text-[color:var(--color-tan)]">Order</p>
          <h1 className="font-display mt-1 text-[2rem] leading-tight tracking-[0.02em] text-[color:var(--color-ink-strong)]">
            {order.reference}
          </h1>
        </div>
        <p className="text-[0.8125rem] text-[color:var(--color-ink-muted)]">
          Placed {formatDate(order.createdAt)} · {order.locale.toUpperCase()}
        </p>
      </div>

      {/* Status strip: the three facts the owner checks before doing anything. */}
      <dl className="mt-6 grid gap-px border border-[color:var(--color-line)] bg-[color:var(--color-line)] sm:grid-cols-3">
        <Fact label="Order">
          <Badge tone={order.status === "paid" ? "settled" : settled ? "neutral" : "owe"}>
            {orderStatusCopy(order.status)}
          </Badge>
        </Fact>
        <Fact label="Payment">
          <Badge tone={payment.tone}>{payment.label}</Badge>
          <p className="mt-1 text-[0.75rem] leading-relaxed text-[color:var(--color-mist)]">
            {payment.detail}
          </p>
        </Fact>
        <Fact label="Total">
          <span className="font-display text-[1.25rem] leading-none text-[color:var(--color-ink-strong)]">
            {formatSen(order.totalSen, order.locale)}
          </span>
          <p className="mt-1 text-[0.75rem] text-[color:var(--color-mist)]">
            {paymentMethodLabel(order)}
            {order.shippingSen === null ? " · delivery cost not yet agreed" : null}
          </p>
        </Fact>
      </dl>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Items */}
        <section className="lg:col-span-7">
          <h2 className="font-display text-[1.25rem] leading-tight text-[color:var(--color-ink-strong)]">
            Items ({units})
          </h2>

          <ul className="mt-3 border border-[color:var(--color-line)] bg-white">
            {order.lines.map((line, index) => {
              const description = lineDescription(line, order.locale);
              return (
                <li
                  key={`${line.variantId}-${index}`}
                  className="flex items-start justify-between gap-4 border-b border-[color:var(--color-line)] px-4 py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-[0.9375rem] font-medium text-[color:var(--color-ink-strong)]">
                      {description.name}
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-[color:var(--color-ink-muted)]">
                      {/* The variant id is shown in full: it is what
                          distinguishes two SKUs that share a product name. */}
                      Variant: <span className="tracking-[0.02em]">{description.variant}</span>
                      {description.sku ? (
                        <>
                          {" "}
                          · SKU <span className="tracking-[0.02em]">{description.sku}</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[0.9375rem] text-[color:var(--color-ink-strong)]">
                      × {description.quantity}
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-[color:var(--color-mist)]">
                      {formatSen(line.lineTotalSen, order.locale)}
                    </p>
                  </div>
                </li>
              );
            })}
            {order.lines.length === 0 ? (
              <li className="px-4 py-8 text-center text-[0.8125rem] text-[color:var(--color-mist)]">
                This order has no lines recorded.
              </li>
            ) : null}
          </ul>

          <dl className="mt-3 space-y-1.5 text-[0.8125rem]">
            <Row label="Subtotal" value={formatSen(order.subtotalSen, order.locale)} />
            <Row
              label="Delivery"
              // `null` is genuinely unknown: the shop quotes delivery after the
              // order. Printing RM 0.00 would claim delivery is free.
              value={
                order.shippingSen === null
                  ? "Quoted before dispatch"
                  : formatSen(order.shippingSen, order.locale)
              }
            />
            <Row
              label="Total"
              value={formatSen(order.totalSen, order.locale)}
              strong
            />
          </dl>

          {order.payment ? (
            <div className="mt-4 border-l-2 border-[#41593a] bg-white px-4 py-3">
              <p className="text-[0.8125rem] text-[color:var(--color-ink-strong)]">
                {formatSen(order.payment.amountSen, order.locale)} recorded as received
              </p>
              <p className="mt-0.5 text-[0.75rem] text-[color:var(--color-mist)]">
                {order.payment.provider} · {order.payment.providerReference} ·{" "}
                {formatDate(order.payment.paidAt)}
              </p>
            </div>
          ) : null}
        </section>

        {/* Delivery + actions */}
        <div className="space-y-8 lg:col-span-5">
          <section>
            <h2 className="font-display text-[1.25rem] leading-tight text-[color:var(--color-ink-strong)]">
              Deliver to
            </h2>

            <address className="mt-3 border border-[color:var(--color-line)] bg-white p-4 text-[0.875rem] not-italic leading-relaxed text-[color:var(--color-ink-body)]">
              <p className="font-medium text-[color:var(--color-ink-strong)]">{address.recipient}</p>
              <p className="text-[color:var(--color-ink-muted)]">{address.phone}</p>
              <p className="mt-2">
                {address.street.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
                <span className="block">{address.locality}</span>
                <span className="block">{address.state}</span>
              </p>
              <p className="mt-2">
                <a
                  href={`mailto:${order.customer.email}`}
                  className="text-[color:var(--color-cognac)] underline underline-offset-2"
                >
                  {order.customer.email}
                </a>
              </p>
              {address.notes ? (
                <p className="mt-3 border-t border-[color:var(--color-line)] pt-2 text-[0.8125rem] text-[color:var(--color-ink-muted)]">
                  <span className="font-medium text-[color:var(--color-ink-body)]">Notes: </span>
                  {address.notes}
                </p>
              ) : null}
            </address>

            {/* A WhatsApp link to the customer is the fastest way to confirm a
                delivery window. Rendered only when the phone number looks
                usable; a broken wa.me link is worse than none. */}
            {whatsappForCustomer(order.customer.phone) ? (
              <a
                href={whatsappForCustomer(order.customer.phone)!}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center justify-center bg-[#1f7a4d] px-5 text-[0.6875rem] font-medium tracking-[0.1em] uppercase text-white"
              >
                Message customer on WhatsApp
              </a>
            ) : null}
          </section>

          <section>
            <h2 className="font-display text-[1.25rem] leading-tight text-[color:var(--color-ink-strong)]">
              Actions
            </h2>

            {settled ? (
              <p className="mt-3 border-l-2 border-[color:var(--color-line-strong)] bg-white px-4 py-3 text-[0.8125rem] leading-relaxed text-[color:var(--color-ink-muted)]">
                {order.status === "paid"
                  ? "This order is settled. There is nothing left to do to it — the payment record is the proof."
                  : "This order was cancelled and owes nothing."}
              </p>
            ) : (
              <div className="mt-3 space-y-3">
                <form action={markOrderPaid}>
                  <input type="hidden" name="reference" value={order.reference} />
                  <button
                    type="submit"
                    disabled={order.totalSen <= 0}
                    className="min-h-11 w-full bg-[color:var(--color-espresso)] px-5 text-[0.6875rem] font-medium tracking-[0.12em] uppercase text-[color:var(--color-ivory)] transition-colors hover:bg-[color:var(--color-cognac-deep)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Mark paid — {formatSen(order.totalSen, order.locale)} received
                  </button>
                  <p className="mt-1.5 text-[0.6875rem] leading-relaxed text-[color:var(--color-mist)]">
                    Records the order total as received. Only press this once you actually have the
                    cash.
                  </p>
                </form>

                <form action={cancelOrder}>
                  <input type="hidden" name="reference" value={order.reference} />
                  <button
                    type="submit"
                    className="min-h-11 w-full border border-[color:var(--color-line-strong)] px-5 text-[0.6875rem] font-medium tracking-[0.12em] uppercase text-[color:var(--color-ink-muted)] transition-colors hover:border-[#a8442c] hover:text-[#a8442c]"
                  >
                    Cancel order
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* --------------------------------- Pieces -------------------------------- */

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white px-4 py-3">
      <dt className="text-[0.625rem] tracking-[0.1em] uppercase text-[color:var(--color-stone)]">
        {label}
      </dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "owe" | "settled" | "neutral";
  children: React.ReactNode;
}) {
  const classes =
    tone === "settled"
      ? "bg-[color:var(--color-cream)] text-[#41593a]"
      : tone === "owe"
        ? "bg-[color:var(--color-cream)] text-[color:var(--color-cognac-deep)]"
        : "bg-[color:var(--color-cream)] text-[color:var(--color-stone)]";
  return (
    <span className={`inline-block px-2 py-0.5 text-[0.625rem] tracking-[0.08em] uppercase ${classes}`}>
      {children}
    </span>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[color:var(--color-ink-muted)]">{label}</dt>
      <dd
        className={
          strong
            ? "font-medium text-[color:var(--color-ink-strong)]"
            : "text-[color:var(--color-ink-body)]"
        }
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * A wa.me link for the customer's phone number.
 *
 * Returns null when the number cannot be normalised to something plausible,
 * rather than producing a link that opens a chat with nobody. Malaysian numbers
 * are the only format this shop receives, so the check is: strip formatting,
 * convert a leading 0 to 60, and require at least ten digits.
 */
function whatsappForCustomer(phone: string): string | null {
  const digits = (phone ?? "").replace(/[^\d]/g, "").replace(/^0/, "60");
  if (!/^6\d{9,}$/.test(digits)) return null;
  return `https://wa.me/${digits}`;
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
