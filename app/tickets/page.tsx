"use client";

import { useState } from "react";
import { useExhibitions } from "@/hooks/useExhibitions";
import { Loader2, Calendar, MapPin, Ticket, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TicketsPage() {
    const { exhibitions, loading, error } = useExhibitions();
    const [selectedExhibition, setSelectedExhibition] = useState<any>(null);
    const [ticketType, setTicketType] = useState<"normal" | "reduced">("normal");
    const [isPurchased, setIsPurchased] = useState(false);

    const handleBuyTicket = () => {
        // Symulacja zakupu
        setIsPurchased(true);
        setTimeout(() => {
            setIsPurchased(false);
            setSelectedExhibition(null);
        }, 3000);
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

            {/* Ticket Modal */}
            <AnimatePresence>
                {selectedExhibition && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isPurchased && setSelectedExhibition(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-[#0f0f0f] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden p-10 text-center"
                        >
                            {!isPurchased ? (
                                <>
                                    <button 
                                        onClick={() => setSelectedExhibition(null)}
                                        className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                    
                                    <div className="mb-8">
                                        <div className="h-20 w-20 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
                                            <Ticket size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Wybierz typ biletu</h3>
                                        <p className="text-muted-foreground">{selectedExhibition.title}</p>
                                    </div>

                                    <div className="space-y-4 mb-10">
                                        <button
                                            onClick={() => setTicketType("normal")}
                                            className={cn(
                                                "w-full p-6 rounded-3xl border transition-all flex items-center justify-between",
                                                ticketType === "normal" 
                                                    ? "bg-primary/10 border-primary text-white" 
                                                    : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                                            )}
                                        >
                                            <div className="text-left">
                                                <div className="font-bold">Normalny</div>
                                                <div className="text-xs opacity-60">Pełny dostęp do wystawy</div>
                                            </div>
                                            <div className="text-xl font-black">49 PLN</div>
                                        </button>
                                        <button
                                            onClick={() => setTicketType("reduced")}
                                            className={cn(
                                                "w-full p-6 rounded-3xl border transition-all flex items-center justify-between",
                                                ticketType === "reduced" 
                                                    ? "bg-primary/10 border-primary text-white" 
                                                    : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                                            )}
                                        >
                                            <div className="text-left">
                                                <div className="font-bold">Ulgowy</div>
                                                <div className="text-xs opacity-60">Studenci, Seniorzy</div>
                                            </div>
                                            <div className="text-xl font-black">29 PLN</div>
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleBuyTicket}
                                        className="w-full bg-primary text-white font-black py-5 rounded-[2rem] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all active:scale-[0.98]"
                                    >
                                        Potwierdzam Zakup
                                    </button>
                                </>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-10"
                                >
                                    <div className="h-24 w-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                                        <CheckCircle2 size={60} />
                                    </div>
                                    <h3 className="text-3xl font-black mb-4">Dziękujemy!</h3>
                                    <p className="text-muted-foreground mb-8">Twój bilet został wygenerowany i wysłany na adres e-mail.</p>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-sm italic opacity-60">
                                        Przekierowanie do listy wystaw...
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
