import { useEffect, useState } from "react";
import {API_BASE_URL} from "@/lib/api";

type Category = { id: number; name: string };

export function useCategories() {
    const [data, setData] = useState<Category[]>([]);
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/v1/arts/categories`, { headers: { Accept: "application/json" } })
            .then(r => (r.ok ? r.json() : Promise.reject(r)))
            .then(setData)
            .catch(() => setData([]));
    }, []);
    return data;
}