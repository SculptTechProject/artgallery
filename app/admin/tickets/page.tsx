"use client";

import { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { Search, RotateCw, Loader2 } from "lucide-react";
import { getAllTicketsAdmin, type Ticket } from "@/lib/api";

const ITEMS_PER_PAGE = 50;

export default function TicketsAdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        const data = await getAllTicketsAdmin();
        // Sortuj od najnowszych do najstarszych
        const sorted = [...data].sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });
        setTickets(sorted);
        setFilteredTickets(sorted.slice(0, ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setFilteredTickets(tickets.slice(startIndex, endIndex));
    } else {
      const filtered = tickets.filter((ticket) => {
        const searchLower = searchQuery.toLowerCase();

        const email = ticket.email || ticket.user?.email || "";

        const id = ticket.id.toString();

        const exhibitionName = ticket.exhibition?.name || "";

        return (
          id.includes(searchLower) ||
          email.toLowerCase().includes(searchLower) ||
          exhibitionName.toLowerCase().includes(searchLower)
        );
      });

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setFilteredTickets(filtered.slice(startIndex, endIndex));
    }
  }, [searchQuery, tickets, currentPage]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await getAllTicketsAdmin();
      const sorted = [...data].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
      setTickets(sorted);
      setFilteredTickets(sorted.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error refreshing tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const allFilteredTickets = searchQuery
    ? tickets.filter((ticket: any) => {
        const searchLower = searchQuery.toLowerCase();

        const email = ticket.email || ticket.user?.email || "";

        const id = ticket.id.toString();

        const exhibitionName = ticket.exhibition?.name || "";

        return (
          email.toLowerCase().includes(searchLower) ||
          id.includes(searchLower) ||
          exhibitionName.toLowerCase().includes(searchLower)
        );
      })
    : tickets;

  const totalPages = Math.ceil(allFilteredTickets.length / ITEMS_PER_PAGE);
  const displayedTickets = filteredTickets;

  const columns = [
    {
      header: "ID",
      accessor: (ticket: any) => ticket.id,
    },
    {
      header: "WYSTAWA",
      accessor: (ticket: any) => ticket.exhibition?.name || "Brak danych",
    },
    {
      header: "DATA",
      accessor: (ticket: any) =>
        ticket.purchaseDate
          ? new Date(ticket.purchaseDate).toLocaleDateString("pl-PL")
          : "Brak daty",
    },
    {
      header: "TYP",
      accessor: (ticket: any) => ticket.type,
    },
    {
      header: "CENA",
      accessor: (ticket: any) => `${ticket.price} PLN`,
    },
    {
      header: "EMAIL",
      accessor: (ticket: any) => ticket.email,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="h-10 bg-[#2B2D30] border-b border-[#4E5155] flex items-center px-4 gap-4 flex-shrink-0">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-[#4E5155]"
          />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#1E1F22] border border-[#4E5155] pl-8 pr-2 py-0.5 text-xs focus:outline-none focus:border-[#3574F0] w-64 text-[#A8ADBD]"
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-1 hover:bg-[#393B40] rounded text-[#A8ADBD] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RotateCw size={14} />
          )}
        </button>
        <div className="ml-auto text-xs text-[#4E5155]">
          {searchQuery
            ? `Znaleziono: ${filteredTickets.length}`
            : `Wszystkich: ${tickets.length}`}
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-2">
        <AdminTable
          columns={columns}
          data={displayedTickets}
          isLoading={loading}
          pagination={{
            currentPage,
            totalPages: totalPages || 1,
            totalItems: allFilteredTickets.length,
            onPageChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
    </div>
  );
}
