"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Product } from "@/content/types";
import {
  acceptCurrentPrices,
  addLine,
  emptyCart,
  parseStoredCart,
  reconcile,
  removeLine,
  removeUnavailableLines,
  setQuantity,
  type AddResult,
  type Cart,
  type ReconciledCart,
} from "@/lib/cart-store";

const STORAGE_KEY = "elvora_cart_v1";

interface CartContextValue {
  cart: Cart;
  reconciled: ReconciledCart;
  /** False until localStorage has been read, so the UI can avoid a flash. */
  hydrated: boolean;
  add: (product: Product, variantId: string, quantity?: number) => AddResult;
  updateQuantity: (variantId: string, quantity: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  confirmPrices: () => void;
  dropUnavailable: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Cart provider.
 *
 * State lives in localStorage. Everything read back is treated as untrusted and
 * passed through `parseStoredCart`, because storage is user-editable. Prices are
 * never recalculated from stored values at checkout — `reconcile` always works
 * from the live catalogue, so a tampered `addedPriceSen` cannot lower a price;
 * the worst it can do is trigger a visible "price changed" notice.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [hydrated, setHydrated] = useState(false);
  const skipWrite = useRef(true);

  // Read once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCart(parseStoredCart(JSON.parse(raw)));
    } catch {
      setCart(emptyCart);
    }
    setHydrated(true);
  }, []);

  // Persist on change, but not on the initial empty render.
  useEffect(() => {
    if (!hydrated) return;
    if (skipWrite.current) {
      skipWrite.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Storage may be full or blocked; the cart still works for this session.
    }
  }, [cart, hydrated]);

  // Keep multiple tabs in step.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      try {
        setCart(event.newValue ? parseStoredCart(JSON.parse(event.newValue)) : emptyCart);
      } catch {
        setCart(emptyCart);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const reconciled = useMemo(() => reconcile(cart), [cart]);

  const add = useCallback((product: Product, variantId: string, quantity = 1): AddResult => {
    let result: AddResult = { ok: false, reason: "variant-missing" };
    setCart((current) => {
      result = addLine(current, product, variantId, quantity);
      return result.ok ? result.cart : current;
    });
    return result;
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setCart((current) => setQuantity(current, variantId, quantity));
  }, []);

  const remove = useCallback((variantId: string) => {
    setCart((current) => removeLine(current, variantId));
  }, []);

  const clear = useCallback(() => setCart(emptyCart), []);
  const confirmPrices = useCallback(() => setCart((current) => acceptCurrentPrices(current)), []);
  const dropUnavailable = useCallback(
    () => setCart((current) => removeUnavailableLines(current)),
    [],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      reconciled,
      hydrated,
      add,
      updateQuantity,
      remove,
      clear,
      confirmPrices,
      dropUnavailable,
    }),
    [cart, reconciled, hydrated, add, updateQuantity, remove, clear, confirmPrices, dropUnavailable],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
