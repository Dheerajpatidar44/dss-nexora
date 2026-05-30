"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { User, Lock, Settings } from "lucide-react";
import { toast } from "sonner";

export default function VendorSettingsPage() {
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("vendor@dssnexus.com");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Please enter both old and new passwords");
      return;
    }
    toast.success("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Store Settings" subtitle="Configure vendor account preferences and security options" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <User size={18} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Store Manager Profile</h3>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div>
              <label className="label">Manager Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Manager Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary bg-blue-600 hover:bg-blue-700 py-2.5 font-bold">
              Update Profile
            </button>
          </form>
        </div>

        {/* Security Card */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Lock size={18} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">Security Credentials</h3>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div>
              <label className="label">Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary bg-blue-600 hover:bg-blue-700 py-2.5 font-bold">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
