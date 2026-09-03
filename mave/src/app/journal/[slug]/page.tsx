import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { articles, getArticle } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { cn, toneClasses } from "@/lib/utils";
import { Bestsellers } from "@/components/home/Bestsellers";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return { title: a?.title ?? "Journal", description: a?.dek };
}

const related: Record<string, string[]> = {
  "flange-sizing-guide": ["fit-sizing-kit", "aura-wearable-pump", "balm-nipple-balm"],
  "returning-to-work-pumping": ["aura-wearable-pump", "chill-milk-cooler", "chill-tote", "hold-pumping-bra"],
  "how-to-warm-breastmilk": ["warm-milk-warmer", "warm-go-portable", "glass-bottle-set"],
  "engorgement-relief": ["soothe-therapy-pads", "pulse-lactation-massager", "silver-nursing-cups", "balm-nipple-balm"],
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  return (
    <>
      <section className={cn("py-20 sm:py-28", toneClasses[a.tone])}>
        <Container className="max-w-3xl">
          <Link href="/journal" className="text-sm text-ink/55 hover:text-ink">← Journal</Link>
          <p className="eyebrow mt-8 text-ink/50">{a.category} · {a.readTime} · {formatDate(a.date)}</p>
          <h1 className="font-display mt-4 text-balance text-4xl leading-[1.05] sm:text-6xl">{a.title}</h1>
          <p className="mt-6 text-lg text-ink/65">{a.dek}</p>
        </Container>
      </section>
      <Container className="max-w-3xl py-16">
        <article className="space-y-7 text-[17px] leading-[1.75] text-ink/85">
          {a.body.map((p, i) => (
            <p key={i} className={cn(i === 0 && "first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:text-6xl first-letter:leading-[0.85]")}>{p}</p>
          ))}
        </article>
        <p className="mt-12 border-t border-ink/10 pt-6 text-sm text-ink/50">Reviewed by a registered lactation consultant (IBCLC). This article is general information, not medical advice. Contact your midwife or GP for personal guidance.</p>
      </Container>
      <Bestsellers eyebrow="Mentioned in this article" title="The tools that help" slugs={related[a.slug] ?? []} />
    </>
  );
}
