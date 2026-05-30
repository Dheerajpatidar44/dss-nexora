"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Store, Clock, Truck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function VendorStorePage() {
  const [storeName, setStoreName] = useState("FreshMart Express");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [deliveryTime, setDeliveryTime] = useState("20-30 min");
  const [deliveryCharge, setDeliveryCharge] = useState("40");
  const [isOpen, setIsOpen] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Store details saved successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Store Configuration" subtitle="Configure timings, banners, and delivery logistics" />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Config Inputs */}
        <div className="card p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Store size={18} className="text-blue-600" />
            <h3 className="font-bold text-gray-900">General Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Store Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Estimated Delivery Time</label>
              <input
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Delivery Charge (₹)</label>
              <input
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_open"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_open" className="text-sm font-semibold text-gray-700">
              Store is currently open and accepting orders
            </label>
          </div>

          <button type="submit" className="btn-primary bg-blue-600 hover:bg-blue-700 w-full py-3 font-bold mt-4">
            Save Store Details
          </button>
        </div>

        {/* Right Col - Status Notice */}
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShieldAlert size={18} className="text-blue-600" />
              <h3 className="font-bold text-gray-900">Verification Status</h3>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <p className="text-sm font-bold text-green-800">Verified Seller</p>
                <p className="text-xs text-green-700">Your store is fully active and listed on the marketplace app.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
