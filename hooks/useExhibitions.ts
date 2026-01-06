import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { Exhibition } from "@/lib/types";

export function useExhibitions() {
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExhibitions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Zakładając endpoint /api/v1/exhibitions
            const data = await api.get<Exhibition[]>("/api/v1/exhibitions");
            setExhibitions(data);
        } catch (err: any) {
            // Jeśli endpoint nie istnieje, zwrócimy puste lub mockowe dane, 
            // ale staramy się uderzyć w API zgodnie z instrukcją "Backend już obsługuje paginację i bilety"
            setError(err.message || "Błąd podczas pobierania wystaw");
            
            // Fallback na przykładowe dane dla celów prezentacyjnych, jeśli API nie odpowiada
            if (process.env.NODE_ENV === 'development') {
                setExhibitions([
                    {
                        id: "1",
                        title: "Neonowe Sny",
                        description: "Podróż przez futurystyczne wizje miast przyszłości, gdzie światło neonów definiuje rzeczywistość.",
                        date: "15.01.2026 - 20.02.2026",
                        location: "Hala Główna, Galeria Cyfrowa",
                        imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop"
                    },
                    {
                        id: "2",
                        title: "Klasyka w Nowym świetle",
                        description: "Dzieła wielkich mistrzów interpretowane na nowo przez algorytmy sztucznej inteligencji.",
                        date: "01.03.2026 - 15.04.2026",
                        location: "Sala Renesansowa",
                        imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1945&auto=format&fit=crop"
                    }
                ]);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExhibitions();
    }, [fetchExhibitions]);

    const addExhibition = async (data: any) => {
        try {
            const newItem = await api.post<Exhibition>("/api/v1/exhibitions", data);
            setExhibitions(prev => [...prev, newItem]);
            return true;
        } catch (err: any) {
            setError(err.message || "Błąd podczas dodawania");
            return false;
        }
    };

    const updateExhibition = async (id: string, data: any) => {
        try {
            const updated = await api.put<Exhibition>(`/api/v1/exhibitions/${id}`, data);
            setExhibitions(prev => prev.map(ex => ex.id === id ? updated : ex));
            return true;
        } catch (err: any) {
            setError(err.message || "Błąd podczas aktualizacji");
            return false;
        }
    };

    const deleteExhibition = async (id: string) => {
        try {
            await api.delete(`/api/v1/exhibitions/${id}`);
            setExhibitions(prev => prev.filter(ex => ex.id !== id));
            return true;
        } catch (err: any) {
            setError(err.message || "Błąd podczas usuwania");
            return false;
        }
    };

    return { 
        exhibitions, 
        loading, 
        error, 
        refresh: fetchExhibitions, 
        addExhibition, 
        updateExhibition, 
        deleteExhibition 
    };
}
