"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("admin_jwt");
        setIsLoggedIn(!!token);
    }, []);

    const handleAdminClick = () => {
        if (isLoggedIn) {
            router.push("/admin");
        } else {
            router.push("/login");
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                    ART GALLERY
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/gallery" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                        Obrazy
                    </Link>
                    <Link href="/artists" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                        Artyści
                    </Link>
                    <Link href="/tickets" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                        Bilety
                    </Link>
                    <button
                        onClick={handleAdminClick}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                        {isLoggedIn ? (
                            <>
                                <User size={18} className="text-primary" />
                                <span className="text-sm font-bold">Panel Admina</span>
                            </>
                        ) : (
                            <>
                                <Lock size={18} className="text-muted-foreground" />
                                <span className="text-sm font-bold">Zaloguj</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden p-2 text-muted-foreground"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-black/90 backdrop-blur-2xl border-b border-white/10 p-4 space-y-4 animate-in slide-in-from-top duration-300">
                    <Link 
                        href="/gallery" 
                        className="block text-lg font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Obrazy
                    </Link>
                    <Link 
                        href="/artists" 
                        className="block text-lg font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Artyści
                    </Link>
                    <Link 
                        href="/tickets" 
                        className="block text-lg font-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Bilety
                    </Link>
                    <button
                        onClick={() => {
                            handleAdminClick();
                            setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
                    >
                        {isLoggedIn ? "Panel Admina" : "Zaloguj"}
                    </button>
                </div>
            )}
        </nav>
    );
}
