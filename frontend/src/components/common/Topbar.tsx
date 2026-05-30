"use client";

import { Bell, Search, Menu, Sun, Moon } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import Link from "next/link";

interface TopbarProps {
  title?: string;
}

export default function Topbar({ title }: TopbarProps) {
  const { toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="btn-icon lg:hidden">
          <Menu size={18} />
        </button>
        {title && (
          <h1 className="font-semibold text-gray-900 text-sm hidden sm:block">{title}</h1>
        )}
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-sm mx-4 hidden md:block">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon relative"
          >
            <Bell size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 card shadow-xl z-50 py-2">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-semibold text-gray-900 text-sm">Notifications</p>
              </div>
              {[
                { title: "New order placed", desc: "Order #ORD-001 from John", time: "2m ago", type: "order" },
                { title: "New vendor registered", desc: "TechStore Ltd. needs approval", time: "15m ago", type: "vendor" },
                { title: "Withdrawal request", desc: "₹5,000 from Vendor A", time: "1h ago", type: "finance" },
              ].map((n, i) => (
                <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      n.type === "order" ? "bg-green-500" :
                      n.type === "vendor" ? "bg-blue-500" : "bg-orange-500"
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500">{n.desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2">
                <Link href="/admin/notifications" className="text-xs text-green-600 font-medium hover:underline">
                  View all notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xs cursor-pointer hover:ring-2 hover:ring-green-300 transition-all">
          {user?.name?.[0]?.toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}
