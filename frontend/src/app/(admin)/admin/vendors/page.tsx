"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { toast } from "sonner";

const mockVendors = [
  { id: "VND-001", businessName: "FreshMart Express", owner: "Jane Doe", email: "freshmart@gmail.com", isApproved: true },
  { id: "VND-002", businessName: "BakeryWorld", owner: "John Smith", email: "bakery@gmail.com", isApproved: true },
  { id: "VND-003", businessName: "Organic Farms", owner: "Karan Malhotra", email: "organic@gmail.com", isApproved: false },
];

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState(mockVendors);

  const handleApprove = (id: string) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isApproved: true } : v))
    );
    toast.success(`Store Vendor ${id} approved successfully!`);
  };

  const columns = [
    { header: "Vendor ID", accessor: "id" as const },
    { header: "Store Business Name", accessor: "businessName" as const, sortable: true },
    { header: "Store Owner", accessor: "owner" as const, sortable: true },
    { header: "Email Address", accessor: "email" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.isApproved ? "badge-green" : "badge-orange"}`}>
          {row.isApproved ? "Approved" : "Pending Verification"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) =>
        !row.isApproved ? (
          <button onClick={() => handleApprove(row.id)} className="btn-secondary !py-1 !px-2.5 text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 border-none">
            Approve Store
          </button>
        ) : (
          <span className="text-gray-400 text-xs font-semibold">Active</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Store Sellers (Vendors)" subtitle="Verify and approve store registration requests" />

      <div className="card p-5">
        <DataTable columns={columns} data={vendors} searchKey="businessName" searchPlaceholder="Search by business name..." />
      </div>
    </div>
  );
}
