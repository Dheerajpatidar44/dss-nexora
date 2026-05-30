"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard, ShoppingCart, Users, Package, Store,
  Truck, Tag, BarChart3, Bell, Settings, LogOut,
  ChevronDown, CircleDollarSign, Megaphone, MapPin,
  Shield, FileText, Activity, CreditCard, Zap,
  ChevronLeft, ChevronRight, HelpCircle, Clock
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  badge?: string;
  children?: NavItem[];
}

const adminNav: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { title: "Main Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { title: "POS Dashboard", href: "/admin/pos", icon: Zap },
    ],
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    children: [
      { title: "All Orders", href: "/admin/orders", icon: ShoppingCart },
      { title: "Dispute Management", href: "/admin/disputes", icon: FileText },
    ],
  },
  {
    title: "Catalog",
    icon: Package,
    children: [
      { title: "Categories", href: "/admin/categories", icon: Tag },
      { title: "Products", href: "/admin/products", icon: Package },
      { title: "Brands", href: "/admin/brands", icon: Tag },
      { title: "Tax Rates", href: "/admin/tax-rates", icon: CreditCard },
    ],
  },
  {
    title: "Customers",
    icon: Users,
    children: [
      { title: "All Customers", href: "/admin/customers", icon: Users },
      { title: "Wallet Transactions", href: "/admin/wallet-transactions", icon: CircleDollarSign },
      { title: "Refer & Earn", href: "/admin/referrals", icon: Megaphone },
    ],
  },
  {
    title: "Sellers",
    icon: Store,
    children: [
      { title: "All Sellers", href: "/admin/vendors", icon: Store },
      { title: "Settlements", href: "/admin/settlements", icon: CircleDollarSign },
      { title: "Withdrawals", href: "/admin/withdrawals", icon: CreditCard },
    ],
  },
  { title: "Stores", href: "/admin/stores", icon: Store },
  { title: "Delivery Boys", href: "/admin/delivery-boys", icon: Truck },
  {
    title: "Marketing",
    icon: Megaphone,
    children: [
      { title: "Banners", href: "/admin/banners", icon: Megaphone },
      { title: "Featured Deals", href: "/admin/featured-deals", icon: Tag },
      { title: "Promo Codes", href: "/admin/promo-codes", icon: Tag },
    ],
  },
  {
    title: "Ad Campaigns",
    icon: BarChart3,
    children: [
      { title: "Dashboard", href: "/admin/ad-campaigns", icon: BarChart3 },
    ],
  },
  {
    title: "Finance",
    icon: CircleDollarSign,
    children: [
      { title: "Plans", href: "/admin/plans", icon: CreditCard },
      { title: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
    ],
  },
  {
    title: "Communication",
    icon: Bell,
    children: [
      { title: "Notifications", href: "/admin/notifications", icon: Bell },
      { title: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    title: "Delivery Zones",
    icon: MapPin,
    children: [
      { title: "Manage Zones", href: "/admin/delivery-zones", icon: MapPin },
    ],
  },
  {
    title: "System",
    icon: Settings,
    children: [
      { title: "Roles & Permissions", href: "/admin/roles", icon: Shield },
      { title: "System Users", href: "/admin/system-users", icon: Users },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  { title: "Cron Monitor", href: "/admin/cron-logs", icon: Clock },
  { title: "Analytics", href: "/admin/analytics", icon: Activity },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();
  const [openGroups, setOpenGroups] = useState<string[]>(["Dashboard"]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: NavItem) =>
    item.children?.some((c) => c.href && pathname.startsWith(c.href));

  return (
    <aside
      className={cn(
        "sidebar scrollbar-thin overflow-y-auto overflow-x-hidden transition-all duration-300",
        isSidebarCollapsed ? "w-16" : "w-[280px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100 flex-shrink-0">
        {!isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-black text-sm">D</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-none">DSS Nexus</p>
              <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
            </div>
          </motion.div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="btn-icon ml-auto"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2">
        {adminNav.map((item) => {
          if (item.children) {
            const isOpen = openGroups.includes(item.title);
            const groupActive = isGroupActive(item);

            return (
              <div key={item.title} className="mb-1">
                <button
                  onClick={() => !isSidebarCollapsed && toggleGroup(item.title)}
                  title={isSidebarCollapsed ? item.title : undefined}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    groupActive
                      ? "text-green-700 bg-green-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                    isSidebarCollapsed && "justify-center"
                  )}
                >
                  <item.icon size={18} className="flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform text-gray-400",
                          isOpen && "rotate-180"
                        )}
                      />
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && !isSidebarCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 mt-1 space-y-0.5 border-l border-gray-100 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href!}
                            className={cn(
                              "flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all",
                              isActive(child.href!)
                                ? "text-green-700 bg-green-50 font-semibold"
                                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            )}
                          >
                            <child.icon size={14} />
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              title={isSidebarCollapsed ? item.title : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1",
                isActive(item.href!)
                  ? "text-green-700 bg-green-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                isSidebarCollapsed && "justify-center"
              )}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {!isSidebarCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      {!isSidebarCollapsed && (
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
