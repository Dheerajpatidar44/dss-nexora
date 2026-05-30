"use client";

import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";

const mockSubs = [
  { id: "SUB-001", store: "FreshMart Express", planName: "Silver Professional", startDate: "May 1, 2025", endDate: "July 30, 2025", status: "active" },
  { id: "SUB-002", store: "BakeryWorld", planName: "Bronze Starter", startDate: "May 10, 2025", endDate: "June 10, 2025", status: "active" },
];

export default function AdminSubscriptionsPage() {
  const columns = [
    { header: "Subscription ID", accessor: "id" as const },
    { header: "Store", accessor: "store" as const, sortable: true },
    { header: "Active Plan", accessor: "planName" as const },
    { header: "Start Date", accessor: "startDate" as const },
    { header: "End Date", accessor: "endDate" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className="badge badge-green">{row.status}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Seller Memberships" subtitle="Log of active vendor plans and subscription durations" />

      <div className="card p-5">
        <DataTable columns={columns} data={mockSubs} searchKey="store" searchPlaceholder="Search by store..." />
      </div>
    </div>
  );
}
