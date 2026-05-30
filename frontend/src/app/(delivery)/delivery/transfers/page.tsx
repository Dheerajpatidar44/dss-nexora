"use client";

import { useState } from "react";
import { Send, Building, Key, Plus, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { toast } from "sonner";

export default function DeliveryTransfersPage() {
  const [upi, setUpi] = useState("agent@upi");
  const [bankAccount, setBankAccount] = useState("XXXX XXXX 1234");
  const [ifsc, setIfsc] = useState("SBIN0001234");

  const handleUpdateUpi = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("UPI ID updated successfully!");
  };

  const handleUpdateBank = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bank details updated successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Fund Transfers" subtitle="Configure where your weekly earnings are deposited" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UPI Details */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Send size={18} className="text-teal-600" />
            <h3 className="font-bold text-gray-900">UPI Configuration</h3>
          </div>
          <form onSubmit={handleUpdateUpi} className="space-y-3">
            <div>
              <label className="label">UPI ID</label>
              <input
                type="text"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                placeholder="e.g. name@upi"
                className="input"
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary bg-teal-600 hover:bg-teal-700 py-2.5 font-bold">
              Update UPI ID
            </button>
          </form>
        </div>

        {/* Bank Details */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building size={18} className="text-teal-600" />
            <h3 className="font-bold text-gray-900">Bank Account details</h3>
          </div>
          <form onSubmit={handleUpdateBank} className="space-y-3">
            <div>
              <label className="label">Account Number</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Bank account number"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                placeholder="IFSC code"
                className="input"
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary bg-teal-600 hover:bg-teal-700 py-2.5 font-bold">
              Update Bank Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
