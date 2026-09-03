import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";

export const metadata: Metadata = { title: "About", description: "Why Mave exists, how we design, and what we promise." };

const principles = [
  { title: "Numbers, not marketing", body: "'Hospital-grade' means nothing in EU law. We publish suction in mmHg, cycles per minute, decibels and the number of parts you will wash. Compare us on those." },
  { title: "Fit first", body: "Half of mothers do not fit the 24 mm flange every other brand ships. Every Mave pump includes six sizes and a 30-day fit guarantee backed by a lactation consultant." },
  { title: "Nothing above 40°C", body: "Breastmilk is a living food. Our warmers are physically incapable of overheating it. It cost us eight months of engineering. It was worth it." },
  { title: "Designed to disappear", body: "The best product is the one you forget you are using. Silence, few parts, and a shape that fits under a t-shirt are not features. They are the point." },
];

const promises = [
  { id: "returns", title: "100-night trial", body: "Try any Mave pump for 100 nights. Not right? We collect it, sanitise it for our research programme, and refund you in full." },
  { id: "warranty", title: "2-year warranty, 3 on motors", body: "Every product, no registration needed. Spare parts are stocked for ten years after a product is discontinued." },
  { id: "reimbursement", title: "Insurance, handled", body: "Most Dutch supplementary insurers reimburse €75–80 towards a pump via a lactation consultant. We pre-fill the form and partner with NVL-affiliated consultants." },
  { id: "sustainability", title: "Repair before replace", body: "Modular parts, a repair service in Amsterdam, and a take-back scheme. Milk-contact parts are BPA- and BPS-free; steel and glass wherever plastic is not essential." },
  { id: "contact", title: "A human, fast", body: "Email hello@mave.example or chat 08:00–23:00, seven days. Night feeds do not keep office hours, so neither do we." },
];

export default function AboutPage() {
  return (
    <>
      <section className="grain relative overflow-hidden bg-ink py-28 text-porcelain sm:py-40">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_80%_20%,#3a342b_0%,#15130f_60%)]" />
        <Container className="relative">
          <Reveal><p className="eyebrow text-porcelain/50">About Mave</p></Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display mt-6 max-w-4xl text-balance text-5xl leading-[1.02] sm:text-7xl">We started with a question: why does the most important equipment a new mother owns look and sound like a medical appliance from 1995?</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-porcelain/65">
              Mave was founded in Amsterdam in 2023 by a product designer who had just returned to work while exclusively pumping, and a midwife who had watched a thousand mothers give up on pumps that hurt. We spent two years with 400 mothers, two lactation consultants and one acoustics engineer before shipping a single unit.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-ink/10 py-16">
        <Container className="grid gap-10 sm:grid-cols-3">
          {[{ v: 400, s: "", l: "Mothers in the design programme" }, { v: 2, s: " yrs", l: "Of research before launch" }, { v: 96, s: "%", l: "Would recommend Mave to a friend" }].map((x, i) => (
            <Reveal key={x.l} delay={i * 0.08}>
              <p className="font-display text-6xl tabular-nums"><Counter to={x.v} suffix={x.s} /></p>
              <p className="mt-2 text-sm text-ink/60">{x.l}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="How we design" title="Four principles, no exceptions." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] bg-ink/10 sm:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06} className="bg-porcelain p-8 sm:p-10">
                <span className="font-display text-4xl text-clay">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display mt-6 text-2xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/65">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="Our promises" title="What you can hold us to." />
          <dl className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
            {promises.map((p) => (
              <Reveal key={p.id}>
                <div id={p.id} className="grid gap-4 py-8 scroll-mt-28 sm:grid-cols-12">
                  <dt className="font-display text-2xl sm:col-span-4">{p.title}</dt>
                  <dd className="leading-relaxed text-ink/65 sm:col-span-8">{p.body}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
          <Reveal className="mt-14">
            <Button href="/shop" arrow>Shop the range</Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
