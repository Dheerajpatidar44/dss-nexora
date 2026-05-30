"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isUp?: boolean;
  icon: React.ElementType;
  bg?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  change,
  isUp = true,
  icon: Icon,
  bg = "bg-green-50",
  iconColor = "text-green-600",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card"
    >
      <div className={`stat-icon ${bg}`}>
        <Icon className={iconColor} size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-semibold truncate uppercase tracking-wider">{title}</p>
        <p className="text-xl font-black text-gray-900 leading-tight mt-1">{value}</p>
        {change && (
          <div className="flex items-center gap-1 mt-1.5">
            {isUp ? (
              <ArrowUp size={12} className="text-green-500" />
            ) : (
              <ArrowDown size={12} className="text-red-500" />
            )}
            <span className={`text-xs font-bold ${isUp ? "text-green-600" : "text-red-500"}`}>
              {change}
            </span>
            <span className="text-xs text-gray-400 font-medium">vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
