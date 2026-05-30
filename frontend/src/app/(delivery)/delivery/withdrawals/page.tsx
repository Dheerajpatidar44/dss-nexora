"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, DollarSign, Clock, ArrowUpRight, HelpCircle } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { toast } from "sonner";

const mockWithdrawals = [
  { id: "WTH-2025-001", amount: 1500, method: "UPI / Google Pay", status: "completed", date: "May 25, 2025" },
  { id: "WTH-2025-002", amount: 2000, method: "Bank Transfer", status: "pending", date: "May 28, 2025" },
];

export default function DeliveryWithdrawalsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("UPI");

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success(`Withdrawal request for ₹${amount} submitted successfully!`);
    setIsOpen(false);
    setAmount("");
  };

  const columns = [
    { header: "Request ID", accessor: "id" as const },
    { header: "Amount", accessor: (row: any) => <span className="font-bold">₹{row.amount}</span> },
    { header: "Method", accessor: "method" as const },
    { header: "Date", accessor: "date" as const },
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
      <PageHeader title="Withdrawals" subtitle="Cash out your wallet balance to your bank account">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-teal-600 hover:bg-teal-700">
          Request Cashout
        </button>
      </PageHeader>

      {/* Balance card */}
      <div className="card p-5 bg-teal-600 text-white flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-teal-100 font-semibold uppercase tracking-wider">Withdrawable Balance</p>
          <h2 className="text-3xl font-black">₹4,250</h2>
        </div>
        <Wallet size={36} className="text-teal-200" />
      </div>

      {/* List */}
      <div className="card p-5">
        <h3 className="font-bold text-gray-900 mb-4">Cashout History</h3>
        <DataTable columns={columns} data={mockWithdrawals} />
      </div>

      {/* Form Modal */}
      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Request Cashout">
        <form onSubmit={handleRequest} className="space-y-4">
          <div>
            <label className="label">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to withdraw"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="input"
            >
              <option value="UPI">UPI / Google Pay</option>
              <option value="BANK">Direct Bank Transfer</option>
            </select>
          </div>
          <button type="submit" className="w-full btn-primary bg-teal-600 hover:bg-teal-700 py-3 mt-4">
            Submit Request
          </button>
        </form>
      </FormModal>
    </div>
  );
}
