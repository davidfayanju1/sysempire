// util/useCart.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { CartItem } from "../types/product";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const getCart = (): CartItem[] => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  };

  const saveCart = (cart: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setCartItems(cart);
    updateCartCount(cart);
  };

  const updateCartCount = (cart: CartItem[]) => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  const addToCart = (
    product: any,
    selectedSize: string,
    selectedColor: string,
    quantity: number,
  ): boolean => {
    console.log("=== addToCart from hook called ===");
    console.log("Product:", product);
    console.log("Selected Size:", selectedSize);
    console.log("Selected Color:", selectedColor);
    console.log("Quantity:", quantity);

    if (!selectedSize) {
      toast.error("Please select a size");
      return false;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return false;
    }
    if (!product) {
      toast.error("Product not found");
      return false;
    }

    const cart = getCart();

    const cartItem: CartItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0]?.url || "",
      sku: product.sku,
    };

    console.log("Cart item to add:", cartItem);

    // Check if item already exists in cart (same product, size, color)
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === product.id &&
        item.size === cartItem.size &&
        item.color === cartItem.color,
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      const oldQuantity = cart[existingItemIndex].quantity;
      cart[existingItemIndex].quantity += quantity;
      saveCart(cart);
      toast.success(
        `Updated ${product.name} quantity from ${oldQuantity} to ${cart[existingItemIndex].quantity}`,
      );
      console.log("Updated existing item");
    } else {
      // Add new item
      cart.push(cartItem);
      saveCart(cart);
      toast.success(`${product.name} added to cart!`);
      console.log("Added new item");
    }

    return true;
  };

  const removeFromCart = (itemId: number) => {
    const cart = getCart();
    const itemToRemove = cart.find((item) => item.id === itemId);
    const updatedCart = cart.filter((item) => item.id !== itemId);
    saveCart(updatedCart);
    if (itemToRemove) {
      toast.success(`${itemToRemove.name} removed from cart`);
    }
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    const cart = getCart();
    const itemIndex = cart.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      cart[itemIndex].quantity = newQuantity;
      saveCart(cart);
    }
  };

  const clearCart = () => {
    saveCart([]);
    toast.success("Cart cleared");
  };

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);
    updateCartCount(cart);

    const handleCartUpdate = () => {
      const updatedCart = getCart();
      setCartItems(updatedCart);
      updateCartCount(updatedCart);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  return {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCart,
    saveCart,
  };
};
