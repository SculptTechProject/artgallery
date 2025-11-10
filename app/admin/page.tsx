"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {API_BASE_URL} from "@/lib/api";

// --- Config ---------------------------------------------------------------
async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            Accept: "application/json",
            ...(init?.body ? { "Content-Type": "application/json" } : {}),
            ...(init?.headers || {}),
        },
        cache: "no-store",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<T>;
}

function normalizeSrc(raw?: string | null) {
    if (!raw) return null;
    let r = raw.trim();
    try { r = decodeURIComponent(r); } catch {}       // jeśli przyjdzie http%3A...

    if (r.startsWith("/")) return `${API_BASE_URL}${r}`; // ścieżka względna
    if (/^(https?:|data:|blob:)/.test(r)) return r;      // absolutne i lokalne
    return `${API_BASE_URL}/${r.replace(/^\/+/, "")}`;   // fallback
}


// --- Types ----------------------------------------------------------------

type Artist = { id: string; name: string; surname: string; biography: string };

type ArtType =
    | "Unknown"
    | "Painting"
    | "Drawing"
    | "Sculpture"
    | "Print"
    | "Photography"
    | "Digital"
    | "MixedMedia"
    | "Video"
    | "Textile"
    | "Ceramic"
    | "Glass"
    | "Sound"
    | "Street"
    | "Illustration";

type Artwork = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    type: ArtType;
    artist: Artist;
};

// --- UI helpers -----------------------------------------------------------
function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title: string; }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] grid place-items-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg rounded-2xl glass bg-white/90 dark:bg-neutral-900/80 p-5 shadow-2xl">
                <div className="mb-3 flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-md border border-input bg-secondary text-foreground hover:bg-muted">✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode; }) {
    return (
        <section className="glass rounded-xl p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{title}</h2>
                {action}
            </div>
            {children}
        </section>
    );
}

function Pill({ children }: { children: React.ReactNode }) {
    return <span className="inline-block rounded-full border border-input bg-secondary px-2 py-0.5 text-xs text-foreground">{children}</span>;
}

