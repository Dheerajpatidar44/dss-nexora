"use client";

import { useState } from "react";
import { ChevronDown, RefreshCw, AlertTriangle, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function DispatchManagement() {
  const [showAlert, setShowAlert] = useState(true);
  const [activeTab, setActiveTab] = useState("Riders on Delivery");

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2d3136] font-sans -mt-6 -mx-6 p-4 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Dispatch Management</h1>
          <div className="text-sm text-[#FF6900] flex items-center gap-2 mt-1">
            <Link href="/admin/dashboard" className="hover:underline">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">Dispatch Management</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6900]/20 focus:border-[#FF6900]">
              <option>All Zones</option>
              <option>Bhuj</option>
              <option>Delhi</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-sm text-gray-500">20s</span>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#FF6900]/30 text-[#FF6900] rounded-md text-sm font-medium hover:bg-[#FF6900] hover:text-white transition-colors group">
            <RefreshCw size={14} className="group-hover:animate-spin-once" /> Refresh
          </button>
        </div>
      </div>

      {/* Alert */}
      {showAlert && (
        <div className="bg-red-50/80 border border-red-100 rounded-md p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-700">
            <AlertTriangle size={18} className="text-gray-600" />
            <span className="text-[15px]">20 order(s) waiting for rider assignment for over 15 minutes!</span>
          </div>
          <button onClick={() => setShowAlert(false)} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Row 1 */}
        <StatCard title="ACTIVE RIDERS" value="1" titleColor="text-emerald-500" />
        <StatCard title="ON DELIVERY" value="1" titleColor="text-blue-500" />
        <StatCard title="IDLE RIDERS" value="0" titleColor="text-amber-500" />
        <StatCard title="UNASSIGNED ORDERS" value="20" titleColor="text-red-500" />
        
        {/* Row 2 */}
        <StatCard title="READY FOR PICKUP" value="16" titleColor="text-orange-500" />
        <StatCard title="ONGOING DELIVERIES" value="9" titleColor="text-[#FF6900]" />
        <StatCard title="DELIVERED TODAY" value="0" titleColor="text-emerald-500" />
        <StatCard title="AVG. ASSIGNMENT TIME" value="0" unit="min" titleColor="text-gray-400" />
        
        {/* Row 3 */}
        <StatCard title="DROPS TODAY" value="0" titleColor="text-red-500" />
      </div>

      {/* Chart Section */}
      <div className="bg-white border border-gray-200 rounded-md mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-[15px] font-semibold text-gray-700">Hourly Delivery Performance</h2>
        </div>
        <div className="px-6 pt-6 pb-0">
          {/* Chart plot area */}
          <div className="relative h-[180px]">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between text-xs text-gray-400 text-right">
              <span>2</span>
              <span>1</span>
              <span>0</span>
            </div>
            {/* Grid lines */}
            <div className="absolute inset-x-8 top-0 border-t border-dashed border-gray-200"></div>
            <div className="absolute inset-x-8 top-1/2 border-t border-dashed border-gray-200"></div>
            <div className="absolute inset-x-8 bottom-0 border-t border-gray-300"></div>
          </div>
          {/* X-axis time labels — always below the baseline */}
          <div className="pl-8 flex justify-between text-xs text-gray-400 mt-2 pb-4">
            {["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00"].map((time) => (
              <span key={time}>{time}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Table Area */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-md">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-4 pt-4 pb-0 gap-6">
            <Tab 
              title="Riders on Delivery" 
              count={1} 
              active={activeTab === "Riders on Delivery"} 
              onClick={() => setActiveTab("Riders on Delivery")}
              badgeColor="bg-[#FF6900]/10 text-[#FF6900]"
            />
            <Tab 
              title="Unassigned Orders" 
              count={20} 
              active={activeTab === "Unassigned Orders"} 
              onClick={() => setActiveTab("Unassigned Orders")}
              badgeColor="bg-red-100 text-red-600"
            />
            <Tab 
              title="Ready for Pickup" 
              count={16} 
              active={activeTab === "Ready for Pickup"} 
              onClick={() => setActiveTab("Ready for Pickup")}
              badgeColor="bg-amber-100 text-amber-600"
            />
          </div>

          {/* Filters */}
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none">
                  <option>All Payment Types</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none">
                  <option>All Time</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <label className="flex items-center gap-2 text-[15px] text-gray-600 cursor-pointer ml-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#FF6900] focus:ring-[#FF6900]" />
                Stale Only ({'>'}15 min)
              </label>
            </div>
          </div>
          
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-[15px] text-gray-600">
              Show
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-sm focus:outline-none">
                  <option>10</option>
                  <option>25</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              per page
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6900]/20 focus:border-[#FF6900] w-full md:w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-3 mx-1 px-3">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white border-b border-gray-200 text-gray-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">Rider Name</th>
                  <th className="px-4 py-3">Rider Phone</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Order Status</th>
                  <th className="px-4 py-3">Store(s)</th>
                  <th className="px-4 py-3">
                    <div className="flex items-center gap-1 cursor-pointer">
                      Assigned At <span className="text-gray-400 text-xs">▼</span>
                    </div>
                  </th>
                  <th className="px-4 py-3">Elapsed Time</th>
                  <th className="px-4 py-3">Zone</th>
                  <th className="px-4 py-3">Last GPS Update</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">2886</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#FF6900]/10 text-[#FF6900] px-2.5 py-1 rounded-md text-xs font-semibold">Out For Delivery</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">Bhuj Bus St. st...</td>
                  <td className="px-4 py-4 text-gray-600">25 May 2026, 03:42 PM</td>
                  <td className="px-4 py-4 text-gray-600">6 days</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">1877</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-semibold">Delivered</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">City Square M...</td>
                  <td className="px-4 py-4 text-gray-600">28 Feb 2026, 05:41 PM</td>
                  <td className="px-4 py-4 text-gray-600">3 months</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                 <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">2886</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#FF6900]/10 text-[#FF6900] px-2.5 py-1 rounded-md text-xs font-semibold">Out For Delivery</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">Bhuj Bus St. st...</td>
                  <td className="px-4 py-4 text-gray-600">25 May 2026, 03:42 PM</td>
                  <td className="px-4 py-4 text-gray-600">6 days</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">1877</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-semibold">Delivered</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">City Square M...</td>
                  <td className="px-4 py-4 text-gray-600">28 Feb 2026, 05:41 PM</td>
                  <td className="px-4 py-4 text-gray-600">3 months</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                 <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">2886</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#FF6900]/10 text-[#FF6900] px-2.5 py-1 rounded-md text-xs font-semibold">Out For Delivery</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">Bhuj Bus St. st...</td>
                  <td className="px-4 py-4 text-gray-600">25 May 2026, 03:42 PM</td>
                  <td className="px-4 py-4 text-gray-600">6 days</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">1877</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-semibold">Delivered</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">City Square M...</td>
                  <td className="px-4 py-4 text-gray-600">28 Feb 2026, 05:41 PM</td>
                  <td className="px-4 py-4 text-gray-600">3 months</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                 <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">2886</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#FF6900]/10 text-[#FF6900] px-2.5 py-1 rounded-md text-xs font-semibold">Out For Delivery</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">Bhuj Bus St. st...</td>
                  <td className="px-4 py-4 text-gray-600">25 May 2026, 03:42 PM</td>
                  <td className="px-4 py-4 text-gray-600">6 days</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">1877</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-semibold">Delivered</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">City Square M...</td>
                  <td className="px-4 py-4 text-gray-600">28 Feb 2026, 05:41 PM</td>
                  <td className="px-4 py-4 text-gray-600">3 months</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                 <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">2886</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#FF6900]/10 text-[#FF6900] px-2.5 py-1 rounded-md text-xs font-semibold">Out For Delivery</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">Bhuj Bus St. st...</td>
                  <td className="px-4 py-4 text-gray-600">25 May 2026, 03:42 PM</td>
                  <td className="px-4 py-4 text-gray-600">6 days</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">1877</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-semibold">Delivered</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">City Square M...</td>
                  <td className="px-4 py-4 text-gray-600">28 Feb 2026, 05:41 PM</td>
                  <td className="px-4 py-4 text-gray-600">3 months</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                 <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">2886</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#FF6900]/10 text-[#FF6900] px-2.5 py-1 rounded-md text-xs font-semibold">Out For Delivery</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">Bhuj Bus St. st...</td>
                  <td className="px-4 py-4 text-gray-600">25 May 2026, 03:42 PM</td>
                  <td className="px-4 py-4 text-gray-600">6 days</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">1877</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-semibold">Delivered</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">City Square M...</td>
                  <td className="px-4 py-4 text-gray-600">28 Feb 2026, 05:41 PM</td>
                  <td className="px-4 py-4 text-gray-600">3 months</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                 <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">2886</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#FF6900]/10 text-[#FF6900] px-2.5 py-1 rounded-md text-xs font-semibold">Out For Delivery</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">Bhuj Bus St. st...</td>
                  <td className="px-4 py-4 text-gray-600">25 May 2026, 03:42 PM</td>
                  <td className="px-4 py-4 text-gray-600">6 days</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">1877</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-semibold">Delivered</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">City Square M...</td>
                  <td className="px-4 py-4 text-gray-600">28 Feb 2026, 05:41 PM</td>
                  <td className="px-4 py-4 text-gray-600">3 months</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                 <tr className="border-b border-gray-100 bg-gray-50/50">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">2886</td>
                  <td className="px-4 py-4">
                    <span className="bg-[#FF6900]/10 text-[#FF6900] px-2.5 py-1 rounded-md text-xs font-semibold">Out For Delivery</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">Bhuj Bus St. st...</td>
                  <td className="px-4 py-4 text-gray-600">25 May 2026, 03:42 PM</td>
                  <td className="px-4 py-4 text-gray-600">6 days</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-4 font-medium text-gray-800">Monica</td>
                  <td className="px-4 py-4 text-gray-600"></td>
                  <td className="px-4 py-4 text-gray-800">1877</td>
                  <td className="px-4 py-4">
                    <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-semibold">Delivered</span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">City Square M...</td>
                  <td className="px-4 py-4 text-gray-600">28 Feb 2026, 05:41 PM</td>
                  <td className="px-4 py-4 text-gray-600">3 months</td>
                  <td className="px-4 py-4 text-gray-600">Bhuj</td>
                  <td className="px-4 py-4 text-gray-600">01 Jun, 05:52 AM</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="p-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-200">
            <span>1-2 of 2</span>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">←</button>
              <button className="px-3 py-1.5 border border-[#FF6900] bg-[#FF6900]/10 text-[#FF6900] rounded-md font-medium">1</button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-400 bg-gray-50 cursor-not-allowed">→</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar Lists */}
        <div className="space-y-6">
          {/* Zone Rider Availability */}
          <div className="bg-white border border-gray-200 rounded-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-[15px] font-semibold text-gray-700">Zone Rider Availability</h3>
            </div>
                      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="w-full text-left text-[13px] whitespace-nowrap">
                <thead className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="px-4 py-3">ZONE</th>
                    <th className="px-4 py-3 text-center">TOTAL RIDERS</th>
                    <th className="px-4 py-3 text-center">ACTIVE RIDERS</th>
                    <th className="px-4 py-3 text-center">ON DELIVERY</th>
                    <th className="px-4 py-3 text-center">IDLE RIDERS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-red-50/50 border-b border-gray-100 text-red-500 font-medium">
                    <td className="px-4 py-2.5">Bhuj</td>
                    <td className="px-4 py-2.5 text-center">2</td>
                    <td className="px-4 py-2.5 text-center">1</td>
                    <td className="px-4 py-2.5 text-center">1</td>
                    <td className="px-4 py-2.5 text-center text-red-500">0</td>
                  </tr>
                  <tr className="border-b border-gray-100 text-gray-600">
                    <td className="px-4 py-2.5">Anjar Zone</td>
                    <td className="px-4 py-2.5 text-center">3</td>
                    <td className="px-4 py-2.5 text-center">0</td>
                    <td className="px-4 py-2.5 text-center">0</td>
                    <td className="px-4 py-2.5 text-center text-red-500">0</td>
                  </tr>
                  <tr className="border-b border-gray-100 text-gray-600">
                    <td className="px-4 py-2.5">delhi</td>
                    <td className="px-4 py-2.5 text-center">66</td>
                    <td className="px-4 py-2.5 text-center">0</td>
                    <td className="px-4 py-2.5 text-center">0</td>
                    <td className="px-4 py-2.5 text-center text-red-500">0</td>
                  </tr>
                  <tr className="border-b border-gray-100 text-gray-600">
                    <td className="px-4 py-2.5">San Francisco</td>
                    <td className="px-4 py-2.5 text-center">3</td>
                    <td className="px-4 py-2.5 text-center">0</td>
                    <td className="px-4 py-2.5 text-center">0</td>
                    <td className="px-4 py-2.5 text-center text-red-500">0</td>
                  </tr>
                  <tr className="text-gray-600">
                    <td className="px-4 py-2.5">Ahemdabad</td>
                    <td className="px-4 py-2.5 text-center">27</td>
                    <td className="px-4 py-2.5 text-center">0</td>
                    <td className="px-4 py-2.5 text-center">0</td>
                    <td className="px-4 py-2.5 text-center text-red-500">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-md">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-[15px] font-semibold text-gray-700">Recent Activity</h3>
            </div>
            <div className="max-h-[300px] overflow-y-auto scrollbar-thin">
              <div className="flex justify-between items-start p-4 border-b border-gray-100 text-[13px]">
                <span className="text-gray-600">Monica assigned to Order #651</span>
                <span className="text-gray-400 text-[11px] whitespace-nowrap ml-4">13 hours ago</span>
              </div>
              <div className="flex justify-between items-start p-4 border-b border-gray-100 text-[13px]">
                <span className="text-gray-600">Monica dropped Order #651</span>
                <span className="text-gray-400 text-[11px] whitespace-nowrap ml-4">13 hours ago</span>
              </div>
              <div className="flex justify-between items-start p-4 border-b border-gray-100 text-[13px]">
                <span className="text-gray-600">Monica assigned to Order #648</span>
                <span className="text-gray-400 text-[11px] whitespace-nowrap ml-4">3 days ago</span>
              </div>
              <div className="flex justify-between items-start p-4 border-b border-gray-100 text-[13px]">
                <span className="text-gray-600">Monica dropped Order #648</span>
                <span className="text-gray-400 text-[11px] whitespace-nowrap ml-4">4 days ago</span>
              </div>
              <div className="flex justify-between items-start p-4 text-[13px]">
                <span className="text-gray-600">Monica dropped Order #648</span>
                <span className="text-gray-400 text-[11px] whitespace-nowrap ml-4">4 days ago</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

function StatCard({ title, value, unit, titleColor }: { title: string; value: string; unit?: string; titleColor: string }) {
  return (
    <div className="bg-white rounded-md p-5 border border-gray-200 flex flex-col justify-between min-h-[105px]">
      <span className={`text-[11px] font-semibold uppercase tracking-[0.05em] ${titleColor}`}>
        {title}
      </span>
      <div className="mt-2 text-3xl font-semibold text-gray-800">
        {value} {unit && <span className="text-[15px] text-gray-500 font-normal">{unit}</span>}
      </div>
    </div>
  );
}

function Tab({ title, count, active, onClick, badgeColor }: { title: string; count: number; active: boolean; onClick: () => void; badgeColor: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "pb-3 text-[15px] font-medium border-b-2 flex items-center gap-2 transition-colors",
        active ? "border-[#FF6900] text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"
      )}
    >
      {title}
      <span className={cn("px-1.5 py-0.5 rounded-md text-[11px] font-bold", badgeColor)}>
        {count}
      </span>
    </button>
  );
}
