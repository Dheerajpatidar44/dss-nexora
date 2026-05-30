"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import FormModal from "@/components/common/FormModal";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const mockAdminUsers = [
  { id: "ADM-01", name: "Alice Johnson", email: "alice@dssnexus.com", role: "Super Admin" },
  { id: "ADM-02", name: "Bob Carter", email: "bob@dssnexus.com", role: "Manager" },
];

export default function AdminSystemUsersPage() {
  const [users, setUsers] = useState(mockAdminUsers);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Manager");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUsr = {
      id: `ADM-0${users.length + 1}`,
      name,
      email,
      role,
    };

    setUsers([...users, newUsr]);
    toast.success("System user created successfully!");
    setIsOpen(false);
    setName("");
    setEmail("");
  };

  const columns = [
    { header: "User ID", accessor: "id" as const },
    { header: "User Name", accessor: "name" as const, sortable: true },
    { header: "Email Address", accessor: "email" as const },
    { header: "Administrative Role", accessor: "role" as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="System Users" subtitle="Manage back-office admin system users">
        <button onClick={() => setIsOpen(true)} className="btn-primary bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
          <Plus size={16} />
          Add User
        </button>
      </PageHeader>

      <div className="card p-5">
        <DataTable columns={columns} data={users} searchKey="name" searchPlaceholder="Search users..." />
      </div>

      <FormModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add User">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Charlie Brown"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="charlie@dssnexus.com"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Admin Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Manager">Manager</option>
              <option value="Fleet Supervisor">Fleet Supervisor</option>
            </select>
          </div>
          <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 mt-4">
            Add Administrative User
          </button>
        </form>
      </FormModal>
    </div>
  );
}
