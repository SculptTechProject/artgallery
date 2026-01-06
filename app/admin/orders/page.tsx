"use client";

import { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { Search, RotateCw, Loader2 } from "lucide-react";
import { getAllOrdersAdmin, type Order } from "@/lib/api";

const ITEMS_PER_PAGE = 50;

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await getAllOrdersAdmin();
        // Sortuj od najnowszych do najstarszych
        const sorted = [...data].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        setOrders(sorted);
        setFilteredOrders(sorted.slice(0, ITEMS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setFilteredOrders(orders.slice(startIndex, endIndex));
    } else {
      const filtered = orders.filter((order) => {
        const searchLower = searchQuery.toLowerCase();
        const email =
          order.user?.email || order.email || order.customerEmail || "";
        return (
          order.id.toString().toLowerCase().includes(searchLower) ||
          email.toLowerCase().includes(searchLower) ||
          order.date.toLowerCase().includes(searchLower)
        );
      });
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setFilteredOrders(filtered.slice(startIndex, endIndex));
    }
  }, [searchQuery, orders, currentPage]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await getAllOrdersAdmin();
      const sorted = [...data].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
      setOrders(sorted);
      setFilteredOrders(sorted.slice(0, ITEMS_PER_PAGE));
      setCurrentPage(1);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const allFilteredOrders = searchQuery
    ? orders.filter((order: any) => {
        const searchLower = searchQuery.toLowerCase();

        // 1. Bezpiecznie wyciągamy email (tak jak zrobiliśmy w kolumnach)
        const email =
          order.customer?.email || order.user?.email || order.email || "";

        // 2. Bezpiecznie wyciągamy datę (TO NAPRAWIA TWÓJ BŁĄD!)
        // Jeśli backend wysyła orderDate, bierzemy to. Jeśli nie ma nic, bierzemy pusty tekst "".
        const dateStr = order.orderDate || order.date || "";

        return (
          // Szukamy po ID
          order.id.toString().toLowerCase().includes(searchLower) ||
          // Szukamy po emailu
          email.toLowerCase().includes(searchLower) ||
          // Szukamy po dacie (bezpiecznie, bo dateStr to na pewno string)
          dateStr.toString().toLowerCase().includes(searchLower)
        );
      })
    : orders;

  const totalPages = Math.ceil(allFilteredOrders.length / ITEMS_PER_PAGE);
  const displayedOrders = filteredOrders;

  const columns = [
    { header: "ID", accessor: "id", width: "80px" },
    {
      header: "EMAIL KLIENTA",
      accessor: (order: any) => {
        // POPRAWKA: Dodaliśmy order.customer?.email
        return order.customer?.email || order.user?.email || "Gość";
      },
      width: "200px",
    },
    {
      header: "DATA",
      accessor: (order: any) => {
        // Tu jest fix: szukamy orderDate, a jak nie ma to date
        const dateStr = order.orderDate || order.date;
        if (!dateStr) return "Brak daty";

        try {
          return new Date(dateStr).toLocaleString("pl-PL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch {
          return "Błąd daty";
        }
      },
      className: "font-mono",
      width: "150px",
    },
    {
      header: "ILOŚĆ ELEMENTÓW",
      accessor: (order: any) => order.orderItems?.length || 0,
      className: "text-center",
      width: "120px",
    },
    {
      header: "SUMA",
      accessor: (order: any) =>
        `${(order.totalAmount ?? order.total ?? 0).toLocaleString(
          "pl-PL"
        )} PLN`,
      className: "text-right font-mono",
      width: "120px",
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
            placeholder="Filter orders..."
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
            ? `Znaleziono: ${filteredOrders.length}`
            : `Wszystkich: ${orders.length}`}
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-2">
        <AdminTable
          columns={columns}
          data={displayedOrders}
          isLoading={loading}
          pagination={{
            currentPage,
            totalPages: totalPages || 1,
            totalItems: allFilteredOrders.length,
            onPageChange: (page) => setCurrentPage(page),
          }}
        />
      </div>
    </div>
  );
}
