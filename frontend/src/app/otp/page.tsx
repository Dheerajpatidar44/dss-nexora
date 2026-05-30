"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function OTPPage() {
  const router = useRouter();
  const { user, initialize } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP code");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/verify-otp", { otp, type: "email" });
      toast.success("OTP verified successfully!");
      // Re-initialize auth status
      await initialize();
      router.push("/");
    } catch (err: any) {
      const message = err.response?.data?.message || "OTP verification failed. Try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/send-otp", { type: "email" });
      toast.success("OTP sent to your email!");
      setResendTimer(60);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to resend OTP. Try again.";
      toast.error(message);
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
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Verify Your Account</h2>
          <p className="text-gray-500 text-sm">
            Enter the 6-digit code sent to your registered email address.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="0 0 0 0 0 0"
              className="w-full text-center tracking-widest text-2xl font-black font-mono py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <CheckCircle size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {resendTimer > 0 ? (
            <p className="text-gray-400">Resend code in <span className="font-bold text-gray-600">{resendTimer}s</span></p>
          ) : (
            <button
              onClick={handleResend}
              className="text-green-600 font-bold hover:underline"
            >
              Resend OTP Code
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
