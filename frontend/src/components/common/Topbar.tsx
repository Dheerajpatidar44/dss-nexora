"use client";

import { Bell, Search, Menu, ChevronDown } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const { toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();

  const pageTitle = (pathname.split("/").pop() || "Dashboard").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-8 py-4 bg-[#faf8f5] md:bg-[#faf8f5]/80 backdrop-blur-md sticky top-0 z-20 gap-4 border-b border-gray-100 h-auto min-h-[76px]">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-lg hover:bg-gray-200 lg:hidden text-gray-600 transition-colors">
          <Menu size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 hidden md:block">{pageTitle}</h1>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
        <div className="relative flex-1 md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search stock, order, etc" 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
          />
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white shadow-xl rounded-xl border border-gray-100 z-50 py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-bold text-gray-900 text-sm">Notifications</p>
              </div>
              {[
                { title: "New order placed", desc: "Order #ORD-001 from John", time: "2m ago", type: "order" },
                { title: "New vendor registered", desc: "TechStore Ltd. needs approval", time: "15m ago", type: "vendor" },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 hover:bg-orange-50/50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.type === "order" ? "bg-emerald-500" : "bg-orange-500"
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2 mt-1">
                <Link href="/admin/notifications" className="text-[11px] text-orange-500 font-bold hover:underline">
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-300 cursor-pointer hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-orange-600 font-bold text-sm">{user?.name?.[0]?.toUpperCase() || "M"}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{user?.name || "Marcus George"}</p>
            <p className="text-[11px] text-gray-500">{user?.role === "admin" ? "Admin" : "Admin"}</p>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}
