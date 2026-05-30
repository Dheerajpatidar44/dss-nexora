"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockPromo = [
  { id: "PRM-001", code: "WELCOME150", value: 150, type: "fixed", minAmount: 499, status: "active" },
  { id: "PRM-002", code: "SUPERDEAL", value: 10, type: "percent", minAmount: 1200, status: "active" },
];

export default function AdminPromoCodesPage() {
  const [promos, setPromos] = useState(mockPromo);
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("fixed");
  const [minAmount, setMinAmount] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value || !minAmount) return;

    const newPrm = {
      id: `PRM-00${promos.length + 1}`,
      code: code.toUpperCase(),
      value: Number(value),
      type,
      minAmount: Number(minAmount),
      status: "active",
    };

    setPromos([...promos, newPrm]);
    toast.success("Coupon code created successfully!");
    setIsOpen(false);
    setCode("");
    setValue("");
    setMinAmount("");
  };

  const columns = [
    { header: "Coupon Code", accessor: "code" as const, sortable: true },
    { header: "Value Discount", accessor: (row: any) => <span>{row.type === "percent" ? `${row.value}%` : `₹${row.value}`}</span> },
    { header: "Min Order Req", accessor: (row: any) => <span>₹{row.minAmount}</span> },
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
      <PageHeader title="Discount Coupons" subtitle="Manage promo discount coupons and offers code">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
          <Plus size={16} />
          Create Coupon
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={promos} searchKey="code" searchPlaceholder="Search coupons..." />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Coupon">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. FESTIVE20"
              className="input uppercase"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Discount Value</label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="20"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Flat Cash (₹)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Minimum Order Requirement (₹)</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="e.g. 500"
              className="input"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 mt-4">
            Save Coupon Code
          </button>
        </form>
      </FormModal>
    </div>
  );
}
