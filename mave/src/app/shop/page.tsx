import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = { title: "Shop", description: "Pumps, warmers, coolers, storage and care for breastfeeding mothers." };

export default function ShopPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-12 max-w-2xl">
        <p className="eyebrow text-clay">The shop</p>
        <h1 className="font-display mt-3 text-5xl leading-[1.02] sm:text-6xl">Everything, in one system.</h1>
        <p className="mt-5 text-ink/65">Twenty-one products. Each one threads, clips or pours into the next. Filter by what you need, or by the moment you are in.</p>
      </div>
      <Suspense>
        <ShopClient />
      </Suspense>
    </Container>
  );
}
