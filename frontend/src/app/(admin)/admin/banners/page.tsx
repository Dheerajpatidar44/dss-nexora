"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockBanners = [
  { id: "BNR-01", title: "Mega Summer Groceries Sale", position: "hero", status: "active" },
  { id: "BNR-02", title: "Fresh Fish & Salmon Boost", position: "section", status: "active" },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState(mockBanners);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("hero");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newBnr = {
      id: `BNR-0${banners.length + 1}`,
      title,
      position,
      status: "active",
    };

    setBanners([...banners, newBnr]);
    toast.success("Promo banner uploaded successfully!");
    setIsOpen(false);
    setTitle("");
  };

  const columns = [
    { header: "Banner ID", accessor: "id" as const },
    { header: "Ad Banner Title", accessor: "title" as const, sortable: true },
    { header: "Layout Position", accessor: "position" as const },
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
      <PageHeader title="Marketing Banners" subtitle="Configure and list promotional banners on customer homepage">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
          <Plus size={16} />
          Upload Banner
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={banners} searchKey="title" searchPlaceholder="Search banners..." />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Upload Banner">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Banner Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Winter Fresh veggies promo"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Layout position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="input"
            >
              <option value="hero">Hero Top Slider</option>
              <option value="section">Middle Banner Section</option>
              <option value="category">Category Promo Card</option>
            </select>
          </div>
          <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 mt-4">
            Upload Banner
          </button>
        </form>
      </FormModal>
    </div>
  );
}
