"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { toast } from "sonner";

const mockCustomers = [
  { id: "CST-001", name: "Arjun Kumar", email: "arjun@gmail.com", status: "active" },
  { id: "CST-002", name: "Priya Shah", email: "priya@gmail.com", status: "active" },
  { id: "CST-003", name: "Karan Singh", email: "karan@gmail.com", status: "blocked" },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "blocked" : "active";
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c)));
    toast.success(`Customer status set to ${nextStatus}`);
  };

  const columns = [
    { header: "Customer ID", accessor: "id" as const },
    { header: "Customer Name", accessor: "name" as const, sortable: true },
    { header: "Email Address", accessor: "email" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.status === "active" ? "badge-green" : "badge-red"}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <button
          onClick={() => handleToggleStatus(row.id, row.status)}
          className={`btn-secondary !py-1 !px-2.5 text-xs font-bold border-none ${
            row.status === "active" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          {row.status === "active" ? "Block Account" : "Unblock"}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="All Customers" subtitle="Directory of all registered buyers and shoppers" />

      <div className="card p-5">
        <DataTable columns={columns} data={customers} searchKey="name" searchPlaceholder="Search by name..." />
      </div>
    </div>
  );
}
