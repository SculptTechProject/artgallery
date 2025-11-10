"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LoginResponse = { token: string };

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!username.trim() || !password.trim()) {
            setErr("Podaj login i hasło.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ username: username.trim(), password }),
            });

            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.error || `HTTP ${res.status}`);
            }

            const data = (await res.json()) as LoginResponse;

            // zapisz token (tu: localStorage; możesz przenieść do httpOnly cookie po stronie serwera)
            localStorage.setItem("admin_jwt", data.token);

            // opcjonalnie: pingnij toasta itp.
            router.push("/admin");
        } catch (e: any) {
            setErr(e.message ?? "Nie udało się zalogować.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-[60vh] grid place-items-start">
            <section className="glass rounded-xl p-6 w-full max-w-md mx-4 mt-8">
                <h1 className="text-2xl font-semibold mb-1">Logowanie admina</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Wpisz poświadczenia administratora.
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm">Login</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full h-9 rounded-md border px-3 text-sm
                         border-input bg-secondary text-foreground placeholder:text-muted-foreground
                         focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="admin"
                            autoComplete="username"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm">Hasło</label>
                        <div className="flex gap-2">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPass ? "text" : "password"}
                                className="w-full h-9 rounded-md border px-3 text-sm
                           border-input bg-secondary text-foreground placeholder:text-muted-foreground
                           focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass((s) => !s)}
                                className="h-9 px-3 rounded-md border bg-secondary border-input text-foreground"
                                aria-label={showPass ? "Ukryj hasło" : "Pokaż hasło"}
                            >
                                {showPass ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {err && (
                        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                            {err}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-9 w-full rounded-md bg-foreground text-background font-medium
                       hover:opacity-90 disabled:opacity-50 transition"
                    >
                        {loading ? "Logowanie…" : "Zaloguj"}
                    </button>
                </form>

                <p className="mt-4 text-xs text-muted-foreground">
                    Endpoint: <code>/api/v1/admin/login</code> (przez proxy <code>/api/admin/login</code>)
                </p>
            </section>
        </main>
    );
}
