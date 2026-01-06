"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import {
  getDashboardStats,
  getRevenueChartData,
  getTopExhibitions,
  // Upewnij się, że te typy w api.ts też mają odpowiednie pola!
  type DashboardStats,
  type RevenueChartDataPoint,
  type TopExhibition,
} from "@/lib/api";

const COLORS = [
  "#3574F0",
  "#62B543",
  "#E3AC00",
  "#B161E9",
  "#FF6B6B",
  "#4ECDC4",
];

// Definicja interfejsów LOKALNIE, żebyś miał pewność, że pasują do Backendu
// (W idealnym świecie powinny być w types.ts/api.ts)
interface DashboardStatsResponse {
  totalRevenue: number;
  totalOrders: number;
  ticketsSold: number;
  totalArts: number; // Backend wysyła to, a nie artworksCount
}

interface TopExhibitionResponse {
  exhibitionName: string; // Backend wysyła to, a nie title
  ticketCount: number;
  revenue: number;
}

export default function ReportsPage() {
  // Używamy any lub poprawionych typów, żeby TypeScript nie krzyczał na mismatch
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueChartDataPoint[]>([]);
  const [topExhibitions, setTopExhibitions] = useState<TopExhibitionResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Rzutujemy na any przy pobieraniu, żeby ominąć błędy typowania starego api.ts
        const [statsData, revenueDataResult, exhibitionsData] =
          await Promise.all([
            getDashboardStats(),
            getRevenueChartData(),
            getTopExhibitions(),
          ]);
        setStats(statsData as any);
        setRevenueData(revenueDataResult);
        setTopExhibitions(exhibitionsData as any);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
      // FIX 1: Zmieniono stats?.artworksCount na stats?.totalArts
      value: stats?.totalArts ?? 0,
      icon: ImageIcon,
      color: "text-[#B161E9]",
    },
  ];

  // FIX 2: Zmieniono exhibition.title na exhibition.exhibitionName
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
          <p className="text-[#A8ADBD]">Ładowanie raportów...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
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
            <div className="text-3xl font-mono font-bold text-white">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2 bg-zinc-900 border border-[#4E5155] rounded-xl p-6">
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
                      return date.toLocaleDateString("pl-PL", {
                        day: "2-digit",
                        month: "2-digit",
                      });
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

        {/* Top Exhibitions - Takes 1 column */}
        <div className="bg-zinc-900 border border-[#4E5155] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-[#B161E9]" />
            <h2 className="text-lg font-bold text-white">Top Wystawy</h2>
          </div>
          {topExhibitions && topExhibitions.length > 0 && pieData.length > 0 ? (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    // Wyświetlanie procentów na wykresie
                    label={({ name, percent }) =>
                      percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : ""
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
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
              <div className="space-y-2 mt-4 max-h-[300px] overflow-auto custom-scrollbar">
                {topExhibitions.map((exhibition, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-[#1E1F22] rounded border border-[#4E5155]"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded flex-shrink-0"
                        style={{
                          backgroundColor: COLORS[idx % COLORS.length],
                        }}
                      />
                      {/* FIX 3: Tutaj też używamy exhibitionName */}
                      <span
                        className="text-sm text-[#A8ADBD] truncate max-w-[150px]"
                        title={exhibition.exhibitionName}
                      >
                        {exhibition.exhibitionName || "Bez nazwy"}
                      </span>
                    </div>
                    <span className="text-sm font-mono font-bold text-white">
                      {(exhibition.revenue || 0).toLocaleString("pl-PL")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-[#4E5155]">
              Brak danych do wyświetlenia
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
