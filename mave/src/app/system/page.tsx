import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { System } from "@/components/home/System";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Bundles } from "@/components/home/Bundles";
import { Bestsellers } from "@/components/home/Bestsellers";

export const metadata: Metadata = { title: "The Mave System", description: "Express, cool, store and warm: how every Mave product fits every other." };

const compat = [
  { part: "Aura cups", fits: ["Warm", "Chill (pour lid)", "Storage bags (pour)"] },
  { part: "Core bottles / Glass Set", fits: ["Core", "Warm", "Warm Go", "Chill (adapter)", "Pure"] },
  { part: "Storage bags", fits: ["Core (pump-direct)", "Freezer tray", "Warm (bag clip)", "Chill Tote"] },
  { part: "Flange inserts 13–27 mm", fits: ["Aura", "Aura Solo", "Core", "Hand"] },
];

export default function SystemPage() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal><p className="eyebrow text-clay">The Mave System</p></Reveal>
          <Reveal delay={0.08}><h1 className="font-display mt-4 max-w-4xl text-balance text-5xl leading-[1.02] sm:text-7xl">Milk should move from you to your baby without touching a funnel, an adapter or a second container.</h1></Reveal>
          <Reveal delay={0.16}><p className="mt-8 max-w-2xl text-lg text-ink/65">Every decanting step loses a few millilitres and adds a part to wash. So we designed one thread, one clip and one lid across the whole range. Here is how it connects.</p></Reveal>
        </Container>
      </section>
      <System />
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="Compatibility" title="What fits what." body="One thread standard. One bag clip. If it says Mave, it fits." />
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/50">
                  <th className="py-3 pr-6 font-medium">Component</th>
                  <th className="py-3 font-medium">Works directly with</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {compat.map((r) => (
                  <tr key={r.part}>
                    <td className="py-4 pr-6 font-medium">{r.part}</td>
                    <td className="py-4">
                      <div className="flex flex-wrap gap-2">
                        {r.fits.map((f) => (
                          <span key={f} className="rounded-full bg-cream px-3 py-1 text-xs">{f}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>
      <Bundles />
      <Bestsellers eyebrow="Start here" title="The core of the system" slugs={["aura-wearable-pump", "chill-milk-cooler", "warm-milk-warmer", "storage-bags-50", "fit-sizing-kit"]} />
    </>
  );
}
