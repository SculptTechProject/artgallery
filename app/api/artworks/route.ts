import { NextResponse } from "next/server";

const ART_API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") ?? "";
    const upstream = q
        ? `${ART_API}/api/v1/arts?q=${encodeURIComponent(q)}`
        : `${ART_API}/api/v1/arts`;

    try {
        const r = await fetch(upstream, { headers: { Accept: "application/json" }, cache: "no-store" });
        if (!r.ok) {
            const text = await r.text();
            return NextResponse.json({ error: `Upstream ${r.status}: ${text}` }, { status: 502 });
        }
        const data = await r.json();
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: String(e) }, { status: 502 });
    }
}