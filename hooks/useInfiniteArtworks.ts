import { useState, useCallback, useEffect } from "react";
import { api } from "@/lib/api";
import { Artwork } from "@/lib/types";

export function useInfiniteArtworks(sort: string = "newest") {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArtworks = useCallback(async (pageNum: number, isInitial: boolean = false) => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get<Artwork[]>(`/api/v1/arts?page=${pageNum}&sort=${sort}`);
            
            if (data.length === 0) {
                setHasMore(false);
            } else {
                setArtworks(prev => isInitial ? data : [...prev, ...data]);
                setHasMore(data.length >= 10); // Zakładamy limit 10 na stronę
            }
        } catch (err: any) {
            setError(err.message || "Błąd podczas pobierania danych");
        } finally {
            setLoading(false);
        }
    }, [sort]);

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchArtworks(1, true);
    }, [sort, fetchArtworks]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchArtworks(nextPage);
        }
    }, [loading, hasMore, page, fetchArtworks]);

    return { artworks, loading, error, hasMore, loadMore };
}
