"use client";

import AdminTable from "@/components/admin/AdminTable";
import { Search, RotateCw } from "lucide-react";

export default function TicketsAdminPage() {
    const columns = [
        { header: "ID", accessor: "id", width: "50px" },
        { header: "EXHIBITION", accessor: "exhibition" },
        { header: "EMAIL", accessor: "email" },
        { header: "TYPE", accessor: "type" },
        { header: "STATUS", accessor: "status" },
    ];

    const data = [
        { id: 101, exhibition: "Neonowe Sny", email: "user@test.com", type: "NORMAL", status: "VALID" },
        { id: 102, exhibition: "Klasyka w Nowym świetle", email: "guest@art.pl", type: "REDUCED", status: "EXPIRED" },
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="h-10 bg-[#2B2D30] border-b border-[#4E5155] flex items-center px-4 gap-4 flex-shrink-0">
                <div className="relative">
                    <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#4E5155]" />
                    <input 
                        type="text"
                        placeholder="Search tickets..."
                        className="bg-[#1E1F22] border border-[#4E5155] pl-8 pr-2 py-0.5 text-xs focus:outline-none focus:border-[#3574F0] w-64 text-[#A8ADBD]"
                    />
                </div>
                <button className="p-1 hover:bg-[#393B40] rounded text-[#A8ADBD]">
                    <RotateCw size={14} />
                </button>
            </div>
            <div className="flex-1 overflow-hidden p-2">
                <AdminTable columns={columns} data={data} />
            </div>
        </div>
    );
}
