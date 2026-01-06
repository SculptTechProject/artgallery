"use client";

import { useState, useRef } from "react";
import { uploadFile } from "@/lib/api";
import { Loader2, Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export default function ImageUpload({ value, onChange, className = "" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const url = await uploadFile(file);
            onChange(url);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError("Błąd przesyłania pliku.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div 
            className={`relative group ${className}`}
            onClick={() => fileInputRef.current?.click()}
        >
            <input 
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
            />

            <div className={`
                h-40 w-full border-2 border-dashed border-[#4E5155] rounded-lg 
                flex flex-col items-center justify-center gap-2 cursor-pointer
                hover:border-[#3574F0] hover:bg-[#2F333D] transition-all
                bg-[#1E1F22] overflow-hidden relative
                ${error ? "border-red-500" : ""}
            `}>
                {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-[#A8ADBD]">
                        <Loader2 className="animate-spin" size={24} />
                        <span className="text-xs font-mono uppercase">Uploading...</span>
                    </div>
                ) : value ? (
                    <>
                        <img 
                            src={value} 
                            alt="Uploaded preview" 
                            className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="text-white" size={24} />
                        </div>
                        <button 
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-[#2B2D30] border border-[#4E5155] rounded-md text-[#A8ADBD] hover:text-white hover:border-white transition-colors z-10"
                        >
                            <X size={14} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-[#A8ADBD]">
                        <Upload size={24} className="opacity-50" />
                        <span className="text-xs font-mono uppercase text-center px-4">
                            Kliknij, aby wybrać zdjęcie
                        </span>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-[10px] text-red-500 font-mono uppercase tracking-tight">
                    {error}
                </p>
            )}
        </div>
    );
}
