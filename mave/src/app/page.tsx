import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { StageGrid } from "@/components/home/StageGrid";
import { Spotlight } from "@/components/home/Spotlight";
import { Bestsellers } from "@/components/home/Bestsellers";
import { System } from "@/components/home/System";
import { Numbers } from "@/components/home/Numbers";
import { Testimonials } from "@/components/home/Testimonials";
import { Bundles } from "@/components/home/Bundles";
import { JournalTeaser } from "@/components/home/JournalTeaser";
import { Closing } from "@/components/home/Closing";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <StageGrid />
      <Spotlight />
      <Bestsellers />
      <System />
      <Numbers />
      <Bundles />
      <Testimonials />
      <JournalTeaser />
      <Closing />
    </>
  );
}
