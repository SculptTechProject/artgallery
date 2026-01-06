"use client";

import { useState } from "react";
import { useExhibitions } from "@/hooks/useExhibitions";
import AdminTable from "@/components/admin/AdminTable";
import EditExhibitionModal from "@/components/admin/EditExhibitionModal";
import { 
    Plus, 
    RotateCw, 
    Search, 
    Trash2, 
    Image as ImageIcon,
    Calendar,
    Users
} from "lucide-react";
import { Exhibition } from "@/lib/types";

export default function ExhibitionsAdminPage() {
    const { 
        exhibitions, 
        loading, 
        error, 
        refresh, 
        addExhibition, 
        updateExhibition, 
        deleteExhibition 
    } = useExhibitions();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredExhibitions = exhibitions.filter(ex => 
        ex.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Delete exhibition row?")) {
            await deleteExhibition(id);
        }
    };

    const handleRowClick = (ex: Exhibition) => {
        setSelectedExhibition(ex);
        setIsModalOpen(true);
    };

    const handleSave = async (data: any) => {
        if (selectedExhibition) {
            await updateExhibition(selectedExhibition.id, data);
        } else {
            await addExhibition(data);
        }
    };

    const openCreateModal = () => {
        setSelectedExhibition(null);
        setIsModalOpen(true);
    };

    const columns = [
        { 
            header: "ID", 
            accessor: (ex: Exhibition) => <span className="font-mono text-[10px]">{ex.id}</span>,
            width: "50px"
        },
        { 
            header: "BANNER", 
            accessor: (ex: Exhibition) => (
                ex.imageUrl ? (
                    <img src={ex.imageUrl} alt={ex.title} className="w-8 h-4 object-cover rounded border border-[#4E5155]" />
                ) : (
                    <ImageIcon size={12} className="text-[#4E5155]" />
                )
            ),
            width: "50px"
        },
        { header: "NAME", accessor: "title" },
        { 
            header: "DATE RANGE", 
            accessor: (ex: Exhibition) => (
                <div className="flex items-center gap-1.5">
                    <Calendar size={10} className="text-[#4E5155]" />
                    <span>{ex.date}</span>
                </div>
            )
        },
        { 
            header: "CAPACITY", 
            accessor: (ex: any) => (
                <div className="flex items-center gap-1.5 font-mono">
                    <Users size={10} className="text-[#4E5155]" />
                    <span>{ex.capacity || 100}</span>
                </div>
            ),
            width: "100px"
        },
        { 
            header: "ACTIONS", 
            accessor: (ex: Exhibition) => (
                <div className="flex justify-center">
                    <button 
                        onClick={(e) => handleDelete(e, ex.id)} 
                        className="text-[#4E5155] hover:text-red-400 p-0.5 transition-colors"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            ),
            width: "60px"
        }
    ];

    return (
        <div className="flex flex-col h-full bg-[#1E1F22]">
            {/* Toolbar */}
            <div className="h-10 bg-[#2B2D30] border-b border-[#4E5155] flex items-center px-4 gap-4 flex-shrink-0">
                <div className="relative">
                    <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#4E5155]" />
                    <input 
                        type="text"
                        placeholder="Filter exhibitions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#1E1F22] border border-[#4E5155] pl-8 pr-2 py-0.5 text-xs text-[#A8ADBD] focus:outline-none focus:border-[#3574F0] w-64"
                    />
                </div>
                
                <button 
                    onClick={openCreateModal}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#3574F0] text-white text-xs font-bold rounded-sm hover:bg-[#437EEB] transition-colors"
                >
                    <Plus size={14} /> New Exhibition
                </button>

                <button 
                    onClick={() => refresh()}
                    className="p-1 hover:bg-[#393B40] rounded text-[#A8ADBD] hover:text-white transition-colors"
                >
                    <RotateCw size={14} />
                </button>

                {error && <div className="text-red-400 text-[10px] ml-auto uppercase font-bold">{error}</div>}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden p-2">
                <AdminTable 
                    columns={columns} 
                    data={filteredExhibitions} 
                    isLoading={loading} 
                    onRowClick={handleRowClick}
                />
            </div>

            <EditExhibitionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                exhibition={selectedExhibition}
                onSave={handleSave}
            />
        </div>
    );
}
