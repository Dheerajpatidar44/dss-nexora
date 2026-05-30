"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const roleRedirects: Record<string, string> = {
  admin: "/admin/dashboard",
  vendor: "/vendor/dashboard",
  delivery: "/delivery/dashboard",
  customer: "/",
};

export default function LoginPage() {
  const { login, isLoading, user } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      const redirect = user ? roleRedirects[user.role] || "/" : "/";
      toast.success("Welcome back!");
      router.push(redirect);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center px-12"
        >
          <div className="flex items-center justify-center mx-auto mb-6">
            <Image src="/logo.png" alt="DSS Nexus Commerce" width={200} height={64} className="w-auto h-16 object-contain" priority />
          </div>
          <p className="text-green-100 text-lg mb-12 leading-relaxed">
            Enterprise-grade multi-vendor marketplace for the modern world
          </p>

          {/* Feature List */}
          <div className="space-y-4 text-left">
            {[
              { icon: "🚀", text: "30-minute delivery across India" },
              { icon: "🏪", text: "500+ trusted local vendors" },
              { icon: "🔒", text: "Bank-grade security & encryption" },
              { icon: "💎", text: "Premium shopping experience" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-white/90">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            {[
              { value: "2M+", label: "Users" },
              { value: "5K+", label: "Products" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-green-200 text-xs font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center mb-6 lg:hidden">
            <Image src="/logo.png" alt="DSS Nexus Commerce" width={160} height={48} className="w-auto h-12 object-contain" priority />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Quick Login Hints */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-gray-600 mb-2">🔑 Demo Accounts</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-500">
              <span>Admin: admin@dssnexus.com</span>
              <span>Vendor: vendor@dssnexus.com</span>
              <span>Customer: customer@dssnexus.com</span>
              <span>Password: *@123456</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={`input ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-200" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Password</label>
                <Link href="/forgot-password" className="text-xs text-green-600 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input pr-10 ${errors.password ? "border-red-300" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-green-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>

          {/* Vendor CTA */}
          <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center gap-3">
            <ShoppingBag size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Want to sell on DSS Nexus?</p>
              <Link href="/register?role=vendor" className="text-xs text-green-600 font-medium hover:underline">
                Apply as a vendor →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
