import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

type Artist = {
    id: string;
    name: string;
    surname: string;
    biography: string;
};

export function useArtists() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArtists = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Zakładając endpoint /api/artists zgodnie z logiką projektu
            const data = await api.get<Artist[]>("/api/v1/artists");
            setArtists(data);
        } catch (err: any) {
            setError(err.message || "Błąd podczas pobierania artystów");
        } finally {
            setLoading(false);
        }
    }, []);

    const addArtist = async (artist: any) => {
        try {
            const newArtist = await api.post<Artist>("/api/v1/artists", artist);
            setArtists(prev => [...prev, newArtist]);
            return true;
        } catch (err: any) {
            setError(err.message || "Błąd podczas dodawania artysty");
            return false;
        }
    };

    const updateArtist = async (id: string, artist: any) => {
        try {
            await api.put<Artist>(`/api/v1/artists/${id}`, artist);
            setArtists(prev => prev.map(a => a.id === id ? { ...a, ...artist } : a));
            return true;
        } catch (err: any) {
            setError(err.message || "Błąd podczas edycji artysty");
            return false;
        }
    };

    const deleteArtist = async (id: string) => {
        try {
            await api.delete(`/api/v1/artists/${id}`);
            setArtists(prev => prev.filter(a => a.id !== id));
            return true;
        } catch (err: any) {
            setError(err.message || "Błąd podczas usuwania artysty");
            return false;
        }
    };

    useEffect(() => {
        fetchArtists();
    }, [fetchArtists]);

    return { artists, loading, error, refresh: fetchArtists, addArtist, updateArtist, deleteArtist };
}
