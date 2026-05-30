"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockTaxes = [
  { id: "TAX-1", name: "GST 5%", rate: 5 },
  { id: "TAX-2", name: "GST 12%", rate: 12 },
  { id: "TAX-3", name: "GST 18%", rate: 18 },
];

export default function AdminTaxRatesPage() {
  const [taxes, setTaxes] = useState(mockTaxes);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rate) return;

    const newTax = {
      id: `TAX-${taxes.length + 1}`,
      name,
      rate: Number(rate),
    };

    setTaxes([...taxes, newTax]);
    toast.success("Tax rate added successfully!");
    setIsOpen(false);
    setName("");
    setRate("");
  };

  const columns = [
    { header: "Tax Code ID", accessor: "id" as const },
    { header: "Tax Label", accessor: "name" as const, sortable: true },
    { header: "Tax Rate (%)", accessor: (row: any) => <span>{row.rate}%</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Tax Rules & Rates" subtitle="Configure catalog tax slabs and rates">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
          <Plus size={16} />
          Add Tax Rate
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={taxes} />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Tax Rate">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Tax Label Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GST 28%"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Tax Rate Percentage (%)</label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="28"
              className="input"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 mt-4">
            Add Tax Rule
          </button>
        </form>
      </FormModal>
    </div>
  );
}
