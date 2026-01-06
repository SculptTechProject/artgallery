import { api } from "@/lib/api";
import { Artwork } from "@/lib/types";
import { artworkImageUrl } from "@/lib/images";
import Image from "next/image";

type SearchParams = { q?: string };

async function fetchArtworks(q?: string): Promise<Artwork[]> {
    const path = q
        ? `/api/v1/arts?search=${encodeURIComponent(q)}`
        : `/api/v1/arts`;
    return api.get<Artwork[]>(path);
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const { q = "" } = await searchParams;
    const query = q.trim();

    let artworks: Artwork[] = [];
    try {
        artworks = await fetchArtworks(query);
    } catch(e: any) {
        console.error("Błąd pobierania:", e);
    }

    const filtered = query
        ? artworks.filter(a => [a.title, a.artist?.name, a.artist?.surname]
            .filter(Boolean)
            .some(s => s!.toLowerCase().includes(query.toLowerCase())))
        : artworks;

    return (
        <main>

            <section className="glass supports-[backdrop-filter]:glass glass-fallback rounded-xl px-6 py-3 mb-5 mx-24 mt-12 text-center">
                <h2 className="text-2xl font-semibold">Witamy w galerii</h2>
                <p className="text-muted-foreground">Przeglądaj dzieła, artystów i kolekcje.</p>
                {query && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        Wyniki dla: <span className="font-medium">{query}</span>
                    </p>
                )}
            </section>

            <section>
                {filtered.length === 0 ? (
                    <div className="glass supports-[backdrop-filter]:glass glass-fallback rounded-xl p-8 text-center">
                        <p className="text-muted-foreground">Brak wyników {query ? `dla „${query}”` : "do wyświetlenia"}.</p>
                    </div>
                ) : (
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
                        {filtered.map(a => (
                            <li key={a.id} className="group glass supports-[backdrop-filter]:glass glass-fallback rounded-lg overflow-hidden">
                                <div className="relative aspect-[4/5]">
                                    <img src={artworkImageUrl(a)} alt={a.title} className="w-full h-full object-cover hover:p-1  hover:rounded-2xl transition-all" />

                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium">{a.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {a.artist?.name} {a.artist?.surname}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
