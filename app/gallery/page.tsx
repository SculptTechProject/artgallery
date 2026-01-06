"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteArtworks } from "@/hooks/useInfiniteArtworks";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import ArtCard from "@/components/ArtCard";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShoppingCart, Sparkles, Clock, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { Artwork } from "@/lib/types";

const filters = [
    { id: "all", label: "Wszystkie", icon: LayoutGrid, sort: "" },
    { id: "newest", label: "Najnowsze", icon: Clock, sort: "newest" },
    { id: "random", label: "Losuj", icon: Sparkles, sort: "random" },
];

export default function GalleryPage() {
    const router = useRouter();
    const [sort, setSort] = useState("newest");
    const { artworks, loading, hasMore, loadMore, error } = useInfiniteArtworks(sort);
    const { addToCart, cart } = useCart();
    const { ref, inView } = useInView({ threshold: 0.1 });

    const isInCart = (id: string) => cart.some(item => item.id === id);

    const handleFilterClick = async (filter: typeof filters[0]) => {
        if (filter.id === "random") {
            try {
                const randomArt = await api.get<Artwork>("/api/v1/arts/random-single");
                if (randomArt && randomArt.id) {
                    router.push(`/gallery/${randomArt.id}`);
                }
            } catch (err) {
                console.error("Failed to fetch random artwork", err);
            }
        } else {
            setSort(filter.sort);
        }
    };

    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMore();
        }
    }, [inView, hasMore, loading, loadMore]);

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-foreground pb-20">
            {/* Sticky Header with Filters */}
            <header className="sticky top-20 z-30 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        Eksploruj Galerię
                    </h1>
                    
                    <nav className="flex items-center gap-2 p-1 bg-white/5 rounded-full border border-white/10">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => handleFilterClick(filter)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                                    (sort === filter.sort && filter.id !== "random")
                                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" 
                                        : "hover:bg-white/10 text-muted-foreground"
                                )}
                            >
                                <filter.icon size={16} />
                                {filter.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <div className="container mx-auto px-4 pt-12">
                {error && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-center mb-8">
                        {error}
                    </div>
                )}

                <motion.section 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {artworks.map((artwork, index) => (
                            <ArtCard 
                                key={artwork.id}
                                artwork={artwork}
                                index={index}
                                isInCart={isInCart(artwork.id)}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </AnimatePresence>
                </motion.section>

                {/* Observer target */}
                <div ref={ref} className="h-20 flex items-center justify-center mt-12">
                    {loading && (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Ładowanie kolejnych dzieł...</p>
                        </div>
                    )}
                    {!hasMore && artworks.length > 0 && (
                        <p className="text-muted-foreground italic text-center">To już wszystkie dzieła w naszej galerii.</p>
                    )}
                    {artworks.length === 0 && !loading && !error && (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20 w-full">
                            <p className="text-muted-foreground text-lg">Nie znaleziono żadnych dzieł.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
