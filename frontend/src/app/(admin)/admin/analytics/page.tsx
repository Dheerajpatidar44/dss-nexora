"use client";

import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import { BarChart3, LineChart, TrendingUp, Users, Percent, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const analyticsData = [
  { month: "Jan", views: 24000, sales: 120 },
  { month: "Feb", views: 32000, sales: 180 },
  { month: "Mar", views: 45000, sales: 250 },
  { month: "Apr", views: 51000, sales: 300 },
  { month: "May", views: 68000, sales: 480 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Platform Analytics" subtitle="Track total monthly platform sales, traffic, and shopper conversion rate" />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Platform views" value="68,000" change="+18%" icon={Users} bg="bg-green-50" iconColor="text-green-600" />
        <StatCard title="Platform Sales Orders" value="480" change="+12%" icon={TrendingUp} bg="bg-green-50" iconColor="text-green-600" />
        <StatCard title="Conversion rate" value="0.7%" change="+1.4%" icon={Percent} bg="bg-green-50" iconColor="text-green-600" />
      </div>

      {/* Traffic Graph */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">Monthly Traffic (Page Views)</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={analyticsData}>
            <defs>
              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="views" stroke="#16a34a" strokeWidth={2} fill="url(#viewsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
