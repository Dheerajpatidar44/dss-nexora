"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockZones = [
  { id: "ZON-1", name: "Mumbai West Zone", pincodes: "400001, 400002", charge: 40 },
  { id: "ZON-2", name: "Navi Mumbai Zone", pincodes: "400701, 400702", charge: 60 },
];

export default function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState(mockZones);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [pincodes, setPincodes] = useState("");
  const [charge, setCharge] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pincodes || !charge) return;

    const newZon = {
      id: `ZON-${zones.length + 1}`,
      name,
      pincodes,
      charge: Number(charge),
    };

    setZones([...zones, newZon]);
    toast.success("Delivery zone created successfully!");
    setIsOpen(false);
    setName("");
    setPincodes("");
    setCharge("");
  };

  const columns = [
    { header: "Zone ID", accessor: "id" as const },
    { header: "Zone Name", accessor: "name" as const, sortable: true },
    { header: "Pincodes Covered", accessor: "pincodes" as const },
    { header: "Delivery Charge", accessor: (row: any) => <span>₹{row.charge}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Shipping & Delivery Zones" subtitle="Configure platform delivery zones and shipping prices based on pincodes">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
          <Plus size={16} />
          Add Zone
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={zones} />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Delivery Zone">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Zone Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pune City Zone"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Pincodes Covered (comma separated)</label>
            <input
              type="text"
              value={pincodes}
              onChange={(e) => setPincodes(e.target.value)}
              placeholder="e.g. 411001, 411002"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Delivery Charge (₹)</label>
            <input
              type="number"
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
              placeholder="e.g. 40"
              className="input"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 mt-4">
            Add Zone
          </button>
        </form>
      </FormModal>
    </div>
  );
}
