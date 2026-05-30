"use client";

import PageHeader from "@/components/common/PageHeader";
import { Bell, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const mockNotifs = [
  { id: 1, title: "New Order Assigned", body: "Order ORD-2025-001 has been placed and is pending store confirmation.", time: "2 min ago", type: "order" },
  { id: 2, title: "Payout completed", body: "Automatic weekly settlement of ₹8,450 deposited to State Bank of India account.", time: "1 hour ago", type: "payment" },
];

export default function VendorNotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Store Notifications" subtitle="Notifications and critical updates regarding store dashboard" />

      <div className="space-y-2">
        {mockNotifs.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card p-4 flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Bell size={16} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.body}</p>
              <span className="text-[10px] text-gray-400 block pt-1">{item.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
