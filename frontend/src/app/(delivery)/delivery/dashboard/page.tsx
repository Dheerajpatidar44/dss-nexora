"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Compass, MapPin, Phone, CheckCircle2, Navigation,
  ShieldCheck, AlertTriangle, Coins, Award
} from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";

export default function DeliveryDashboardPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [activeStep, setActiveStep] = useState(0); // 0: Pick up, 1: Arrived, 2: Out for delivery, 3: Completed

  const steps = [
    { label: "Accept Order", desc: "Confirm acceptance" },
    { label: "Reach Store", desc: "Pick up the order items" },
    { label: "Deliver items", desc: "Deliver to customer location" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Toggle */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-teal-50 shadow-xs flex-wrap gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Duty Status</h2>
          <p className="text-xs text-gray-400">Receive new delivery orders instantly</p>
        </div>
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md ${
            isOnline
              ? "bg-teal-600 hover:bg-teal-700 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-300 animate-ping" : "bg-gray-400"}`} />
          {isOnline ? "ONLINE" : "OFFLINE"}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Orders" value="6 / 8" icon={Compass} bg="bg-teal-50" iconColor="text-teal-600" />
        <StatCard title="Today's Earnings" value="₹1,240" icon={Coins} bg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Cash collected" value="₹3,450" icon={Coins} bg="bg-orange-50" iconColor="text-orange-600" />
        <StatCard title="Agent Rating" value="4.9 ★" icon={Award} bg="bg-yellow-50" iconColor="text-yellow-600" />
      </div>

      {/* Active Task / Delivery Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 border-l-4 border-teal-500"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div>
            <span className="badge badge-blue">Active Task</span>
            <p className="text-sm font-black text-gray-900 mt-1">ORD-2025-4512</p>
          </div>
          <span className="text-xs font-semibold text-teal-600">30 Min Delivery</span>
        </div>

        {/* Locations */}
        <div className="space-y-4 relative pl-5 border-l-2 border-dashed border-gray-200 ml-2">
          {/* Store Location */}
          <div className="relative">
            <div className="absolute -left-7 top-0.5 bg-teal-500 w-3 h-3 rounded-full border-2 border-white" />
            <p className="text-xs text-gray-400 font-medium">PICKUP FROM</p>
            <p className="text-sm font-bold text-gray-900">FreshMart Express Store</p>
            <p className="text-xs text-gray-500">Andheri West, Mumbai</p>
          </div>

          {/* Customer Location */}
          <div className="relative">
            <div className="absolute -left-7 top-0.5 bg-orange-500 w-3 h-3 rounded-full border-2 border-white" />
            <p className="text-xs text-gray-400 font-medium">DELIVER TO</p>
            <p className="text-sm font-bold text-gray-900">Karan Malhotra</p>
            <p className="text-xs text-gray-500">Flat 402, Sunset Heights, Mumbai</p>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <a
            href="tel:+919876543210"
            className="btn-secondary py-3 flex items-center justify-center gap-2 text-sm font-bold rounded-xl"
          >
            <Phone size={16} />
            Call Customer
          </a>
          <button
            onClick={() => setActiveStep((s) => Math.min(s + 1, steps.length - 1))}
            className="btn-primary bg-teal-600 hover:bg-teal-700 py-3 flex items-center justify-center gap-2 text-sm font-bold rounded-xl shadow-md"
          >
            <Navigation size={16} />
            {steps[activeStep].label}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
