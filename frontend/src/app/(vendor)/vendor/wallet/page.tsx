"use client";

import { motion } from "framer-motion";
import { Wallet, CircleDollarSign, History } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";

const mockTransactions = [
  { id: "TXN-102", amount: 1240, type: "credit", desc: "Order payment: ORD-2025-001", date: "May 29, 2025" },
  { id: "TXN-101", amount: 8500, type: "debit", desc: "Automatic weekly payout to bank", date: "May 24, 2025" },
  { id: "TXN-100", amount: 3450, type: "credit", desc: "Order payment: ORD-2025-002", date: "May 24, 2025" },
];

export default function VendorWalletPage() {
  const columns = [
    { header: "Transaction ID", accessor: "id" as const },
    { header: "Description", accessor: "desc" as const },
    { header: "Date", accessor: "date" as const },
    {
      header: "Amount",
      accessor: (row: any) => (
        <span className={`font-bold ${row.type === "credit" ? "text-green-600" : "text-red-500"}`}>
          {row.type === "credit" ? "+" : "-"}₹{row.amount}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Store Wallet" subtitle="Check sales earnings ledger and direct deposits" />

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5 bg-blue-600 text-white flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Available Balance</p>
            <h2 className="text-3xl font-black mt-1">₹14,250</h2>
          </div>
          <Wallet size={36} className="text-blue-200" />
        </div>

        <div className="card p-5 bg-emerald-600 text-white flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-100 font-semibold uppercase tracking-wider">Total Payouts Done</p>
            <h2 className="text-3xl font-black mt-1">₹1,85,000</h2>
          </div>
          <CircleDollarSign size={36} className="text-emerald-200" />
        </div>
      </div>

      {/* Transactions */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <History size={16} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">Wallet Transactions</h3>
        </div>
        <DataTable columns={columns} data={mockTransactions} />
      </div>
    </div>
  );
}
