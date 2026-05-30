"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus, Wallet } from "lucide-react";
import { toast } from "sonner";

const mockWithdrawals = [
  { id: "WTH-2025-001", amount: 5000, method: "UPI Transfer", status: "completed", date: "May 20, 2025" },
  { id: "WTH-2025-002", amount: 10000, method: "Bank Account Transfer", status: "pending", date: "May 28, 2025" },
];

export default function VendorWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState(mockWithdrawals);
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const newWth = {
      id: `WTH-2025-00${withdrawals.length + 1}`,
      amount: Number(amount),
      method: method === "UPI" ? "UPI Transfer" : "Bank Account Transfer",
      status: "pending",
      date: "Today",
    };

    setWithdrawals([newWth, ...withdrawals]);
    toast.success(`Withdrawal request for ₹${amount} submitted!`);
    setIsOpen(false);
    setAmount("");
  };

  const columns = [
    { header: "Request ID", accessor: "id" as const },
    { header: "Withdraw Amount", accessor: (row: any) => <span className="font-bold">₹{row.amount}</span> },
    { header: "Method", accessor: "method" as const },
    { header: "Date requested", accessor: "date" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.status === "completed" ? "badge-green" : "badge-orange"}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Store Withdrawals" subtitle="Submit manual wallet balance cashouts to your bank account">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5">
          <Plus size={16} />
          Withdraw Balance
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={withdrawals} />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Withdraw Balance">
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="label">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Destination method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="input"
            >
              <option value="UPI">UPI ID Transfer</option>
              <option value="BANK">Primary Bank Account</option>
            </select>
          </div>
          <button type="submit" className="w-full btn-primary bg-blue-600 hover:bg-blue-700 py-3 mt-4">
            Request Payout
          </button>
        </form>
      </FormModal>
    </div>
  );
}
