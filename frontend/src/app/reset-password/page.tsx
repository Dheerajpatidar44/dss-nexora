"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Mail, Lock, Key } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, password });
      toast.success("Password reset successfully! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      const message = err.response?.data?.message || "Reset failed. Please verify the OTP code.";
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
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Reset Password</h2>
          <p className="text-gray-500 text-sm">
            Enter the OTP sent to your email and your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
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

          {/* OTP */}
          <div>
            <label className="label">Verification OTP</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="6 digit OTP"
                maxLength={6}
                className="input pl-10 tracking-widest font-mono font-bold"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="label">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="input pl-10"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="input pl-10"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Resetting...
              </>
            ) : (
              "Save Password"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
