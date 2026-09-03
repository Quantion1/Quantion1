"use client";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cartTotals, useCart } from "@/store/cart";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { cn, toneClasses } from "@/lib/utils";
import { products } from "@/data/products";

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const t = cartTotals(lines);
  return (
    <Container className="py-12 sm:py-16">
      <h1 className="font-display text-5xl">Your bag</h1>
      {lines.length === 0 ? (
        <div className="mt-12 rounded-[28px] bg-cream p-12 text-center">
          <p className="font-display text-2xl">Nothing here yet</p>
          <Button href="/shop" className="mt-6" arrow>Explore the shop</Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <ul className="divide-y divide-ink/10 lg:col-span-8">
            {lines.map((l) => (
              <li key={l.id} className="flex gap-6 py-6">
                <Link href={`/products/${l.slug}`} className={cn("size-28 shrink-0 overflow-hidden rounded-2xl sm:size-36", toneClasses[l.tone])}>
                  <ProductVisual kind={l.visual} color={products.find((p) => p.slug === l.slug)?.colors?.find((c) => c.name === l.color)?.hex} />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-xl">{l.name}</p>
                      <p className="mt-1 text-sm text-ink/55">{[l.color, l.variant].filter(Boolean).join(" · ")}</p>
                    </div>
                    <p className="tabular-nums">{formatPrice(l.price * l.qty)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-ink/15">
                      <button onClick={() => setQty(l.id, l.qty - 1)} aria-label="Decrease" className="grid size-9 place-items-center hover:bg-ink/5"><Minus className="size-3.5" /></button>
                      <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} aria-label="Increase" className="grid size-9 place-items-center hover:bg-ink/5"><Plus className="size-3.5" /></button>
                    </div>
                    <button onClick={() => remove(l.id)} className="inline-flex items-center gap-1 text-sm text-ink/55 hover:text-ink"><X className="size-3.5" /> Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="lg:col-span-4">
            <div className="sticky top-[calc(var(--header-h)+24px)] rounded-[28px] bg-cream p-7">
              <p className="font-display text-2xl">Summary</p>
              <dl className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-ink/60">Subtotal</dt><dd className="tabular-nums">{formatPrice(t.subtotal, { cents: true })}</dd></div>
                <div className="flex justify-between"><dt className="text-ink/60">Shipping</dt><dd className="tabular-nums">{t.shipping === 0 ? "Free" : formatPrice(t.shipping, { cents: true })}</dd></div>
                <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-medium"><dt>Total</dt><dd className="tabular-nums">{formatPrice(t.total, { cents: true })}</dd></div>
              </dl>
              <Button href="/checkout" className="mt-6 w-full" size="lg" arrow>Checkout</Button>
              <p className="mt-3 text-center text-xs text-ink/50">iDEAL, Apple Pay, Klarna, cards</p>
            </div>
          </aside>
        </div>
      )}
    </Container>
  );
}
