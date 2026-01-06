"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import CheckoutModal from "./CheckoutModal";

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const { cart, removeFromCart, checkout } = useCart();

  const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleCheckoutSubmit = async (email: string) => {
    setIsCheckoutModalOpen(false);
    await checkout(email);
    setIsOpen(false);
  };

  return (
    <>
      {/* Przycisk otwierający */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        <ShoppingCart size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-300">
            {cart.length}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="text-primary" /> Twój Koszyk
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                  <ShoppingCart size={48} className="text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-xl font-semibold">Koszyk jest pusty</p>
                  <p className="text-muted-foreground">Dodaj jakieś dzieła sztuki, aby je kupić.</p>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors group"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm font-medium text-primary/80">{item.price?.toLocaleString()} PLN</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                    title="Usuń z koszyka"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-border bg-muted/20">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-muted-foreground">Łączna kwota:</span>
                <span className="text-3xl font-bold tracking-tight">{total.toLocaleString()} PLN</span>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(true)}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
              >
                KUPUJĘ I PŁACĘ
              </button>
            </div>
          )}
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSubmit={handleCheckoutSubmit}
      />
    </>
  );
}
