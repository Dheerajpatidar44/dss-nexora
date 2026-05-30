"use client";

import { motion } from "framer-motion";
import { Truck, Clock, Shield, RefreshCw } from "lucide-react";

const promises = [
  { icon: Truck, title: "Free Delivery", desc: "On orders above ₹499", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Clock, title: "30 Min Delivery", desc: "Lightning fast service", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: Shield, title: "100% Secure", desc: "Safe & encrypted checkout", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns", color: "text-orange-600", bg: "bg-orange-50" },
];

export default function DeliveryPromise() {
  return (
    <section className="py-6 bg-white border-b border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {promises.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <item.icon size={18} className={item.color} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
