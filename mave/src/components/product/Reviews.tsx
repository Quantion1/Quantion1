import { Container } from "@/components/ui/Container";
import { Rating } from "@/components/ui/Rating";
import type { Product } from "@/data/products";
import { Reveal } from "@/components/ui/Reveal";

const sample = [
  { name: "Femke", when: "2 weeks ago", text: "Exactly as described. Quiet, comfortable, and the sizing kit meant no pain from the very first session.", stars: 5, tag: "Verified buyer" },
  { name: "Judith", when: "1 month ago", text: "I compared three brands. This is the one I kept. Customer service replied within an hour on a Sunday.", stars: 5, tag: "Verified buyer" },
  { name: "Mireille", when: "2 months ago", text: "Beautifully made. I would have liked a slightly larger capacity, but for a working day it is enough.", stars: 4, tag: "Verified buyer" },
];

export function Reviews({ product }: { product: Product }) {
  const dist = [78, 16, 4, 1, 1];
  return (
    <section id="reviews" className="border-t border-ink/10 py-20">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-clay">Reviews</p>
          <p className="font-display mt-3 text-6xl">{product.rating.toFixed(1)}</p>
          <Rating value={product.rating} count={product.reviews} size="md" className="mt-2" />
          <ul className="mt-6 space-y-2">
            {dist.map((d, i) => (
              <li key={i} className="flex items-center gap-3 text-xs">
                <span className="w-3 tabular-nums">{5 - i}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full bg-ink" style={{ width: `${d}%` }} />
                </div>
                <span className="w-8 text-right tabular-nums text-ink/50">{d}%</span>
              </li>
            ))}
          </ul>
        </div>
        <ul className="space-y-6 lg:col-span-8">
          {sample.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.08}>
              <li className="rounded-[22px] bg-cream p-6">
                <div className="flex items-center justify-between">
                  <Rating value={r.stars} />
                  <span className="text-xs text-ink/45">{r.when}</span>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed">{r.text}</p>
                <p className="mt-4 text-sm">
                  <span className="font-medium">{r.name}</span> <span className="text-ink/45">· {r.tag}</span>
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
