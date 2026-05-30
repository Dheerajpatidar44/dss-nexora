"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Bell, TrendingUp, TrendingDown, MoreHorizontal,
  ChevronDown, ShoppingBag, Users, Circle, Clock, CheckCircle
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import Image from "next/image";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revenueAnalytics = [
  { date: "12 Aug", revenue: 4000, order: 2400 },
  { date: "13 Aug", revenue: 3000, order: 1398 },
  { date: "14 Aug", revenue: 2000, order: 9800 },
  { date: "15 Aug", revenue: 2780, order: 3908 },
  { date: "16 Aug", revenue: 14921, order: 4800 },
  { date: "17 Aug", revenue: 2390, order: 3800 },
  { date: "18 Aug", revenue: 3490, order: 4300 },
  { date: "19 Aug", revenue: 3000, order: 2100 },
];

const topCategories = [
  { name: "Electronics", value: 1200000, color: "#f97316" },
  { name: "Fashion", value: 950000, color: "#fdba74" },
  { name: "Home & Kitchen", value: 750000, color: "#fed7aa" },
  { name: "Beauty & Personal Care", value: 500000, color: "#ffedd5" },
];

const activeUsers = [
  { country: "United States", value: 50, color: "#f97316" },
  { country: "United Kingdom", value: 24, color: "#fdba74" },
  { country: "Indonesia", value: 17.5, color: "#fed7aa" },
  { country: "Russia", value: 15, color: "#ffedd5" },
];

const conversionRate = [
  { name: "Product Views", value: 25000, change: "+5%" },
  { name: "Add to Cart", value: 12000, change: "+8%" },
  { name: "Proceed to Checkout", value: 8500, change: "+4%" },
  { name: "Completed Purchases", value: 6200, change: "+2%" },
  { name: "Abandoned Carts", value: 3000, change: "-3%", isNegative: true },
];

const trafficSources = [
  { name: "Direct Traffic", value: 40, color: "#fed7aa" },
  { name: "Organic Search", value: 30, color: "#fdba74" },
  { name: "Social Media", value: 15, color: "#f97316" },
  { name: "Referral Traffic", value: 10, color: "#ea580c" },
  { name: "Email Campaigns", value: 5, color: "#c2410c" },
];

const recentOrders = [
  { id: "#10234", customer: "Amaya Weller", product: "Wireless Headphones", qty: 2, total: "$100", status: "Shipped", statusColor: "text-orange-500 bg-orange-50" },
  { id: "#10235", customer: "Sebastian Adama", product: "Running Shoes", qty: 1, total: "$75", status: "Processing", statusColor: "text-gray-500 bg-gray-50" },
  { id: "#10236", customer: "Suzanne Bright", product: "Smartwatch", qty: 1, total: "$150", status: "Delivered", statusColor: "text-emerald-500 bg-emerald-50" },
  { id: "#10237", customer: "Peter Hovil", product: "Coffee Maker", qty: 1, total: "$60", status: "Pending", statusColor: "text-rose-500 bg-rose-50" },
  { id: "#10238", customer: "Anita Singh", product: "Bluetooth Speaker", qty: 3, total: "$90", status: "Shipped", statusColor: "text-orange-500 bg-orange-50" },
];

const recentActivity = [
  { text: "Maureen Steel purchased 2 items totaling $120.", time: "10:30 AM", type: "purchase" },
  { text: "The price of \"Smart TV\" was updated from $520 to $450.", time: "9:45 AM", type: "update" },
  { text: "Vincent Laurent left a 5-star review for \"Wireless Headphones\".", time: "8:20 AM", type: "review" },
  { text: "\"Running Shoes\" stock is below 10 units.", time: "7:50 AM", type: "alert" },
  { text: "Damien Ugo's order status changed from \"Pending\" to \"Processing\".", time: "7:00 AM", type: "status" },
];

