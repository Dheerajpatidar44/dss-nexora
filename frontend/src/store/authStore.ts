import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";

export type UserRole = "admin" | "vendor" | "delivery" | "customer";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  setToken: (token: string) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/auth/login", { email, password });
          const { user, tokens } = data.data;
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", tokens.accessToken);
          }
          set({ user: user, token: tokens.accessToken, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch {}
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      initialize: async () => {
        const token = typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
        if (!token) return;

        set({ isLoading: true });
        try {
          const { data } = await api.get("/auth/me");
          set({ user: data.data.user, isAuthenticated: true, token });
        } catch {
          if (typeof window !== "undefined") localStorage.removeItem("accessToken");
          set({ user: null, isAuthenticated: false, token: null });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "dss-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

// Role helpers
export const useIsAdmin = () => useAuthStore((s) => s.user?.role === "admin");
export const useIsVendor = () => useAuthStore((s) => s.user?.role === "vendor");
export const useIsDelivery = () => useAuthStore((s) => s.user?.role === "delivery");
export const useIsCustomer = () => useAuthStore((s) => s.user?.role === "customer");
