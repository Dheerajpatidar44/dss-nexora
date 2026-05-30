"use client";

import Link from "next/link";
import Image from "next/image";

export default function UserFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center">
                <Image src="/logo.png" alt="DSS Nexus Commerce" width={120} height={40} className="w-auto h-12 object-contain" />
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
  );
}
