import { NextResponse } from "next/server";
import {API_BASE_URL} from "@/lib/api";

export async function POST(req: Request) {
    const body = await req.json().catch(() => ({}));
    const r = await fetch(`${API_BASE_URL}/api/v1/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
    });

    const text = await r.text();
    if (!r.ok) {
        return NextResponse.json({ error: text || "Login failed" }, { status: r.status });
    }
    return new NextResponse(text, {
        headers: { "Content-Type": "application/json" },
    });
}
