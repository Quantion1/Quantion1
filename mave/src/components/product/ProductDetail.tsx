"use client";
import { useState } from "react";
import { motion } from "motion/react";
import type { Product } from "@/data/products";
import { ProductVisual } from "./ProductVisual";
import { AddToCart } from "./AddToCart";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Accordion";
import { formatPrice } from "@/lib/format";
import { cn, toneClasses } from "@/lib/utils";
import { ShieldCheck, Truck, RotateCcw, Stethoscope } from "lucide-react";

export function ProductDetail({ product }: { product: Product }) {
  const [hex, setHex] = useState(product.colors?.[0]?.hex);
  const [view, setView] = useState(0);
  const views = ["Front", "Detail", "In use"];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      {/* gallery */}
      <div className="lg:col-span-7">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
          <motion.div layout className={cn("relative aspect-square overflow-hidden rounded-[28px] sm:aspect-[5/4]", toneClasses[product.tone])}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.7),transparent_60%)]" />
            <motion.div
              key={`${view}-${hex}`}
              initial={{ opacity: 0, scale: 0.96, rotate: view === 1 ? -6 : 0 }}
              animate={{ opacity: 1, scale: view === 1 ? 1.35 : 1, rotate: view === 1 ? -8 : view === 2 ? 4 : 0, x: view === 1 ? "8%" : 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-[8%]"
            >
              <ProductVisual kind={product.visual} color={hex} />
            </motion.div>
            <div className="absolute left-5 top-5 flex gap-2">
              {product.badge && <Badge tone={product.badge === "New" ? "clay" : "ink"}>{product.badge}</Badge>}
              {product.reimbursable && <Badge tone="light">Insurance eligible</Badge>}
            </div>
          </motion.div>
          <div className="mt-4 flex gap-3">
            {views.map((v, i) => (
              <button key={v} onClick={() => setView(i)} className={cn("relative size-20 overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-porcelain transition", toneClasses[product.tone], view === i ? "ring-ink" : "ring-transparent hover:ring-ink/30")} aria-label={v}>
                <div className={cn("absolute inset-2", i === 1 && "scale-150 -rotate-6", i === 2 && "rotate-3")}>
                  <ProductVisual kind={product.visual} color={hex} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* info */}
      <div className="lg:col-span-5">
        <p className="eyebrow text-clay">{product.collection}</p>
        <h1 className="font-display mt-3 text-5xl leading-[1.02]">{product.name}</h1>
        <p className="mt-3 text-lg text-ink/65">{product.tagline}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Rating value={product.rating} count={product.reviews} size="md" />
          <a href="#reviews" className="text-sm underline-offset-2 hover:underline">
            Read reviews
          </a>
        </div>
        <div className="mt-6 flex items-baseline gap-3">
          <p className="text-3xl font-medium tabular-nums">{formatPrice(product.price)}</p>
          {product.compareAt && <p className="text-lg text-ink/40 line-through tabular-nums">{formatPrice(product.compareAt)}</p>}
          <p className="text-sm text-ink/45">incl. VAT</p>
        </div>
        <p className="mt-2 text-sm">
          {product.stock === "in-stock" && <span className="text-sage">● In stock, ships today before 22:00</span>}
          {product.stock === "low" && <span className="text-clay-deep">● Only a few left, ships today</span>}
          {product.stock === "preorder" && <span className="text-ink/60">● Pre-order, ships in October</span>}
        </p>

        <AddToCart product={product} onColorChange={setHex} />

        <ul className="mt-8 grid grid-cols-2 gap-3 text-xs text-ink/70">
          <li className="flex items-center gap-2"><Truck className="size-4 text-ink/50" strokeWidth={1.5} /> Free shipping over €75</li>
          <li className="flex items-center gap-2"><RotateCcw className="size-4 text-ink/50" strokeWidth={1.5} /> 100-night trial</li>
          <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-ink/50" strokeWidth={1.5} /> 2-year warranty</li>
          <li className="flex items-center gap-2"><Stethoscope className="size-4 text-ink/50" strokeWidth={1.5} /> Free fit check by a consultant</li>
        </ul>

        <p className="mt-10 text-[15px] leading-relaxed text-ink/75">{product.description}</p>

        <ul className="mt-10 space-y-6">
          {product.features.map((f, i) => (
            <motion.li key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }} className="flex gap-4">
              <span className="font-display mt-0.5 w-8 shrink-0 text-2xl text-clay">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">{f.body}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        <Accordion
          className="mt-12"
          defaultOpen={null}
          items={[
            {
              title: "Specifications",
              content: (
                <dl className="grid gap-2">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 border-b border-ink/5 pb-2">
                      <dt className="text-ink/50">{k}</dt>
                      <dd className="text-right text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              ),
            },
            {
              title: "In the box",
              content: (
                <ul className="list-disc space-y-1 pl-4">
                  {product.inBox.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              ),
            },
            {
              title: "Shipping, trial & warranty",
              content: "Free shipping in the Netherlands and Belgium over €75, otherwise €4.95. Orders before 22:00 ship the same day. Try Aura for 100 nights; if it is not right for you, we collect it and refund in full. Every Mave product carries a 2-year warranty, motors 3 years.",
            },
            {
              title: "Insurance reimbursement",
              content: "Most Dutch supplementary insurers reimburse €75–80 towards a breast pump when purchased via a lactation consultant. We pre-fill the form for you at checkout and work with NVL-affiliated consultants nationwide.",
            },
          ]}
        />
      </div>
    </div>
  );
}
