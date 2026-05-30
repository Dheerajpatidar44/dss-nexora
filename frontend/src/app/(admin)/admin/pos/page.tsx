"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Search, ShoppingCart, Plus, Minus, CreditCard, Trash2 } from "lucide-react";
import { toast } from "sonner";

const mockProducts = [
  { id: "1", name: "Organic Bananas (1kg)", price: 49, stock: 50 },
  { id: "2", name: "Farm Fresh Eggs (12)", price: 89, stock: 40 },
  { id: "3", name: "Whole Wheat Bread", price: 45, stock: 30 },
  { id: "4", name: "Greek Yogurt 500g", price: 120, stock: 25 },
];

export default function AdminPOSPage() {
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);
  const [search, setSearch] = useState("");

  const addToCart = (product: typeof mockProducts[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.info("Cart cleared");
  };

  const getSubtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    toast.success("Bill generated successfully!");
    setCart([]);
  };

  const filteredProducts = mockProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Point of Sale (POS)" subtitle="Generate instant store bills for walk-in customers" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Product Selector */}
        <div className="card p-5 lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className="card p-4 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">{p.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">Stock: {p.stock} units</p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-black text-gray-900 text-sm">₹{p.price}</span>
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded">
                    + Add
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Billing Cart */}
        <div className="card p-5 flex flex-col justify-between space-y-4 h-[500px]">
          <div className="space-y-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">Cart ({cart.length} items)</h3>
              </div>
              {cart.length > 0 && (
                <button onClick={clearCart} className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1">
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4 text-sm border-b border-gray-50 pb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 truncate leading-tight">{item.name}</p>
                      <span className="text-xs text-gray-400">₹{item.price} each</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => updateQuantity(item.id, -1)} className="btn-icon !p-1 border border-gray-100">
                        <Minus size={12} />
                      </button>
                      <span className="font-bold text-gray-800 text-xs w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="btn-icon !p-1 border border-gray-100">
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <span className="text-3xl">🛒</span>
                  <p className="text-xs font-semibold">Cart is empty</p>
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 pt-4 space-y-4 flex-shrink-0">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-600">
              <span>Total Bill Amount</span>
              <span className="text-xl font-black text-gray-900">₹{getSubtotal()}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full btn-primary bg-blue-600 hover:bg-blue-700 py-3 font-bold flex items-center justify-center gap-2 shadow-md"
            >
              <CreditCard size={16} />
              Complete & Print Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
