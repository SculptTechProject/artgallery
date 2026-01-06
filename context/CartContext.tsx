"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Artwork } from "@/lib/types";
import { api } from "@/lib/api";

interface CartContextType {
  cart: Artwork[];
  addToCart: (art: Artwork) => void;
  removeFromCart: (artId: string) => void;
  clearCart: () => void;
  checkout: (email: string) => Promise<void>;
  isCheckingOut: boolean;
  checkoutSuccess: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Artwork[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const addToCart = (art: Artwork) => {
    setCart((prev) => {
      // Zapobiegamy dodawaniu tego samego dzieła dwa razy (opcjonalnie, ale rozsądne)
      if (prev.find(item => item.id === art.id)) return prev;
      return [...prev, art];
    });
  };

  const removeFromCart = (artId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== artId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = async (email: string) => {
    if (cart.length === 0) return;

    // Upewniamy się, że ID są liczbami całkowitymi (int)
    const artIds = cart.map((item) => Number(item.id));
    setIsCheckingOut(true);
    
    try {
      // Używamy obiektu api dla spójności z resztą aplikacji
      await api.post("/api/v1/orders", {
        email: email,
        artIds: artIds,
      });

      // Symulacja "przetwarzania płatności" przez 2 sekundy, zgodnie z wymaganiem
      await new Promise(resolve => setTimeout(resolve, 2000));

      setCheckoutSuccess(true);
      // Pokaż sukces przez 2-3 sekundy, potem wyczyść i wróć
      setTimeout(() => {
        clearCart();
        setCheckoutSuccess(false);
        setIsCheckingOut(false);
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Błąd zamówienia");
      setIsCheckingOut(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, checkout, isCheckingOut, checkoutSuccess }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
