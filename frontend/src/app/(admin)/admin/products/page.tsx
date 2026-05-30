"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { toast } from "sonner";

const mockProducts = [
  { id: "PROD-001", name: "Organic Bananas (1kg)", store: "FreshMart Express", price: 49, status: "active", isApproved: true },
  { id: "PROD-002", name: "Farm Fresh Eggs (12)", store: "FreshMart Express", price: 89, status: "active", isApproved: true },
  { id: "PROD-004", name: "Greek Yogurt 500g", store: "FreshMart Express", price: 120, status: "pending", isApproved: false },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(mockProducts);

  const handleApprove = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isApproved: true, status: "active" } : p))
    );
    toast.success(`Product ${id} approved successfully!`);
  };

  const columns = [
    { header: "Product ID", accessor: "id" as const },
    { header: "Name", accessor: "name" as const, sortable: true },
    { header: "Store", accessor: "store" as const },
    { header: "Price", accessor: (row: any) => <span>₹{row.price}</span> },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.status === "active" ? "badge-green" : "badge-orange"}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Approval Actions",
      accessor: (row: any) =>
        !row.isApproved ? (
          <button onClick={() => handleApprove(row.id)} className="btn-secondary !py-1 !px-2.5 text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 border-none">
            Approve Product
          </button>
        ) : (
          <span className="text-gray-400 text-xs font-semibold">Approved</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Global Product Catalog" subtitle="Verify and approve product listings submitted by stores" />

      <div className="card p-5">
        <DataTable columns={columns} data={products} searchKey="name" searchPlaceholder="Search products..." />
      </div>
    </div>
  );
}
