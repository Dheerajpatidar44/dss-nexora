import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "DSS Nexus Commerce — Enterprise Multi-Vendor Marketplace",
    template: "%s | DSS Nexus Commerce",
  },
  description:
    "DSS Nexus Commerce is a premium enterprise-grade multi-vendor eCommerce marketplace platform featuring fast delivery, thousands of products, and seamless shopping.",
  keywords: ["ecommerce", "marketplace", "multi-vendor", "online shopping", "DSS Nexus"],
  authors: [{ name: "DSS Nexus Commerce" }],
  icons: {
    icon: "/favicon.svg",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "DSS Nexus Commerce",
    title: "DSS Nexus Commerce — Enterprise Multi-Vendor Marketplace",
    description: "Shop from thousands of vendors. Fast delivery. Best prices.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: { fontFamily: "Inter, sans-serif" },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
