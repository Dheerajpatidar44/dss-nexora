"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockCategories = [
  { id: "CAT-001", name: "Fruits & Veg", slug: "fruits-vegetables", status: "active" },
  { id: "CAT-002", name: "Dairy & Eggs", slug: "dairy-eggs", status: "active" },
  { id: "CAT-003", name: "Beverages", slug: "beverages", status: "active" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      toast.error("Please fill in all fields");
      return;
    }

    const newCat = {
      id: `CAT-00${categories.length + 1}`,
      name,
      slug,
      status: "active",
    };

    setCategories([...categories, newCat]);
    toast.success("Category created successfully!");
    setIsOpen(false);
    setName("");
    setSlug("");
  };

  const columns = [
    { header: "Category ID", accessor: "id" as const },
    { header: "Category Name", accessor: "name" as const, sortable: true },
    { header: "Slug URL", accessor: "slug" as const },
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
      <PageHeader title="Store Categories" subtitle="Manage product catalog category groupings">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
          <Plus size={16} />
          Create Category
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={categories} searchKey="name" searchPlaceholder="Search categories..." />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Category">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Snacks & Candies"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Slug URL</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="snacks-candies"
              className="input"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 mt-4">
            Add Category
          </button>
        </form>
      </FormModal>
    </div>
  );
}
