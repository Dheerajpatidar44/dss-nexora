"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MapPin, Calendar, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

const mockDeliveries = [
  { id: "ORD-2025-102", store: "FreshMart Express", customer: "Amit Sharma", address: "Flat 102, Green Meadows, Mumbai", status: "pending", time: "10m ago", distance: "2.4 km" },
  { id: "ORD-2025-101", store: "BakeryWorld", customer: "Rohit Verma", address: "Sector 4, Plot 12, Navi Mumbai", status: "completed", time: "2h ago", distance: "5.1 km" },
  { id: "ORD-2025-099", store: "MeatMaster", customer: "Neha Sen", address: "Block B-504, Heights, Mumbai", status: "completed", time: "Yesterday", distance: "3.8 km" },
];

export default function DeliveryOrdersPage() {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  const activeDeliveries = mockDeliveries.filter((d) => d.status === "pending");
  const historyDeliveries = mockDeliveries.filter((d) => d.status === "completed");

  const currentList = activeTab === "active" ? activeDeliveries : historyDeliveries;

  return (
    <div className="space-y-6">
      <PageHeader title="My Deliveries" subtitle="Manage your active shipments and pickup runs" />

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-teal-50 max-w-sm">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "active" ? "bg-teal-50 text-teal-700" : "text-gray-500"
          }`}
        >
          Active Deliveries ({activeDeliveries.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "history" ? "bg-teal-50 text-teal-700" : "text-gray-500"
          }`}
        >
          Delivery History ({historyDeliveries.length})
        </button>
      </div>

      {/* Order List */}
      <div className="space-y-3">
        {currentList.length > 0 ? (
          currentList.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card p-4 flex items-center justify-between hover:shadow-md transition-all cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-gray-900">{item.id}</span>
                  <span className={`badge ${item.status === "pending" ? "badge-orange" : "badge-green"}`}>
                    {item.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{item.store}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin size={12} className="text-gray-400" />
                    <span>To: {item.customer} ({item.address})</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                  <span>Distance: {item.distance}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </motion.div>
          ))
        ) : (
          <div className="card p-12 text-center text-gray-400 font-medium">
            No deliveries found in this section.
          </div>
        )}
      </div>
    </div>
  );
}
