"use client";

import PageHeader from "@/components/common/PageHeader";
import { Check, Star } from "lucide-react";
import { toast } from "sonner";

const plans = [
  { name: "Bronze Starter", price: 999, duration: "30 days", maxProducts: 20, commission: "10% commission fee", features: ["Up to 20 active products", "Standard delivery boy assignments", "Basic store performance reports"] },
  { name: "Silver Professional", price: 2499, duration: "90 days", maxProducts: 100, commission: "7% commission fee", features: ["Up to 100 active products", "Priority delivery boy assignments", "Advanced store analytics reports", "Premium custom banners support"], popular: true },
  { name: "Gold Enterprise", price: 4999, duration: "180 days", maxProducts: "Unlimited", commission: "5% commission fee", features: ["Unlimited product listings", "Direct delivery boy assignments", "Real-time POS access billing", "Custom brand deals promotion support"] },
];

export default function VendorSubscriptionsPage() {
  const handleSelectPlan = (name: string) => {
    toast.success(`Redirecting to payment gateway for the ${name} subscription!`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Seller Membership Plans" subtitle="Upgrade your active subscription to list more products and lower transaction commission fees" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card p-6 flex flex-col justify-between relative overflow-hidden ${
              plan.popular ? "border-2 border-blue-600 shadow-lg" : "border border-gray-100"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Star size={10} className="fill-white" />
                Popular
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-black text-gray-900 text-lg">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-400 text-xs font-semibold">/ {plan.duration}</span>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-4 space-y-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                <p>LIMIT: {plan.maxProducts} PRODUCTS</p>
                <p className="text-blue-600">{plan.commission}</p>
              </div>

              <ul className="space-y-2.5 pt-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(plan.name)}
              className={`w-full py-3 rounded-xl font-bold text-sm mt-8 transition-all active:scale-95 ${
                plan.popular
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
