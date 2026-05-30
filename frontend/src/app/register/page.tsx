"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import api from "@/lib/axios";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["customer", "vendor"]),
    businessName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<"customer" | "vendor">("customer");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "customer" },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        ...(data.role === "vendor" ? { businessName: data.businessName } : {}),
      });
      toast.success("Account created! Please verify your email.");
      router.push("/otp");
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
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
          <p className="text-green-100 text-lg mb-12">
            Create an account to start buying or selling products instantly
          </p>

          <div className="space-y-4 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-3 text-white/90">
              <ShieldCheck size={20} className="text-yellow-300" />
              <span className="text-sm font-medium">Verify your email and secure your account</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <ShoppingBag size={20} className="text-yellow-300" />
              <span className="text-sm font-medium">Vendor option to register your online shop</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right — Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-black text-gray-900 mb-1">Create Account</h2>
            <p className="text-gray-500 text-sm">Register to start your journey</p>
          </div>

          {/* Role Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveRole("customer");
                setValue("role", "customer");
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeRole === "customer" ? "bg-white text-green-600 shadow-xs" : "text-gray-500"
              }`}
            >
              Shop as Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveRole("vendor");
                setValue("role", "vendor");
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                activeRole === "vendor" ? "bg-white text-green-600 shadow-xs" : "text-gray-500"
              }`}
            >
              Sell as Vendor
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="label">Full Name</label>
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className={`input ${errors.name ? "border-red-300" : ""}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={`input ${errors.email ? "border-red-300" : ""}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="label">Phone Number</label>
              <input
                {...register("phone")}
                type="text"
                placeholder="10 digit number"
                className={`input ${errors.phone ? "border-red-300" : ""}`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            {/* Business Name if Vendor */}
            {activeRole === "vendor" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <label className="label">Business / Store Name</label>
                <input
                  {...register("businessName")}
                  type="text"
                  placeholder="Fresh Store"
                  className={`input ${errors.businessName ? "border-red-300" : ""}`}
                />
                {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName.message}</p>}
              </motion.div>
            )}

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <input
                {...register("password")}
                type="password"
                placeholder="Minimum 8 characters"
                className={`input ${errors.password ? "border-red-300" : ""}`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirm Password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm password"
                className={`input ${errors.confirmPassword ? "border-red-300" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-green-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
