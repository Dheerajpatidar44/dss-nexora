"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingCart, Package, Star,
  Bell, CreditCard, ChevronRight, AlertCircle
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";

const revenueData = [
  { date: "May 1", sales: 12000, orders: 40 },
  { date: "May 5", sales: 18000, orders: 55 },
  { date: "May 10", sales: 15000, orders: 48 },
  { date: "May 15", sales: 22000, orders: 70 },
  { date: "May 20", sales: 20000, orders: 62 },
  { date: "May 25", sales: 28000, orders: 85 },
  { date: "May 29", sales: 31000, orders: 92 },
];

const recentOrders = [
  { id: "ORD-2025-001", customer: "Arjun Kumar", amount: 1240, status: "delivered" },
  { id: "ORD-2025-002", customer: "Priya Shah", amount: 3450, status: "processing" },
  { id: "ORD-2025-003", customer: "Rahul Verma", amount: 890, status: "pending" },
];

export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Store Dashboard" subtitle="Track your daily store sales and order fulfillment status." />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Sales" value="₹31,000" change="+14.2%" icon={TrendingUp} bg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Today's Orders" value="92" change="+8.5%" icon={ShoppingCart} bg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Products Active" value="48" icon={Package} bg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Store Rating" value="4.8 ★" icon={Star} bg="bg-yellow-50" iconColor="text-yellow-600" />
      </div>

      {/* Charts & Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="card p-5 xl:col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Sales & Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock / Notices */}
        <div className="card p-5 space-y-4">
          <h3 className="font-bold text-gray-900">Notifications</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-600">
                <AlertCircle size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Low Stock Warning</p>
                <p className="text-xs text-gray-500">Avocados (3 pcs) is down to 4 items.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                <CreditCard size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Settlement Successful</p>
                <p className="text-xs text-gray-500">₹8,450 deposited into your bank account.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders table */}
      <div className="card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
          <a href="/vendor/orders" className="text-xs font-semibold text-blue-600 hover:underline">
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
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="font-mono text-xs font-bold text-gray-700">{order.id}</td>
                  <td className="text-gray-900 font-medium">{order.customer}</td>
                  <td className="font-semibold text-gray-900">₹{order.amount}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.status === "delivered"
                          ? "badge-green"
                          : order.status === "processing"
                          ? "badge-blue"
                          : "badge-orange"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
