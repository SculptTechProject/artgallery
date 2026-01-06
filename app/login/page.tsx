"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Bezpośrednio na backend zgodnie z instrukcją, 
            // lub przez nasz lib/api który uderza w API_BASE_URL (8080)
            const response = await fetch("http://localhost:8080/api/v1/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Nieprawidłowe dane logowania");
            }

            const data = await response.json();
            localStorage.setItem("admin_jwt", data.token);
            
            // Odświeżamy stan Navbar (można to zrobić lepiej przez Context/EventEmitter, 
            // ale prosty redirect zazwyczaj wystarczy do odczytania na nowo)
            window.location.href = "/admin";
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd podczas logowania");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-4">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-center">Panel Administratora</h1>
                    <p className="text-muted-foreground mt-2">Zaloguj się, aby zarządzać galerią</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Hasło</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Logowanie...
                            </>
                        ) : "Zaloguj się"}
                    </button>
                </form>
            </motion.div>
        </main>
    );
}
