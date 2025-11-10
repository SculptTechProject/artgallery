'use client'
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

import {ThemeToggle} from "@/components/navbar/theme-toggle";

export const NavbarMain = () => {
    const router = useRouter();
    const sp = useSearchParams();
    const [q, setQ] = useState(sp.get("q") ?? "");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setQ(sp.get("q") ?? ""), [sp]);

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const p = new URLSearchParams(Array.from(sp.entries()));
        if (q) p.set("q", q); else p.delete("q");
        if (q == "admin") {
            router.push("/admin/login");
            return;
        }
        router.push(`/?${p.toString()}`);
    }
    
    return (
        <nav className="m-2 relative z-50 isolate rounded-md px-3 py-2 grid grid-cols-[1fr_auto_1fr] items-center
                bg-white/10 backdrop-blur-md border border-white/20 shadow-lg
                ring-1 ring-white/10
                dark:bg-neutral-800/30 dark:border-white/10 dark:ring-white/5">
            {/* left */}
            <h1 className="text-lg font-semibold justify-self-start text-foreground">
                Galeria Sztuki
            </h1>
            <div className="justify-self-center ">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Obrazy</NavigationMenuTrigger>
                            <NavigationMenuContent className="p-2 glass supports-[backdrop-filter]:glass glass-fallback">
                                {/* Static quick links */}
                                <ul className="min-w-56 space-y-1">
                                    <li><NavigationMenuLink href="/">Wszystkie</NavigationMenuLink></li>
                                    <li><NavigationMenuLink href="/artworks/new">Najnowsze</NavigationMenuLink></li>
                                    <li><NavigationMenuLink href="/artworks/random">Losuj</NavigationMenuLink></li>
                                </ul>
                                {/* TODO: Dynamic categories */}
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink href="/artists">Artyści</NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink href="/categories">Kategorie</NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* right */}
            <div className="justify-self-end flex items-center gap-2">
                <form onSubmit={onSubmit}>
                    <input
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        className="h-8 rounded-md border px-3 text-sm
                       border-input bg-secondary text-foreground placeholder:text-muted-foreground
                       focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Szukaj…"
                    />
                </form>
                
                <ThemeToggle />
                
                {/* Auth slot */}
                {/* TODO: show Login or Avatar based on JWT in storage */}
                {/* {token ? <Avatar/> : <Link href="/admin/login">Admin</Link>} */}
            </div>
        </nav>
    );
};
