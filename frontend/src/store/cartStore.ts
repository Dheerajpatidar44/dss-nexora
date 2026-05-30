import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  _id: string;
  name: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  stock: number;
  vendorId: string;
  storeId: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string;
  couponDiscount: number;
  addItem: (product: CartProduct, quantity?: number, variantId?: string, variantName?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getTotal: (deliveryCharge?: number) => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      couponDiscount: 0,

      addItem: (product, quantity = 1, variantId, variantName) => {
        set((state) => {
          const existing = state.items.findIndex(
            (i) => i.product._id === product._id && i.variantId === variantId
          );
          if (existing >= 0) {
            const items = [...state.items];
            items[existing] = {
              ...items[existing],
              quantity: Math.min(items[existing].quantity + quantity, product.stock),
            };
            return { items };
          }
          return {
            items: [...state.items, { product, quantity, variantId, variantName }],
          };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product._id === productId && i.variantId === variantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => !(i.product._id === productId && i.variantId === variantId)
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              i.product._id === productId && i.variantId === variantId
                ? { ...i, quantity: Math.min(quantity, i.product.stock) }
                : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [], couponCode: "", couponDiscount: 0 }),

      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      removeCoupon: () => set({ couponCode: "", couponDiscount: 0 }),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      getTotal: (deliveryCharge = 40) => {
        const subtotal = get().getSubtotal();
        return Math.max(0, subtotal - get().couponDiscount + deliveryCharge);
      },

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "dss-cart" }
  )
);
