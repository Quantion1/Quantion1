import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { stages, getProduct, type Stage } from "@/data/products";
import { ProductVisual } from "@/components/product/ProductVisual";
import { cn } from "@/lib/utils";

const tones = ["bg-cream", "bg-sand", "bg-mist", "bg-[#e9cfc4]", "bg-ink text-porcelain"];
const heroes: Record<Stage, string> = {
  pregnancy: "hand-manual-pump",
  "first-weeks": "soothe-therapy-pads",
  "back-to-work": "chill-milk-cooler",
  travel: "warm-go-portable",
  night: "warm-milk-warmer",
};

export function StageGrid() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow="Shop by moment" title="Breastfeeding is not one thing. Neither is what you need." body="From the third trimester to the first day back at work, the right tools change. We organised the shop the way life actually goes." />
          <Link href="/shop" className="link-underline shrink-0 text-sm font-medium">
            See everything
          </Link>
        </div>
        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((s, i) => {
            const hero = getProduct(heroes[s.slug]);
            const dark = i === 4;
            return (
              <StaggerItem key={s.slug} className={cn(i === 0 && "sm:col-span-2 lg:row-span-2")}>
                <Link href={`/shop?stage=${s.slug}`} className={cn("group relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-[22px] p-6 transition-shadow duration-500 hover:shadow-lift", tones[i])}>
                  <div
                    className={cn(
                      "pointer-events-none absolute transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-3 group-hover:rotate-3",
                      i === 0 ? "-bottom-10 -right-10 w-[60%] max-w-[420px]" : "-right-[14%] -top-[6%] w-[58%]",
                    )}
                  >
                    {hero && <ProductVisual kind={hero.visual} color={hero.colors?.[0]?.hex} />}
                  </div>
                  <div className="relative flex items-start justify-between">
                    <span className={cn("eyebrow", dark ? "text-porcelain/50" : "text-ink/45")}>0{i + 1}</span>
                    <span className={cn("grid size-9 place-items-center rounded-full transition-all duration-500 group-hover:rotate-45", dark ? "bg-porcelain/10" : "bg-ink/5")}>
                      <ArrowUpRight className="size-4" strokeWidth={1.75} />
                    </span>
                  </div>
                  <div className="relative">
                    <h3 className={cn("font-display text-[1.75rem] leading-tight", i === 0 && "lg:text-5xl")}>{s.name}</h3>
                    <p className={cn("mt-2 max-w-[22ch] text-sm", dark ? "text-porcelain/60" : "text-ink/60")}>{s.blurb}</p>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
