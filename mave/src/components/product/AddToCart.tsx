"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus, Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart, useToast, useWishlist } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function AddToCart({ product, onColorChange }: { product: Product; onColorChange?: (hex: string) => void }) {
  const add = useCart((s) => s.add);
  const toast = useToast((s) => s.push);
  const wish = useWishlist();
  const wished = wish.slugs.includes(product.slug);
  const [color, setColor] = useState(product.colors?.[0]);
  const [variant, setVariant] = useState(product.variants?.[0]?.options[Math.min(3, (product.variants?.[0]?.options.length ?? 1) - 1)]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const submit = () => {
    add({ slug: product.slug, name: product.name, price: product.price, visual: product.visual, tone: product.tone, color: color?.name, variant }, qty);
    toast({ title: `${product.name} added to bag` });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div ref={ref}>
      {product.colors && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Colour</p>
            <p className="text-sm text-ink/55">{color?.name}</p>
          </div>
          <div className="mt-3 flex gap-3">
            {product.colors.map((c) => (
              <button
                key={c.name}
                aria-label={c.name}
                onClick={() => {
                  setColor(c);
                  onColorChange?.(c.hex);
                }}
                className={cn("size-9 rounded-full ring-2 ring-offset-2 ring-offset-porcelain transition", color?.name === c.name ? "ring-ink" : "ring-transparent hover:ring-ink/30")}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
      )}
      {product.variants?.map((v) => (
        <div key={v.label} className="mt-7">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{v.label}</p>
            {v.hint && (
              <Link href="/journal/flange-sizing-guide" className="text-xs text-clay underline-offset-2 hover:underline">
                Sizing guide
              </Link>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {v.options.map((o) => (
              <button key={o} onClick={() => setVariant(o)} className={cn("h-10 min-w-[64px] rounded-full border px-4 text-sm transition", variant === o ? "border-ink bg-ink text-porcelain" : "border-ink/15 hover:border-ink")}>
                {o}
              </button>
            ))}
          </div>
          {v.hint && <p className="mt-2 text-xs text-ink/50">{v.hint}</p>}
        </div>
      ))}

      <div className="mt-8 flex gap-3">
        <div className="inline-flex h-14 items-center rounded-full border border-ink/15">
          <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease" className="grid size-12 place-items-center hover:bg-ink/5">
            <Minus className="size-4" />
          </button>
          <span className="w-6 text-center tabular-nums">{qty}</span>
          <button onClick={() => setQty(qty + 1)} aria-label="Increase" className="grid size-12 place-items-center hover:bg-ink/5">
            <Plus className="size-4" />
          </button>
        </div>
        <button onClick={submit} className="relative flex h-14 flex-1 items-center justify-center overflow-hidden rounded-full bg-ink text-[15px] font-medium text-porcelain transition hover:bg-ink-soft hover:shadow-lift active:scale-[0.99]">
          <AnimatePresence mode="wait" initial={false}>
            {added ? (
              <motion.span key="added" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2">
                <Check className="size-4" /> Added
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                {product.stock === "preorder" ? "Pre-order" : "Add to bag"} · {formatPrice(product.price * qty)}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button onClick={() => wish.toggle(product.slug)} aria-label="Wishlist" className="grid size-14 place-items-center rounded-full border border-ink/15 transition hover:border-ink">
          <Heart className={cn("size-5", wished && "fill-clay text-clay")} strokeWidth={1.5} />
        </button>
      </div>

      {/* Sticky bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-porcelain/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
              <div className="min-w-0">
                <p className="truncate font-medium">{product.name}</p>
                <p className="truncate text-xs text-ink/55">{[color?.name, variant].filter(Boolean).join(" · ")}</p>
              </div>
              <button onClick={submit} className="h-11 shrink-0 rounded-full bg-ink px-6 text-sm font-medium text-porcelain">
                Add · {formatPrice(product.price)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
