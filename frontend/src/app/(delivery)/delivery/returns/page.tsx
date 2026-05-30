"use client";

import { motion } from "framer-motion";
import { RotateCcw, MapPin, CheckCircle, Package } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";

const mockReturns = [
  { id: "RET-004", customer: "Sneha Patel", store: "FreshMart Express", address: "Flat 502, Orchid Towers, Mumbai", reason: "Damaged item during delivery", date: "Today" },
];

export default function DeliveryReturnsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Return Pickups" subtitle="Assigned customer return pickups and store dropoffs" />

      <div className="space-y-3">
        {mockReturns.length > 0 ? (
          mockReturns.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <RotateCcw size={16} className="text-orange-500" />
                  <span className="font-mono text-xs font-bold text-gray-900">{item.id}</span>
                </div>
                <span className="badge badge-orange">Assigned</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-black text-gray-900">{item.customer}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin size={12} className="text-gray-400" />
                  <span>{item.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Package size={12} className="text-gray-400" />
                  <span>Return to Store: {item.store}</span>
                </div>
              </div>

              <div className="bg-orange-50/50 p-3 rounded-lg border border-orange-100/50">
                <p className="text-xs font-semibold text-orange-700">Reason: {item.reason}</p>
              </div>

              <button className="w-full btn-primary bg-teal-600 hover:bg-teal-700 py-3 font-bold text-sm rounded-xl">
                Confirm Pickup
              </button>
            </motion.div>
          ))
        ) : (
          <div className="card p-12 text-center text-gray-400 font-medium">
            No active return pickup requests.
          </div>
        )}
      </div>
    </div>
  );
}
