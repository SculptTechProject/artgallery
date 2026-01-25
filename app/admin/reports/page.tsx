"use client";

import { useEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Ticket,
  Image as ImageIcon,
  TrendingUp,
  Loader2,
  Download,
  Package,
  FileText,
  Filter,
} from "lucide-react";
import {
  getDashboardStats,
  getRevenueChartData,
  getTopExhibitions,
  type RevenueChartDataPoint,
} from "@/lib/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const REPORTS_BASE = `${API_BASE_URL}/api/v1/reports`;

const COLORS = [
  "#3574F0",
  "#62B543",
  "#E3AC00",
  "#B161E9",
  "#FF6B6B",
  "#4ECDC4",
];

interface DashboardStatsResponse {
  totalRevenue: number;
  totalOrders: number;
  ticketsSold: number;
  totalArts: number;
}

interface TopExhibitionResponse {
  exhibitionName: string;
  ticketCount: number;
  revenue: number;
}

type ReportKey = "sales" | "topExhibitions" | "inventory" | "orderForm";

type SaleType = "all" | "tickets" | "arts";

type TopExhibitionsSort = "revenue" | "tickets";

type InventoryGroupBy = "category" | "artist";

type ArtStatus = "all" | "available" | "sold" | "reserved" | "onExhibition";

interface InventoryGroupRow {
  groupName: string;
  artsCount: number;
  totalValue: number;
  avgPrice: number;
}

interface OrderReportItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OrderReportResponse {
  orderId: string;
  createdAt: string;
  status: string;
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
  currency?: string;
  subtotal: number;
  tax?: number;
  total: number;
  items: OrderReportItem[];
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueChartDataPoint[]>([]);
  const [topExhibitions, setTopExhibitions] = useState<TopExhibitionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [activeReport, setActiveReport] = useState<ReportKey>("sales");

  // Shared date range filters
  const [dateFrom, setDateFrom] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [dateTo, setDateTo] = useState<string>(() => new Date().toISOString().slice(0, 10));

  // Report 1: Sales chart filters
  const [saleType, setSaleType] = useState<SaleType>("all");

  // Report 2: Top exhibitions filters
  const [topSort, setTopSort] = useState<TopExhibitionsSort>("revenue");

