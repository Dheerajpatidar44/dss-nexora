"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  ShoppingBag, Shirt, Smartphone, Sparkles, Laptop, Home, Baby, Apple, BookOpen, Armchair
} from "lucide-react";

const categories = [
  { name: "For You", icon: ShoppingBag, href: "/products?category=for-you", active: true },
  { name: "Fashion", icon: Shirt, href: "/products?category=fashion" },
  { name: "Mobiles", icon: Smartphone, href: "/products?category=mobiles" },
  { name: "Beauty", icon: Sparkles, href: "/products?category=beauty" },
  { name: "Electronics", icon: Laptop, href: "/products?category=electronics" },
  { name: "Home", icon: Home, href: "/products?category=home" },
  { name: "Toys, Baby", icon: Baby, href: "/products?category=toys" },
  { name: "Food & Health", icon: Apple, href: "/products?category=food" },
  { name: "Books", icon: BookOpen, href: "/products?category=books" },
  { name: "Furniture", icon: Armchair, href: "/products?category=furniture" },
];

export default function CategoryNav() {
  return (
    <section className="bg-white border-b border-gray-100 shadow-sm relative z-40">
      <div className="container-custom">
        <div className="flex items-center gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={cn(
                "flex items-center gap-2 cursor-pointer group py-[14px] border-b-[3px] transition-all shrink-0",
                cat.active ? "border-primary" : "border-transparent hover:border-gray-200"
              )}
            >
              <cat.icon size={20} strokeWidth={cat.active ? 2 : 1.5} className={cn(cat.active ? "text-primary" : "text-gray-500 group-hover:text-gray-800")} />
              <span className={cn(
                "text-[15px] whitespace-nowrap",
                cat.active ? "font-bold text-primary" : "font-medium text-gray-600 group-hover:text-gray-900"
              )}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
