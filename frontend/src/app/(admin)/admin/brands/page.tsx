"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockBrands = [
  { id: "BRD-001", name: "Amul", status: "active" },
  { id: "BRD-002", name: "Britannia", status: "active" },
  { id: "BRD-003", name: "Pepsi", status: "active" },
];

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState(mockBrands);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newBrand = {
      id: `BRD-00${brands.length + 1}`,
      name,
      status: "active",
    };

    setBrands([...brands, newBrand]);
    toast.success("Brand created successfully!");
    setIsOpen(false);
    setName("");
  };

  const columns = [
    { header: "Brand ID", accessor: "id" as const },
    { header: "Brand Name", accessor: "name" as const, sortable: true },
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
      <PageHeader title="Brand Management" subtitle="Manage product catalog brands">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
          <Plus size={16} />
          Add Brand
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={brands} searchKey="name" searchPlaceholder="Search brands..." />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Brand">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Brand Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Coca-Cola"
              className="input"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 mt-4">
            Add Brand
          </button>
        </form>
      </FormModal>
    </div>
  );
}
