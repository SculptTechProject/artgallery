"use client";

import { useState, useEffect } from "react";
import { Exhibition } from "@/lib/types";
import { X, Save, Loader2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface EditExhibitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    exhibition: Exhibition | null;
    onSave: (data: any) => Promise<void>;
}

export default function EditExhibitionModal({ isOpen, onClose, exhibition, onSave }: EditExhibitionModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState(100);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (exhibition) {
            setTitle(exhibition.title);
            setDescription(exhibition.description);
            setDate(exhibition.date);
            setImageUrl(exhibition.imageUrl || "");
            setLocation(exhibition.location);
            setCapacity((exhibition as any).capacity || 100);
        } else {
            // Default for new
            setTitle("");
            setDescription("");
            setDate("");
            setImageUrl("");
            setLocation("");
            setCapacity(100);
        }
    }, [exhibition, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({
                title,
                description,
                date,
                imageUrl,
                location,
                capacity: Number(capacity)
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
                <div className="bg-[#2B2D30] px-4 py-2 border-b border-[#4E5155] flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8ADBD]">
                        {exhibition ? `Edit Exhibition: ${exhibition.id}` : "New Exhibition"}
                    </span>
                    <button onClick={onClose} className="text-[#A8ADBD] hover:text-white transition-colors">
                        <X size={16} />
                    </button>
                </div>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-[#4E5155] tracking-widest">Date Range</label>
                            <input 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                placeholder="e.g. 15.01.2026 - 20.02.2026"
                                className="w-full bg-[#2B2D30] border border-[#4E5155] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3574F0] transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase text-[#4E5155] tracking-widest">Capacity</label>
                            <input 
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(Number(e.target.value))}
                                className="w-full bg-[#2B2D30] border border-[#4E5155] px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#3574F0] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[#4E5155] tracking-widest">Location</label>
                        <input 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-[#2B2D30] border border-[#4E5155] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3574F0] transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[#4E5155] tracking-widest">Description</label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-[#2B2D30] border border-[#4E5155] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3574F0] transition-colors resize-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-[#4E5155] tracking-widest">Banner Image</label>
                        <ImageUpload 
                            value={imageUrl}
                            onChange={setImageUrl}
                        />
                    </div>
                </form>

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
                        {exhibition ? "Update Exhibition" : "Create Exhibition"}
                    </button>
                </div>
            </div>
        </div>
    );
}
