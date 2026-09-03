import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { value: 12400, suffix: "+", label: "Mothers who reviewed us", decimals: 0 },
  { value: 4.9, suffix: "", label: "Average rating across the range", decimals: 1 },
  { value: 30, suffix: " dB", label: "Aura at full strength. A whisper is 30.", decimals: 0 },
  { value: 6, suffix: "", label: "Flange sizes in every pump box", decimals: 0 },
];

export function Numbers() {
  return (
    <section className="border-y border-ink/10 py-16">
      <Container className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <p className="font-display text-5xl tabular-nums sm:text-6xl">
              <Counter to={s.value} suffix={s.suffix} decimals={s.decimals} />
            </p>
            <p className="mt-3 max-w-[22ch] text-sm text-ink/60">{s.label}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
