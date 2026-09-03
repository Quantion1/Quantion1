import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function Closing() {
  return (
    <section className="grain relative overflow-hidden bg-clay py-28 text-milk sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_80%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
      <Container className="relative text-center">
        <Reveal>
          <p className="eyebrow text-milk/60">The beauty and the burden</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-display mx-auto mt-6 max-w-4xl text-balance text-4xl leading-[1.02] sm:text-6xl lg:text-7xl">
            You are doing something extraordinary. The tools should be too.
          </h2>
        </Reveal>
        <Reveal delay={0.16} className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/shop" variant="inverse" size="lg" arrow>
            Shop the range
          </Button>
          <Button href="/journal/flange-sizing-guide" variant="ghost" size="lg" className="text-milk hover:bg-milk/10">
            Find your flange size
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
