"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search, X, ArrowRight } from "lucide-react";
import { products, collections } from "@/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatPrice } from "@/lib/format";
import { cn, toneClasses } from "@/lib/utils";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => ref.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products.filter((p) => p.badge).slice(0, 6);
    return products.filter((p) => [p.name, p.tagline, p.collection, p.description, ...p.stages].join(" ").toLowerCase().includes(s)).slice(0, 8);
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm" onClick={onClose}>
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-3xl px-4 sm:mt-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-3xl bg-porcelain shadow-lift">
              <div className="flex items-center gap-3 border-b border-ink/10 px-6">
                <Search className="size-5 text-ink/50" strokeWidth={1.5} />
                <input
                  ref={ref}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search pumps, warmers, coolers, care…"
                  className="h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-ink/35"
                />
                <button onClick={onClose} aria-label="Close search" className="grid size-9 place-items-center rounded-full hover:bg-ink/5">
                  <X className="size-4" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4 scroll-thin">
                <p className="eyebrow px-2 pb-3 text-ink/45">{q ? `${results.length} results` : "Popular"}</p>
                <ul className="grid gap-1 sm:grid-cols-2">
                  {results.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/products/${p.slug}`} onClick={onClose} className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-cream">
                        <span className={cn("size-16 shrink-0 overflow-hidden rounded-xl", toneClasses[p.tone])}>
                          <ProductVisual kind={p.visual} color={p.colors?.[0]?.hex} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{p.name}</span>
                          <span className="block truncate text-xs text-ink/55">{p.tagline}</span>
                        </span>
                        <span className="text-sm tabular-nums">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {!q && (
                  <div className="mt-4 flex flex-wrap gap-2 px-2 pb-2">
                    {collections.map((c) => (
                      <Link key={c.slug} href={`/collections/${c.slug}`} onClick={onClose} className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium hover:border-ink">
                        {c.name} <ArrowRight className="size-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
