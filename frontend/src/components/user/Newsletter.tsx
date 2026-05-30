"use client";

import { motion } from "framer-motion";

export default function Newsletter() {
  return (
    <section className="py-16 gradient-hero">
      <div className="container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-3xl font-black text-white mb-3">Never Miss a Deal</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
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
          <p className="text-blue-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
