"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import {
  Home, Zap, ShoppingCart, Truck, Grid, Package, Tag, Percent, Users,
  Store, Bike, Image as ImageIcon, Layout, Gift, BarChart, Repeat,
  Smartphone, Bell, HelpCircle, Map, Shield, Settings, LogOut,
  ChevronDown, ChevronLeft, ChevronRight, Circle
} from "lucide-react";
import { useState } from "react";

interface NavChild {
  title: string;
  href: string;
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: NavChild[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "OVERVIEW",
    items: [
      { title: "Dashboard", href: "/admin/dashboard", icon: Home },
      { title: "POS Dashboard", href: "/admin/pos", icon: Zap },
      { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { title: "Dispatch Management", href: "/admin/dispatch", icon: Truck },
    ]
  },
  {
    label: "CATALOG",
    items: [
      {
        title: "Categories",
        icon: Grid,
        children: [
          { title: "Categories", href: "/admin/categories" }
        ]
      },
      {
        title: "Products",
        icon: Package,
        children: [
          { title: "Products", href: "/admin/products" },
          { title: "Pending approval products", href: "/admin/products/pending" },
          { title: "Badges", href: "/admin/products/badges" },
          { title: "Product FAQs", href: "/admin/products/faqs" }
        ]
      },
      { title: "Brands", href: "/admin/brands", icon: Tag },
      { title: "Tax Rates", href: "/admin/tax-rates", icon: Percent },
    ]
  },
  {
    label: "PEOPLE",
    items: [
      {
        title: "Customers",
        icon: Users,
        children: [
          { title: "Customers", href: "/admin/customers" },
          { title: "Wallet transactions", href: "/admin/customers/wallet" },
          { title: "Pending wallet deposits", href: "/admin/customers/wallet-deposits" },
          { title: "Refer and Earn", href: "/admin/customers/refer-earn" },
          { title: "Referral Earnings", href: "/admin/customers/referral-earnings" }
        ]
      },
      {
        title: "Seller management",
        icon: Store,
        children: [
          { title: "Sellers", href: "/admin/sellers" },
          { title: "Settlement overview", href: "/admin/sellers/settlements" },
          { title: "Seller withdrawals", href: "/admin/sellers/withdrawals" },
          { title: "Withdrawal History", href: "/admin/sellers/withdrawal-history" }
        ]
      },
      { title: "Stores", href: "/admin/stores", icon: Store },
      {
        title: "Manage Delivery Boys",
        icon: Bike,
        children: [
          { title: "Delivery Boys", href: "/admin/delivery-boys" },
          { title: "Live tracking", href: "/admin/delivery-boys/tracking" },
          { title: "Delivery Boy Earnings", href: "/admin/delivery-boys/earnings" },
          { title: "Earning History", href: "/admin/delivery-boys/earning-history" },
          { title: "Delivery Boy cash collection", href: "/admin/delivery-boys/cash-collection" },
          { title: "Cash collection History", href: "/admin/delivery-boys/cash-history" },
          { title: "Delivery Boy withdrawals", href: "/admin/delivery-boys/withdrawals" },
          { title: "Withdrawal History", href: "/admin/delivery-boys/withdrawal-history" }
        ]
      }
    ]
  },
  {
    label: "MARKETING",
    items: [
      { title: "Banners", href: "/admin/banners", icon: ImageIcon },
      {
        title: "Manage featured section",
        icon: Layout,
        children: [
          { title: "Manage featured section", href: "/admin/featured-section/manage" },
          { title: "Sort featured section", href: "/admin/featured-section/sort" }
        ]
      },
      { title: "Promos", href: "/admin/promos", icon: Gift },
      {
        title: "Ad Campaigns",
        icon: BarChart,
        children: [
          { title: "Dashboard", href: "/admin/ad-campaigns/dashboard" },
          { title: "Ad Campaigns", href: "/admin/ad-campaigns/list" }
        ]
      }
    ]
  },
  {
    label: "FINANCE",
    items: [
      {
        title: "Subscriptions",
        icon: Repeat,
        children: [
          { title: "Plans", href: "/admin/subscriptions/plans" },
          { title: "Subscribers", href: "/admin/subscriptions/subscribers" }
        ]
      }
    ]
  },
  {
    label: "COMMUNICATION",
    items: [
      { title: "App notification", href: "/admin/communication/app-notification", icon: Smartphone },
      { title: "Notification", href: "/admin/communication/notification", icon: Bell },
      { title: "FAQs", href: "/admin/faqs", icon: HelpCircle },
      {
        title: "Delivery zones",
        icon: Map,
        children: [
          { title: "Delivery zones", href: "/admin/delivery-zones/list" },
          { title: "Zone preview", href: "/admin/delivery-zones/preview" }
        ]
      }
    ]
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "Roles & Permissions",
        icon: Shield,
        children: [
          { title: "Roles", href: "/admin/system/roles" },
          { title: "System Users", href: "/admin/system/users" }
        ]
      },
      {
        title: "Settings",
        icon: Settings,
        children: [
          { title: "Cron Monitor", href: "/admin/system/cron" },
          { title: "System Updates", href: "/admin/system/updates" }
        ]
      },
      { title: "Logout", href: "#", icon: LogOut }
    ]
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const { user, logout } = useAuthStore();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? [] : [title]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: NavItem) =>
    item.children?.some((c) => pathname.startsWith(c.href));

  return (
    <aside
      className={cn(
        "sidebar scrollbar-thin overflow-y-auto overflow-x-hidden transition-all duration-300 bg-[#faf8f5] border-r border-gray-200 flex flex-col h-screen text-[#2d3136]",
        isSidebarCollapsed ? "w-20" : "w-[280px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-2 border-b border-gray-200 flex-shrink-0 sticky top-0 bg-[#faf8f5] z-10">
        {!isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center">
              <Image src="/logo.png" alt="DSS Nexus" width={120} height={36} className="w-auto h-20 object-contain" priority />
            </div>
            <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider ml-1">Admin Panel</p>
          </motion.div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className={cn(
            "p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-orange-50 hover:text-orange-600 text-gray-600 transition-colors",
            isSidebarCollapsed && "mx-auto"
          )}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {/* Section Header */}
            {!isSidebarCollapsed && (
              <h3 className="px-3 mb-2 text-[11px] font-bold text-gray-700 tracking-[0.1em] uppercase">
                {group.label}
              </h3>
            )}
            {isSidebarCollapsed && (
              <div className="flex justify-center mb-2">
                <div className="h-px w-6 bg-gray-200"></div>
              </div>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                if (item.children) {
                  const isOpen = openGroups.includes(item.title);
                  const groupActive = isGroupActive(item);

                  return (
                    <div key={item.title}>
                      <button
                        onClick={() => !isSidebarCollapsed && toggleGroup(item.title)}
                        title={isSidebarCollapsed ? item.title : undefined}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all group",
                          groupActive
                            ? "bg-orange-100 text-orange-600"
                            : "hover:bg-orange-50 hover:text-orange-600 text-[#2d3136]",
                          isSidebarCollapsed && "justify-center"
                        )}
                      >
                        <item.icon 
                          size={18} 
                          className="flex-shrink-0 transition-colors" 
                        />
                        {!isSidebarCollapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            <ChevronDown
                              size={16}
                              className={cn(
                                "transition-transform duration-200",
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
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="ml-10 mt-1 mb-1 space-y-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all group/child",
                                    isActive(child.href)
                                      ? "bg-orange-100 text-orange-600"
                                      : "hover:bg-orange-50 hover:text-orange-600 text-[#5a5e63]"
                                  )}
                                >
                                  <Circle 
                                    size={6} 
                                    className={cn(
                                      "flex-shrink-0",
                                      isActive(child.href) ? "fill-orange-600" : ""
                                    )} 
                                  />
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

                // Standalone Item
                if (item.title === "Logout") {
                   return (
                     <button
                       key={item.title}
                       onClick={() => logout()}
                       title={isSidebarCollapsed ? item.title : undefined}
                       className={cn(
                         "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all group text-red-500 hover:bg-red-50",
                         isSidebarCollapsed && "justify-center"
                       )}
                     >
                       <item.icon size={18} className="flex-shrink-0" />
                       {!isSidebarCollapsed && <span>{item.title}</span>}
                     </button>
                   );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    title={isSidebarCollapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all group",
                      isActive(item.href!)
                        ? "bg-orange-100 text-orange-600"
                        : "hover:bg-orange-50 hover:text-orange-600 text-[#2d3136]",
                      isSidebarCollapsed && "justify-center"
                    )}
                  >
                    <item.icon 
                      size={18} 
                      className="flex-shrink-0 transition-colors" 
                    />
                    {!isSidebarCollapsed && <span>{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
