"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-bold mb-8 backdrop-blur-md"
                    >
                        <Sparkles size={16} />
                        <span>Nowa Era Kolekcjonowania</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter"
                    >
                        Sztuka, która <br />
                        <span className="bg-gradient-to-r from-primary via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                            definiuje jutro.
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
                    >
                        Odkryj wyselekcjonowaną kolekcję dzieł sztuki cyfrowej i tradycyjnej od najbardziej obiecujących twórców współczesnych.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link 
                            href="/gallery"
                            className="group relative flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black text-lg hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.6)] transition-all"
                        >
                            Eksploruj Galerię
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            href="/tickets"
                            className="px-10 py-5 rounded-2xl border border-white/10 bg-white/5 font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md"
                        >
                            Kup Bilety
                        </Link>
                    </motion.div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[160px] opacity-50 pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] opacity-30 pointer-events-none" />
            </section>

            {/* Features */}
            <section className="py-20 px-4">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: ShieldCheck, title: "Autentyczność", desc: "Każde dzieło jest weryfikowane i certyfikowane przez naszych ekspertów." },
                        { icon: Zap, title: "Szybka Dostawa", desc: "Zapewniamy bezpieczny transport i ubezpieczenie każdej przesyłki." },
                        { icon: Sparkles, title: "Unikalność", desc: "Współpracujemy wyłącznie z artystami tworzącymi limitowane serie." },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md"
                        >
                            <div className="h-14 w-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
                                <feature.icon size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </main>
    );
}
