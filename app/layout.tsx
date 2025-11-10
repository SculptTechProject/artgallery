import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { NavbarMain } from "@/components/navbar/navbar-main";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Galeria Sztuki",
    description: "Galeria Sztuki.",
};

const NO_FLASH = `
(function(){
  try {
    var m = document.cookie.match(/(?:^|; )theme=(light|dark)/);
    var cookieTheme = m ? m[1] : null;
    var stored = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = cookieTheme || stored || (systemDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  } catch (e) {}
})();
`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const jar = await cookies();
    const cookieTheme = jar.get("theme")?.value as "light" | "dark" | undefined;
    const initialClass = cookieTheme === "dark" ? "dark" : ""; // SSR klasa

    return (
        <html lang="pl" className={initialClass} suppressHydrationWarning>
        <head>
            <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavbarMain />
        {children}
        </body>
        </html>
    );
}
