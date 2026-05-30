"use client";

import { motion } from "framer-motion";
import { Receipt, Calendar, CreditCard, ChevronRight } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";

const mockPayouts = [
  { id: "PAY-2025-021", range: "May 18 - May 24", basePay: 2500, incentives: 850, fuelAllowance: 450, total: 3800, status: "paid" },
  { id: "PAY-2025-020", range: "May 11 - May 17", basePay: 2200, incentives: 600, fuelAllowance: 400, total: 3200, status: "paid" },
];

export default function DeliverySalaryPage() {
  const columns = [
    { header: "Payout ID", accessor: "id" as const },
    { header: "Week Range", accessor: "range" as const },
    { header: "Base Pay", accessor: (row: any) => <span>₹{row.basePay}</span> },
    { header: "Incentives", accessor: (row: any) => <span className="text-green-600">+₹{row.incentives}</span> },
    { header: "Fuel", accessor: (row: any) => <span>₹{row.fuelAllowance}</span> },
    { header: "Total Paid", accessor: (row: any) => <span className="font-bold text-gray-900">₹{row.total}</span> },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.status === "paid" ? "badge-green" : "badge-orange"}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Earnings & Salary" subtitle="Weekly base pay and incentive payouts statements" />

      {/* Salary Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 bg-white space-y-1">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">This Week base pay</p>
          <h3 className="text-2xl font-black text-gray-900">₹1,800</h3>
        </div>
        <div className="card p-5 bg-white space-y-1">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">This Week Incentives</p>
          <h3 className="text-2xl font-black text-green-600">₹450</h3>
        </div>
        <div className="card p-5 bg-white space-y-1">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Fuel Allowance</p>
          <h3 className="text-2xl font-black text-gray-900">₹300</h3>
        </div>
      </div>

      {/* History Table */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={16} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">Payout Statements</h3>
        </div>
        <DataTable columns={columns} data={mockPayouts} />
      </div>
    </div>
  );
}
