import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { products, getProduct, getCollection } from "@/data/products";
import { ProductDetail } from "@/components/product/ProductDetail";
import { Reviews } from "@/components/product/Reviews";
import { Bestsellers } from "@/components/home/Bestsellers";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return { title: p?.name ?? "Product", description: p?.tagline };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const collection = getCollection(product.collection)!;
  const related = products.filter((p) => p.slug !== product.slug && (p.collection === product.collection || p.stages.some((s) => product.stages.includes(s)))).slice(0, 6);

  return (
    <>
      <Container className="py-8 sm:py-12">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-ink/50">
          <Link href="/shop" className="hover:text-ink">Shop</Link>
          <ChevronRight className="size-3" />
          <Link href={`/collections/${collection.slug}`} className="hover:text-ink">{collection.name}</Link>
          <ChevronRight className="size-3" />
          <span className="text-ink">{product.name}</span>
        </nav>
        <ProductDetail product={product} />
      </Container>
      <Reviews product={product} />
      <Bestsellers eyebrow="Complete the system" title="Pairs with this" slugs={related.map((p) => p.slug)} />
    </>
  );
}
