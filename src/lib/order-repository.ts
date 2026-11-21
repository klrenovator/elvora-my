import type { Order } from "@/lib/orders";

/**
 * Order persistence boundary.
 *
 * Deliberately the same shape as the catalogue repository, for the same reason:
 * where orders live is a hosting decision, and it should not leak into the
 * checkout code.
 *
 * `MemoryOrderRepository` is the default and is honest about what it is: records
 * survive for the life of the server process and are lost on redeploy. That is
 * genuinely useful — it makes the checkout flow complete, testable and correct
 * today — but it is not a durable order book, and the storefront says so.
 *
 * Crucially, it does **not** pretend to be durable. A second implementation
 * against a database is the real fix, and this interface is what makes that a
 * single file.
 */

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  byReference(reference: string): Promise<Order | undefined>;
  /** Update an existing order. Used by the payment callback, not by checkout. */
  update(reference: string, order: Order): Promise<Order>;
  /** Most recent first. For the owner's order list. */
  recent(limit?: number): Promise<Order[]>;
}

export class OrderStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderStorageError";
  }
}

/**
 * Process-local order store.
 *
 * An explicit `durable = false` flag is carried on the class rather than being
 * inferred, so the UI can state the truth without reaching into internals.
 */
export class MemoryOrderRepository implements OrderRepository {
  readonly durable = false;
  private readonly orders = new Map<string, Order>();

  async create(order: Order): Promise<Order> {
    if (this.orders.has(order.reference)) {
      // A collision after one retry means something is wrong with the source of
      // randomness; refuse rather than overwrite an existing order.
      throw new OrderStorageError(`Order ${order.reference} already exists.`);
    }
    this.orders.set(order.reference, order);
    return order;
  }

  async byReference(reference: string): Promise<Order | undefined> {
    return this.orders.get(reference);
  }

  async update(reference: string, order: Order): Promise<Order> {
    if (!this.orders.has(reference)) {
      throw new OrderStorageError(`Order ${reference} does not exist.`);
    }
    this.orders.set(reference, order);
    return order;
  }

  async recent(limit = 50): Promise<Order[]> {
    return [...this.orders.values()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
}

let active: OrderRepository = new MemoryOrderRepository();

export function getOrderRepository(): OrderRepository {
  return active;
}

/** Test seam. */
export function setOrderRepository(repository: OrderRepository): void {
  active = repository;
}

export function resetOrderRepository(): void {
  active = new MemoryOrderRepository();
}

/**
 * Whether orders survive a restart. Read by the UI so it can state the truth.
 *
 * Takes an optional repository so a caller holding a reference (a server action
 * mid-flight) asks about the store it actually wrote to.
 */
export function ordersAreDurable(repository: OrderRepository = active): boolean {
  return !(repository instanceof MemoryOrderRepository);
}