  // Report 3: Inventory grouped filters
  const [inventoryGroupBy, setInventoryGroupBy] = useState<InventoryGroupBy>("category");
  const [artStatus, setArtStatus] = useState<ArtStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [inventoryRows, setInventoryRows] = useState<InventoryGroupRow[]>([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  // Report 4: Order form filters
  const [orderId, setOrderId] = useState<string>("");
  const [orderVariant, setOrderVariant] = useState<"receipt" | "invoice">("receipt");
  const [orderReport, setOrderReport] = useState<OrderReportResponse | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string>("");

  async function fetchInventory() {
    try {
      setInventoryLoading(true);
      const params = new URLSearchParams({
        dateFrom,
        dateTo,
        groupBy: inventoryGroupBy,
        status: artStatus,
      });
      if (categoryFilter.trim().length > 0) params.set("category", categoryFilter.trim());

      const res = await fetch(`${REPORTS_BASE}/inventory?${params.toString()}`);
      if (!res.ok) throw new Error(`Inventory report failed: ${res.status}`);
      const data = (await res.json()) as InventoryGroupRow[];
      setInventoryRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setInventoryRows([]);
    } finally {
      setInventoryLoading(false);
    }
  }

  async function fetchOrderReport() {
    if (!orderId.trim()) {
      setOrderError("Wpisz numer zamówienia.");
      setOrderReport(null);
      return;
    }

    try {
      setOrderError("");
      setOrderLoading(true);
      const params = new URLSearchParams({
        variant: orderVariant,
      });
      const res = await fetch(`${REPORTS_BASE}/order/${encodeURIComponent(orderId.trim())}?${params.toString()}`);
      if (!res.ok) throw new Error(`Order report failed: ${res.status}`);
      const data = (await res.json()) as OrderReportResponse;
      setOrderReport(data);
    } catch (e) {
      console.error(e);
      setOrderReport(null);
      setOrderError("Nie udało się pobrać raportu zamówienia. Sprawdź czy backend działa i czy numer zamówienia istnieje.");
    } finally {
      setOrderLoading(false);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        if (activeReport === "sales" || activeReport === "topExhibitions") {
          const [statsData, revenueDataResult, exhibitionsData] = await Promise.all([
            getDashboardStats(),
            getRevenueChartData({ dateFrom, dateTo, saleType } as any),
            getTopExhibitions({ dateFrom, dateTo, sort: topSort } as any),
          ]);
          setStats(statsData as any);
          setRevenueData(revenueDataResult);
          setTopExhibitions(exhibitionsData as any);
        }

        if (activeReport === "inventory") {
          await fetchInventory();
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeReport, dateFrom, dateTo, saleType, topSort, inventoryGroupBy, artStatus]);

  async function downloadPdf() {
    if (!reportRef.current) return;

    try {
      setPdfLoading(true);

      const [{ toPng }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const element = reportRef.current;

      const prevOverflow = element.style.overflow;
      const prevHeight = element.style.height;
      element.style.overflow = "visible";
      element.style.height = "auto";

      const imgData = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#111113",
        skipFonts: true,
        quality: 1,
      });

      element.style.overflow = prevOverflow;
      element.style.height = prevHeight;

      const img = new Image();
      img.src = imgData;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      const imgWidthPx = img.naturalWidth || element.scrollWidth * 2;
      const imgHeightPx = img.naturalHeight || element.scrollHeight * 2;

      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (imgHeightPx * imgWidth) / imgWidthPx;

      let y = 0;
      let remainingHeight = imgHeight;

      pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
      remainingHeight -= pageHeight;

      while (remainingHeight > 0) {
        pdf.addPage();
        y -= pageHeight;
        pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
        remainingHeight -= pageHeight;
      }

      const today = new Date();
      const fileName = `raporty_${today.toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setPdfLoading(false);
    }
  }

  const statsCards = [
    {
      label: "Przychód całkowity",
      value: stats?.totalRevenue
        ? `${stats.totalRevenue.toLocaleString("pl-PL")} PLN`
        : "0 PLN",
      icon: DollarSign,
      color: "text-[#3574F0]",
    },
    {
      label: "Ilość Zamówień",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "text-[#62B543]",
    },
    {
      label: "Sprzedane Bilety",
      value: stats?.ticketsSold ?? 0,
      icon: Ticket,
      color: "text-[#E3AC00]",
    },
    {
      label: "Ilość Dzieł",
      value: stats?.totalArts ?? 0,
      icon: ImageIcon,
      color: "text-[#B161E9]",
    },
  ];

  const pieData =
    topExhibitions && topExhibitions.length > 0
      ? topExhibitions.map((exhibition) => ({
          name: exhibition.exhibitionName || "Bez nazwy",
          value: exhibition.revenue || 0,
        }))
      : [];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#3574F0]" />
          <p className="text-[#A8ADBD]">Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-white">Raporty</h1>
        <button
          type="button"
          onClick={downloadPdf}
          disabled={pdfLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#4E5155] bg-[#1E1F22] text-white hover:bg-[#2B2D30] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pdfLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generowanie...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Pobierz PDF
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveReport("sales")}
          className={`px-3 py-2 rounded-lg border text-sm ${
            activeReport === "sales"
              ? "border-[#3574F0] bg-[#1E1F22] text-white"
              : "border-[#4E5155] bg-[#111113] text-[#A8ADBD] hover:bg-[#1E1F22]"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <TrendingUp size={16} />
            Sprzedaż (wykres)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReport("topExhibitions")}
          className={`px-3 py-2 rounded-lg border text-sm ${
            activeReport === "topExhibitions"
              ? "border-[#B161E9] bg-[#1E1F22] text-white"
              : "border-[#4E5155] bg-[#111113] text-[#A8ADBD] hover:bg-[#1E1F22]"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Ticket size={16} />
            Top wystawy (grupowanie)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReport("inventory")}
          className={`px-3 py-2 rounded-lg border text-sm ${
            activeReport === "inventory"
              ? "border-[#E3AC00] bg-[#1E1F22] text-white"
              : "border-[#4E5155] bg-[#111113] text-[#A8ADBD] hover:bg-[#1E1F22]"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <Package size={16} />
            Magazyn dzieł (grupowanie)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReport("orderForm")}
          className={`px-3 py-2 rounded-lg border text-sm ${
            activeReport === "orderForm"
              ? "border-[#62B543] bg-[#1E1F22] text-white"
              : "border-[#4E5155] bg-[#111113] text-[#A8ADBD] hover:bg-[#1E1F22]"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <FileText size={16} />
            Zamówienie (formularz)
          </span>
        </button>
      </div>

      {/* Report content to export */}
      <div ref={reportRef} className="space-y-6">
        {/* Shared filters bar (date range) for reports that use dates */}
        {(activeReport === "sales" || activeReport === "topExhibitions" || activeReport === "inventory") && (
          <div className="bg-zinc-900 border border-[#4E5155] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white">
              <Filter size={16} />
              <span className="font-bold">Filtry</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="text-sm text-[#A8ADBD] flex flex-col gap-1">
                Data od
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#111113] border border-[#4E5155] text-white"
                />
              </label>
              <label className="text-sm text-[#A8ADBD] flex flex-col gap-1">
                Data do
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#111113] border border-[#4E5155] text-white"
                />
              </label>

              {activeReport === "sales" && (
                <label className="text-sm text-[#A8ADBD] flex flex-col gap-1">
                  Typ sprzedaży
                  <select
                    value={saleType}
                    onChange={(e) => setSaleType(e.target.value as SaleType)}
                    className="px-3 py-2 rounded-lg bg-[#111113] border border-[#4E5155] text-white"
                  >
                    <option value="all">Wszystko</option>
                    <option value="tickets">Bilety</option>
                    <option value="arts">Dzieła</option>
                  </select>
                </label>
              )}

              {activeReport === "topExhibitions" && (
                <label className="text-sm text-[#A8ADBD] flex flex-col gap-1">
                  Sortowanie
                  <select
                    value={topSort}
                    onChange={(e) => setTopSort(e.target.value as TopExhibitionsSort)}
                    className="px-3 py-2 rounded-lg bg-[#111113] border border-[#4E5155] text-white"
                  >
                    <option value="revenue">Po przychodzie</option>
                    <option value="tickets">Po liczbie biletów</option>
                  </select>
                </label>
              )}

              {activeReport === "inventory" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:col-span-3">
                  <label className="text-sm text-[#A8ADBD] flex flex-col gap-1">
                    Grupuj po
                    <select
                      value={inventoryGroupBy}
                      onChange={(e) => setInventoryGroupBy(e.target.value as InventoryGroupBy)}
                      className="px-3 py-2 rounded-lg bg-[#111113] border border-[#4E5155] text-white"
                    >
                      <option value="category">Kategorii</option>
                      <option value="artist">Artyście</option>
                    </select>
                  </label>

                  <label className="text-sm text-[#A8ADBD] flex flex-col gap-1">
                    Status dzieła
                    <select
                      value={artStatus}
                      onChange={(e) => setArtStatus(e.target.value as ArtStatus)}
                      className="px-3 py-2 rounded-lg bg-[#111113] border border-[#4E5155] text-white"
                    >
                      <option value="all">Wszystkie</option>
                      <option value="available">Dostępne</option>
                      <option value="sold">Sprzedane</option>
                      <option value="reserved">Zarezerwowane</option>
                      <option value="onExhibition">Na wystawie</option>
                    </select>
                  </label>

                  <label className="text-sm text-[#A8ADBD] flex flex-col gap-1">
                    Kategoria (opcjonalnie)
                    <input
                      type="text"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      placeholder="np. Malarstwo"
                      className="px-3 py-2 rounded-lg bg-[#111113] border border-[#4E5155] text-white"
                    />
                  </label>

                  <div className="md:col-span-3">
                    <button
                      type="button"
                      onClick={fetchInventory}
                      disabled={inventoryLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#4E5155] bg-[#1E1F22] text-white hover:bg-[#2B2D30] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {inventoryLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Odświeżanie...
                        </>
                      ) : (
                        <>Odśwież raport magazynu</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Report 1: Sales chart (includes stats cards) */}
        {activeReport === "sales" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900 border border-[#4E5155] rounded-xl p-6 flex flex-col gap-3 shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-[#4E5155] uppercase tracking-widest">
                      {card.label}
                    </span>
                    <card.icon size={20} className={card.color} />
                  </div>
                  <div className="text-3xl font-mono font-bold text-white">{card.value}</div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 border border-[#4E5155] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={18} className="text-[#3574F0]" />
                <h2 className="text-lg font-bold text-white">Wykres Sprzedaży</h2>
              </div>
              {revenueData && revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3574F0" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3574F0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4E5155" />
                    <XAxis
                      dataKey="date"
                      stroke="#A8ADBD"
                      style={{ fontSize: "12px" }}
                      tickFormatter={(value) => {
                        try {
                          const date = new Date(value);
                          if (isNaN(date.getTime())) return value;
                          return date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
                        } catch {
                          return value;
                        }
                      }}
                    />
                    <YAxis
                      stroke="#A8ADBD"
                      style={{ fontSize: "12px" }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2B2D30",
                        border: "1px solid #4E5155",
                        borderRadius: "8px",
                        color: "#A8ADBD",
                      }}
                      formatter={(value: number) => [
                        `${(value || 0).toLocaleString("pl-PL")} PLN`,
                        "Przychód",
                      ]}
                      labelFormatter={(label) => {
                        try {
                          const date = new Date(label);
                          if (isNaN(date.getTime())) return label;
                          return date.toLocaleDateString("pl-PL", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          });
                        } catch {
                          return label;
                        }
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3574F0"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-[#4E5155]">
                  Brak danych do wyświetlenia
                </div>
              )}
            </div>
          </>
        )}

        {/* Report 2: Top exhibitions (grouping) */}
        {activeReport === "topExhibitions" && (
          <div className="bg-zinc-900 border border-[#4E5155] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-[#B161E9]" />
              <h2 className="text-lg font-bold text-white">Top Wystawy</h2>
            </div>

            {topExhibitions && topExhibitions.length > 0 && pieData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percent }) => (percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : "")}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2B2D30",
                          border: "1px solid #4E5155",
                          borderRadius: "8px",
                          color: "#A8ADBD",
                        }}
                        formatter={(value: number) => [
                          `${(value || 0).toLocaleString("pl-PL")} PLN`,
                          "Przychód",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-auto custom-scrollbar">
                  {topExhibitions.map((exhibition, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-[#1E1F22] rounded border border-[#4E5155]"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded flex-shrink-0"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span
                          className="text-sm text-[#A8ADBD] truncate max-w-[220px]"
                          title={exhibition.exhibitionName}
                        >
                          {exhibition.exhibitionName || "Bez nazwy"}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-bold text-white">
                        {(exhibition.revenue || 0).toLocaleString("pl-PL")} PLN
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-[#4E5155]">
                Brak danych do wyświetlenia
              </div>
            )}
          </div>
        )}

        {/* Report 3: Inventory grouped */}
        {activeReport === "inventory" && (
          <div className="bg-zinc-900 border border-[#4E5155] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package size={18} className="text-[#E3AC00]" />
              <h2 className="text-lg font-bold text-white">Raport magazynu dzieł</h2>
            </div>

            {inventoryLoading ? (
              <div className="h-[220px] flex items-center justify-center text-[#A8ADBD]">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Ładowanie...
              </div>
            ) : inventoryRows && inventoryRows.length > 0 ? (
              <div className="overflow-auto border border-[#4E5155] rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#1E1F22] text-[#A8ADBD]">
                    <tr>
                      <th className="text-left p-3">{inventoryGroupBy === "category" ? "Kategoria" : "Artysta"}</th>
                      <th className="text-right p-3">Liczba dzieł</th>
                      <th className="text-right p-3">Suma wartości</th>
                      <th className="text-right p-3">Średnia cena</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryRows.map((row, idx) => (
                      <tr key={idx} className="border-t border-[#4E5155]">
                        <td className="p-3 text-white">{row.groupName || "Bez nazwy"}</td>
                        <td className="p-3 text-right text-white font-mono">{row.artsCount ?? 0}</td>
                        <td className="p-3 text-right text-white font-mono">
                          {(row.totalValue || 0).toLocaleString("pl-PL")} PLN
                        </td>
                        <td className="p-3 text-right text-white font-mono">
                          {(row.avgPrice || 0).toLocaleString("pl-PL")} PLN
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-[#4E5155]">
                Brak danych do wyświetlenia
              </div>
            )}
          </div>
        )}

        {/* Report 4: Order form */}
        {activeReport === "orderForm" && (
          <div className="bg-zinc-900 border border-[#4E5155] rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#62B543]" />
              <h2 className="text-lg font-bold text-white">Raport zamówienia (formularz)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="text-sm text-[#A8ADBD] flex flex-col gap-1">
                Numer zamówienia
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="np. 1024"
                  className="px-3 py-2 rounded-lg bg-[#111113] border border-[#4E5155] text-white"
                />
              </label>

              <label className="text-sm text-[#A8ADBD] flex flex-col gap-1">
                Wariant
                <select
                  value={orderVariant}
                  onChange={(e) => setOrderVariant(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-[#111113] border border-[#4E5155] text-white"
                >
                  <option value="receipt">Paragon</option>
                  <option value="invoice">Faktura</option>
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={fetchOrderReport}
                  disabled={orderLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#4E5155] bg-[#1E1F22] text-white hover:bg-[#2B2D30] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {orderLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Pobieranie...
                    </>
                  ) : (
                    <>Generuj formularz</>
                  )}
                </button>
              </div>
            </div>

            {orderError && <div className="text-sm text-[#FF6B6B]">{orderError}</div>}

            {orderReport ? (
              <div className="border border-[#4E5155] rounded-xl p-6 bg-[#111113] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-white font-bold text-lg">Zamówienie #{orderReport.orderId}</div>
                    <div className="text-[#A8ADBD] text-sm">
                      Data: {new Date(orderReport.createdAt).toLocaleString("pl-PL")}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-[#A8ADBD]">Status: </span>
                    <span className="text-white font-bold">{orderReport.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-sm">
                    <div className="text-[#A8ADBD]">Klient</div>
                    <div className="text-white">{orderReport.customerName || "—"}</div>
                    <div className="text-[#A8ADBD]">{orderReport.customerEmail || ""}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-[#A8ADBD]">Płatność</div>
                    <div className="text-white">{orderReport.paymentMethod || "—"}</div>
                    <div className="text-[#A8ADBD]">Waluta: {orderReport.currency || "PLN"}</div>
                  </div>
                </div>

                <div className="overflow-auto border border-[#4E5155] rounded-lg">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#1E1F22] text-[#A8ADBD]">
                      <tr>
                        <th className="text-left p-3">Pozycja</th>
                        <th className="text-right p-3">Ilość</th>
                        <th className="text-right p-3">Cena</th>
                        <th className="text-right p-3">Suma</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderReport.items.map((it, idx) => (
                        <tr key={idx} className="border-t border-[#4E5155]">
                          <td className="p-3 text-white">{it.name}</td>
                          <td className="p-3 text-right text-white font-mono">{it.quantity}</td>
                          <td className="p-3 text-right text-white font-mono">
                            {(it.unitPrice || 0).toLocaleString("pl-PL")} PLN
                          </td>
                          <td className="p-3 text-right text-white font-mono">
                            {(it.total || 0).toLocaleString("pl-PL")} PLN
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col items-end gap-1 text-sm">
                  <div>
                    <span className="text-[#A8ADBD]">Suma częściowa: </span>
                    <span className="text-white font-mono">{(orderReport.subtotal || 0).toLocaleString("pl-PL")} PLN</span>
                  </div>
                  {typeof orderReport.tax === "number" && (
                    <div>
                      <span className="text-[#A8ADBD]">Podatek: </span>
                      <span className="text-white font-mono">{(orderReport.tax || 0).toLocaleString("pl-PL")} PLN</span>
                    </div>
                  )}
                  <div className="text-base">
                    <span className="text-[#A8ADBD]">Razem: </span>
                    <span className="text-white font-mono font-bold">{(orderReport.total || 0).toLocaleString("pl-PL")} PLN</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-[#4E5155]">Wypełnij numer zamówienia i kliknij „Generuj formularz”.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
