export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8080";

async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: { Accept: "application/json", ...(init?.headers ?? {}) },
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status} ${await res.text()}`);
    return res.json() as Promise<T>;
}

export const api = { get: apiGet };
