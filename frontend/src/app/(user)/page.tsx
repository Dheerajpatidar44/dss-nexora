"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search, ShoppingCart, ChevronRight, Star, Zap, Clock,
  Shield, Truck, RefreshCw, ArrowRight, Flame, Tag
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const categories = [
  { name: "Fruits & Veg", icon: "🥦", color: "bg-green-50 border-green-100", href: "/products?category=fruits-vegetables" },
  { name: "Dairy & Eggs", icon: "🥚", color: "bg-yellow-50 border-yellow-100", href: "/products?category=dairy-eggs" },
  { name: "Beverages", icon: "🥤", color: "bg-blue-50 border-blue-100", href: "/products?category=beverages" },
  { name: "Snacks", icon: "🍿", color: "bg-orange-50 border-orange-100", href: "/products?category=snacks" },
  { name: "Bakery", icon: "🍞", color: "bg-amber-50 border-amber-100", href: "/products?category=bakery" },
  { name: "Meat & Fish", icon: "🥩", color: "bg-red-50 border-red-100", href: "/products?category=meat-seafood" },
  { name: "Personal Care", icon: "🧴", color: "bg-purple-50 border-purple-100", href: "/products?category=personal-care" },
  { name: "Electronics", icon: "📱", color: "bg-gray-50 border-gray-100", href: "/products?category=electronics" },
  { name: "Fashion", icon: "👕", color: "bg-pink-50 border-pink-100", href: "/products?category=fashion" },
  { name: "Home & Kitchen", icon: "🍳", color: "bg-teal-50 border-teal-100", href: "/products?category=home-kitchen" },
  { name: "Toys & Games", icon: "🎮", color: "bg-indigo-50 border-indigo-100", href: "/products?category=toys-games" },
  { name: "Health", icon: "💊", color: "bg-emerald-50 border-emerald-100", href: "/products?category=health-wellness" },
];

