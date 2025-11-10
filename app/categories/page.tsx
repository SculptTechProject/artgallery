import Link from "next/link";
import {API_BASE_URL} from "@/lib/api";
import {Category} from "@/lib/types";

async function fetchCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE_URL}/api/v1/arts/categories`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export default async function CategoriesPage() {
    let cats: Category[] = [];
    try {
        cats = await fetchCategories();
    } catch (e) {
        return (
            <main className="p-4">
                <h1 className="text-2xl font-semibold mb-4">Kategorie</h1>
                <div className="glass rounded-xl p-6 text-red-500">
                    Nie udało się pobrać kategorii.
                </div>
            </main>
        );
    }

    return (
        <main className="p-4 space-y-6">
            <section className="glass rounded-xl p-6">
                <h1 className="text-2xl font-semibold">Kategorie</h1>
                <p className="text-muted-foreground">Dostępne typy dzieł z liczbą prac.</p>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {cats.map((c) => (
                    <Link
                        key={c.id}
                        href={`/?type=${c.id}`}
                        className="glass rounded-lg px-4 py-3 flex items-center justify-between hover:translate-y-[-1px] transition"
                    >
                        <span className="font-medium">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.count}</span>
                    </Link>
                ))}
            </section>
        </main>
    );
}
