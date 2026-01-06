import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Artwork } from "@/lib/types";

export function useArtworks() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArtworks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Zakładając endpoint /api/v1/arts zgodnie z opisem
            // Wcześniej w page.tsx widziałem /api/v1/arts, ale trzymam się opisu issue jeśli jest konkretny
            // "pobiera listę dzieł sztuki z mojego backendu (adres np. http://localhost:8080/api/v1/arts)"
            // Ale API_BASE_URL ma już http://127.0.0.1:8080.
            const data = await api.get<Artwork[]>("/api/v1/arts");
            setArtworks(data);
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd podczas pobierania dzieł sztuki");
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteArtwork = async (id: string) => {
        try {
            await api.delete(`/api/v1/arts/${id}`);
            setArtworks(prev => prev.filter(art => art.id !== id));
            return true;
        } catch (err: any) {
            setError(err.message || "Błąd podczas usuwania");
            return false;
        }
    };

    const addArtwork = async (artwork: any) => {
        try {
            const newArt = await api.post<Artwork>("/api/v1/arts", artwork);
            setArtworks(prev => [...prev, newArt]);
            return true;
        } catch (err: any) {
            setError(err.message || "Błąd podczas dodawania");
            return false;
        }
    };

    const updateArtwork = async (id: string, artwork: any) => {
        try {
            const updated = await api.put<Artwork>(`/api/v1/arts/${id}`, artwork);
            setArtworks(prev => prev.map(art => art.id === id ? updated : art));
            return true;
        } catch (err: any) {
            setError(err.message || "Błąd podczas aktualizacji");
            return false;
        }
    };

    useEffect(() => {
        fetchArtworks();
    }, [fetchArtworks]);

    return { artworks, loading, error, refresh: fetchArtworks, deleteArtwork, addArtwork, updateArtwork };
}