const flashSaleProducts = [
  { id: "1", name: "Organic Bananas (1kg)", price: 49, originalPrice: 79, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop", discount: 38, rating: 4.5, reviews: 234 },
  { id: "2", name: "Farm Fresh Eggs (12)", price: 89, originalPrice: 120, image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300&h=300&fit=crop", discount: 26, rating: 4.8, reviews: 512 },
  { id: "3", name: "Whole Wheat Bread", price: 45, originalPrice: 65, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop", discount: 31, rating: 4.3, reviews: 178 },
  { id: "4", name: "Greek Yogurt 500g", price: 120, originalPrice: 180, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop", discount: 33, rating: 4.7, reviews: 391 },
  { id: "5", name: "Fresh Orange Juice 1L", price: 99, originalPrice: 149, image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=300&fit=crop", discount: 34, rating: 4.6, reviews: 267 },
  { id: "6", name: "Almond Milk 1L", price: 149, originalPrice: 220, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop", discount: 32, rating: 4.4, reviews: 145 },
];

const featuredProducts = [
  { id: "7", name: "Wild Salmon Fillet 500g", price: 399, originalPrice: 550, image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=300&fit=crop", rating: 4.9, reviews: 823 },
  { id: "8", name: "Artisan Sourdough Bread", price: 180, originalPrice: 220, image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&h=300&fit=crop", rating: 4.8, reviews: 456 },
  { id: "9", name: "Cold Brew Coffee 500ml", price: 249, originalPrice: 320, image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop", rating: 4.7, reviews: 312 },
  { id: "10", name: "Avocado (3 pcs)", price: 159, originalPrice: 200, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop", rating: 4.6, reviews: 198 },
  { id: "11", name: "Mango Smoothie 500ml", price: 89, originalPrice: 120, image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=300&h=300&fit=crop", rating: 4.5, reviews: 284 },
];

const stores = [
  { id: "1", name: "FreshMart Express", logo: "🛒", deliveryTime: "20-30 min", rating: 4.8, reviews: 1240, categories: "Groceries · Fruits · Dairy" },
  { id: "2", name: "BakeryWorld", logo: "🥖", deliveryTime: "25-35 min", rating: 4.7, reviews: 892, categories: "Bread · Cakes · Pastries" },
  { id: "3", name: "MeatMaster", logo: "🥩", deliveryTime: "35-45 min", rating: 4.9, reviews: 567, categories: "Meat · Seafood · Poultry" },
  { id: "4", name: "DrinkHub", logo: "🥤", deliveryTime: "15-25 min", rating: 4.6, reviews: 2103, categories: "Juices · Smoothies · Water" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Regular Customer", review: "DSS Nexus has completely changed how I shop. The delivery is lightning fast and the products are always fresh!", rating: 5 },
  { name: "Rahul Mehta", role: "Business Owner", review: "As a vendor, the platform is incredibly easy to use. My sales have grown 3x since joining.", rating: 5 },
  { name: "Ananya Reddy", role: "Home Chef", review: "The quality of groceries is exceptional. I can always find fresh, organic produce at great prices.", rating: 5 },
];

// ─── Countdown Timer ─────────────────────────────────────────────────────────
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

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, isFlashSale = false }: { product: typeof flashSaleProducts[0]; isFlashSale?: boolean }) {
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
              added ? "bg-green-500 scale-95" : "bg-green-600 hover:bg-green-700"
            )}
          >
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Home Page ───────────────────────────────────────────────────────────

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                <span className="text-white font-black text-base">D</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-gray-900 text-lg leading-none">DSS Nexus</span>
                <p className="text-[10px] text-gray-400 leading-none">Commerce</p>
              </div>
            </Link>

            {/* Delivery Location */}
            <div className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 border-r border-gray-200 pr-4">
              <span className="text-green-600">📍</span>
              <span className="font-medium">Deliver to:</span>
              <button className="text-green-600 font-semibold hover:underline">Mumbai 400001</button>
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative group">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search for products, stores, brands..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-secondary text-sm py-2 hidden sm:flex">
                Login
              </Link>
              <Link
                href="/cart"
                className="relative btn-primary text-sm py-2 flex items-center gap-2"
              >
                <ShoppingCart size={16} />
                <span className="hidden sm:inline">Cart</span>
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero min-h-[480px] md:min-h-[560px] flex items-center relative">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="container-custom relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                  <Zap size={14} className="text-yellow-300 fill-yellow-300" />
                  India's Fastest Delivery Platform
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
                  Fresh &
                  <span className="block">Delivered</span>
                  <span className="block text-yellow-300">in 30 min</span>
                </h1>
                <p className="text-green-100 text-lg mb-8 max-w-md">
                  Shop from 5,000+ products across groceries, electronics, fashion and more.
                  Get it delivered to your door in under 30 minutes.
                </p>

                {/* Hero Search */}
                <div className="flex gap-2 max-w-lg">
                  <div className="flex-1 relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      className="w-full pl-10 pr-4 py-3.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                    />
                  </div>
                  <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3.5 rounded-xl transition-all active:scale-95 shadow-lg whitespace-nowrap">
                    Search
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="flex gap-6 mt-8 flex-wrap">
                  {[
                    { icon: "⚡", text: "30 min delivery" },
                    { icon: "🔒", text: "100% secure" },
                    { icon: "↩️", text: "Easy returns" },
                  ].map((badge) => (
                    <div key={badge.text} className="flex items-center gap-2 text-white/90 text-sm font-medium">
                      <span>{badge.icon}</span>
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Hero Image / Stats */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:grid grid-cols-2 gap-4"
              >
                {[
                  { value: "5,000+", label: "Products", icon: "📦" },
                  { value: "500+", label: "Vendors", icon: "🏪" },
                  { value: "30 min", label: "Avg Delivery", icon: "⚡" },
                  { value: "2M+", label: "Happy Users", icon: "😍" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <div className="text-4xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                    <div className="text-green-100 text-sm font-medium mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wave Shape */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ─── DELIVERY PROMISE ─────────────────────────────────────── */}
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: "Free Delivery", desc: "On orders above ₹499", color: "text-green-600", bg: "bg-green-50" },
              { icon: Clock, title: "30 Min Delivery", desc: "Lightning fast service", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Shield, title: "100% Secure", desc: "Safe & encrypted checkout", color: "text-purple-600", bg: "bg-purple-50" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns", color: "text-orange-600", bg: "bg-orange-50" },
            ].map((item, i) => (
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

      {/* ─── CATEGORIES ──────────────────────────────────────────── */}
      <section className="section pb-8">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 text-sm mt-0.5">Find exactly what you need</p>
            </div>
            <Link href="/products" className="flex items-center gap-1 text-green-600 text-sm font-semibold hover:gap-2 transition-all">
              See all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={cat.href}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all hover:shadow-md hover:-translate-y-1 group",
                    cat.color
                  )}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLASH SALE ──────────────────────────────────────────── */}
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

      {/* ─── FEATURED PRODUCTS ───────────────────────────────────── */}
      <section className="section">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Featured Products</h2>
              <p className="text-gray-500 text-sm mt-0.5">Handpicked just for you</p>
            </div>
            <Link href="/products?isFeatured=true" className="flex items-center gap-1 text-green-600 text-sm font-semibold hover:gap-2 transition-all">
              See all <ChevronRight size={16} />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-thin pb-2 -mx-4 px-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product as typeof flashSaleProducts[0]} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROMO BANNER ────────────────────────────────────────── */}
      <section className="py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white"
            >
              <div className="relative z-10">
                <span className="text-4xl mb-3 block">🎁</span>
                <h3 className="text-2xl font-black mb-2">New User Offer</h3>
                <p className="text-green-100 mb-4">Get ₹150 off on your first order above ₹499</p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-sm font-bold">
                  Use code: <span className="text-yellow-300">WELCOME150</span>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white"
            >
              <div className="relative z-10">
                <span className="text-4xl mb-3 block">💎</span>
                <h3 className="text-2xl font-black mb-2">Refer & Earn</h3>
                <p className="text-blue-100 mb-4">Earn ₹100 for every friend you refer to DSS Nexus</p>
                <Link href="/wallet" className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors">
                  Start Referring <ArrowRight size={14} />
                </Link>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED STORES ─────────────────────────────────────── */}
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
                    <Clock size={12} className="text-green-500" />
                    <span className="text-xs font-semibold text-green-600">{store.deliveryTime}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900">What Our Users Say</h2>
            <p className="text-gray-500 text-sm mt-1">Join 2 million+ happy users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ──────────────────────────────────────────── */}
      <section className="py-16 gradient-hero">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-3xl font-black text-white mb-3">Never Miss a Deal</h2>
            <p className="text-green-100 mb-8 max-w-md mx-auto">
              Subscribe to get exclusive offers, flash sale alerts, and new product updates.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-white rounded-xl text-sm focus:outline-none shadow-lg"
              />
              <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-6 py-3 rounded-xl transition-all active:scale-95 whitespace-nowrap shadow-lg">
                Subscribe
              </button>
            </div>
            <p className="text-green-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                  <span className="text-white font-black text-base">D</span>
                </div>
                <div>
                  <p className="font-black text-white text-lg leading-none">DSS Nexus</p>
                  <p className="text-xs text-gray-400">Commerce</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">
                India's leading multi-vendor marketplace. Fast delivery, best prices, trusted sellers.
              </p>
              <div className="flex gap-3">
                {["📱", "🐦", "📘", "📸"].map((icon, i) => (
                  <button key={i} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors text-sm">
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Company",
                links: ["About Us", "Careers", "Press", "Blog", "Contact"],
              },
              {
                title: "For Customers",
                links: ["How to Order", "Track Order", "Returns", "FAQs", "Wallet"],
              },
              {
                title: "For Vendors",
                links: ["Become a Seller", "Vendor Dashboard", "Pricing", "Guidelines"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white mb-3 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">© 2025 DSS Nexus Commerce. All rights reserved.</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
