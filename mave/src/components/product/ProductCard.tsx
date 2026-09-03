"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductVisual } from "./ProductVisual";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { formatPrice } from "@/lib/format";
import { cn, toneClasses } from "@/lib/utils";
import { useCart, useToast, useWishlist } from "@/store/cart";

export function ProductCard({ product, index = 0, compact }: { product: Product; index?: number; compact?: boolean }) {
  const add = useCart((s) => s.add);
  const toast = useToast((s) => s.push);
  const wish = useWishlist();
  const wished = wish.slugs.includes(product.slug);
  const color = product.colors?.[0]?.hex;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add({
      slug: product.slug,
      name: product.name,
      price: product.price,
      visual: product.visual,
      tone: product.tone,
      variant: product.variants?.[0]?.options[Math.min(3, product.variants[0].options.length - 1)],
      color: product.colors?.[0]?.name,
    });
    toast({ title: `${product.name} added to bag` });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className={cn("relative aspect-[4/5] overflow-hidden rounded-[22px]", toneClasses[product.tone])}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.6),transparent_60%)]" />
          <div className="absolute inset-[10%] transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.06] group-hover:-rotate-1">
            <ProductVisual kind={product.visual} color={color} />
          </div>
          <div className="absolute left-4 top-4 flex gap-2">
            {product.badge && <Badge tone={product.badge === "New" ? "clay" : "ink"}>{product.badge}</Badge>}
            {product.compareAt && <Badge tone="light">Save {formatPrice(product.compareAt - product.price)}</Badge>}
          </div>
          <button
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              wish.toggle(product.slug);
            }}
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-porcelain/70 text-ink backdrop-blur transition-all hover:bg-porcelain"
          >
            <Heart className={cn("size-4 transition-all", wished && "fill-clay text-clay")} strokeWidth={1.75} />
          </button>
          {!compact && (
            <button
              onClick={quickAdd}
              className="absolute inset-x-4 bottom-4 flex h-11 translate-y-3 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-porcelain opacity-0 shadow-lift transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
            >
              <Plus className="size-4" strokeWidth={2} /> Quick add
            </button>
          )}
          {product.stock === "low" && <span className="absolute bottom-4 left-4 text-[11px] font-medium text-clay-deep group-hover:opacity-0">Only a few left</span>}
          {product.stock === "preorder" && <span className="absolute bottom-4 left-4 text-[11px] font-medium text-ink/60 group-hover:opacity-0">Pre-order · ships October</span>}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-[1.35rem] leading-tight">{product.name}</h3>
            <p className="mt-1 line-clamp-1 text-sm text-ink/60">{product.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-medium tabular-nums">{formatPrice(product.price)}</p>
            {product.compareAt && <p className="text-xs text-ink/40 line-through tabular-nums">{formatPrice(product.compareAt)}</p>}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Rating value={product.rating} count={product.reviews} />
          {product.colors && (
            <div className="flex gap-1">
              {product.colors.map((c) => (
                <span key={c.name} className="size-3 rounded-full ring-1 ring-ink/15" style={{ background: c.hex }} title={c.name} />
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
