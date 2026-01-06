export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8080";

async function request<T>(method: string, path: string, body?: any, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        method,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(init?.headers ?? {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status} ${await res.text()}`);
    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;
}

export const api = {
    get: <T>(path: string, init?: RequestInit) => request<T>("GET", path, undefined, init),
    post: <T>(path: string, body: any, init?: RequestInit) => request<T>("POST", path, body, init),
    put: <T>(path: string, body: any, init?: RequestInit) => request<T>("PUT", path, body, init),
    delete: <T>(path: string, init?: RequestInit) => request<T>("DELETE", path, undefined, init),
};

export async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/api/v1/uploads`, {
        method: "POST",
        body: formData,
        // Nie ustawiamy Content-Type, fetch zrobi to sam dla FormData (z boundary)
    });

    if (!res.ok) throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.url; // Zakładamy, że backend zwraca { "url": "..." }
}