// --- Main page ------------------------------------------------------------
export default function AdminDashboardPage() {
    // tabs
    const [tab, setTab] = useState<"arts" | "artists" | "uploads">("arts");

    // data
    const [artists, setArtists] = useState<Artist[]>([]);
    const [arts, setArts] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // modals
    const [openArtist, setOpenArtist] = useState(false);
    const [openArt, setOpenArt] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);

    // form states
    const [artistForm, setArtistForm] = useState<{ name: string; surname: string; biography: string }>({ name: "", surname: "", biography: "" });
    const [artForm, setArtForm] = useState<{ title: string; description: string; artistId: string; type: ArtType; imageUrl?: string }>({ title: "", description: "", artistId: "", type: "Painting" });
    const [uploading, setUploading] = useState(false);

    // enum list
    const artTypes: ArtType[] = useMemo(
        () => [
            "Painting","Drawing","Sculpture","Print","Photography","Digital","MixedMedia","Video","Textile","Ceramic","Glass","Sound","Street","Illustration"
        ],
        []
    );

    async function loadAll() {
        setLoading(true); setError(null);
        try {
            const [artistsRes, artsRes] = await Promise.all([
                api<Artist[]>("/api/v1/artists"),
                api<Artwork[]>("/api/v1/arts"),
            ]);
            setArtists(artistsRes);
            setArts(artsRes);
        } catch (e: any) {
            setError(e.message ?? String(e));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { void loadAll(); }, []);

    // --- actions ------------------------------------------------------------
    async function createArtist() {
        setLoading(true); setError(null);
        try {
            const body = { ...artistForm };
            const a = await api<Artist>("/api/v1/artists", { method: "POST", body: JSON.stringify(body) });
            setArtists(x => [a, ...x]);
            setOpenArtist(false);
            setArtistForm({ name: "", surname: "", biography: "" });
        } catch (e: any) { setError(e.message ?? String(e)); } finally { setLoading(false); }
    }

    async function uploadImage(file: File): Promise<string> {
        const fd = new FormData();
        fd.append("file", file);
        setUploading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/uploads/arts`, { method: "POST", body: fd });
            if (!res.ok) throw new Error(await res.text());
            const url = await res.json();
            return url as string;
        } finally { setUploading(false); }
    }

    async function createArt() {
        setLoading(true); setError(null);
        try {
            const body = { ...artForm };
            const a = await api<Artwork>("/api/v1/arts", { method: "POST", body: JSON.stringify(body) });
            setArts(x => [a, ...x]);
            setOpenArt(false);
            setArtForm({ title: "", description: "", artistId: "", type: "Painting" });
        } catch (e: any) { setError(e.message ?? String(e)); } finally { setLoading(false); }
    }

    async function deleteArtist(id: string) {
        if (!confirm("Usunąć artystę? (musi nie mieć prac)")) return;
        try {
            await api(`/api/v1/artists/${id}`, { method: "DELETE" });
            setArtists(xs => xs.filter(a => a.id !== id));
        } catch (e: any) { alert(e.message ?? String(e)); }
    }

    // --- render -------------------------------------------------------------
    return (
        <main className="p-4 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setTab("arts")} className={`rounded-md px-3 py-1.5 border ${tab === "arts" ? "bg-foreground text-background" : "bg-secondary text-foreground border-input"}`}>Dzieła</button>
                <button onClick={() => setTab("artists")} className={`rounded-md px-3 py-1.5 border ${tab === "artists" ? "bg-foreground text-background" : "bg-secondary text-foreground border-input"}`}>Artyści</button>
                <button onClick={() => setTab("uploads")} className={`rounded-md px-3 py-1.5 border ${tab === "uploads" ? "bg-foreground text-background" : "bg-secondary text-foreground border-input"}`}>Upload</button>
                <div className="grow" />
                {loading && <Pill>Ładowanie…</Pill>}
                {error && <span className="text-sm text-red-500">{error}</span>}
            </div>

            {tab === "arts" && (
                <Section
                    title="Dzieła"
                    action={<button onClick={() => setOpenArt(true)} className="rounded-md border border-input bg-secondary px-3 py-1.5 text-foreground hover:bg-muted">+ Dodaj dzieło</button>}
                >
                    {arts.length === 0 ? (
                        <p className="text-muted-foreground">Brak dzieł.</p>
                    ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {arts.map(a => (
                                <li key={a.id} className="glass rounded-xl overflow-hidden">
                                    <div className="relative aspect-[4/5]">
                                        {a.imageUrl ? (
                                            <Image src={a.imageUrl.startsWith("/") ? `${API_BASE_URL}${a.imageUrl}` : a.imageUrl} alt={a.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                                        ) : (
                                            <div className="grid h-full place-items-center text-sm text-muted-foreground">Brak obrazu</div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <div className="flex items-center justify-between"><h3 className="font-medium">{a.title}</h3><Pill>{a.type}</Pill></div>
                                        <p className="text-sm text-muted-foreground">{a.artist?.name} {a.artist?.surname}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>
            )}

            {tab === "artists" && (
                <Section
                    title="Artyści"
                    action={<button onClick={() => setOpenArtist(true)} className="rounded-md border border-input bg-secondary px-3 py-1.5 text-foreground hover:bg-muted">+ Dodaj artystę</button>}
                >
                    {artists.length === 0 ? (
                        <p className="text-muted-foreground">Brak artystów.</p>
                    ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {artists.map(a => (
                                <li key={a.id} className="glass rounded-xl p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-medium">{a.name} {a.surname}</h3>
                                            {a.biography && <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{a.biography}</p>}
                                        </div>
                                        <button onClick={() => void deleteArtist(a.id)} className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-400 hover:bg-red-500/15">Usuń</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Section>
            )}

            {tab === "uploads" && (
                <Section title="Upload obrazu" action={<Pill>{uploading ? "Wysyłanie…" : "Gotowe"}</Pill>}>
                    <UploadBox onUpload={uploadImage} />
                </Section>
            )}

            {/* Modale */}
            <Modal open={openArtist} onClose={() => setOpenArtist(false)} title="Nowy artysta">
                <div className="space-y-3">
                    <Field label="Imię">
                        <input value={artistForm.name} onChange={e => setArtistForm({ ...artistForm, name: e.target.value })} className="w-full h-9 rounded-md border px-3 text-sm border-input bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </Field>
                    <Field label="Nazwisko">
                        <input value={artistForm.surname} onChange={e => setArtistForm({ ...artistForm, surname: e.target.value })} className="w-full h-9 rounded-md border px-3 text-sm border-input bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </Field>
                    <Field label="Biografia">
                        <textarea value={artistForm.biography} onChange={e => setArtistForm({ ...artistForm, biography: e.target.value })} className="w-full min-h-24 rounded-md border px-3 py-2 text-sm border-input bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </Field>
                    <div className="mt-2 flex justify-end gap-2">
                        <button onClick={() => setOpenArtist(false)} className="rounded-md border border-input bg-secondary px-3 py-1.5 text-foreground">Anuluj</button>
                        <button onClick={() => void createArtist()} className="rounded-md bg-foreground px-3 py-1.5 text-background">Zapisz</button>
                    </div>
                </div>
            </Modal>

            <Modal open={openArt} onClose={() => setOpenArt(false)} title="Nowe dzieło">
                <div className="space-y-3">
                    <Field label="Tytuł">
                        <input value={artForm.title} onChange={e => setArtForm({ ...artForm, title: e.target.value })} className="w-full h-9 rounded-md border px-3 text-sm border-input bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </Field>
                    <Field label="Opis">
                        <textarea value={artForm.description} onChange={e => setArtForm({ ...artForm, description: e.target.value })} className="w-full min-h-24 rounded-md border px-3 py-2 text-sm border-input bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </Field>
                    <Field label="Artysta">
                        <select value={artForm.artistId} onChange={e => setArtForm({ ...artForm, artistId: e.target.value })} className="w-full h-9 rounded-md border px-2 text-sm border-input bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                            <option value="">— wybierz —</option>
                            {artists.map(a => (
                                <option key={a.id} value={a.id}>{a.name} {a.surname}</option>
                            ))}
                        </select>
                    </Field>
                    <Field label="Typ">
                        <select value={artForm.type} onChange={e => setArtForm({ ...artForm, type: e.target.value as ArtType })} className="w-full h-9 rounded-md border px-2 text-sm border-input bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                            {artTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </Field>
                    <Field label="Obraz (URL względny /images/...)">
                        <input value={artForm.imageUrl ?? ""} onChange={e => setArtForm({ ...artForm, imageUrl: e.target.value || undefined })} className="w-full h-9 rounded-md border px-3 text-sm border-input bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="/images/artworks/mgla.jpg" />
                    </Field>
                    <div className="mt-2 flex justify-end gap-2">
                        <button onClick={() => setOpenArt(false)} className="rounded-md border border-input bg-secondary px-3 py-1.5 text-foreground">Anuluj</button>
                        <button onClick={() => void createArt()} className="rounded-md bg-foreground px-3 py-1.5 text-background">Zapisz</button>
                    </div>
                </div>
            </Modal>

            <Modal open={openUpload} onClose={() => setOpenUpload(false)} title="Wyślij obraz">
                <UploadBox onUpload={uploadImage} />
            </Modal>
        </main>
    );
}

// --- Reusable fields & upload --------------------------------------------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            {children}
        </label>
    );
}

function UploadBox({ onUpload }: { onUpload: (file: File) => Promise<string> }) {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    async function submit() {
        if (!file) return;
        setBusy(true); setResult(null);
        try {
            const url = await onUpload(file);
            setResult(url);
        } catch (e: any) {
            setResult(`Błąd: ${e.message ?? String(e)}`);
        } finally { setBusy(false); }
    }

    const preview = normalizeSrc(result);

    return (
        <div className="rounded-xl border border-input bg-secondary p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="block w-full text-sm" />
                <button onClick={() => void submit()} disabled={!file || busy} className="rounded-md bg-foreground px-3 py-1.5 text-background disabled:opacity-50">{busy ? "Wysyłanie…" : "Wyślij"}</button>
            </div>
            {result && (
                <div className="mt-3 text-sm">
                    {preview ? (
                        <div className="space-y-2">
                            <p className="text-muted-foreground">Zapisano pod:</p>
                            <code className="block rounded-md bg-black/10 dark:bg-white/10 p-2 break-all">
                                {result}
                            </code>
                            <div className="relative mt-2 aspect-[4/3] w-full max-w-md">
                                <img src={preview} alt="podgląd" className="w-full h-full object-contain" />
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-500">Błędny URL</p>
                    )}
                </div>
            )}
        </div>
    );
}
