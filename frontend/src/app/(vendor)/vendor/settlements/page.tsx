"use client";

import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { Receipt } from "lucide-react";

const mockSettlements = [
  { id: "SET-9912", amount: 8500, taxDeducted: 150, platformFee: 250, bankName: "State Bank of India", date: "May 24, 2025", status: "settled" },
  { id: "SET-9911", amount: 14200, taxDeducted: 240, platformFee: 400, bankName: "State Bank of India", date: "May 17, 2025", status: "settled" },
];

export default function VendorSettlementsPage() {
  const columns = [
    { header: "Settlement ID", accessor: "id" as const },
    { header: "Amount Deposited", accessor: (row: any) => <span className="font-bold">₹{row.amount}</span> },
    { header: "Platform Fee", accessor: (row: any) => <span className="text-gray-500">₹{row.platformFee}</span> },
    { header: "Bank Account", accessor: "bankName" as const },
    { header: "Settled Date", accessor: "date" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className="badge badge-green">{row.status}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Bank Settlements" subtitle="Log of daily automated store sales deposits into your bank account" />

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={16} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">Settlements Ledger</h3>
        </div>
        <DataTable columns={columns} data={mockSettlements} />
      </div>
    </div>
  );
}
