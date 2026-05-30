"use client";

import { useState } from "react";
import { Star, Flame } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

// Make this type generic enough or export it from a types file later
export interface ProductType {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  discount?: number;
}

export default function ProductCard({ product, isFlashSale = false }: { product: ProductType; isFlashSale?: boolean }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      _id: product.id,
      name: product.name,
      thumbnail: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: 50,
      vendorId: "v1",
      storeId: "s1",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="product-card bg-white flex-shrink-0 w-44 md:w-52">
      <div className="relative overflow-hidden">
        {/* Discount Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="badge bg-red-500 text-white text-[10px] font-black">
            -{discount}%
          </span>
        </div>
        {isFlashSale && (
          <div className="absolute top-2 right-2 z-10">
            <Flame size={14} className="text-orange-500" />
          </div>
        )}
        <div className="relative h-40 overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">{product.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-base font-black text-gray-900">₹{product.price}</span>
            <span className="text-xs text-gray-400 line-through ml-1">₹{product.originalPrice}</span>
          </div>
          <button
            onClick={handleAddToCart}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all active:scale-90",
              added ? "bg-primary scale-95" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
