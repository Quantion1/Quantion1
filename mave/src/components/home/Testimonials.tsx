"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils";

const quotes = [
  { text: "I pumped through a board meeting and nobody noticed. Then I cried in the car, because I had been dreading going back for months and it was just… fine.", who: "Sanne, Utrecht", product: "Mave Aura", role: "Back to work at 12 weeks" },
  { text: "The Fit Kit told me I was a 17, not a 24. Pumping stopped hurting the same day and I got 40 ml more per session. Why does nobody tell you this?", who: "Amara, Rotterdam", product: "Mave Fit Kit", role: "Exclusive pumper" },
  { text: "Warm is the only thing I use at 3 a.m. with my eyes closed. It glows when it's ready and it has never once made the milk too hot.", who: "Lieke, Haarlem", product: "Mave Warm", role: "Twins, 4 months" },
  { text: "Twelve-hour shifts, one Chill. I stopped asking the ward for fridge space. It is the best-designed thing I own, including my phone.", who: "Dr. Noor, Amsterdam UMC", product: "Mave Chill", role: "Paediatric resident" },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % quotes.length), 6500);
    return () => clearInterval(t);
  }, []);
  const q = quotes[i];
  return (
    <section className="py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-clay">In their words</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.05] sm:text-5xl">12,000 reviews. One theme.</h2>
          <p className="mt-5 text-ink/65">Relief. From pain, from noise, from the 3 a.m. kitchen. Every review below is verified and unedited.</p>
          <div className="mt-8 flex gap-2">
            {quotes.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Show review ${k + 1}`} className={cn("h-1.5 rounded-full transition-all duration-500", i === k ? "w-10 bg-ink" : "w-4 bg-ink/20 hover:bg-ink/40")} />
            ))}
          </div>
        </div>
        <div className="relative min-h-[300px] lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[28px] bg-cream p-8 sm:p-12"
            >
              <Rating value={5} size="md" />
              <p className="font-display mt-6 text-2xl leading-snug text-balance sm:text-[2.1rem]">“{q.text}”</p>
              <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium">{q.who}</p>
                  <p className="text-ink/55">{q.role}</p>
                </div>
                <span className="rounded-full border border-ink/15 px-3 py-1 text-xs">{q.product}</span>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
