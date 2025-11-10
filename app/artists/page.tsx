"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export default function ArtistsPage() {
    const [artists, setArtists] = useState<any[]>([]); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/api/v1/artists`)
            .then(res => setArtists(res.data))
            .catch(err => setError(err.message));
    }, []);

    if (error) return <p className="text-red-500">Błąd: {error}</p>;
    if (!artists.length) return <p>Ładowanie...</p>;

    return (
        <main className="p-4">
            <h2 className="text-xl font-semibold mb-4">Artyści</h2>
            <ul className="space-y-2">
                {artists.map(a => (
                    <li key={a.id} className="glass p-3 rounded-md">
                        <p className="font-medium">{a.name} {a.surname}</p>
                        {a.biography && <p className="text-sm text-muted-foreground">{a.biography}</p>}
                    </li>
                ))}
            </ul>
        </main>
    );
}