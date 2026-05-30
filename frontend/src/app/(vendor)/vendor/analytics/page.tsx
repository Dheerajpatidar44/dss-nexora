"use client";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import { BarChart3, LineChart, PieChart, TrendingUp, Users, Percent, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const analyticsData = [
  { month: "Jan", views: 2400, sales: 12 },
  { month: "Feb", views: 3200, sales: 18 },
  { month: "Mar", views: 4500, sales: 25 },
  { month: "Apr", views: 5100, sales: 30 },
  { month: "May", views: 6800, sales: 48 },
];

export default function VendorAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Store Analytics" subtitle="Analyze store page views, orders count, and check conversions rate" />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Store Views" value="6,800" change="+24%" icon={Users} bg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard title="Completed Sales" value="48" change="+18%" icon={TrendingUp} bg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard title="Conversion Rate" value="0.7%" change="+2.4%" icon={Percent} bg="bg-orange-50" iconColor="text-orange-600" />
      </div>

      {/* Page view graph */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">Traffic (Page Views)</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="views" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
