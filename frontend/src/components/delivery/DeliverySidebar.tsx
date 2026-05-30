"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import {
  LayoutDashboard, ShoppingBag, RotateCcw, Wallet,
  Send, DollarSign, Receipt, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const deliveryNav = [
  { title: "Dashboard", href: "/delivery/dashboard", icon: LayoutDashboard },
  { title: "My Deliveries", href: "/delivery/orders", icon: ShoppingBag },
  { title: "Return Pickups", href: "/delivery/returns", icon: RotateCcw },
  { title: "Withdrawals", href: "/delivery/withdrawals", icon: Wallet },
  { title: "Fund Transfers", href: "/delivery/transfers", icon: Send },
  { title: "Collected Cash", href: "/delivery/cash", icon: DollarSign },
  { title: "Earnings & Salary", href: "/delivery/salary", icon: Receipt },
];

export default function DeliverySidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={cn(
        "sidebar scrollbar-thin overflow-y-auto overflow-x-hidden transition-all duration-300 border-r border-teal-50",
        isSidebarCollapsed ? "w-16" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-teal-50">
        {!isSidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2.5">
            <div className="flex items-center justify-center">
              <Image src="/logo.png" alt="DSS Nexus" width={100} height={32} className="w-auto h-8 object-contain" priority />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Delivery Fleet</p>
            </div>
          </motion.div>
        )}
        <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="btn-icon ml-auto">
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2">
        {deliveryNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.title : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5",
                isActive
                  ? "text-teal-700 bg-teal-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                isSidebarCollapsed && "justify-center"
              )}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!isSidebarCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      {!isSidebarCollapsed && (
        <div className="border-t border-teal-50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || "D"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Delivery Agent"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || "delivery@dssnexus.com"}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
