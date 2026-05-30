"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { toast } from "sonner";

const mockWithdrawals = [
  { id: "WTH-2025-001", user: "FreshMart Express (Vendor)", amount: 5000, method: "UPI Transfer", status: "completed", date: "May 20, 2025" },
  { id: "WTH-2025-002", user: "Ravi Kumar (Delivery Boy)", amount: 1200, method: "Bank Account Transfer", status: "pending", date: "May 28, 2025" },
];

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);

  const handleApprove = (id: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "completed" } : w))
    );
    toast.success(`Withdrawal payout ${id} approved and sent to processor`);
  };

  const columns = [
    { header: "Request ID", accessor: "id" as const },
    { header: "User / Store", accessor: "user" as const, sortable: true },
    { header: "Withdraw Amount", accessor: (row: any) => <span className="font-bold">₹{row.amount}</span> },
    { header: "Method", accessor: "method" as const },
    { header: "Date requested", accessor: "date" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.status === "completed" ? "badge-green" : "badge-orange"}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (row: any) =>
        row.status === "pending" ? (
          <button onClick={() => handleApprove(row.id)} className="btn-secondary !py-1 !px-2.5 text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 border-none">
            Approve Payout
          </button>
        ) : (
          <span className="text-gray-400 text-xs font-semibold">Processed</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Payout Withdrawals" subtitle="Review and approve manual withdrawal requests from vendors and delivery boys" />

      <div className="card p-5">
        <DataTable columns={columns} data={withdrawals} />
      </div>
    </div>
  );
}
