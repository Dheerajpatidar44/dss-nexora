"use client";

import VendorSidebar from "@/components/vendor/VendorSidebar";
import Topbar from "@/components/common/Topbar";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useUIStore();
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <VendorSidebar />
      <div className={cn("flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300", isSidebarCollapsed ? "ml-16" : "ml-[260px]")}>
        <Topbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="p-6">
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
