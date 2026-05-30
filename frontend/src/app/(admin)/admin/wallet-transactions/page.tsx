"use client";

import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { CircleDollarSign } from "lucide-react";

const mockTxns = [
  { id: "TXN-5011", user: "Arjun Kumar", amount: 1500, type: "deposit", date: "May 29, 2025" },
  { id: "TXN-5010", user: "Priya Shah", amount: 450, type: "refund", date: "May 28, 2025" },
  { id: "TXN-5009", user: "Rahul Verma", amount: 890, type: "payment", date: "May 28, 2025" },
];

export default function AdminWalletTransactionsPage() {
  const columns = [
    { header: "Transaction ID", accessor: "id" as const },
    { header: "User / Customer", accessor: "user" as const, sortable: true },
    { header: "Date", accessor: "date" as const },
    { header: "Type", accessor: (row: any) => <span className="badge badge-gray">{row.type}</span> },
    {
      header: "Amount",
      accessor: (row: any) => (
        <span className={`font-bold ${row.type === "deposit" || row.type === "refund" ? "text-green-600" : "text-red-500"}`}>
          {row.type === "deposit" || row.type === "refund" ? "+" : "-"}₹{row.amount}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Wallets Ledger" subtitle="Platform-wide ledger of customer deposits, payments, and refund transactions" />

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <CircleDollarSign size={16} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">Platform Wallet Logs</h3>
        </div>
        <DataTable columns={columns} data={mockTxns} searchKey="user" searchPlaceholder="Search by customer..." />
      </div>
    </div>
  );
}
