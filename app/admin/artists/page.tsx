"use client";

import { useState } from "react";
import { useArtists } from "@/hooks/useArtists";
import AdminTable from "@/components/admin/AdminTable";
import { 
    Plus, 
    RotateCw, 
    Search, 
    Trash2, 
    Edit2, 
    X, 
    User
} from "lucide-react";

export default function ArtistsAdminPage() {
    const { artists, loading, error, deleteArtist, addArtist, refresh } = useArtists();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        biography: ""
    });

    const filteredArtists = artists.filter(a => 
        `${a.name} ${a.surname}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (confirm("Delete artist?")) {
            await deleteArtist(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await addArtist(formData);
        if (success) {
            setIsModalOpen(false);
            setFormData({ name: "", surname: "", biography: "" });
        }
    };

    const columns = [
        { 
            header: "ID", 
            accessor: (a: any) => <span className="font-mono">{a.id}</span>,
            width: "50px"
        },
        { header: "NAME", accessor: "name" },
        { header: "SURNAME", accessor: "surname" },
        { 
            header: "BIO", 
            accessor: (a: any) => <span className="truncate block max-w-xs">{a.biography}</span> 
        },
        { 
            header: "ACTIONS", 
            accessor: (a: any) => (
                <div className="flex gap-2">
                    <button className="text-[#A8ADBD] hover:text-white"><Edit2 size={12} /></button>
                    <button onClick={() => handleDelete(a.id)} className="text-[#A8ADBD] hover:text-red-400"><Trash2 size={12} /></button>
                </div>
            ),
            width: "60px"
        }
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="h-10 bg-[#2B2D30] border-b border-[#4E5155] flex items-center px-4 gap-4 flex-shrink-0">
                <div className="relative">
                    <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#4E5155]" />
                    <input 
                        type="text"
                        placeholder="Search artists..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#1E1F22] border border-[#4E5155] pl-8 pr-2 py-0.5 text-xs focus:outline-none focus:border-[#3574F0] w-64"
                    />
                </div>
                
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-[#3574F0] text-white text-xs font-bold rounded hover:bg-[#437EEB] transition-colors"
                >
                    <Plus size={14} /> Add Artist
                </button>

                <button 
                    onClick={() => refresh()}
                    className="p-1 hover:bg-[#393B40] rounded text-[#A8ADBD] hover:text-white transition-colors"
                >
                    <RotateCw size={14} />
                </button>

                {error && <div className="text-red-400 text-[10px] ml-auto uppercase font-bold">{error}</div>}
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden p-2">
                <AdminTable columns={columns} data={filteredArtists} isLoading={loading} />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-[#2B2D30] border border-[#4E5155] w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center px-4 py-2 border-b border-[#4E5155] bg-[#393B40]">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">New Artist Profile</span>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#A8ADBD] hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[#4E5155]">First Name</label>
                                    <input
                                        required
                                        className="w-full bg-[#1E1F22] border border-[#4E5155] px-2 py-1 text-xs text-[#A8ADBD] focus:outline-none focus:border-[#3574F0]"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[#4E5155]">Last Name</label>
                                    <input
                                        required
                                        className="w-full bg-[#1E1F22] border border-[#4E5155] px-2 py-1 text-xs text-[#A8ADBD] focus:outline-none focus:border-[#3574F0]"
                                        value={formData.surname}
                                        onChange={e => setFormData({...formData, surname: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[#4E5155]">Biography</label>
                                <textarea
                                    className="w-full bg-[#1E1F22] border border-[#4E5155] px-2 py-1 text-xs text-[#A8ADBD] focus:outline-none focus:border-[#3574F0] h-32"
                                    value={formData.biography}
                                    onChange={e => setFormData({...formData, biography: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-1.5 border border-[#4E5155] text-xs font-bold hover:bg-[#393B40] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-1.5 bg-[#3574F0] text-white text-xs font-bold hover:bg-[#437EEB] transition-colors"
                                >
                                    Save Artist
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
