"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

const mockOrders = [
  { id: "ORD-2025-001", customer: "Arjun Kumar", store: "FreshMart Express", amount: 1240, status: "delivered", date: "May 29, 2025" },
  { id: "ORD-2025-002", customer: "Priya Shah", store: "FreshMart Express", amount: 3450, status: "processing", date: "May 29, 2025" },
  { id: "ORD-2025-003", customer: "Rahul Verma", store: "BakeryWorld", amount: 890, status: "pending", date: "May 28, 2025" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);

  const columns = [
    { header: "Order ID", accessor: "id" as const, sortable: true },
    { header: "Customer", accessor: "customer" as const, sortable: true },
    { header: "Store", accessor: "store" as const },
    { header: "Amount", accessor: (row: any) => <span className="font-bold">₹{row.amount}</span> },
    { header: "Date placed", accessor: "date" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span
          className={`badge ${
            row.status === "delivered"
              ? "badge-green"
              : row.status === "processing"
              ? "badge-blue"
              : "badge-orange"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="All Orders" subtitle="Master view of all customer orders across the platform" />

      <div className="card p-5">
        <DataTable columns={columns} data={orders} searchKey="customer" searchPlaceholder="Search by customer name..." />
      </div>
    </div>
  );
}
