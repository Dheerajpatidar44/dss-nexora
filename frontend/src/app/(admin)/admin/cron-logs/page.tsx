"use client";

import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { Clock } from "lucide-react";

const mockCronLogs = [
  { id: "CRN-998", name: "Settlement Processor", date: "Today, 2:00 AM", duration: "1.4s", status: "success" },
  { id: "CRN-997", name: "Subscription Expiry Checker", date: "Today, 12:00 AM", duration: "0.8s", status: "success" },
  { id: "CRN-996", name: "Expired Sessions Cleanup", date: "Yesterday, 11:00 PM", duration: "0.2s", status: "success" },
];

export default function AdminCronLogsPage() {
  const columns = [
    { header: "Cron Job ID", accessor: "id" as const },
    { header: "Task name", accessor: "name" as const, sortable: true },
    { header: "Run schedule / Time", accessor: "date" as const },
    { header: "Execution Duration", accessor: "duration" as const },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className="badge badge-green">{row.status}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Cron Monitor" subtitle="Check background scheduler logs and job execution times" />

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">Cron Logs</h3>
        </div>
        <DataTable columns={columns} data={mockCronLogs} />
      </div>
    </div>
  );
}
