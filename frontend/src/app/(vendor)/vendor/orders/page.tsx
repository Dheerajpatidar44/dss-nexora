"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { toast } from "sonner";

const mockOrders = [
  { id: "ORD-2025-001", customer: "Arjun Kumar", amount: 1240, status: "delivered", date: "May 29, 2025" },
  { id: "ORD-2025-002", customer: "Priya Shah", amount: 3450, status: "processing", date: "May 29, 2025" },
  { id: "ORD-2025-003", customer: "Rahul Verma", amount: 890, status: "pending", date: "May 28, 2025" },
  { id: "ORD-2025-004", customer: "Sneha Patel", amount: 2100, status: "shipped", date: "May 27, 2025" },
];

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order ${id} status updated to ${newStatus}`);
  };

  const columns = [
    { header: "Order ID", accessor: "id" as const, sortable: true },
    { header: "Customer Name", accessor: "customer" as const, sortable: true },
    { header: "Order Amount", accessor: (row: any) => <span className="font-bold">₹{row.amount}</span> },
    { header: "Date placed", accessor: "date" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span
          className={`badge ${
            row.status === "delivered"
              ? "badge-green"
              : row.status === "shipped"
              ? "badge-purple"
              : row.status === "processing"
              ? "badge-blue"
              : "badge-orange"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Update Status",
      accessor: (row: any) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="input !py-1 !px-2 text-xs !w-auto"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Store Orders" subtitle="Manage and process incoming store orders" />

      <div className="card p-5">
        <DataTable columns={columns} data={orders} searchKey="customer" searchPlaceholder="Search by customer..." />
      </div>
    </div>
  );
}
