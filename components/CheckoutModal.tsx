"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Mail } from "lucide-react";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, onSubmit }: CheckoutModalProps) {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            onSubmit(email);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg relative shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                <CreditCard size={24} />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Finalizacja Zamówienia</h2>
                        </div>
                        <p className="text-muted-foreground mb-8">Wprowadź swoje dane, aby dokończyć zakup dzieł sztuki.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/60 flex items-center gap-2">
                                    <Mail size={16} /> Adres email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors text-white"
                                    placeholder="twoj@email.com"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-4 rounded-2xl border border-white/10 bg-white/5 font-bold hover:bg-white/10 transition-all text-white/70"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-white font-black py-4 rounded-2xl hover:opacity-90 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                                >
                                    Zamawiam
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
