import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      toggleWishlist: (productId) => {
        set((state) => {
          const exists = state.productIds.includes(productId);
          return {
            productIds: exists
              ? state.productIds.filter((id) => id !== productId)
              : [...state.productIds, productId],
          };
        });
      },

      isWishlisted: (productId) => get().productIds.includes(productId),

      clearWishlist: () => set({ productIds: [] }),
    }),
    { name: "dss-wishlist" }
  )
);

// ─── UI Store ─────────────────────────────────────────────────────────────────

interface UIState {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  isCartOpen: boolean;
  isSearchOpen: boolean;
  activeModal: string | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (val: boolean) => void;
  setCartOpen: (val: boolean) => void;
  setSearchOpen: (val: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  isCartOpen: false,
  isSearchOpen: false,
  activeModal: null,

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarCollapsed: (val) => set({ isSidebarCollapsed: val }),
  setCartOpen: (val) => set({ isCartOpen: val }),
  setSearchOpen: (val) => set({ isSearchOpen: val }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
