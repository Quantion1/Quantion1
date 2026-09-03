"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { ProductVisual } from "@/components/product/ProductVisual";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const chapters = [
  { eyebrow: "Silence", title: "Under 30 decibels.", body: "A library is 40. Aura's motor floats on a silicone cradle, so the loudest thing in the room is the baby breathing.", stat: "< 30 dB", color: "#efe6da" },
  { eyebrow: "Strength", title: "Hospital-strength, on your terms.", body: "Up to 300 mmHg with twenty levels. Stimulation and expression switch automatically when let-down begins, or when you say so.", stat: "300 mmHg", color: "#b2634b" },
  { eyebrow: "Fit", title: "Six sizes. In the box.", body: "Half of mothers do not fit the 24 mm flange every other brand ships. Aura arrives with inserts from 13 to 27 mm and a ruler to find yours.", stat: "13–27 mm", color: "#8a9a86" },
  { eyebrow: "Cleaning", title: "Four parts. One rack.", body: "Milk never touches the motor. The four pieces that do are dishwasher-safe and click together half asleep.", stat: "4 parts", color: "#2b2822" },
];

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(chapters.length - 1, Math.floor(v * chapters.length))));
  const rotate = useTransform(scrollYProgress, [0, 1], [-6, 8]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="relative bg-ink text-porcelain" style={{ height: `${chapters.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_30%_50%,#2b2822_0%,#15130f_70%)]" />
        <Container className="relative grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <p className="eyebrow mb-6 text-porcelain/45">Mave Aura</p>
            <div className="relative h-[280px] sm:h-[300px]">
              {chapters.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={false}
                  animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : active > i ? -24 : 24, filter: active === i ? "blur(0px)" : "blur(6px)" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                  style={{ pointerEvents: active === i ? "auto" : "none" }}
                >
                  <p className="text-sm text-clay">{c.eyebrow}</p>
                  <h3 className="font-display mt-3 text-4xl leading-[1.02] sm:text-6xl">{c.title}</h3>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-porcelain/65 sm:text-lg">{c.body}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-6">
              <div className="flex gap-2">
                {chapters.map((_, i) => (
                  <span key={i} className={cn("h-1 rounded-full transition-all duration-500", active === i ? "w-8 bg-porcelain" : "w-3 bg-porcelain/25")} />
                ))}
              </div>
              <Button href="/products/aura-wearable-pump" variant="inverse" size="sm" arrow>
                Meet Aura
              </Button>
            </div>
          </div>
          <div className="relative order-1 flex justify-center lg:order-2">
            <motion.div style={{ rotate, y }} className="relative w-[70vw] max-w-[520px]">
              <motion.div
                className="absolute inset-[15%] rounded-full blur-3xl"
                animate={{ backgroundColor: chapters[active].color, opacity: 0.35 }}
                transition={{ duration: 0.9 }}
              />
              <ProductVisual kind="wearable" color="#efe6da" />
            </motion.div>
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-[4%] top-[18%] sm:right-[8%] rounded-2xl border border-porcelain/15 bg-ink/60 px-4 py-3 backdrop-blur"
              >
                <p className="font-display text-3xl">{chapters[active].stat}</p>
                <p className="text-xs text-porcelain/50">{chapters[active].eyebrow}</p>
              </motion.div>
          </div>
        </Container>
      </div>
    </section>
  );
}
