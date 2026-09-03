import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ShopClient } from "@/components/shop/ShopClient";
import { collections, getCollection, productsByCollection } from "@/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";
import { cn, toneClasses } from "@/lib/utils";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCollection((await params).slug);
  return { title: c?.name ?? "Collection", description: c?.intro };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const hero = productsByCollection(c.slug)[0];
  return (
    <>
      <section className={cn("relative overflow-hidden", toneClasses[c.tone])}>
        <Container className="relative grid min-h-[46vh] items-end gap-8 py-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-clay">{c.name}</p>
            <h1 className="font-display mt-3 text-balance text-5xl leading-[1.02] sm:text-6xl lg:text-7xl">{c.title}</h1>
            <p className="mt-6 max-w-lg text-ink/65">{c.intro}</p>
          </div>
          {hero && (
            <div className="absolute -right-10 top-1/2 hidden w-[420px] -translate-y-1/2 lg:block">
              <ProductVisual kind={hero.visual} color={hero.colors?.[0]?.hex} float />
            </div>
          )}
        </Container>
      </section>
      <Container className="py-12 sm:py-16">
        <Suspense>
          <ShopClient fixedCollection={c.slug} />
        </Suspense>
      </Container>
    </>
  );
}
