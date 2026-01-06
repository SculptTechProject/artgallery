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

// Reports API
export type DashboardStats = {
    totalRevenue: number;
    totalOrders: number;
    ticketsSold: number;
    artworksCount: number;
};

export type RevenueChartDataPoint = {
    date: string;
    revenue: number;
};

export type TopExhibition = {
    id: string;
    title: string;
    revenue: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
    return api.get<DashboardStats>("/api/v1/reports/dashboard-stats");
}

export async function getRevenueChartData(): Promise<RevenueChartDataPoint[]> {
    return api.get<RevenueChartDataPoint[]>("/api/v1/reports/revenue-chart");
}

export async function getTopExhibitions(): Promise<TopExhibition[]> {
    return api.get<TopExhibition[]>("/api/v1/reports/top-exhibitions");
}

// Orders API
import type { Order, Ticket } from "./types";

export async function getOrders(): Promise<Order[]> {
    return api.get<Order[]>("/api/v1/orders");
}

export async function getAllOrdersAdmin(): Promise<Order[]> {
    return api.get<Order[]>("/api/v1/orders/all");
}

export async function getAllTicketsAdmin(): Promise<Ticket[]> {
    return api.get<Ticket[]>("/api/v1/tickets/all");
}