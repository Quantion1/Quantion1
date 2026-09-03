import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { articles } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { cn, toneClasses } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

export function JournalTeaser() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="The Journal" title="Evidence, not opinion." body="Guides written with lactation consultants and reviewed by a paediatrician. The things we wish someone had told us." />
          <Link href="/journal" className="link-underline shrink-0 text-sm font-medium">
            All articles
          </Link>
        </div>
        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <StaggerItem key={a.slug}>
              <Link href={`/journal/${a.slug}`} className="group block">
                <div className={cn("relative aspect-[4/3] overflow-hidden rounded-[22px] p-6", toneClasses[a.tone])}>
                  <span className="eyebrow text-ink/50">{a.category}</span>
                  <span className="absolute bottom-6 right-6 grid size-10 place-items-center rounded-full bg-porcelain transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="size-4" strokeWidth={1.75} />
                  </span>
                  <p className="font-display absolute bottom-6 left-6 right-20 text-2xl leading-tight">{a.title}</p>
                </div>
                <p className="mt-4 text-sm text-ink/60">{a.dek}</p>
                <p className="mt-2 text-xs text-ink/45">
                  {formatDate(a.date)} · {a.readTime}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
