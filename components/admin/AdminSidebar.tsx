"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Table,
  Users,
  ShoppingCart,
  Ticket,
  LogOut,
  Database,
  BarChart3,
  GalleryVertical,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutGrid },
  { name: "Obrazy", href: "/admin/arts", icon: Table },
  { name: "Artyści", href: "/admin/artists", icon: Users },
  { name: "Zamówienia", href: "/admin/orders", icon: ShoppingCart },
  { name: "Bilety", href: "/admin/tickets", icon: Ticket },
  { name: "Wystawy", href: "/admin/exhibitions", icon: GalleryVertical },
  { name: "Raporty", href: "/admin/reports", icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_jwt");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full py-4 text-[#A8ADBD] font-sans">
      <div className="px-4 mb-6 flex items-center gap-2">
        <Database size={20} className="text-[#4E5155]" />
        <span className="font-bold text-sm tracking-tight text-white">
          DataGrip Gallery
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                                flex items-center gap-3 px-4 py-1.5 text-sm transition-colors
                                ${
                                  isActive
                                    ? "bg-[#4E5155] text-white"
                                    : "hover:bg-[#393B40]"
                                }
                            `}
            >
              <item.icon
                size={16}
                className={isActive ? "text-white" : "text-[#A8ADBD]"}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#393B40] transition-colors border-t border-[#4E5155] pt-4"
      >
        <LogOut size={16} />
        Wyloguj
      </button>
    </div>
  );
}
