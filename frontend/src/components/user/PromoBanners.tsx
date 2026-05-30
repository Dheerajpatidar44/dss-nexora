"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromoBanners() {
  return (
    <section className="py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 p-8 text-white"
          >
            <div className="relative z-10">
              <span className="text-4xl mb-3 block">🎁</span>
              <h3 className="text-2xl font-black mb-2">New User Offer</h3>
              <p className="text-blue-100 mb-4">Get ₹150 off on your first order above ₹499</p>
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
  );
}
