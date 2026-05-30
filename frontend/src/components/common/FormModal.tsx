"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function FormModal({ isOpen, onClose, title, children }: FormModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
              <h3 className="text-base font-bold text-gray-900">{title}</h3>
              <button onClick={onClose} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
