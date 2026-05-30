"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockDeals = [
  { id: "DEL-01", name: "Mega Monsoon Sale", discount: "Flat 25%", status: "active" },
  { id: "DEL-02", name: "Organic Veggies Deal", discount: "Buy 1 Get 1 Free", status: "active" },
];

export default function AdminFeaturedDealsPage() {
  const [deals, setDeals] = useState(mockDeals);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !discount) return;

    const newDel = {
      id: `DEL-0${deals.length + 1}`,
      name,
      discount,
      status: "active",
    };

    setDeals([...deals, newDel]);
    toast.success("Featured deal created successfully!");
    setIsOpen(false);
    setName("");
    setDiscount("");
  };

  const columns = [
    { header: "Deal ID", accessor: "id" as const },
    { header: "Deal Name", accessor: "name" as const, sortable: true },
    { header: "Discount details", accessor: "discount" as const },
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
      <PageHeader title="Featured Deals" subtitle="Promote store items under flash-sales and featured banners">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
          <Plus size={16} />
          Add Deal
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={deals} searchKey="name" searchPlaceholder="Search deals..." />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Deal">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Deal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Free delivery weekend"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Discount details</label>
            <input
              type="text"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. Flat ₹50 off"
              className="input"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 mt-4">
            Add Deal
          </button>
        </form>
      </FormModal>
    </div>
  );
}
