"use client";

import PageHeader from "@/components/common/PageHeader";
import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const mockReviews = [
  { id: "REV-12", customer: "Priya Sharma", rating: 5, comment: "Avocados were perfectly ripe! Excellent quality and super fast delivery.", product: "Organic Avocado (3 pcs)" },
  { id: "REV-11", customer: "Karan Singh", rating: 4, comment: "Bread was fresh, but the packing could have been a bit better.", product: "Whole Wheat Bread" },
];

export default function VendorReviewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customer Reviews" subtitle="Read comments and ratings on your store products catalog" />

      {/* Average rating cards */}
      <div className="card p-5 flex items-center justify-between bg-yellow-50/50 border-yellow-100 max-w-md">
        <div className="space-y-1">
          <p className="text-xs text-yellow-700 font-bold uppercase tracking-wider">Average store Rating</p>
          <h2 className="text-3xl font-black text-yellow-800">4.8 ★</h2>
          <p className="text-xs text-gray-500">Based on 145 ratings</p>
        </div>
        <Star size={36} className="text-yellow-600 fill-yellow-500" />
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {mockReviews.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="card p-5 space-y-3"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">{item.customer}</span>
                <span className="text-gray-400 text-xs">({item.product})</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < item.rating ? "text-yellow-500 fill-yellow-400" : "text-gray-200"}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed font-medium">"{item.comment}"</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
