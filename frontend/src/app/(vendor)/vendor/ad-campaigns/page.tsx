"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus, Megaphone, BarChart2 } from "lucide-react";
import { toast } from "sonner";

const mockCampaigns = [
  { id: "CMP-001", title: "Mango Festival Offer Banner", type: "banner", budget: 1500, spent: 450, status: "active", clicks: 340 },
  { id: "CMP-002", title: "Fresh Salmon Boost", type: "product", budget: 2000, spent: 1800, status: "ended", clicks: 920 },
];

export default function VendorAdCampaignsPage() {
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [type, setType] = useState("product");

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !budget) {
      toast.error("Please fill in all fields");
      return;
    }

    const newCmp = {
      id: `CMP-00${campaigns.length + 1}`,
      title,
      type,
      budget: Number(budget),
      spent: 0,
      status: "active",
      clicks: 0,
    };

    setCampaigns([newCmp, ...campaigns]);
    toast.success("Ad campaign launched successfully!");
    setIsOpen(false);
    setTitle("");
    setBudget("");
  };

  const columns = [
    { header: "Campaign ID", accessor: "id" as const },
    { header: "Title", accessor: "title" as const, sortable: true },
    { header: "Type", accessor: "type" as const },
    { header: "Budget", accessor: (row: any) => <span>₹{row.budget}</span> },
    { header: "Clicks", accessor: "clicks" as const, sortable: true },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.status === "active" ? "badge-green" : "badge-gray"}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Ad Campaigns" subtitle="Boost visibility and increase sales by promoting products">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5">
          <Plus size={16} />
          Create Campaign
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={campaigns} searchKey="title" searchPlaceholder="Search campaigns..." />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Ad Campaign">
        <form onSubmit={handleLaunch} className="space-y-4">
          <div>
            <label className="label">Campaign Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Special Banner Ad"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Campaign Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input"
            >
              <option value="product">Promote Specific Product</option>
              <option value="banner">Store Hero Banner Ad</option>
            </select>
          </div>
          <div>
            <label className="label">Ad Budget Limit (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 2000"
              className="input"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary bg-blue-600 hover:bg-blue-700 py-3 mt-4">
            Launch Campaign
          </button>
        </form>
      </FormModal>
    </div>
  );
}
