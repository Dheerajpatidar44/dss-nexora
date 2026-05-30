"use client";

import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import StatCard from "@/components/common/StatCard";
import { Award, Users, DollarSign } from "lucide-react";

const mockReferrals = [
  { id: "REF-01", referrer: "Arjun Kumar", referee: "Amit Sharma", bonus: 100, date: "May 28, 2025", status: "rewarded" },
  { id: "REF-02", referrer: "Priya Shah", referee: "Kajal Patel", bonus: 100, date: "May 29, 2025", status: "pending" },
];

export default function AdminReferralsPage() {
  const columns = [
    { header: "Referral ID", accessor: "id" as const },
    { header: "Referrer (Invited By)", accessor: "referrer" as const, sortable: true },
    { header: "Referee (Joined Customer)", accessor: "referee" as const },
    { header: "Bonus Earned", accessor: (row: any) => <span>₹{row.bonus}</span> },
    { header: "Date joined", accessor: "date" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`badge ${row.status === "rewarded" ? "badge-green" : "badge-orange"}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Refer & Earn program" subtitle="Track user invitation metrics and referral earnings payouts" />

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Invites" value="1,240" icon={Users} bg="bg-green-50" iconColor="text-green-600" />
        <StatCard title="Successful Referrals" value="985" icon={Award} bg="bg-green-50" iconColor="text-green-600" />
        <StatCard title="Payouts Distributed" value="₹98,500" icon={DollarSign} bg="bg-green-50" iconColor="text-green-600" />
      </div>

      <div className="card p-5">
        <DataTable columns={columns} data={mockReferrals} />
      </div>
    </div>
  );
}
