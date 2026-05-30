"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import Topbar from "@/components/common/Topbar";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300",
          isSidebarCollapsed ? "ml-16" : "ml-[280px]"
        )}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
