"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockPlans = [
  { id: "PLN-1", name: "Bronze Starter", price: 999, duration: 30 },
  { id: "PLN-2", name: "Silver Professional", price: 2499, duration: 90 },
  { id: "PLN-3", name: "Gold Enterprise", price: 4999, duration: 180 },
];

export default function AdminPlansPage() {
  const [plans, setPlans] = useState(mockPlans);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !duration) return;

    const newPln = {
      id: `PLN-${plans.length + 1}`,
      name,
      price: Number(price),
      duration: Number(duration),
    };

    setPlans([...plans, newPln]);
    toast.success("Subscription plan created successfully!");
    setIsOpen(false);
    setName("");
    setPrice("");
    setDuration("");
  };

  const columns = [
    { header: "Plan ID", accessor: "id" as const },
    { header: "Membership Name", accessor: "name" as const, sortable: true },
    { header: "Price (₹)", accessor: (row: any) => <span className="font-bold">₹{row.price}</span> },
    { header: "Duration Period", accessor: (row: any) => <span>{row.duration} days</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Seller Plans config" subtitle="Configure and list subscription plans for store merchants">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
          <Plus size={16} />
          Create Plan
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={plans} />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Plan">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Membership Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Diamond Special"
              className="input"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2999"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Duration (Days)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="90"
                className="input"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 mt-4">
            Add Subscription Plan
          </button>
        </form>
      </FormModal>
    </div>
  );
}
