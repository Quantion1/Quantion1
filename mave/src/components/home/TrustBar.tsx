import { Marquee } from "@/components/ui/Marquee";
export function TrustBar() {
  return (
    <div className="border-b border-ink/10 bg-porcelain py-4">
      <Marquee
        items={[
          "Rated 4.9 by 12,000+ mothers",
          "Free flange sizing kit with every pump",
          "100-night trial on Aura",
          "2-year warranty",
          "Reimbursed by most Dutch supplementary insurers",
          "Designed with 400 mothers and 2 midwives",
          "Free shipping over €75",
          "Ships from Amsterdam in 24 hours",
        ]}
        className="text-ink/70"
      />
    </div>
  );
}
