"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const featuredProducts = [
  { id: "7", name: "Wild Salmon Fillet 500g", price: 399, originalPrice: 550, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=300&fit=crop", rating: 4.9, reviews: 823 },
  { id: "8", name: "Artisan Sourdough Bread", price: 180, originalPrice: 220, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&h=300&fit=crop", rating: 4.8, reviews: 456 },
  { id: "9", name: "Cold Brew Coffee 500ml", price: 249, originalPrice: 320, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop", rating: 4.7, reviews: 312 },
  { id: "10", name: "Avocado (3 pcs)", price: 159, originalPrice: 200, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop", rating: 4.6, reviews: 198 },
  { id: "11", name: "Mango Smoothie 500ml", price: 89, originalPrice: 120, image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300&h=300&fit=crop", rating: 4.5, reviews: 284 },
];

export default function FeaturedProducts() {
  return (
    <section className="section">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Featured Products</h2>
            <p className="text-gray-500 text-sm mt-0.5">Handpicked just for you</p>
          </div>
          <Link href="/products?isFeatured=true" className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
            See all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2 -mx-4 px-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
