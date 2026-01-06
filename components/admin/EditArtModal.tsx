"use client";

import { useState, useEffect } from "react";
import { Artwork } from "@/lib/types";
import { X, Save, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface EditArtModalProps {
    isOpen: boolean;
    onClose: () => void;
    art: Artwork | null;
    onSave: (data: any) => Promise<void>;
}

export default function EditArtModal({ isOpen, onClose, art, onSave }: EditArtModalProps) {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (art) {
            setTitle(art.title);
            setPrice(art.price);
            setDescription(art.description);
            setImageUrl(art.imageUrl || "");
            // Zakładamy że isAvailable jest w obiekcie, jeśli nie - domyślnie true
            setIsAvailable((art as any).isAvailable !== false);
        }
    }, [art, isOpen]);

    if (!isOpen || !art) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({
                title,
                description,
                price: Number(price),
                imageUrl,
                isAvailable,
                // Zachowujemy te dane z oryginału
                categoryId: (art as any).categoryId || 1, 
                artistId: Number(art.artist.id)
            });
            onClose();
        } catch (err) {
            console.error("Save error:", err);
            alert("Błąd podczas zapisywania zmian.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#1E1F22] border border-[#4E5155] w-full max-w-lg shadow-2xl rounded-sm flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#2B2D30] px-4 py-2 border-b border-[#4E5155] flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8ADBD]">
                        Edit Row: {art.id}
                    </span>
                    <button onClick={onClose} className="text-[#A8ADBD] hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[#4E5155] tracking-widest">Title</label>
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-[#2B2D30] border border-[#4E5155] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3574F0] transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[#4E5155] tracking-widest">Price (PLN)</label>
                        <input 
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            required
                            className="w-full bg-[#2B2D30] border border-[#4E5155] px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#3574F0] transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[#4E5155] tracking-widest">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-[#2B2D30] border border-[#4E5155] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3574F0] transition-colors resize-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[#4E5155] tracking-widest">Artwork Image</label>
                        <ImageUpload 
                            value={imageUrl}
                            onChange={setImageUrl}
                        />
                    </div>

                    <div className="flex items-center gap-3 py-2">
                        <input 
                            type="checkbox"
                            id="isAvailable"
                            checked={isAvailable}
                            onChange={(e) => setIsAvailable(e.target.checked)}
                            className="w-4 h-4 rounded-sm bg-[#2B2D30] border-[#4E5155] text-[#3574F0] focus:ring-0"
                        />
                        <label htmlFor="isAvailable" className="text-sm text-[#A8ADBD] cursor-pointer">
                            Is Available for Purchase
                        </label>
                    </div>
                </form>

                {/* Footer */}
                <div className="bg-[#2B2D30] px-6 py-4 border-t border-[#4E5155] flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A8ADBD] hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#3574F0] hover:bg-[#467FF2] text-white px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
