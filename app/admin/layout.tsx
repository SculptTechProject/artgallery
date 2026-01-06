"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("admin_jwt");
        if (!token && pathname !== "/admin/login") {
            router.push("/login");
        } else {
            setIsAuthorized(true);
        }
    }, [router, pathname]);

    if (!isAuthorized) {
        return (
            <div className="h-screen w-screen bg-[#1E1F22] flex items-center justify-center text-[#A8ADBD]">
                Checking authorization...
            </div>
        );
    }

    return (
        <div className="h-screen w-screen overflow-hidden flex bg-[#1E1F22] text-[#A8ADBD] font-sans selection:bg-[#35373E]">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-[#2B2D30] border-r border-[#4E5155] flex flex-col">
                <AdminSidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto flex flex-col">
                {children}
            </main>
        </div>
    );
}
