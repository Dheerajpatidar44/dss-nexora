"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

const flashSaleProducts = [
  { id: "1", name: "Organic Bananas (1kg)", price: 49, originalPrice: 79, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop", discount: 38, rating: 4.5, reviews: 234 },
  { id: "2", name: "Farm Fresh Eggs (12)", price: 89, originalPrice: 120, image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300&h=300&fit=crop", discount: 26, rating: 4.8, reviews: 512 },
  { id: "3", name: "Whole Wheat Bread", price: 45, originalPrice: 65, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop", discount: 31, rating: 4.3, reviews: 178 },
  { id: "4", name: "Greek Yogurt 500g", price: 120, originalPrice: 180, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop", discount: 33, rating: 4.7, reviews: 391 },
  { id: "5", name: "Fresh Orange Juice 1L", price: 99, originalPrice: 149, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop", discount: 34, rating: 4.6, reviews: 267 },
  { id: "6", name: "Almond Milk 1L", price: 149, originalPrice: 220, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop", discount: 32, rating: 4.4, reviews: 145 },
];

function CountdownTimer() {
  const [time, setTime] = useState({ h: 2, m: 45, s: 30 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 2, m: 45, s: 30 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1 text-white">
      {[pad(time.h), pad(time.m), pad(time.s)].map((unit, i) => (
        <div key={i} className="flex items-center">
          <div className="bg-white/20 rounded-lg px-2.5 py-1 text-lg font-black font-mono backdrop-blur-sm">
            {unit}
          </div>
          {i < 2 && <span className="mx-0.5 font-black text-lg">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function FlashSale() {
  return (
    <section className="py-8 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500">
      <div className="container-custom">
        {/* Flash Sale Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white">
              <Flame size={24} className="fill-white animate-pulse" />
              <div>
                <h2 className="text-xl font-black text-white">Flash Sale</h2>
                <p className="text-white/80 text-xs">Hurry! Deals expire soon</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <CountdownTimer />
            </div>
          </div>
          <Link href="/products?isFlashSale=true" className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all backdrop-blur-sm">
            See all <ArrowRight size={14} />
          </Link>
        </div>

        {/* Products Scroll */}
        <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2 -mx-4 px-4">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} isFlashSale />
          ))}
        </div>
      </div>
    </section>
  );
}
