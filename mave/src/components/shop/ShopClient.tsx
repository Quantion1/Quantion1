"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import { products, collections, stages, type CollectionSlug, type Stage } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

export function ShopClient({ fixedCollection }: { fixedCollection?: CollectionSlug }) {
  const params = useSearchParams();
  const router = useRouter();
  const [collection, setCollection] = useState<CollectionSlug | "all">(fixedCollection ?? ((params.get("collection") as CollectionSlug) || "all"));
  const [stage, setStage] = useState<Stage | "all">((params.get("stage") as Stage) || "all");
  const [sort, setSort] = useState<Sort>("featured");
  const [maxPrice, setMaxPrice] = useState(400);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const list = useMemo(() => {
    let l = products.filter((p) => (collection === "all" || p.collection === collection) && (stage === "all" || p.stages.includes(stage)) && p.price <= maxPrice);
    if (sort === "price-asc") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    return l;
  }, [collection, stage, sort, maxPrice]);

  const setStageAndUrl = (s: Stage | "all") => {
    setStage(s);
    const sp = new URLSearchParams(params.toString());
    if (s === "all") sp.delete("stage");
    else sp.set("stage", s);
    router.replace(`?${sp.toString()}`, { scroll: false });
  };

  const Filters = (
    <div className="space-y-8">
      {!fixedCollection && (
        <div>
          <p className="eyebrow mb-4 text-ink/45">Collection</p>
          <ul className="space-y-2">
            {[{ slug: "all" as const, name: "Everything" }, ...collections].map((c) => (
              <li key={c.slug}>
                <button onClick={() => setCollection(c.slug)} className={cn("flex w-full items-center justify-between text-left text-[15px] transition", collection === c.slug ? "font-medium text-ink" : "text-ink/55 hover:text-ink")}>
                  <span>{c.name}</span>
                  <span className="text-xs text-ink/35">{c.slug === "all" ? products.length : products.filter((p) => p.collection === c.slug).length}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <p className="eyebrow mb-4 text-ink/45">Moment</p>
        <div className="flex flex-wrap gap-2">
          {[{ slug: "all" as const, name: "Any" }, ...stages].map((s) => (
            <button key={s.slug} onClick={() => setStageAndUrl(s.slug)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition", stage === s.slug ? "border-ink bg-ink text-porcelain" : "border-ink/15 hover:border-ink")}>
              {s.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow text-ink/45">Max price</p>
          <span className="text-sm tabular-nums">€{maxPrice}</span>
        </div>
        <input type="range" min={10} max={400} step={10} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-clay" aria-label="Maximum price" />
      </div>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-[calc(var(--header-h)+24px)]">{Filters}</div>
      </aside>
      <div className="lg:col-span-9">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-ink/10 pb-5">
          <p className="text-sm text-ink/55">
            <span className="font-medium text-ink">{list.length}</span> products
            {stage !== "all" && (
              <button onClick={() => setStageAndUrl("all")} className="ml-3 inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-xs">
                {stages.find((s) => s.slug === stage)?.name} <X className="size-3" />
              </button>
            )}
          </p>
          <div className="flex items-center gap-3">
            <button onClick={() => setFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm lg:hidden">
              <SlidersHorizontal className="size-4" strokeWidth={1.75} /> Filters
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-ink/55 sm:inline">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-full border border-ink/15 bg-transparent px-4 py-2 text-sm outline-none">
                <option value="featured">Featured</option>
                <option value="rating">Top rated</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
            </label>
          </div>
        </div>
        <motion.div layout className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div key={p.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-display text-2xl">Nothing matches those filters</p>
            <button onClick={() => { setStageAndUrl("all"); setMaxPrice(400); setCollection(fixedCollection ?? "all"); }} className="mt-4 text-sm underline">
              Reset filters
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-ink/40 lg:hidden" onClick={() => setFiltersOpen(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-porcelain p-6" onClick={(e) => e.stopPropagation()}>
              <div className="mb-6 flex items-center justify-between">
                <p className="font-display text-2xl">Filters</p>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close" className="grid size-9 place-items-center rounded-full hover:bg-ink/5">
                  <X className="size-4" />
                </button>
              </div>
              {Filters}
              <button onClick={() => setFiltersOpen(false)} className="mt-8 h-12 w-full rounded-full bg-ink text-sm font-medium text-porcelain">
                Show {list.length} products
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
