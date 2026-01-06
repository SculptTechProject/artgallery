"use client";

import { useState, useMemo } from "react";
import { X, CreditCard, Mail, Users, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Exhibition } from "@/lib/types";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TicketModalProps {
    exhibition: Exhibition;
    onClose: () => void;
}

export default function TicketModal({ exhibition, onClose }: TicketModalProps) {
    const [email, setEmail] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("BLIK");
    const [ticketType, setTicketType] = useState<"Normalny" | "Ulgowy">("Normalny");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const availableSeats = useMemo(() => Math.floor(Math.random() * 50) + 10, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/api/v1/tickets/buy", {
                exhibitionId: exhibition.id,
                email,
                paymentMethod,
                ticketType,
            });
            
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Błąd podczas zakupu biletu:", error);
            alert("Błąd podczas zakupu biletu. Spróbuj ponownie.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-card border border-white/10 p-12 rounded-[2.5rem] text-center max-w-sm w-full glass shadow-2xl"
                >
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Sukces!</h3>
                    <p className="text-muted-foreground">Bilet wysłany na maila!</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative glass"
            >
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    <div className="mb-8">
                        <span className="text-primary text-xs font-black tracking-widest uppercase mb-2 block">Rezerwacja</span>
                        <h2 className="text-3xl font-bold mb-1">{exhibition.title}</h2>
                        <p className="text-muted-foreground text-sm">Dostępne miejsca: <span className="text-white font-bold">{availableSeats}</span></p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-white/50 ml-1">Adres Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="twoj@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-white/50 ml-1">Typ Biletu</label>
                                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
                                    {(["Normalny", "Ulgowy"] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setTicketType(type)}
                                            className={cn(
                                                "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
                                                ticketType === type ? "bg-primary text-white shadow-lg" : "text-white/40 hover:text-white"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-white/50 ml-1">Płatność</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 focus:ring-2 focus:ring-primary outline-none appearance-none"
                                >
                                    <option value="BLIK">BLIK</option>
                                    <option value="Karta">Karta</option>
                                    <option value="Przelew">Przelew</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <CreditCard size={24} />
                                        ZAPŁAĆ I REZERWUJ
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
