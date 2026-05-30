"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, KeyRound, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Password reset code sent to your email!");
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong. Try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-xl p-8"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Forgot Password</h2>
          <p className="text-gray-500 text-sm">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input pl-10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Send Reset OTP
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-green-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
