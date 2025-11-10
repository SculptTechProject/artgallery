'use client';
import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark';

function readCookieTheme(): Mode | undefined {
    const m = document.cookie.match(/(?:^|;\s*)theme=(light|dark)/);
    return (m?.[1] as Mode | undefined);
}

export function ThemeToggle() {
    const [isDark, setIsDark] = useState<boolean | null>(null);

    // init – raz, po zamontowaniu
    useEffect(() => {
        const cookie = readCookieTheme();
        const stored = (localStorage.getItem('theme') as Mode | null) ?? undefined;
        const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initial: Mode = cookie ?? stored ?? system;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsDark(initial === 'dark');
    }, []);

    useEffect(() => {
        if (isDark === null) return;
        const mode: Mode = isDark ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', mode);
        document.cookie = `theme=${mode}; path=/; max-age=31536000; samesite=lax`;
    }, [isDark]);

    useEffect(() => {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const fn = (e: MediaQueryListEvent) => setIsDark(e.matches);
      mq.addEventListener('change', fn);
      return () => mq.removeEventListener('change', fn);
    }, []);

    if (isDark === null) {
        return (
            <button
                type="button"
                aria-label="Toggle theme"
                className="h-8 rounded-md border px-2 border-input bg-secondary text-foreground hover:bg-muted transition"
            >
                …
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setIsDark(d => !d)}
            aria-label="Toggle theme"
            className="h-8 rounded-md border px-2 border-input bg-secondary text-foreground hover:bg-muted transition"
        >
            {isDark ? '🌙' : '☀️'}
        </button>
    );
}
