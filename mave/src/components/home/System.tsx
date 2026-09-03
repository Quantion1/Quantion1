"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Reveal } from "@/components/ui/Reveal";
import { getProduct } from "@/data/products";
import { cn, toneClasses } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const steps = [
  { slug: "aura-wearable-pump", verb: "Express", body: "Pump straight into Aura's 180 ml cups, or into a Glass bottle on Core." },
  { slug: "chill-milk-cooler", verb: "Cool", body: "Pour into Chill. Forty-eight hours below 4°C, no fridge, no ice." },
  { slug: "storage-bags-50", verb: "Store", body: "Freeze flat in Mave bags, file upright in the tray. Oldest out first." },
  { slug: "warm-milk-warmer", verb: "Warm", body: "Bag or bottle into Warm. Body temperature in minutes, never above 40°C." },
];

export function System() {
  return (
    <section className="overflow-hidden bg-cream py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="The Mave System"
          title="Every piece fits every other piece."
          body="Bottles thread onto pumps. Bags clip into warmers. The cooler screws onto Core. No adapters, no decanting, no wasted millilitre. One system from breast to baby."
          align="center"
        />
        <div className="relative mt-20">
          <svg className="pointer-events-none absolute inset-x-0 top-[38%] hidden h-2 w-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 2">
            <motion.line x1="0" y1="1" x2="100" y2="1" stroke="#b2634b" strokeWidth="0.15" strokeDasharray="1 1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: "easeInOut" }} />
          </svg>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const p = getProduct(s.slug)!;
              return (
                <Reveal key={s.slug} delay={i * 0.1}>
                  <Link href={`/products/${p.slug}`} className="group block">
                    <div className={cn("relative aspect-square overflow-hidden rounded-[22px] ring-1 ring-ink/5", toneClasses[p.tone])}>
                      <div className="absolute inset-[12%] transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-105">
                        <ProductVisual kind={p.visual} color={p.colors?.[0]?.hex} />
                      </div>
                      <span className="absolute left-4 top-4 grid size-8 place-items-center rounded-full bg-porcelain text-xs font-semibold">{i + 1}</span>
                    </div>
                    <p className="font-display mt-5 text-3xl">{s.verb}</p>
                    <p className="mt-1 text-sm font-medium text-ink/80">{p.name}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.body}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
        <Reveal className="mt-14 text-center">
          <Button href="/system" variant="secondary" arrow>
            How the system works
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
