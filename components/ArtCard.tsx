"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Artwork } from "@/lib/types";
import { artworkImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ArtCardProps {
    artwork: Artwork;
    index: number;
    isInCart: boolean;
    onAddToCart: (art: Artwork) => void;
}

export default function ArtCard({ artwork, index, isInCart, onAddToCart }: ArtCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all duration-500"
        >
            {/* Link do szczegółów na całą kartę */}
            <Link href={`/gallery/${artwork.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">Zobacz szczegóły {artwork.title}</span>
            </Link>

            <div className="aspect-[4/5] overflow-hidden">
                <motion.img
                    src={artworkImageUrl(artwork)}
                    alt={artwork.title}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            <div className="p-6 flex flex-col flex-1 relative z-10 pointer-events-none">
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {artwork.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    {artwork.artist ? `${artwork.artist.name} ${artwork.artist.surname}` : "Nieznany artysta"}
                </p>
                
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Cena</span>
                        <span className="text-lg font-bold text-white">
                            {artwork.price?.toLocaleString()} PLN
                        </span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onAddToCart(artwork);
                        }}
                        disabled={isInCart}
                        className={cn(
                            "relative z-20 p-3 rounded-xl transition-all duration-300 pointer-events-auto",
                            isInCart
                                ? "bg-green-500/20 text-green-500 cursor-default"
                                : "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] active:scale-95"
                        )}
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