export default function EzMartDashboard() {
  const [showRevFilter, setShowRevFilter] = useState(false);
  const [showConvFilter, setShowConvFilter] = useState(false);
  const [showOrderFilter, setShowOrderFilter] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-gray-800 font-sans -mt-6 -mx-6 p-4 md:p-8">

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-500">Total Sales</span>
            <div className="p-2 bg-orange-100 rounded-lg text-orange-500">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-gray-900">$983,410</h3>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                <TrendingUp size={12} /> +15.54%
              </span>
              <span className="text-[10px] text-gray-400">vs last week</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-500">Total Orders</span>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-gray-900">58,375</h3>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-rose-500 flex items-center gap-0.5">
                <TrendingDown size={12} /> -2.05%
              </span>
              <span className="text-[10px] text-gray-400">vs last week</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-500">Total Visitors</span>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-gray-900">237,782</h3>
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
                <TrendingUp size={12} /> +8.52%
              </span>
              <span className="text-[10px] text-gray-400">vs last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Spans 8) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Revenue Analytics & Monthly Target Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Analytics */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs flex items-center gap-1.5 text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span> Revenue
                    </span>
                    <span className="text-xs flex items-center gap-1.5 text-gray-500">
                      <span className="w-2 h-2 border-2 border-orange-300 rounded-full"></span> Order
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button onClick={() => setShowRevFilter(!showRevFilter)} className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors">
                    Last 8 Days <ChevronDown size={14} className={cn("transition-transform", showRevFilter && "rotate-180")} />
                  </button>
                  {showRevFilter && (
                    <div className="absolute right-0 top-10 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 text-xs">
                      <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">Last 8 Days</div>
                      <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">This Month</div>
                      <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">This Year</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueAnalytics} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ color: '#64748b', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="order" stroke="#fdba74" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Target */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Monthly Target</h3>
                <MoreHorizontal size={18} className="text-gray-400 cursor-pointer" />
              </div>
              <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="w-40 h-40 relative">
                   <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: 85 }, { value: 15 }]}
                        cx="50%" cy="50%"
                        innerRadius={55} outerRadius={70}
                        startAngle={180} endAngle={0}
                        dataKey="value" stroke="none"
                      >
                        <Cell fill="#f97316" />
                        <Cell fill="#ffedd5" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] text-center">
                    <span className="text-2xl font-bold text-gray-900">85%</span>
                    <span className="block text-[10px] text-emerald-500 font-bold">+5.02% <span className="font-normal text-gray-400">from last month</span></span>
                  </div>
                </div>
                <div className="text-center mt-[-20px]">
                  <p className="text-sm font-bold text-gray-900">Great Progress!</p>
                  <p className="text-[10px] text-gray-500 mt-1 max-w-[160px] mx-auto">
                    Our achievement increased by <span className="text-orange-500 font-bold">100k, 30%</span> left to reach 100% next month.
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 p-3 bg-orange-50 rounded-xl">
                <div>
                  <p className="text-[10px] text-orange-400 uppercase tracking-wider font-bold">Target</p>
                  <p className="text-sm font-bold text-gray-900">$600,000</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-orange-400 uppercase tracking-wider font-bold">Revenue</p>
                  <p className="text-sm font-bold text-gray-900">$510,000</p>
                </div>
              </div>
            </div>

          </div>

          {/* Users and Conversion Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Active User */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Active User</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-gray-900">2,758</span>
                    <span className="text-[10px] text-gray-400">Users</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <MoreHorizontal size={18} className="text-gray-400 cursor-pointer mb-2" />
                   <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">-0.02%</span>
                   <span className="text-[9px] text-gray-400 mt-0.5">from last month</span>
                </div>
              </div>
              <div className="space-y-4">
                {activeUsers.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-gray-500">{item.country}</span>
                      <span className="font-bold text-gray-900">{item.value}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Convertion Rate</h3>
                <div className="relative">
                  <button onClick={() => setShowConvFilter(!showConvFilter)} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg">
                    This Week <ChevronDown size={14} className={cn("transition-transform", showConvFilter && "rotate-180")} />
                  </button>
                  {showConvFilter && (
                    <div className="absolute right-0 top-10 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 text-xs">
                      <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">This Week</div>
                      <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">Last Week</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-end h-40">
                {conversionRate.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1">
                    <div className="text-center mb-2 px-1">
                       <p className="text-[9px] text-gray-400 h-6 leading-tight flex items-end justify-center mb-1">{step.name}</p>
                       <p className="text-sm font-bold text-gray-900">{step.value.toLocaleString()}</p>
                       <p className={cn("text-[10px] font-bold", step.isNegative ? "text-rose-500" : "text-emerald-500")}>{step.change}</p>
                    </div>
                    <div className="w-full max-w-[40px] bg-orange-100 rounded-t-lg relative flex items-end justify-center h-20">
                       <div 
                         className="w-full bg-orange-300 rounded-t-lg opacity-80" 
                         style={{ height: `${(step.value / 25000) * 100}%` }}
                       ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search product, customer, etc" 
                      className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[11px] focus:outline-none w-48"
                    />
                  </div>
                  <div className="relative">
                    <button onClick={() => setShowOrderFilter(!showOrderFilter)} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg">
                      All Categories <ChevronDown size={14} className={cn("transition-transform", showOrderFilter && "rotate-180")} />
                    </button>
                    {showOrderFilter && (
                      <div className="absolute right-0 top-10 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 text-xs">
                        <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">All Categories</div>
                        <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">Electronics</div>
                        <div className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">Fashion</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-3 font-medium">No</th>
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">Qty</th>
                      <th className="pb-3 font-medium">Total</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors text-sm">
                        <td className="py-3 text-gray-500">{idx + 1}</td>
                        <td className="py-3 font-medium text-gray-900">{order.id}</td>
                        <td className="py-3 text-gray-600">{order.customer}</td>
                        <td className="py-3">
                           <div className="flex items-center gap-2">
                             <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-[10px]">📦</div>
                             <span className="text-gray-900 font-medium text-[13px]">{order.product}</span>
                           </div>
                        </td>
                        <td className="py-3 text-gray-600">{order.qty}</td>
                        <td className="py-3 font-bold text-gray-900">{order.total}</td>
                        <td className="py-3">
                          <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5", order.statusColor)}>
                             <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                             {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-between items-center mt-6 text-[11px] text-gray-400">
                <p>Copyright © 2024 EzMart</p>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-600">Term and conditions</a>
                  <a href="#" className="hover:text-gray-600">Contact</a>
                </div>
              </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Spans 4) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Top Categories */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Top Categories</h3>
                <span className="text-[11px] text-gray-400 cursor-pointer hover:text-gray-600">See All</span>
              </div>
              <div className="relative h-48 w-full flex justify-center items-center mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCategories}
                      cx="50%" cy="50%"
                      innerRadius={65} outerRadius={85}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {topCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-[10px] text-gray-400">Total Sales</span>
                  <span className="block text-xl font-bold text-gray-900">$3,400,000</span>
                </div>
              </div>
              <div className="space-y-3">
                 {topCategories.map((cat, idx) => (
                   <div key={idx} className="flex justify-between items-center text-sm">
                     <div className="flex items-center gap-2">
                       <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }}></span>
                       <span className="text-gray-600">{cat.name}</span>
                     </div>
                     <span className="font-bold text-gray-900">${cat.value.toLocaleString()}</span>
                   </div>
                 ))}
              </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Traffic Sources</h3>
                <MoreHorizontal size={18} className="text-gray-400 cursor-pointer" />
              </div>
              <div className="flex w-full h-8 rounded-lg overflow-hidden mb-6">
                 {trafficSources.map((source, idx) => (
                   <div key={idx} style={{ width: `${source.value}%`, backgroundColor: source.color }} className="h-full border-r border-white/20 last:border-0 hover:opacity-90 transition-opacity"></div>
                 ))}
              </div>
              <div className="space-y-2">
                 {trafficSources.map((source, idx) => (
                   <div key={idx} className="flex justify-between items-center text-xs">
                     <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: source.color }}></span>
                       <span className="text-gray-500">{source.name}</span>
                     </div>
                     <span className="font-bold text-gray-900">{source.value}%</span>
                   </div>
                 ))}
              </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <MoreHorizontal size={18} className="text-gray-400 cursor-pointer" />
              </div>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 before:to-transparent">
                 {recentActivity.map((act, idx) => (
                   <div key={idx} className="relative flex items-start gap-4">
                     <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 z-10 border-4 border-white">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                     </div>
                     <div className="pt-0.5 pb-2">
                       <p className="text-[13px] text-gray-700 leading-snug mb-1">{act.text}</p>
                       <span className="text-[10px] text-gray-400">{act.time}</span>
                     </div>
                   </div>
                 ))}
              </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Utility to handle conditional classes if not already imported
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
