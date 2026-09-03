"use client";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";

export function Bestsellers({ title = "What mothers buy first", eyebrow = "Bestsellers", slugs }: { title?: string; eyebrow?: string; slugs?: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const list = slugs ? products.filter((p) => slugs.includes(p.slug)) : products.filter((p) => p.badge === "Bestseller" || p.badge === "Award winner");
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.7), behavior: "smooth" });
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading eyebrow={eyebrow} title={title} />
          <div className="hidden gap-2 sm:flex">
            <button onClick={() => scroll(-1)} aria-label="Previous" className="grid size-11 place-items-center rounded-full border border-ink/15 transition hover:border-ink hover:bg-ink hover:text-porcelain">
              <ArrowLeft className="size-4" strokeWidth={1.75} />
            </button>
            <button onClick={() => scroll(1)} aria-label="Next" className="grid size-11 place-items-center rounded-full border border-ink/15 transition hover:border-ink hover:bg-ink hover:text-porcelain">
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </Container>
      <div ref={ref} className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 sm:px-8 lg:px-[max(3rem,calc((100vw-1320px)/2+3rem))]">
        {list.map((p, i) => (
          <div key={p.slug} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[300px]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
