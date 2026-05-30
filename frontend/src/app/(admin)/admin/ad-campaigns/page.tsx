"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { toast } from "sonner";

const mockCampaigns = [
  { id: "CMP-001", store: "FreshMart Express", budget: 1500, status: "pending" },
  { id: "CMP-002", store: "BakeryWorld", budget: 2000, status: "active" },
];

export default function AdminAdCampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);

  const handleApprove = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "active" } : c))
    );
    toast.success(`Ad campaign ${id} activated successfully!`);
  };

  const columns = [
    { header: "Campaign ID", accessor: "id" as const },
    { header: "Store Business Name", accessor: "store" as const, sortable: true },
    { header: "Budget Limit", accessor: (row: any) => <span>₹{row.budget}</span> },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.status === "active" ? "badge-green" : "badge-orange"}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (row: any) =>
        row.status === "pending" ? (
          <button onClick={() => handleApprove(row.id)} className="btn-secondary !py-1 !px-2.5 text-xs font-bold bg-green-50 text-green-700 hover:bg-green-100 border-none">
            Approve Campaign
          </button>
        ) : (
          <span className="text-gray-400 text-xs font-semibold font-mono">Running</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Ad Moderation" subtitle="Approve and monitor advertisements campaigns launched by stores" />

      <div className="card p-5">
        <DataTable columns={columns} data={campaigns} searchKey="store" searchPlaceholder="Search by store name..." />
      </div>
    </div>
  );
}
