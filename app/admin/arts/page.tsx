"use client";

import { useState } from "react";
import { useArtworks } from "@/hooks/useArtworks";
import { useArtists } from "@/hooks/useArtists";
import AdminTable from "@/components/admin/AdminTable";
import EditArtModal from "@/components/admin/EditArtModal";
import ImageUpload from "@/components/admin/ImageUpload";
import { 
    Plus, 
    RotateCw, 
    Search, 
    Trash2, 
    X, 
    Image as ImageIcon 
} from "lucide-react";
import { Artwork } from "@/lib/types";

export default function ArtsAdminPage() {
    const { artworks, loading, error, deleteArtwork, addArtwork, updateArtwork, refresh } = useArtworks();
    const { artists } = useArtists();
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedArt, setSelectedArt] = useState<Artwork | null>(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [addFormData, setAddFormData] = useState({
        title: "",
        description: "",
        artistId: "",
        type: "Painting",
        imageUrl: "",
        price: 0
    });

    const filteredArtworks = artworks.filter(art => 
        art.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Delete row? This action cannot be undone.")) {
            await deleteArtwork(id);
        }
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await addArtwork({
            ...addFormData,
            artistId: Number(addFormData.artistId),
            categoryId: 1, // Default category
            isAvailable: true
        });
        if (success) {
            setIsAddModalOpen(false);
            setAddFormData({ title: "", description: "", artistId: "", type: "Painting", imageUrl: "", price: 0 });
        }
    };

    const handleRowClick = (art: Artwork) => {
        setSelectedArt(art);
        setIsEditModalOpen(true);
    };

    const handleUpdateSave = async (data: any) => {
        if (selectedArt) {
            await updateArtwork(selectedArt.id, data);
        }
    };

    const columns = [
        { 
            header: "ID", 
            accessor: (art: Artwork) => <span className="font-mono text-[10px]">{art.id}</span>,
            width: "50px"
        },
        { 
            header: "IMG", 
            accessor: (art: Artwork) => (
                art.imageUrl ? (
                    <img src={art.imageUrl} alt={art.title} className="w-5 h-5 object-cover rounded shadow-sm border border-[#4E5155]" />
                ) : (
                    <ImageIcon size={12} className="text-[#4E5155]" />
                )
            ),
            width: "35px"
        },
        { header: "TITLE", accessor: "title" },
        { 
            header: "ARTIST", 
            accessor: (art: Artwork) => art.artist ? `${art.artist.name} ${art.artist.surname}` : "N/A" 
        },
        { 
            header: "PRICE", 
            accessor: (art: Artwork) => <span className="font-mono">{art.price?.toLocaleString()}</span>,
            className: "text-right",
            width: "90px"
        },
        { 
            header: "STATUS", 
            accessor: (art: any) => (
                <span className={`text-[9px] px-1 rounded border border-[#4E5155] ${art.isAvailable !== false ? "bg-[#393B40] text-green-400" : "bg-[#2B2D30] text-[#4E5155] opacity-50"}`}>
                    {art.isAvailable !== false ? "AVAILABLE" : "SOLD/UNAVAILABLE"}
                </span>
            ),
            width: "100px"
        },
        { 
            header: "ACTIONS", 
            accessor: (art: Artwork) => (
                <div className="flex justify-center">
                    <button 
                        onClick={(e) => handleDelete(e, art.id)} 
                        className="text-[#4E5155] hover:text-red-400 p-0.5 transition-colors"
                        title="Delete Row"
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
                        placeholder="Search SQL..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-[#1E1F22] border border-[#4E5155] pl-8 pr-2 py-0.5 text-xs text-[#A8ADBD] focus:outline-none focus:border-[#3574F0] w-64"
                    />
                </div>
                
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#3574F0] text-white text-xs font-bold rounded-sm hover:bg-[#437EEB] transition-colors"
                >
                    <Plus size={14} /> Add New Row
                </button>

                <button 
                    onClick={() => refresh()}
                    className="p-1 hover:bg-[#393B40] rounded text-[#A8ADBD] hover:text-white transition-colors"
                    title="Refresh Table"
                >
                    <RotateCw size={14} />
                </button>

                {error && <div className="text-red-400 text-[10px] ml-auto uppercase font-bold">{error}</div>}
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-hidden p-2">
                <AdminTable 
                    columns={columns} 
                    data={filteredArtworks} 
                    isLoading={loading} 
                    onRowClick={handleRowClick}
                />
            </div>

            {/* Modals */}
            <EditArtModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                art={selectedArt}
                onSave={handleUpdateSave}
            />

            {/* Add New Row Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#1E1F22] border border-[#4E5155] w-full max-w-md shadow-2xl rounded-sm">
                        <div className="flex justify-between items-center px-4 py-2 border-b border-[#4E5155] bg-[#2B2D30]">
                            <span className="text-[10px] font-bold text-[#A8ADBD] uppercase tracking-wider">Insert New Artwork Row</span>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-[#A8ADBD] hover:text-white">
                                <X size={16} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[#4E5155] tracking-widest">Title</label>
                                <input
                                    required
                                    className="w-full bg-[#2B2D30] border border-[#4E5155] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3574F0] transition-colors"
                                    value={addFormData.title}
                                    onChange={e => setAddFormData({...addFormData, title: e.target.value})}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[#4E5155] tracking-widest">Artist</label>
                                    <select
                                        required
                                        className="w-full bg-[#2B2D30] border border-[#4E5155] px-2 py-2 text-sm text-white focus:outline-none focus:border-[#3574F0] transition-colors"
                                        value={addFormData.artistId}
                                        onChange={e => setAddFormData({...addFormData, artistId: e.target.value})}
                                    >
                                        <option value="">Select Artist</option>
                                        {artists.map(a => <option key={a.id} value={a.id}>{a.name} {a.surname}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-[#4E5155] tracking-widest">Price</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-[#2B2D30] border border-[#4E5155] px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#3574F0] transition-colors"
                                        value={addFormData.price}
                                        onChange={e => setAddFormData({...addFormData, price: Number(e.target.value)})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[#4E5155] tracking-widest">Image</label>
                                <ImageUpload 
                                    value={addFormData.imageUrl}
                                    onChange={url => setAddFormData({...addFormData, imageUrl: url})}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[#4E5155] tracking-widest">Description</label>
                                <textarea
                                    className="w-full bg-[#2B2D30] border border-[#4E5155] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#3574F0] h-24 resize-none transition-colors"
                                    value={addFormData.description}
                                    onChange={e => setAddFormData({...addFormData, description: e.target.value})}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[#4E5155]">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A8ADBD] hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-1.5 bg-[#3574F0] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#437EEB] transition-colors"
                                >
                                    Insert Row
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
