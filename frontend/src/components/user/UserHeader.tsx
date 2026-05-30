"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, ChevronRight, Zap, User } from "lucide-react";
import { useState } from "react";

export default function UserHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center h-[76px] gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/logo.png" alt="DSS Nexus Commerce" width={120} height={40} className="w-auto h-[46px] object-contain" priority />
          </Link>

          {/* Delivery Location (Zepto Style) */}
          <div className="hidden md:flex flex-col flex-shrink-0 cursor-pointer border-r border-gray-100 pr-6 pl-2">
            <div className="flex items-center gap-1 font-bold text-[14px] text-gray-900">
              <Zap size={14} className="fill-gray-900" />
              6 minutes
            </div>
            <div className="text-[12px] text-gray-500 flex items-center gap-1">
              <span className="font-bold text-gray-800">Mumbai</span> - 400001
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-3xl">
            <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder='Search for "banana"'
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Actions (Zepto Style) */}
          <div className="flex items-center gap-8 pl-4 pr-2">
            <Link href="/login" className="flex flex-col items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors">
              <User size={24} strokeWidth={1.5} />
              <span className="text-[12px] font-medium leading-none">Login</span>
            </Link>
            <Link href="/cart" className="flex flex-col items-center gap-1 text-gray-700 hover:text-gray-900 transition-colors relative">
              <div className="relative">
                <ShoppingCart size={24} strokeWidth={1.5} />
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  0
                </span>
              </div>
              <span className="text-[12px] font-medium leading-none">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
