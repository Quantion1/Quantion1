import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { articles } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { cn, toneClasses } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

export const metadata: Metadata = { title: "Journal", description: "Evidence-based guides on pumping, storing and warming breastmilk." };

export default function JournalPage() {
  const [lead, ...rest] = articles;
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow text-clay">The Journal</p>
        <h1 className="font-display mt-3 text-5xl leading-[1.02] sm:text-6xl">Evidence, not opinion.</h1>
        <p className="mt-5 text-ink/65">Written with lactation consultants, reviewed by a paediatrician, updated when the science changes.</p>
      </div>
      <Link href={`/journal/${lead.slug}`} className={cn("group mt-14 grid gap-8 overflow-hidden rounded-[28px] p-8 sm:p-12 lg:grid-cols-2", toneClasses[lead.tone])}>
        <div className="flex flex-col justify-between">
          <span className="eyebrow text-ink/50">{lead.category} · {lead.readTime}</span>
          <div>
            <h2 className="font-display mt-10 text-4xl leading-tight sm:text-5xl">{lead.title}</h2>
            <p className="mt-4 max-w-md text-ink/65">{lead.dek}</p>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <span className="grid size-14 place-items-center rounded-full bg-porcelain transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight className="size-5" strokeWidth={1.5} /></span>
        </div>
      </Link>
      <Stagger className="mt-8 grid gap-5 md:grid-cols-3">
        {rest.map((a) => (
          <StaggerItem key={a.slug}>
            <Link href={`/journal/${a.slug}`} className="group block">
              <div className={cn("relative aspect-[4/3] overflow-hidden rounded-[22px] p-6", toneClasses[a.tone])}>
                <span className="eyebrow text-ink/50">{a.category}</span>
                <p className="font-display absolute bottom-6 left-6 right-16 text-2xl leading-tight">{a.title}</p>
                <span className="absolute bottom-6 right-6 grid size-10 place-items-center rounded-full bg-porcelain transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight className="size-4" strokeWidth={1.75} /></span>
              </div>
              <p className="mt-4 text-sm text-ink/60">{a.dek}</p>
              <p className="mt-2 text-xs text-ink/45">{formatDate(a.date)} · {a.readTime}</p>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Container>
  );
}
