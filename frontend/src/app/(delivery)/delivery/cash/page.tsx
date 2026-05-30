"use client";

import { motion } from "framer-motion";
import { DollarSign, Clock, CheckCircle2, History } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";

const mockCashLogs = [
  { id: "CSH-001", amount: 1240, orderId: "ORD-2025-4510", date: "Today, 1:12 PM", status: "in_hand" },
  { id: "CSH-002", amount: 2210, orderId: "ORD-2025-4508", date: "Yesterday, 4:32 PM", status: "submitted" },
];

export default function DeliveryCashPage() {
  const totalInHand = mockCashLogs
    .filter((c) => c.status === "in_hand")
    .reduce((sum, c) => sum + c.amount, 0);

  const columns = [
    { header: "Transaction ID", accessor: "id" as const },
    { header: "Order ID", accessor: "orderId" as const },
    { header: "Amount", accessor: (row: any) => <span className="font-bold">₹{row.amount}</span> },
    { header: "Date Collected", accessor: "date" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.status === "in_hand" ? "badge-orange" : "badge-green"}`}>
          {row.status === "in_hand" ? "In Hand" : "Submitted to Hub"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Collected Cash (COD)" subtitle="Manage Cash on Delivery collections in your custody" />

      {/* Cash in Hand Banner */}
      <div className="card p-5 bg-orange-500 text-white flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-orange-100 font-semibold uppercase tracking-wider">Cash in Hand (COD)</p>
          <h2 className="text-3xl font-black">₹{totalInHand}</h2>
        </div>
        <DollarSign size={36} className="text-orange-200" />
      </div>

      {/* Warning Box */}
      <div className="card p-4 border-l-4 border-amber-500 bg-amber-50/50 flex items-start gap-3">
        <Clock className="text-amber-600 mt-0.5" size={16} />
        <div>
          <h4 className="text-sm font-bold text-amber-800">Hub Submission Required</h4>
          <p className="text-xs text-amber-700 mt-0.5">
            Please deposit cash in hand exceeding ₹5,000 to your designated hub manager by end of day.
          </p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <History size={16} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">Collection Ledger</h3>
        </div>
        <DataTable columns={columns} data={mockCashLogs} />
      </div>
    </div>
  );
}
