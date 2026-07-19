import { create } from "zustand";
import { toast } from "sonner";
import api from "../lib/axios";
import type {
  ApiCart,
  ApiCartItem,
  ApiOrder,
  CheckoutPayload,
} from "../types/api-cart";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  sku: string;
  maxQuantity: number;
  inStock: boolean;
}

export interface AddToCartPayload {
  productId: string;
  variantId: string;
  size: string;
  color: string;
  quantity: number;
  measurements?: Record<string, unknown>;
}

const mapApiItem = (item: ApiCartItem): CartItem => ({
  id: item.id,
  name: item.product?.name ?? "",
  price: item.unitPrice,
  quantity: item.quantity,
  size: item.size,
  color: item.color,
  image: item.image,
  sku: item.sku,
  maxQuantity: item.maxQuantity,
  inStock: item.inStock,
});

interface CartState {
  items: CartItem[];
  loading: boolean;
  initialized: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (payload: AddToCartPayload) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeCart: () => Promise<void>;
  checkout: (payload: CheckoutPayload) => Promise<ApiOrder>;
}

// Multiple components mount this store at once (Nav, product pages, etc). Without
// this, each would fire its own uncoordinated first GET /cart before a guest
// session id exists, and the backend would mint a different session per request
// — whichever response lands last then silently clobbers the real cart.
let inFlightFetch: Promise<void> | null = null;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: true,
  initialized: false,

  fetchCart: async () => {
    if (inFlightFetch) return inFlightFetch;
    inFlightFetch = (async () => {
      try {
        set({ loading: true });
        const response = await api.get("/cart");
        const apiCart: ApiCart = response.data.data;
        set({ items: apiCart.items.map(mapApiItem), initialized: true });
      } catch (error) {
        console.log(error, "Cart Fetch Error");
      } finally {
        set({ loading: false });
        inFlightFetch = null;
      }
    })();
    return inFlightFetch;
  },

  addToCart: async (payload) => {
    try {
      const response = await api.post("/cart/items", {
        product: payload.productId,
        variantId: payload.variantId,
        size: payload.size,
        color: payload.color,
        quantity: payload.quantity,
        measurements: payload.measurements ?? {},
      });
      const apiCart: ApiCart = response.data.data;
      set({ items: apiCart.items.map(mapApiItem) });
      toast.success("Added to cart!");
      return true;
    } catch (error: any) {
      console.log(error, "Add To Cart Error");
      toast.error(
        error?.response?.data?.message ?? "Could not add item to cart",
      );
      return false;
    }
  },

  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      const apiCart: ApiCart = response.data.data;
      set({ items: apiCart.items.map(mapApiItem) });
    } catch (error: any) {
      console.log(error, "Remove From Cart Error");
      toast.error(error?.response?.data?.message ?? "Could not remove item");
    }
  },

  updateQuantity: async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await get().removeFromCart(itemId);
      return;
    }
    try {
      const response = await api.patch(`/cart/items/${itemId}`, {
        quantity: newQuantity,
      });
      const apiCart: ApiCart = response.data.data;
      set({ items: apiCart.items.map(mapApiItem) });
    } catch (error: any) {
      console.log(error, "Update Quantity Error");
      toast.error(
        error?.response?.data?.message ?? "Could not update quantity",
      );
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete("/cart");
      const apiCart: ApiCart = response.data.data;
      set({ items: apiCart.items.map(mapApiItem) });
    } catch (error: any) {
      console.log(error, "Clear Cart Error");
      toast.error(error?.response?.data?.message ?? "Could not clear cart");
    }
  },

  mergeCart: async () => {
    try {
      const response = await api.post("/cart/merge", {});
      const apiCart: ApiCart = response.data.data;
      set({ items: apiCart.items.map(mapApiItem) });
    } catch (error) {
      console.log(error, "Merge Cart Error");
    }
  },

  checkout: async (payload) => {
    const response = await api.post("/cart/checkout", payload);
    if (payload.clearCart) {
      await get().fetchCart();
    }
    return response.data.data;
  },
}));
