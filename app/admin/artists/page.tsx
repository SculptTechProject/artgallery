"use client";

import { useState } from "react";
import { useArtists } from "@/hooks/useArtists";
import { Loader2, Trash2, Plus, X, Edit2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminArtistsPage() {
    const { artists, loading, error, deleteArtist, addArtist, updateArtist } = useArtists();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArtist, setEditingArtist] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        biography: ""
    });

    const handleOpenModal = (artist: any = null) => {
        if (artist) {
            setEditingArtist(artist);
            setFormData({
                name: artist.name,
                surname: artist.surname,
                biography: artist.biography
            });
        } else {
            setEditingArtist(null);
            setFormData({ name: "", surname: "", biography: "" });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Czy na pewno chcesz usunąć tego artystę?")) {
            await deleteArtist(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let success;
        if (editingArtist) {
            success = await updateArtist(editingArtist.id, formData);
        } else {
            success = await addArtist(formData);
        }

        if (success) {
            setIsModalOpen(false);
        }
    };

    if (loading && artists.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-2">
                        Zarządzaj Artystami
                    </h1>
                    <p className="text-muted-foreground">Dodawaj, edytuj i usuwaj twórców z Twojej galerii.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all active:scale-95 font-bold"
                >
                    <Plus size={20} /> Dodaj Artystę
                </button>
            </div>

            {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-2xl mb-8 flex items-center gap-3">
                    <X size={20} />
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Artysta</th>
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground">Biografia</th>
                            <th className="p-6 font-bold text-sm uppercase tracking-wider text-muted-foreground text-right">Akcje</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {artists.map((artist) => (
                            <tr key={artist.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center border border-white/10 text-primary group-hover:scale-110 transition-transform">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{artist.name} {artist.surname}</div>
                                            <div className="text-xs text-muted-foreground">ID: {artist.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <p className="text-muted-foreground line-clamp-2 max-w-md text-sm">
                                        {artist.biography || "Brak opisu."}
                                    </p>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenModal(artist)}
                                            className="p-3 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/10 transition-all"
                                            title="Edytuj"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(artist.id)}
                                            className="p-3 rounded-xl bg-white/5 hover:bg-destructive/20 hover:text-destructive border border-white/10 transition-all"
                                            title="Usuń"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {artists.length === 0 && (
                    <div className="p-20 text-center text-muted-foreground">
                        Brak artystów w bazie danych.
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center p-8 border-b border-white/5 bg-white/5">
                            <div>
                                <h2 className="text-2xl font-black text-white">
                                    {editingArtist ? "Edytuj Artystę" : "Nowy Artysta"}
                                </h2>
                                <p className="text-sm text-muted-foreground">Wypełnij dane twórcy.</p>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)} 
                                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground ml-1">Imię</label>
                                    <input
                                        required
                                        placeholder="np. Leonardo"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-muted-foreground ml-1">Nazwisko</label>
                                    <input
                                        required
                                        placeholder="np. da Vinci"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                                        value={formData.surname}
                                        onChange={e => setFormData({...formData, surname: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground ml-1">Biografia</label>
                                <textarea
                                    required
                                    placeholder="Krótki opis twórczości..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none min-h-[150px] transition-all resize-none"
                                    value={formData.biography}
                                    onChange={e => setFormData({...formData, biography: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors font-bold"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all font-bold"
                                >
                                    {editingArtist ? "Zapisz Zmiany" : "Stwórz Profil"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
