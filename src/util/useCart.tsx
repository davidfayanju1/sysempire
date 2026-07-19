// util/useCart.ts
import { useEffect, useMemo } from "react";
import { useCartStore } from "../store/cartStore";

export type { CartItem, AddToCartPayload } from "../store/cartStore";

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const cartLoading = useCartStore((s) => s.loading);
  const initialized = useCartStore((s) => s.initialized);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const mergeCart = useCartStore((s) => s.mergeCart);
  const checkout = useCartStore((s) => s.checkout);

  useEffect(() => {
    if (!initialized) {
      fetchCart();
    }
  }, [initialized, fetchCart]);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  return {
    cartItems: items,
    cartCount,
    cartLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    mergeCart,
    checkout,
    fetchCart,
  };
};
