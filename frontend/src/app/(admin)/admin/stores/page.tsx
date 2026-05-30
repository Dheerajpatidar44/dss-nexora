"use client";

import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";

const mockStores = [
  { id: "STR-01", name: "FreshMart Express", owner: "Jane Doe", rating: 4.8, status: "active" },
  { id: "STR-02", name: "BakeryWorld", owner: "John Smith", rating: 4.7, status: "active" },
  { id: "STR-03", name: "MeatMaster", owner: "Rohan Verma", rating: 4.9, status: "active" },
];

export default function AdminStoresPage() {
  const columns = [
    { header: "Store ID", accessor: "id" as const },
    { header: "Store Name", accessor: "name" as const, sortable: true },
    { header: "Owner", accessor: "owner" as const },
    { header: "Rating", accessor: (row: any) => <span>{row.rating} ★</span> },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className="badge badge-green">{row.status}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Registered Stores" subtitle="Moderate active vendor outlets listed on the marketplace" />

      <div className="card p-5">
        <DataTable columns={columns} data={mockStores} searchKey="name" searchPlaceholder="Search by store name..." />
      </div>
    </div>
  );
}
