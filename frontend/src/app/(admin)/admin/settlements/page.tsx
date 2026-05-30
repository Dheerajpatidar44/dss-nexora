"use client";

import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import StatCard from "@/components/common/StatCard";
import { CircleDollarSign, Calendar, TrendingUp } from "lucide-react";

const mockSettlements = [
  { id: "SET-201", store: "FreshMart Express", amount: 15450, taxDeducted: 340, date: "May 29, 2025", status: "settled" },
  { id: "SET-202", store: "BakeryWorld", amount: 8900, taxDeducted: 180, date: "May 28, 2025", status: "settled" },
];

export default function AdminSettlementsPage() {
  const columns = [
    { header: "Settlement ID", accessor: "id" as const },
    { header: "Store Name", accessor: "store" as const, sortable: true },
    { header: "Amount Paid", accessor: (row: any) => <span className="font-bold">₹{row.amount}</span> },
    { header: "Tax Deducted (TDS)", accessor: (row: any) => <span className="text-gray-400">₹{row.taxDeducted}</span> },
    { header: "Date processed", accessor: "date" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className="badge badge-green">{row.status}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Store Settlements" subtitle="Manage daily sales payouts deposits to vendor bank accounts" />

      {/* Settlements stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="This Month Payouts" value="₹4,85,000" icon={TrendingUp} bg="bg-green-50" iconColor="text-green-600" />
        <StatCard title="Today's Payouts" value="₹24,350" icon={CircleDollarSign} bg="bg-green-50" iconColor="text-green-600" />
        <StatCard title="Next Payout Run" value="Tonight, 2 AM" icon={Calendar} bg="bg-green-50" iconColor="text-green-600" />
      </div>

      <div className="card p-5">
        <DataTable columns={columns} data={mockSettlements} searchKey="store" searchPlaceholder="Search by store name..." />
      </div>
    </div>
  );
}
