"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
    width?: string;
}

interface AdminTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    onRowClick?: (item: T) => void;
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        onPageChange: (page: number) => void;
    };
}

export default function AdminTable<T extends { id: string | number }>({ 
    columns, 
    data, 
    isLoading,
    onRowClick,
    pagination
}: AdminTableProps<T>) {
    return (
        <div className="flex flex-col h-full bg-[#1E1F22] border border-[#4E5155]">
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse text-xs text-[#A8ADBD]">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#393B40] border-b border-[#4E5155]">
                            {columns.map((col, idx) => (
                                <th 
                                    key={idx}
                                    style={{ width: col.width }}
                                    className="px-2 py-1.5 text-left font-bold border-r border-[#4E5155] last:border-r-0"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center">
                                    Loading data...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-[#4E5155]">
                                    No rows to display
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr 
                                    key={item.id} 
                                    onClick={() => onRowClick?.(item)}
                                    className={`border-b border-[#4E5155] hover:bg-[#2F333D] transition-colors group ${onRowClick ? "cursor-pointer" : ""}`}
                                >
                                    {columns.map((col, idx) => (
                                        <td 
                                            key={idx}
                                            className={`px-2 py-1 border-r border-[#4E5155] last:border-r-0 ${col.className || ""}`}
                                        >
                                            {typeof col.accessor === "function" 
                                                ? col.accessor(item) 
                                                : (item[col.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="h-8 bg-[#2B2D30] border-t border-[#4E5155] flex items-center justify-between px-4 text-[10px] uppercase tracking-wider font-bold">
                <div className="flex items-center gap-4">
                    <span>
                        {pagination 
                            ? `Total: ${pagination.totalItems} rows`
                            : `Total: ${data.length} rows`}
                    </span>
                </div>
                {pagination && (
                    <div className="flex items-center gap-2">
                        <span className="text-[#4E5155]">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <div className="flex gap-0.5 ml-2">
                            <button
                                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="p-0.5 hover:bg-[#393B40] rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="p-0.5 hover:bg-[#393B40] rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
                {!pagination && (
                    <div className="flex items-center gap-2">
                        <span className="text-[#4E5155]">Page 1 of 1</span>
                        <div className="flex gap-0.5 ml-2">
                            <button className="p-0.5 hover:bg-[#393B40] rounded disabled:opacity-30" disabled>
                                <ChevronLeft size={14} />
                            </button>
                            <button className="p-0.5 hover:bg-[#393B40] rounded disabled:opacity-30" disabled>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
