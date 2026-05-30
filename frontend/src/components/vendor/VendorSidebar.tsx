"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import {
  LayoutDashboard, ShoppingCart, Package, Store,
  CircleDollarSign, Megaphone, BarChart3, Bell,
  Settings, LogOut, ChevronLeft, ChevronRight,
  Tag, CreditCard, FileText, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const vendorNav = [
  { title: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  { title: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { title: "Products", href: "/vendor/products", icon: Package },
  { title: "My Store", href: "/vendor/store", icon: Store },
  { title: "Wallet", href: "/vendor/wallet", icon: CircleDollarSign },
  { title: "Settlements", href: "/vendor/settlements", icon: CreditCard },
  { title: "Withdrawals", href: "/vendor/withdrawals", icon: FileText },
  { title: "Subscription", href: "/vendor/subscriptions", icon: Tag },
  { title: "Ad Campaigns", href: "/vendor/ad-campaigns", icon: Megaphone },
  { title: "Analytics", href: "/vendor/analytics", icon: BarChart3 },
  { title: "Reviews", href: "/vendor/reviews", icon: Star },
  { title: "Notifications", href: "/vendor/notifications", icon: Bell },
  { title: "Settings", href: "/vendor/settings", icon: Settings },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();

  return (
    <aside
      className={cn(
        "sidebar scrollbar-thin overflow-y-auto overflow-x-hidden transition-all duration-300",
        isSidebarCollapsed ? "w-16" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
        {!isSidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center">
              <span className="text-white font-black text-sm">V</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">DSS Nexus</p>
              <p className="text-xs text-gray-400 mt-0.5">Vendor Panel</p>
            </div>
          </motion.div>
        )}
        <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="btn-icon ml-auto">
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2">
        {vendorNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isSidebarCollapsed ? item.title : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5",
                isActive
                  ? "text-blue-700 bg-blue-50"
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
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full gradient-secondary flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
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
