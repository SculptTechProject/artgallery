"use client";

import { useArtworks } from "@/hooks/useArtworks";
import { 
    Database, 
    ShoppingCart, 
    Ticket as TicketIcon, 
    TrendingUp,
    Activity,
    Terminal
} from "lucide-react";

export default function AdminDashboard() {
    const { artworks } = useArtworks();

    const stats = [
        { label: "Total Arts", value: artworks.length, icon: Database, color: "text-[#3574F0]" },
        { label: "Active Orders", value: 12, icon: ShoppingCart, color: "text-[#62B543]" },
        { label: "Tickets Sold", value: 48, icon: TicketIcon, color: "text-[#E3AC00]" },
        { label: "Revenue", value: `${(artworks.reduce((acc, art) => acc + (art.price || 0), 0) * 0.4).toLocaleString()} PLN`, icon: TrendingUp, color: "text-[#B161E9]" },
    ];

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center gap-3 border-b border-[#4E5155] pb-4">
                <Activity size={20} className="text-[#A8ADBD]" />
                <h1 className="text-xl font-bold text-white tracking-tight uppercase">Server Status: SQL_GALLERY_DB</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-[#2B2D30] border border-[#4E5155] p-4 flex flex-col gap-2 shadow-lg">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-[#4E5155] uppercase tracking-widest">{stat.label}</span>
                            <stat.icon size={16} className={stat.color} />
                        </div>
                        <div className="text-2xl font-mono font-bold text-white">
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* SQL Console-like section */}
            <div className="bg-[#2B2D30] border border-[#4E5155] rounded-sm overflow-hidden flex flex-col h-64">
                <div className="bg-[#393B40] px-4 py-1 flex items-center gap-2 border-b border-[#4E5155]">
                    <Terminal size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Console Output</span>
                </div>
                <div className="flex-1 p-4 font-mono text-[11px] space-y-1 text-[#62B543] overflow-auto">
                    <p className="text-[#A8ADBD] opacity-50">[{new Date().toLocaleTimeString()}] Initializing connection to production...</p>
                    <p>Connected to 127.0.0.1:8080 (SQLITE)</p>
                    <p className="text-[#E3AC00]">Warning: 3 migrations are pending.</p>
                    <p>SELECT * FROM arts WHERE status = &apos;active&apos;;</p>
                    <p className="text-[#A8ADBD] opacity-50">-- Fetched {artworks.length} rows in 12ms</p>
                    <p>SELECT SUM(price) FROM orders WHERE date &gt; &apos;2026-01-01&apos;;</p>
                    <p className="text-[#A8ADBD] opacity-50">-- Aggregate result: 142,500.00</p>
                </div>
            </div>
        </div>
    );
}
