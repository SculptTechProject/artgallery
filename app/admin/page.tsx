"use client";

import { useState } from "react";
import { useArtworks } from "@/hooks/useArtworks";
import { useArtists } from "@/hooks/useArtists";
import { Loader2, Trash2, Plus, X } from "lucide-react";

export default function AdminPage() {
    const { artworks, loading, error, deleteArtwork, addArtwork } = useArtworks();
    const { artists } = useArtists();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        artistId: "",
        type: "Painting",
        imageUrl: "",
        price: 0
    });

    const handleDelete = async (id: string) => {
        if (confirm("Czy na pewno chcesz usunąć to dzieło?")) {
            await deleteArtwork(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await addArtwork(formData);
        if (success) {
            setIsModalOpen(false);
            setFormData({ title: "", description: "", artistId: "", type: "Painting", imageUrl: "", price: 0 });
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Panel Administratora</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    <Plus size={20} /> Dodaj nowe dzieło
                </button>
            </div>

            {error && <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">{error}</div>}

            <div className="overflow-x-auto rounded-xl border border-border bg-card">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border bg-muted/50">
                            <th className="p-4 font-semibold">Tytuł</th>
                            <th className="p-4 font-semibold">Autor</th>
                            <th className="p-4 font-semibold">Typ</th>
                            <th className="p-4 font-semibold text-right">Cena</th>
                            <th className="p-4 font-semibold text-right">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {artworks.map((art) => (
                            <tr key={art.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-medium">{art.title}</td>
                                <td className="p-4 text-muted-foreground">
                                    {art.artist ? `${art.artist.name} ${art.artist.surname}` : "Brak"}
                                </td>
                                <td className="p-4">
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary">
                                        {art.type}
                                    </span>
                                </td>
                                <td className="p-4 text-right font-medium">
                                    {art.price?.toLocaleString()} PLN
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleDelete(art.id)}
                                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-border">
                            <h2 className="text-xl font-bold">Dodaj nowe dzieło</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tytuł</label>
                                <input
                                    required
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Autor</label>
                                <select
                                    required
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.artistId}
                                    onChange={e => setFormData({...formData, artistId: e.target.value})}
                                >
                                    <option value="">Wybierz autora</option>
                                    {artists.map(a => <option key={a.id} value={a.id}>{a.name} {a.surname}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Typ</label>
                                <input
                                    required
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Cena (PLN)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL obrazu</label>
                                <input
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Opis</label>
                                <textarea
                                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none min-h-[100px]"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                                >
                                    Anuluj
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                                >
                                    Zapisz dzieło
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
