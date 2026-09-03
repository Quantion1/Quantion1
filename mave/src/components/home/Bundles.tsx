"use client";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { bundles, getProduct } from "@/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { cn, toneClasses } from "@/lib/utils";
import { useCart, useToast } from "@/store/cart";

export function Bundles() {
  const add = useCart((s) => s.add);
  const toast = useToast((s) => s.push);
  return (
    <section className="bg-sand/60 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Kits" title="Curated for the moment you are in." body="Bundles built with midwives, priced below the sum of their parts. Add the whole kit in one tap." />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {bundles.map((b, i) => {
            const items = b.items.map((s) => getProduct(s)!);
            return (
              <Reveal key={b.slug} delay={i * 0.1}>
                <div className="group relative overflow-hidden rounded-[28px] bg-porcelain p-8 shadow-soft transition-shadow duration-500 hover:shadow-lift">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow text-clay">Save {formatPrice(b.compareAt - b.price)}</p>
                      <h3 className="font-display mt-2 text-3xl">{b.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-medium tabular-nums">{formatPrice(b.price)}</p>
                      <p className="text-sm text-ink/40 line-through tabular-nums">{formatPrice(b.compareAt)}</p>
                    </div>
                  </div>
                  <div className="mt-8 flex -space-x-4">
                    {items.map((p, k) => (
                      <Link key={p.slug} href={`/products/${p.slug}`} title={p.name} className={cn("size-20 shrink-0 overflow-hidden rounded-2xl ring-4 ring-porcelain transition-transform duration-500 hover:-translate-y-2 sm:size-24", toneClasses[p.tone])} style={{ zIndex: 10 - k }}>
                        <ProductVisual kind={p.visual} color={p.colors?.[0]?.hex} />
                      </Link>
                    ))}
                  </div>
                  <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/65">
                    {items.map((p) => (
                      <li key={p.slug}>{p.name}</li>
                    ))}
                  </ul>
                  <Button
                    className="mt-8"
                    arrow
                    onClick={() => {
                      items.forEach((p, idx) =>
                        add({
                          slug: p.slug,
                          name: p.name,
                          price: idx === 0 ? p.price - (b.compareAt - b.price) : p.price,
                          visual: p.visual,
                          tone: p.tone,
                          variant: p.variants?.[0]?.options[Math.min(3, p.variants[0].options.length - 1)],
                          color: p.colors?.[0]?.name,
                        }),
                      );
                      toast({ title: `${b.name} added`, body: `Saved ${formatPrice(b.compareAt - b.price)}` });
                    }}
                  >
                    Add the kit
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
