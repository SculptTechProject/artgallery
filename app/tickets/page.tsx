"use client";

import { useState } from "react";
import { useExhibitions } from "@/hooks/useExhibitions";
import { Loader2, Calendar, MapPin, Ticket, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

export default function TicketsPage() {
    const { exhibitions, loading } = useExhibitions();
    const [selectedExhibition, setSelectedExhibition] = useState<any>(null);
    const [email, setEmail] = useState("");
    const [ticketType, setTicketType] = useState("Normalny");
    const [paymentMethod, setPaymentMethod] = useState("BLIK");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [purchasedEmail, setPurchasedEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedExhibition) return;

        setIsSubmitting(true);
        try {
            await api.post("/api/v1/tickets/buy", {
                exhibitionId: parseInt(selectedExhibition.id, 10),
                email: email,
                type: ticketType === "Normalny" ? 0 : 1,
                paymentMethod: paymentMethod === "Karta" ? "Card" : paymentMethod
            });
            
            setPurchasedEmail(email);
            setSelectedExhibition(null);
            setEmail("");
            setTicketType("Normalny");
            setPaymentMethod("BLIK");
            setShowSuccess(true);
        } catch (err) {
            alert("Błąd zakupu biletu");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && exhibitions.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white pb-20 pt-12">
            <div className="container mx-auto px-4">
                <header className="mb-16 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
                    >
                        Bilety i Wystawy
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Zarezerwuj miejsce na nadchodzące wydarzenia i zanurz się w świecie nowoczesnej sztuki.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {exhibitions.map((ex, index) => (
                        <motion.div
                            key={ex.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md hover:border-primary/40 transition-all duration-500"
                        >
                            <div className="aspect-[21/9] overflow-hidden">
                                <img 
                                    src={ex.imageUrl} 
                                    alt={ex.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                            </div>

                            <div className="p-8 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-3xl font-bold">{ex.title}</h2>
                                    <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                                        WKRÓTCE
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-8 line-clamp-2">{ex.description}</p>
                                
                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-white/70">
                                        <Calendar size={18} className="text-primary" />
                                        {ex.date}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/70">
                                        <MapPin size={18} className="text-primary" />
                                        {ex.location}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedExhibition(ex)}
                                    className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-4 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                    <Ticket size={20} />
                                    Kup Bilet
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedExhibition && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#111] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg relative"
                        >
                            <button 
                                onClick={() => setSelectedExhibition(null)}
                                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-3xl font-bold mb-2">Kup Bilet</h2>
                            <p className="text-muted-foreground mb-8">Na wystawę: <span className="text-white font-medium">{selectedExhibition.title}</span></p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/60">Twój Email</label>
                                    <input 
                                        type="email" 
                                        required 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors"
                                        placeholder="twoj@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/60">Typ Biletu</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {["Normalny", "Ulgowy"].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setTicketType(type)}
                                                className={`py-4 rounded-2xl font-bold border transition-all ${
                                                    ticketType === type 
                                                        ? "bg-primary border-primary text-white" 
                                                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white/60">Metoda Płatności</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {["BLIK", "Karta"].map((method) => (
                                            <button
                                                key={method}
                                                type="button"
                                                onClick={() => setPaymentMethod(method)}
                                                className={`py-4 rounded-2xl font-bold border transition-all ${
                                                    paymentMethod === method 
                                                        ? "bg-primary border-primary text-white" 
                                                        : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                                                }`}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Przetwarzanie...
                                        </>
                                    ) : (
                                        <>
                                            <Ticket size={20} />
                                            Zapłać i Rezerwuj
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
                {showSuccess && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#111] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-lg text-center relative"
                        >
                            <div className="mx-auto w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 300, 
                                        damping: 15, 
                                        delay: 0.2 
                                    }}
                                >
                                    <Check className="text-green-500" size={48} />
                                </motion.div>
                            </div>

                            <h2 className="text-3xl font-black mb-4 text-white">Dziękujemy za zamówienie!</h2>
                            <p className="text-white/60 mb-10 leading-relaxed">
                                Twój bilet został wstępnie zarezerwowany. Na adres email <span className="text-white font-bold">{purchasedEmail}</span> wysłaliśmy instrukcję płatności. Masz 15 minut na opłacenie.
                            </p>

                            <button
                                onClick={() => setShowSuccess(false)}
                                className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                            >
                                Rozumiem
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
