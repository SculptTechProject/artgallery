"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function CheckoutOverlay() {
    const { isCheckingOut, checkoutSuccess } = useCart();

    return (
        <AnimatePresence>
            {isCheckingOut && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
                >
                    <div className="text-center p-10 max-w-md w-full">
                        <AnimatePresence mode="wait">
                            {!checkoutSuccess ? (
                                <motion.div
                                    key="loading"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 1.2, opacity: 0 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="relative mb-8">
                                        <Loader2 className="h-24 w-24 animate-spin text-primary" strokeWidth={1} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-16 w-16 rounded-full bg-primary/10 blur-xl animate-pulse" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-black mb-2 tracking-tight text-white">
                                        Przetwarzanie płatności...
                                    </h2>
                                    <p className="text-muted-foreground animate-pulse">
                                        Prosimy nie odświeżać strony.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center"
                                >
                                    <motion.div
                                        initial={{ rotate: -45, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                                        className="h-24 w-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-[0_0_50px_rgba(34,197,94,0.5)]"
                                    >
                                        <CheckCircle2 size={60} strokeWidth={2.5} />
                                    </motion.div>
                                    <h2 className="text-4xl font-black mb-4 text-white">
                                        Sukces!
                                    </h2>
                                    <p className="text-xl text-white/80 font-medium">
                                        Dziękujemy za zamówienie!
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-4 italic">
                                        Zaraz zostaniesz przekierowany...
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    {/* Background Neon Elements */}
                    <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
