"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

const mockDisputes = [
  { id: "DSP-001", orderId: "ORD-2025-001", customer: "Arjun Kumar", vendor: "FreshMart Express", reason: "Item damaged", status: "open" },
  { id: "DSP-002", orderId: "ORD-2025-004", customer: "Sneha Patel", vendor: "MeatMaster", reason: "Wrong items delivered", status: "resolved" },
];

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState(mockDisputes);

  const handleResolve = (id: string) => {
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: "resolved" } : d)));
    toast.success(`Dispute ticket ${id} resolved`);
  };

  const columns = [
    { header: "Dispute ID", accessor: "id" as const },
    { header: "Order ID", accessor: "orderId" as const },
    { header: "Customer", accessor: "customer" as const },
    { header: "Store", accessor: "vendor" as const },
    { header: "Reason", accessor: "reason" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.status === "open" ? "badge-red" : "badge-green"}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) =>
        row.status === "open" ? (
          <button onClick={() => handleResolve(row.id)} className="btn-secondary !py-1 !px-2.5 text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 border-none">
            Resolve
          </button>
        ) : (
          <span className="text-gray-400 text-xs font-semibold">Done</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Disputes & Tickets" subtitle="Moderate customer disputes and process refund tickets" />

      <div className="card p-5">
        <DataTable columns={columns} data={disputes} />
      </div>
    </div>
  );
}
