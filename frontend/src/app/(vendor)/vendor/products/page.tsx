"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus, Tag } from "lucide-react";
import { toast } from "sonner";

const mockProducts = [
  { id: "PROD-001", name: "Organic Bananas (1kg)", price: 49, stock: 120, status: "active", category: "Fruits & Veg" },
  { id: "PROD-002", name: "Farm Fresh Eggs (12)", price: 89, stock: 85, status: "active", category: "Dairy & Eggs" },
  { id: "PROD-003", name: "Whole Wheat Bread", price: 45, stock: 4, status: "active", category: "Bakery" },
];

export default function VendorProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Fruits & Veg");

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      toast.error("Please fill in all fields");
      return;
    }

    const newProduct = {
      id: `PROD-00${products.length + 1}`,
      name,
      price: Number(price),
      stock: Number(stock),
      status: "active",
      category,
    };

    setProducts([newProduct, ...products]);
    toast.success("Product added successfully!");
    setIsOpen(false);
    setName("");
    setPrice("");
    setStock("");
  };

  const columns = [
    { header: "Product ID", accessor: "id" as const, sortable: true },
    { header: "Name", accessor: "name" as const, sortable: true },
    { header: "Category", accessor: "category" as const },
    { header: "Price", accessor: (row: any) => <span>₹{row.price}</span> },
    {
      header: "Stock",
      accessor: (row: any) => (
        <span className={row.stock <= 5 ? "text-red-500 font-bold" : "text-gray-700"}>
          {row.stock} items {row.stock <= 5 && "(Low)"}
        </span>
      ),
    },
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
      <PageHeader title="Store Catalog" subtitle="Add and manage inventory products">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5">
          <Plus size={16} />
          Add Product
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={products} searchKey="name" searchPlaceholder="Search products..." />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add New Product">
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="label">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fresh Mangoes 1kg"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value="Fruits & Veg">Fruits & Veg</option>
              <option value="Dairy & Eggs">Dairy & Eggs</option>
              <option value="Bakery">Bakery</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="99"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="input"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full btn-primary bg-blue-600 hover:bg-blue-700 py-3 mt-4">
            Add Product to Catalog
          </button>
        </form>
      </FormModal>
    </div>
  );
}
