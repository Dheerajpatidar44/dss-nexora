"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Clock } from "lucide-react";

const stores = [
  { id: "1", name: "FreshMart Express", logo: "🛒", deliveryTime: "20-30 min", rating: 4.8, reviews: 1240, categories: "Groceries · Fruits · Dairy" },
  { id: "2", name: "BakeryWorld", logo: "🥖", deliveryTime: "25-35 min", rating: 4.7, reviews: 892, categories: "Bread · Cakes · Pastries" },
  { id: "3", name: "MeatMaster", logo: "🥩", deliveryTime: "35-45 min", rating: 4.9, reviews: 567, categories: "Meat · Seafood · Poultry" },
  { id: "4", name: "DrinkHub", logo: "🥤", deliveryTime: "15-25 min", rating: 4.6, reviews: 2103, categories: "Juices · Smoothies · Water" },
];

export default function FeaturedStores() {
  return (
    <section className="section bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">Top Stores Near You</h2>
          <p className="text-gray-500 text-sm mt-1">The best local vendors, all in one place</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stores.map((store, i) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/stores/${store.id}`} className="card-hover p-5 block">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl">
                    {store.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{store.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-gray-700">{store.rating}</span>
                      <span className="text-xs text-gray-400">({store.reviews})</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">{store.categories}</p>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-primary" />
                  <span className="text-xs font-semibold text-primary">{store.deliveryTime}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
