"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { toast } from "sonner";

const mockFleet = [
  { id: "DBY-101", name: "Ravi Kumar", phone: "+91 98765 00112", status: "active", isAvailable: true },
  { id: "DBY-102", name: "Vikram Singh", phone: "+91 98765 00113", status: "active", isAvailable: false },
];

export default function AdminDeliveryBoysPage() {
  const [fleet, setFleet] = useState(mockFleet);

  const columns = [
    { header: "Agent ID", accessor: "id" as const },
    { header: "Agent Name", accessor: "name" as const, sortable: true },
    { header: "Phone Number", accessor: "phone" as const },
    {
      header: "Duty Status",
      accessor: (row: any) => (
        <span className={`badge ${row.isAvailable ? "badge-green" : "badge-gray"}`}>
          {row.isAvailable ? "Online (Duty)" : "Offline"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Delivery Fleet" subtitle="Manage and track delivery boy locations and active duty shifts" />

      <div className="card p-5">
        <DataTable columns={columns} data={fleet} searchKey="name" searchPlaceholder="Search delivery agents..." />
      </div>
    </div>
  );
}
