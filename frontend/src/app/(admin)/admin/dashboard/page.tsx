"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingCart, Users, Store, Package,
  Truck, CircleDollarSign, ArrowUp, ArrowDown,
  Clock, CheckCircle, AlertCircle, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revenueData = [
  { date: "May 1", revenue: 42000, orders: 120 },
  { date: "May 5", revenue: 58000, orders: 165 },
  { date: "May 10", revenue: 47000, orders: 140 },
  { date: "May 15", revenue: 73000, orders: 210 },
  { date: "May 20", revenue: 65000, orders: 185 },
  { date: "May 25", revenue: 89000, orders: 250 },
  { date: "May 29", revenue: 95000, orders: 270 },
];

const categoryData = [
  { name: "Fruits & Veg", value: 35, color: "#16a34a" },
  { name: "Dairy", value: 20, color: "#2563eb" },
  { name: "Beverages", value: 18, color: "#f97316" },
  { name: "Snacks", value: 15, color: "#8b5cf6" },
  { name: "Others", value: 12, color: "#94a3b8" },
];

const recentOrders = [
  { id: "ORD-2025-001", customer: "Arjun Kumar", amount: 1240, status: "delivered", time: "2m ago" },
  { id: "ORD-2025-002", customer: "Priya Shah", amount: 3450, status: "processing", time: "8m ago" },
  { id: "ORD-2025-003", customer: "Rahul Verma", amount: 890, status: "pending", time: "15m ago" },
  { id: "ORD-2025-004", customer: "Sneha Patel", amount: 2100, status: "shipped", time: "32m ago" },
  { id: "ORD-2025-005", customer: "Karan Singh", amount: 550, status: "cancelled", time: "1h ago" },
];

const stats = [
  {
    title: "Total Revenue",
    value: "₹4,69,000",
    change: "+18.2%",
    isUp: true,
    icon: CircleDollarSign,
    color: "green",
    bg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Total Orders",
    value: "1,340",
    change: "+12.5%",
    isUp: true,
    icon: ShoppingCart,
    color: "blue",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Total Customers",
    value: "8,240",
    change: "+8.1%",
    isUp: true,
    icon: Users,
    color: "purple",
    bg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Active Vendors",
    value: "127",
    change: "-2.3%",
    isUp: false,
    icon: Store,
    color: "orange",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    title: "Products",
    value: "5,892",
    change: "+25.4%",
    isUp: true,
    icon: Package,
    color: "pink",
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    title: "Deliveries Today",
    value: "89",
    change: "+6.8%",
    isUp: true,
    icon: Truck,
    color: "teal",
    bg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
];

const statusColors: Record<string, string> = {
  delivered: "badge-green",
  processing: "badge-blue",
  pending: "badge-orange",
  shipped: "badge-purple",
  cancelled: "badge-red",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input !w-auto text-sm py-2">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>This month</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className={`stat-icon ${stat.bg}`}>
              <stat.icon className={stat.iconColor} size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium truncate">{stat.title}</p>
              <p className="text-lg font-bold text-gray-900 leading-tight mt-0.5">{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.isUp ? (
                  <ArrowUp size={12} className="text-green-500" />
                ) : (
                  <ArrowDown size={12} className="text-red-500" />
                )}
                <span className={`text-xs font-semibold ${stat.isUp ? "text-green-600" : "text-red-500"}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-400">vs last month</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5 xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Revenue & Orders</h3>
              <p className="text-sm text-gray-400">Last 30 days performance</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-3 h-0.5 bg-green-500 rounded inline-block" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-3 h-0.5 bg-blue-400 rounded inline-block" /> Orders
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                formatter={(value: number, name: string) =>
                  name === "revenue" ? [`₹${value.toLocaleString()}`, "Revenue"] : [value, "Orders"]
                }
              />
              <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="orders" stroke="#60a5fa" strokeWidth={2} fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-5"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={categoryData} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card xl:col-span-3"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <a href="/admin/orders" className="text-sm text-green-600 hover:underline font-medium">
              View all →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-xs text-gray-700">{order.id}</td>
                    <td className="font-medium text-gray-900">{order.customer}</td>
                    <td className="font-semibold text-gray-900">₹{order.amount.toLocaleString()}</td>
                    <td>
                      <span className={statusColors[order.status]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-gray-400 text-xs">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions & Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="xl:col-span-2 space-y-4"
        >
          {/* Alerts */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Action Required</h3>
            <div className="space-y-3">
              {[
                { icon: AlertCircle, text: "12 vendors pending approval", color: "text-orange-500", bg: "bg-orange-50" },
                { icon: Clock, text: "5 withdrawal requests pending", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: Package, text: "3 products pending review", color: "text-purple-500", bg: "bg-purple-50" },
                { icon: CheckCircle, text: "All deliveries on track today", color: "text-green-500", bg: "bg-green-50" },
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${alert.bg} flex items-center justify-center flex-shrink-0`}>
                    <alert.icon size={15} className={alert.color} />
                  </div>
                  <p className="text-sm text-gray-600">{alert.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Target */}
          <div className="card p-5">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900">Monthly Target</h3>
              <span className="text-sm font-bold text-green-600">78%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="h-full gradient-primary rounded-full"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">₹4,69,000 / ₹6,00,000 target</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
