"use client";

import { useState } from "react";
import { ChevronDown, List, HelpCircle, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PosDashboard() {
  const [dateFilter, setDateFilter] = useState("Today");
  const [showDropdown, setShowDropdown] = useState(false);
  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-01");

  return (
    <div className="min-h-screen bg-[#faf8f5] text-gray-800 font-sans -mt-6 -mx-6 p-4 md:p-8">
      
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {/* Dropdown Container */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className={cn(
                "flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors min-w-[140px]",
                dateFilter === "Custom Range" && "ring-2 ring-orange-100 border-orange-300"
              )}
            >
              {dateFilter} <ChevronDown size={16} className="text-gray-400" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full mt-1 w-full min-w-[140px] bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
                {["Today", "Last 7 days", "Last 30 days", "Custom Range"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setDateFilter(option);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Date Pickers */}
          {dateFilter === "Custom Range" && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="relative flex items-center">
                 <input 
                   type="date" 
                   value={startDate}
                   onChange={(e) => setStartDate(e.target.value)}
                   className="px-3 py-2 pr-10 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-100 h-[38px] w-[140px]"
                 />
                 <Calendar size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex items-center">
                 <input 
                   type="date" 
                   value={endDate}
                   onChange={(e) => setEndDate(e.target.value)}
                   className="px-3 py-2 pr-10 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-100 h-[38px] w-[140px]"
                 />
                 <Calendar size={14} className="absolute right-3 text-gray-400 pointer-events-none" />
              </div>
              <button className="p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors h-[38px] w-[38px] flex items-center justify-center">
                <Check size={18} />
              </button>
            </div>
          )}
        </div>

        <Link 
          href="/admin/orders"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-md text-sm font-medium text-orange-600 hover:bg-orange-500 hover:text-white transition-all group"
        >
          <List size={16} className="group-hover:text-white transition-colors" /> POS Orders
        </Link>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        
        <div className="bg-white rounded-md p-5 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Revenue</span>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">0 Orders</span>
          </div>
          <h3 className="text-3xl font-semibold text-gray-800">₹0.00</h3>
        </div>

        <div className="bg-white rounded-md p-5 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg. Order Value</span>
          </div>
          <h3 className="text-3xl font-semibold text-gray-800">₹0.00</h3>
        </div>

        <div className="bg-white rounded-md p-5 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active POS Sellers</span>
          </div>
          <h3 className="text-3xl font-semibold text-gray-800">0</h3>
        </div>

        <div className="bg-white rounded-md p-5 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Refunds</span>
          </div>
          <h3 className="text-3xl font-semibold text-gray-800">₹0.00</h3>
          <p className="text-[11px] text-gray-400 mt-1">0 refunds (0%)</p>
        </div>

      </div>

      {/* Second Row: Sales Trend & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        <div className="lg:col-span-2 bg-white rounded-md border border-gray-200 flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-gray-200">
             <h3 className="text-[15px] font-semibold text-gray-700">Sales Trend</h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
             <p className="text-sm text-gray-400">No sales data for this period</p>
          </div>
        </div>

        <div className="bg-white rounded-md border border-gray-200 flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-gray-200">
             <h3 className="text-[15px] font-semibold text-gray-700">Payment Methods</h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
             <p className="text-sm text-gray-400">No payment data</p>
          </div>
        </div>

      </div>

      {/* Third Row: Top Sellers & Customer Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        <div className="bg-white rounded-md border border-gray-200 flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-gray-200">
             <h3 className="text-[15px] font-semibold text-gray-700">Top Sellers by POS Revenue</h3>
          </div>
          <div className="flex-1 flex items-center justify-center">
             <p className="text-sm text-gray-400">No seller data</p>
          </div>
        </div>

        <div className="bg-white rounded-md border border-gray-200 flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-gray-200">
             <h3 className="text-[15px] font-semibold text-gray-700">Customer Breakdown</h3>
          </div>
          <div className="flex-1 flex items-center justify-center relative p-6">
             {/* Text No data in the center-left area */}
             <div className="absolute left-[20%] lg:left-[30%] top-1/2 -translate-y-1/2">
                <p className="text-sm text-gray-400">No data</p>
             </div>
             
             {/* Stats on the right */}
             <div className="ml-auto w-1/2 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Registered</span>
                    <span className="text-sm font-semibold text-gray-800">0</span>
                  </div>
                  <p className="text-[11px] text-gray-400">0%</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Walk-in</span>
                    <span className="text-sm font-semibold text-gray-800">0</span>
                  </div>
                  <p className="text-[11px] text-gray-400">0%</p>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* Fourth Row: Top Selling Products & Adoption */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-md border border-gray-200 flex flex-col min-h-[250px]">
          <div className="p-4 border-b border-gray-200">
             <h3 className="text-[15px] font-semibold text-gray-700">Top Selling Products</h3>
          </div>
          <div className="overflow-x-auto flex-1">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="text-[11px] text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-white">
                   <th className="px-5 py-3 font-semibold">Product</th>
                   <th className="px-5 py-3 font-semibold text-center">Quantity</th>
                   <th className="px-5 py-3 font-semibold text-right">Revenue</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td colSpan={3} className="py-12 text-center text-sm text-gray-400">No data available</td>
                 </tr>
               </tbody>
             </table>
          </div>
        </div>

        <div className="bg-white rounded-md border border-gray-200 flex flex-col p-5 min-h-[250px]">
           <div className="flex items-center gap-1.5 mb-6">
              <h3 className="text-[15px] font-semibold text-gray-700">Seller POS Adoption</h3>
              <HelpCircle size={16} className="text-gray-400 cursor-pointer" />
           </div>
           
           <div className="space-y-4">
             <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div className="flex items-center gap-1.5">
                   <span className="text-sm font-medium text-gray-600">Total Sellers</span>
                   <HelpCircle size={14} className="text-gray-400 cursor-pointer" />
                </div>
                <span className="text-sm font-semibold text-gray-800">31</span>
             </div>
             
             <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div className="flex items-center gap-1.5">
                   <span className="text-sm font-medium text-gray-600">Sellers with POS Orders</span>
                   <HelpCircle size={14} className="text-gray-400 cursor-pointer" />
                </div>
                <span className="text-sm font-semibold text-gray-800">1</span>
             </div>
           </div>

           <div className="mt-auto pt-6">
              <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-gray-600">Adoption Rate</span>
                    <HelpCircle size={14} className="text-gray-400 cursor-pointer" />
                 </div>
                 <span className="text-sm font-semibold text-orange-600">3.2%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                 <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: '3.2%' }}></div>
              </div>
           </div>
        </div>

      </div>

    </div>
  );
}
