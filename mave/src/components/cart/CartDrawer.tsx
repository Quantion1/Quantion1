"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X, Truck, ShieldCheck } from "lucide-react";
import { cartTotals, useCart } from "@/store/cart";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { cn, toneClasses } from "@/lib/utils";
import { products } from "@/data/products";

export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, add } = useCart();
  const t = cartTotals(lines);
  const freeShipLeft = Math.max(0, 75 - t.subtotal);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const suggestions = products.filter((p) => !lines.some((l) => l.slug === p.slug) && p.price < 60).slice(0, 3);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[85] bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-[86] flex w-full max-w-[460px] flex-col bg-porcelain shadow-lift"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-2xl">
                Your bag <span className="text-ink/40">({t.count})</span>
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close bag" className="grid size-10 place-items-center rounded-full hover:bg-ink/5">
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="border-b border-ink/10 px-6 py-3">
              <div className="flex items-center gap-2 text-xs text-ink/70">
                <Truck className="size-3.5" strokeWidth={1.75} />
                {freeShipLeft > 0 ? <span>Add {formatPrice(freeShipLeft, { cents: true })} for free shipping</span> : <span className="text-sage">Free shipping unlocked</span>}
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
                <motion.div className="h-full bg-clay" animate={{ width: `${Math.min(100, (t.subtotal / 75) * 100)}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 scroll-thin">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <p className="font-display text-2xl">Your bag is empty</p>
                  <p className="mt-2 max-w-xs text-sm text-ink/55">Start with the Fit Kit. It changes everything about how a pump feels.</p>
                  <Button href="/shop" className="mt-6" size="sm" arrow onClick={() => setOpen(false)}>
                    Explore the shop
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-ink/10">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li key={l.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="flex gap-4 py-5">
                        <Link href={`/products/${l.slug}`} onClick={() => setOpen(false)} className={cn("size-24 shrink-0 overflow-hidden rounded-2xl", toneClasses[l.tone])}>
                          <ProductVisual kind={l.visual} color={products.find((p) => p.slug === l.slug)?.colors?.find((c) => c.name === l.color)?.hex} />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium">{l.name}</p>
                              <p className="mt-0.5 text-xs text-ink/50">{[l.color, l.variant].filter(Boolean).join(" · ")}</p>
                            </div>
                            <p className="text-sm tabular-nums">{formatPrice(l.price * l.qty)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full border border-ink/15">
                              <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease" className="grid size-8 place-items-center hover:bg-ink/5">
                                <Minus className="size-3" />
                              </button>
                              <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                              <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase" className="grid size-8 place-items-center hover:bg-ink/5">
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <button onClick={() => remove(l.id)} className="text-xs text-ink/50 underline-offset-2 hover:underline">
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {lines.length > 0 && suggestions.length > 0 && (
                <div className="mt-2 border-t border-ink/10 py-5">
                  <p className="eyebrow mb-3 text-ink/45">Goes well with</p>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar">
                    {suggestions.map((p) => (
                      <div key={p.slug} className="w-40 shrink-0 rounded-2xl border border-ink/10 p-3">
                        <div className={cn("aspect-square overflow-hidden rounded-xl", toneClasses[p.tone])}>
                          <ProductVisual kind={p.visual} color={p.colors?.[0]?.hex} />
                        </div>
                        <p className="mt-2 truncate text-sm font-medium">{p.name}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs tabular-nums">{formatPrice(p.price)}</span>
                          <button
                            onClick={() => add({ slug: p.slug, name: p.name, price: p.price, visual: p.visual, tone: p.tone })}
                            className="grid size-7 place-items-center rounded-full bg-ink text-porcelain"
                            aria-label={`Add ${p.name}`}
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-ink/10 bg-porcelain px-6 py-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="tabular-nums">{formatPrice(t.subtotal, { cents: true })}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-ink/60">Shipping</span>
                  <span className="tabular-nums">{t.shipping === 0 ? "Free" : formatPrice(t.shipping, { cents: true })}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3">
                  <span className="font-medium">Total</span>
                  <span className="font-medium tabular-nums">{formatPrice(t.total, { cents: true })}</span>
                </div>
                <Button href="/checkout" className="mt-4 w-full" size="lg" arrow onClick={() => setOpen(false)}>
                  Checkout
                </Button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink/50">
                  <ShieldCheck className="size-3.5" /> 100-night trial · 2-year warranty · Free returns
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
