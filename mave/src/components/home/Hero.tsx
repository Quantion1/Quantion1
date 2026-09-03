"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SplitWords } from "@/components/ui/Reveal";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yProduct = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section ref={ref} className="grain relative -mt-[calc(var(--header-h)+36px)] flex min-h-[100svh] items-end overflow-hidden bg-ink text-porcelain">
      {/* backdrop */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_20%,#3a342b_0%,#15130f_55%)]" />
        <motion.div
          className="absolute -right-[10%] top-[8%] size-[70vw] rounded-full bg-[radial-gradient(circle,rgba(178,99,75,0.35),transparent_60%)] blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-[15%] bottom-[-20%] size-[60vw] rounded-full bg-[radial-gradient(circle,rgba(138,154,134,0.25),transparent_60%)] blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* product */}
      <motion.div style={{ y: yProduct }} className="pointer-events-none absolute right-[-4%] top-[14%] w-[62vw] max-w-[820px] sm:right-[2%] sm:top-[10%] sm:w-[48vw]">
        <motion.div initial={{ opacity: 0, y: 60, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
          <div className="relative">
            <div className="absolute inset-[20%] rounded-full bg-clay/20 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 size-[46%] -translate-x-1/2 -translate-y-[65%] rounded-full border border-porcelain/15 animate-pulse-ring" />
            <ProductVisual kind="wearable" color="#efe6da" float />
          </div>
        </motion.div>
      </motion.div>

      <Container className="relative z-10 pb-16 pt-[40vh] sm:pb-24">
        <motion.div style={{ y: yText, opacity }} className="max-w-3xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }} className="eyebrow mb-6 text-porcelain/55">
            Mave Aura · Wearable double pump
          </motion.p>
          <h1 className="font-display text-[clamp(2.75rem,7.2vw,6.5rem)] leading-[0.98] text-porcelain">
            <SplitWords text="Quiet enough for" delay={0.35} />
            <br />
            <SplitWords text="a sleeping baby." className="text-porcelain/70 italic" delay={0.6} />
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mt-7 max-w-lg text-base leading-relaxed text-porcelain/70 sm:text-lg">
            Hospital-strength suction in a pump you wear under a t-shirt. Under 30 decibels, four parts to wash, and every flange size in the box.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button href="/products/aura-wearable-pump" variant="inverse" size="lg" arrow>
                Discover Aura · €349
              </Button>
            </Magnetic>
            <Button href="/shop" variant="ghost" size="lg" className="text-porcelain hover:bg-porcelain/10">
              Shop everything
            </Button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="mt-16 flex items-center justify-between border-t border-porcelain/10 pt-6 text-xs text-porcelain/50">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <span>&lt; 30 dB</span>
            <span>300 mmHg</span>
            <span>4 parts</span>
            <span>6 flange sizes included</span>
            <span className="hidden sm:inline">CE · MDR 2017/745</span>
          </div>
          <span className="hidden items-center gap-2 sm:flex">
            Scroll <ArrowDown className="size-3 animate-bounce" />
          </span>
        </motion.div>
      </Container>
    </section>
  );
}
