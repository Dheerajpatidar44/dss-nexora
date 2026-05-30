"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Send, Bell, User } from "lucide-react";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success(`Broadcast message sent to ${target} target segment successfully!`);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Broadcast Alerts" subtitle="Send platform-wide push notifications and emails" />

      <form onSubmit={handleBroadcast} className="card p-5 space-y-4 max-w-lg">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Bell size={18} className="text-green-600" />
          <h3 className="font-bold text-gray-900">Configure Broadcast</h3>
        </div>

        <div>
          <label className="label">Target Segment</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)} className="input">
            <option value="all">All Users (Buyers & Sellers)</option>
            <option value="vendors">All Store Vendors</option>
            <option value="delivery">All Delivery Boys</option>
            <option value="customers">All Registered Customers</option>
          </select>
        </div>

        <div>
          <label className="label">Alert Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Scheduled System Update"
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">Alert Message Body</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter alert message details..."
            rows={4}
            className="input !h-auto"
            required
          />
        </div>

        <button type="submit" className="w-full btn-primary bg-green-600 hover:bg-green-700 py-3 font-bold flex items-center justify-center gap-2 shadow-md">
          <Send size={16} />
          Send Broadcast Now
        </button>
      </form>
    </div>
  );
}
