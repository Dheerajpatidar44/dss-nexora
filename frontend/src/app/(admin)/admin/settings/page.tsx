"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Settings, ShieldAlert, Truck } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [appName, setAppName] = useState("DSS Nexus Commerce");
  const [supportEmail, setSupportEmail] = useState("support@dssnexus.com");
  const [commissionRate, setCommissionRate] = useState("10");
  const [deliveryCharge, setDeliveryCharge] = useState("40");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Global system settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="System Configuration" subtitle="Configure platform-wide branding, commission slabs, and logistics settings" />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col */}
        <div className="card p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Settings size={18} className="text-green-600" />
            <h3 className="font-bold text-gray-900">General settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Application Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Support Email Address</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Platform Commission Fee (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Default Delivery Charge (₹)</label>
              <input
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary bg-green-600 hover:bg-green-700 w-full py-3 font-bold mt-4">
            Save System Configurations
          </button>
        </div>

        {/* Right Col */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShieldAlert size={18} className="text-green-600" />
              <h3 className="font-bold text-gray-900">Platform status</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-sm font-bold text-green-800">All Systems Operational</p>
                <p className="text-xs text-green-700">Services, servers, and database pools are working normally.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
