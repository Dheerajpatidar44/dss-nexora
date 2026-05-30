"use client";

import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import { ShieldAlert } from "lucide-react";

const mockRoles = [
  { id: "ROL-1", role: "Super Admin", permissions: "Full Access" },
  { id: "ROL-2", role: "Manager", permissions: "Moderate catalog, orders, support tickets" },
  { id: "ROL-3", role: "Fleet Supervisor", permissions: "Manage delivery fleet, delivery zones" },
];

export default function AdminRolesPage() {
  const columns = [
    { header: "Role ID", accessor: "id" as const },
    { header: "Role Name", accessor: "role" as const, sortable: true },
    { header: "Permissions Scope", accessor: "permissions" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Access Control (RBAC)" subtitle="Modify system permissions scope for administrative users" />

      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert size={16} className="text-gray-400" />
          <h3 className="font-bold text-gray-900">Administrative Roles</h3>
        </div>
        <DataTable columns={columns} data={mockRoles} />
      </div>
    </div>
  );
}
