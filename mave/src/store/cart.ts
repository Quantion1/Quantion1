"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export interface CartLine {
  id: string; // slug + variants key
  slug: string;
  name: string;
  price: number;
  qty: number;
  variant?: string;
  color?: string;
  visual: Product["visual"];
  tone: Product["tone"];
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  add: (line: Omit<CartLine, "qty" | "id">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      add: (line, qty = 1) =>
        set((s) => {
          const id = [line.slug, line.variant, line.color].filter(Boolean).join("|");
          const existing = s.lines.find((l) => l.id === id);
          const lines = existing
            ? s.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
            : [...s.lines, { ...line, id, qty }];
          return { lines, open: true };
        }),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.id !== id) : s.lines.map((l) => (l.id === id ? { ...l, qty } : l)),
        })),
      clear: () => set({ lines: [] }),
      setOpen: (open) => set({ open }),
    }),
    { name: "mave-cart", partialize: (s) => ({ lines: s.lines }) },
  ),
);

export const cartTotals = (lines: CartLine[]) => {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 75 ? 0 : 4.95;
  return { subtotal, shipping, total: subtotal + shipping, count: lines.reduce((n, l) => n + l.qty, 0) };
};

interface WishlistState {
  slugs: string[];
  toggle: (slug: string) => void;
}
export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) =>
        set((s) => ({ slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug] })),
    }),
    { name: "mave-wishlist" },
  ),
);

interface ToastState {
  toasts: { id: number; title: string; body?: string }[];
  push: (t: { title: string; body?: string }) => void;
  dismiss: (id: number) => void;
}
export const useToast = create<ToastState>()((set) => ({
  toasts: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { id, ...t }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 3200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));
